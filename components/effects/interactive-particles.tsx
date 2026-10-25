"use client";

import { useEffect, useRef } from "react";

class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseVx: number;
    baseVy: number;
    radius: number;
    alpha: number;

    constructor(w: number, h: number, dpr: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseVx = (Math.random() - 0.5) * 0.6 * dpr;
        this.baseVy = (Math.random() - 0.5) * 0.6 * dpr;
        this.vx = this.baseVx;
        this.vy = this.baseVy;
        this.radius = (Math.random() * 1.5 + 0.5) * dpr;
        this.alpha = Math.random() * 0.5 + 0.15;
    }

    update(w: number, h: number, mouse: { x: number; y: number; radius: number }, dpr: number) {
        if (this.x < 0 || this.x > w) {
            this.baseVx *= -1;
            this.vx *= -1;
            this.x = Math.max(0, Math.min(this.x, w));
        }
        if (this.y < 0 || this.y > h) {
            this.baseVy *= -1;
            this.vy *= -1;
            this.y = Math.max(0, Math.min(this.y, h));
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared > 0 && distanceSquared < mouse.radius * mouse.radius) {
            const dist = Math.sqrt(distanceSquared);
            const forceDirectionX = dx / dist;
            const forceDirectionY = dy / dist;
            const force = (mouse.radius - dist) / mouse.radius;

            const pushX = -forceDirectionX * force * 3 * dpr;
            const pushY = -forceDirectionY * force * 3 * dpr;

            this.vx += pushX;
            this.vy += pushY;
        }

        this.vx += (this.baseVx - this.vx) * 0.04;
        this.vy += (this.baseVy - this.vy) * 0.04;

        const speedSquared = this.vx * this.vx + this.vy * this.vy;
        const maxSpeed = 4 * dpr;
        if (speedSquared > maxSpeed * maxSpeed) {
            const currentSpeed = Math.sqrt(speedSquared);
            this.vx = (this.vx / currentSpeed) * maxSpeed;
            this.vy = (this.vy / currentSpeed) * maxSpeed;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
            ? `rgba(255, 255, 255, ${this.alpha})`
            : `rgba(0, 0, 0, ${this.alpha})`;
        ctx.fill();
    }
}

export function InteractiveParticles() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000, radius: 150 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId = 0;
        let isVisible = false;
        let particles: Particle[] = [];
        let cachedRect = canvas.getBoundingClientRect();
        // Keep retina sharpness without a 3x/4x backing canvas for tiny particles.
        let cachedDpr = Math.min(window.devicePixelRatio || 1, 2);
        let cachedIsDark = document.documentElement.classList.contains('dark');

        const themeObserver = new MutationObserver(() => {
            cachedIsDark = document.documentElement.classList.contains('dark');
        });
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        const resizeCanvas = () => {
            cachedRect = canvas.getBoundingClientRect();
            cachedDpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = cachedRect.width * cachedDpr;
            canvas.height = cachedRect.height * cachedDpr;

            mouseRef.current.radius = 140 * cachedDpr;

            initParticles(cachedRect.width, cachedRect.height, cachedDpr);
        };

        const initParticles = (logicalWidth: number, logicalHeight: number, dpr: number) => {
            particles = [];
            const canvasWidth = logicalWidth * dpr;
            const canvasHeight = logicalHeight * dpr;

            const logicalArea = logicalWidth * logicalHeight;
            let count = Math.floor(logicalArea / 12000);
            count = Math.max(20, Math.min(count, 150));

            for (let i = 0; i < count; i++) {
                particles.push(new Particle(canvasWidth, canvasHeight, dpr));
            }
        };

        const startLoop = () => {
            if (animationFrameId) return;
            animationFrameId = requestAnimationFrame(animate);
        };

        const stopLoop = () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = 0;
            }
        };

        const animate = () => {
            if (!isVisible) {
                animationFrameId = 0;
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouse = mouseRef.current;

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(canvas.width, canvas.height, mouse, cachedDpr);
                particles[i].draw(ctx, cachedIsDark);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startLoop();
                } else {
                    stopLoop();
                }
            },
            { threshold: 0 }
        );
        visibilityObserver.observe(canvas);

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX - cachedRect.left) * cachedDpr;
            mouseRef.current.y = (e.clientY - cachedRect.top) * cachedDpr;
        };

        const handleMouseLeave = () => {
            mouseRef.current.x = -1000;
            mouseRef.current.y = -1000;
        };

        window.addEventListener("resize", resizeCanvas);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);

        resizeCanvas();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            stopLoop();
            visibilityObserver.disconnect();
            themeObserver.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />
    );
}
