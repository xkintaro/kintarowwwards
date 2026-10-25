"use client";

import { useEffect, useRef } from "react";
import { User } from "lucide-react";

export function HangingProfile() {
  const boxRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGLineElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wakePhysicsRef = useRef<(() => void) | null>(null);
  const cleanupDragRef = useRef<(() => void) | null>(null);

  const gravity = 1.2;
  const ropeLength = 180;
  const damping = 0.995;

  const state = useRef({
    angle: 0,
    velocity: 0,
    isDragging: false,
    dragX: 0,
    dragY: 0,
    currentLength: ropeLength
  });

  useEffect(() => {
    let animationFrameId = 0;
    let isVisible = false;

    const updatePhysics = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      if (!state.current.isDragging) {

        state.current.currentLength += (ropeLength - state.current.currentLength) * 0.1;

        const acceleration = (-gravity / state.current.currentLength) * Math.sin(state.current.angle);

        state.current.velocity += acceleration;
        state.current.velocity *= damping;
        state.current.angle += state.current.velocity;
      } else {
        const dx = state.current.dragX;

        const dy = Math.max(state.current.dragY, 10);

        const targetAngle = Math.atan2(dx, dy);
        let targetLength = Math.sqrt(dx * dx + dy * dy);

        if (targetLength > ropeLength) {
          targetLength = ropeLength + (targetLength - ropeLength) * 0.2;
        } else if (targetLength < ropeLength * 0.3) {
          targetLength = ropeLength * 0.3;
        }

        state.current.angle += (targetAngle - state.current.angle) * 0.4;
        state.current.currentLength += (targetLength - state.current.currentLength) * 0.4;
        state.current.velocity = 0;
      }

      // Stop only when the remaining movement is below a visible pixel.
      const isResting = !state.current.isDragging
        && Math.abs(state.current.angle) < 0.0005
        && Math.abs(state.current.velocity) < 0.00005
        && Math.abs(state.current.currentLength - ropeLength) < 0.1;

      if (isResting) {
        state.current.angle = 0;
        state.current.velocity = 0;
        state.current.currentLength = ropeLength;
      }

      if (boxRef.current && ropeRef.current) {
        const x = state.current.currentLength * Math.sin(state.current.angle);
        const y = state.current.currentLength * Math.cos(state.current.angle);

        ropeRef.current.setAttribute("x2", (150 + x).toString());
        ropeRef.current.setAttribute("y2", y.toString());

        boxRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${-state.current.angle}rad)`;
      }

      animationFrameId = isResting ? 0 : requestAnimationFrame(updatePhysics);
    };

    const startLoop = () => {
      if (!isVisible || animationFrameId) return;
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    wakePhysicsRef.current = startLoop;

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const observer = new IntersectionObserver(
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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      wakePhysicsRef.current = null;
      cleanupDragRef.current?.();
      stopLoop();
      observer.disconnect();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    cleanupDragRef.current?.();
    state.current.isDragging = true;
    if (boxRef.current) {
      boxRef.current.style.cursor = "grabbing";
    }

    const updateMousePos = (ev: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const originX = rect.width / 2;
      const originY = 0;

      state.current.dragX = ev.clientX - rect.left - originX;
      state.current.dragY = ev.clientY - rect.top - originY;
    };

    const handlePointerUp = () => {
      state.current.isDragging = false;
      if (boxRef.current) {
        boxRef.current.style.cursor = "grab";
      }
      window.removeEventListener("pointermove", updateMousePos);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      cleanupDragRef.current = null;
    };

    updateMousePos(e.nativeEvent as PointerEvent);

    window.addEventListener("pointermove", updateMousePos);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
    cleanupDragRef.current = handlePointerUp;
    wakePhysicsRef.current?.();
  };

  return (
    <div ref={containerRef} className="relative w-[300px] h-[350px] flex justify-center -mt-4">
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
        <line
          ref={ropeRef}
          x1="150"
          y1="0"
          x2="150"
          y2="180"
          stroke="currentColor"
          strokeWidth="3"
          className="text-foreground/20"
          strokeLinecap="round"
        />
        <circle cx="150" cy="0" r="5" fill="currentColor" className="text-foreground/40" />
        <circle cx="150" cy="0" r="2" fill="currentColor" className="text-background" />
      </svg>

      <div
        ref={boxRef}
        onPointerDown={handlePointerDown}
        className="absolute top-0 flex flex-col items-center justify-center p-4 w-[140px] rounded-2xl bg-background/40 backdrop-blur-md border border-foreground/10 cursor-grab shadow-2xl select-none group hover:bg-background/60 transition-colors duration-300"
        style={{
          left: "50%",
          marginLeft: "-70px",
          transformOrigin: "center top",
          transform: "translate(0px, 180px)",
          touchAction: "none"
        }}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden border border-foreground/20 mb-3 bg-foreground/5 flex items-center justify-center pointer-events-none group-hover:border-foreground/40 transition-colors duration-300">
          <User className="w-10 h-10 text-foreground/40 group-hover:text-foreground/70 transition-colors duration-300" />
        </div>
        <div className="flex flex-col items-center gap-1 pointer-events-none">
          <span className="text-xs font-bold tracking-[0.2em] text-foreground/80">
            KINTARO
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Developer
          </span>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 rounded-full border-2 border-foreground/20 bg-background" />
      </div>
    </div>
  );
}
