"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useScroll, useTransform, useMotionTemplate, motion } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";
import { ArrowRight, Mouse } from "lucide-react";
import { ContactModal } from "@/components/modals/contact-modal";
import { InteractiveParticles } from "@/components/effects/interactive-particles";
import { RichText } from "@/lib/markdown";

const TRACK_1 = [
    "/hero-slider/makise-kurisu-2.webp",
    "/hero-slider/atam-1.webp",
    "/hero-slider/kintaro-2.webp",
    "/hero-slider/makise-kurisu-1.webp",
    "/hero-slider/atam-2.webp",
    "/hero-slider/kintaro-1.webp",
] as const;

const TRACK_2 = [
    "/hero-slider/kintaro-1.webp",
    "/hero-slider/atam-2.webp",
    "/hero-slider/makise-kurisu-1.webp",
    "/hero-slider/kintaro-2.webp",
    "/hero-slider/atam-1.webp",
    "/hero-slider/makise-kurisu-2.webp",
] as const;

const COL_1_IMAGES = [...TRACK_1, ...TRACK_1];
const COL_2_IMAGES = [...TRACK_2, ...TRACK_2];

export default function Hero() {
    const { content, dict } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const [contactOpen, setContactOpen] = useState(false);

    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 800], [1, 0]);
    const scale = useTransform(scrollY, [0, 800], [1, 0.94]);
    const y = useTransform(scrollY, [0, 800], [0, -150]);
    const blurValue = useTransform(scrollY, [0, 800], [0, 10]);
    const filter = useMotionTemplate`blur(${blurValue}px)`;

    const scrollToProjects = useCallback(() => {
        const projectsSection = document.getElementById("projects");
        if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <section
            ref={containerRef}
            className="sticky top-0 h-screen w-full flex flex-col justify-between bg-background px-container md:px-16 pt-28 pb-12 sm:pt-32 sm:pb-16 2xl:pb-24 overflow-hidden"
            id="home"
        >
            <InteractiveParticles />

            <motion.div
                style={{ opacity }}
                className="absolute top-0 right-6 sm:right-12 md:right-16 lg:right-24 xl:right-36 2xl:right-48 bottom-0 h-full w-55 sm:w-65 md:w-85 lg:w-100 xl:w-110 2xl:w-120 flex gap-3 sm:gap-4 px-2 overflow-hidden z-5 pointer-events-none select-none opacity-[0.22] dark:opacity-[0.28] mix-blend-luminosity"
            >
                <div className="max-md:hidden flex-1 h-full overflow-hidden relative">
                    <motion.div
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{
                            ease: "linear",
                            duration: 32,
                            repeat: Infinity
                        }}
                        className="flex flex-col gap-3 sm:gap-4 pt-4"
                    >
                        {COL_1_IMAGES.map((src, idx) => (
                            <div key={idx} className="w-full aspect-3/4 relative overflow-hidden rounded-4xl border border-border/5">
                                <Image
                                    src={src}
                                    alt="Portrait"
                                    fill
                                    sizes="(max-width: 767px) 0px, (max-width: 1023px) 154px, (max-width: 1279px) 184px, (max-width: 1535px) 204px, 224px"
                                    loading="lazy"
                                    className="object-cover object-center grayscale contrast-[1.08] brightness-[0.8]"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="max-md:opacity-50 flex-1 h-full overflow-hidden relative">
                    <motion.div
                        animate={{ y: ["-50%", "0%"] }}
                        transition={{
                            ease: "linear",
                            duration: 32,
                            repeat: Infinity
                        }}
                        className="flex flex-col gap-3 sm:gap-4 pt-4"
                    >
                        {COL_2_IMAGES.map((src, idx) => (
                            <div key={idx} className="w-full aspect-3/4 relative overflow-hidden rounded-4xl border border-border/5">
                                <Image
                                    src={src}
                                    alt="Portrait"
                                    fill
                                    sizes="(max-width: 639px) 192px, (max-width: 767px) 232px, (max-width: 1023px) 154px, (max-width: 1279px) 184px, (max-width: 1535px) 204px, 224px"
                                    loading={idx >= TRACK_2.length && idx < TRACK_2.length + 3 ? "eager" : "lazy"}
                                    className="object-cover object-center grayscale contrast-[1.08] brightness-[0.8]"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-background pointer-events-none z-10" />
                <div className="absolute inset-0 bg-linear-to-r from-background via-transparent to-transparent pointer-events-none z-10" />
            </motion.div>

            <motion.div
                style={{ opacity, scale, y, filter }}
                className="relative z-20 flex-1 flex flex-col gap-6 sm:gap-8 xl:gap-12 justify-end w-full h-full will-change-[opacity,transform,filter]"
            >

                <div className="flex justify-between items-start w-full">

                    <div className="text-4xl sm:text-6xl text-foreground/10 grunge-text rotate-90 pointer-events-none select-none">
                        {"////"}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="w-px h-12 bg-border relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 w-full h-1/2 bg-foreground"
                                animate={{
                                    y: ["0%", "100%", "0%"]
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                        <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-muted-foreground [writing-mode:vertical-lr]">
                            {dict.scrollDown}
                        </span>
                    </div>
                </div>

                <div className="w-full mt-auto flex flex-col justify-center relative z-20 mix-blend-difference">
                    <div className="overflow-hidden">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl 3xl:text-[140px] font-black tracking-tighter leading-[0.85] text-foreground uppercase whitespace-nowrap">
                            Kintaro
                            <br />
                            <span className="text-foreground/80">
                                Portfolio
                            </span>
                        </h1>
                    </div>
                </div>

                <div className="space-y-6 sm:space-y-8 xl:space-y-10">
                    <p className="sm:text-lg 2xl:text-xl text-muted-foreground font-light leading-relaxed max-w-xl mix-blend-difference">
                        <RichText>{content.about.description}</RichText>
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-4">
                        <button
                            onClick={() => setContactOpen(true)}
                            className="w-fit group relative flex h-12 xl:h-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border/50 bg-foreground px-6 xl:px-10 text-background transition-all duration-500 ease-out hover:bg-background hover:border-foreground/30 hover:text-foreground shadow-2xl hover:-translate-y-0.5"
                        >
                            <div className="absolute inset-0 flex h-full w-full justify-center -translate-x-full -skew-x-12 group-hover:duration-1000 group-hover:translate-x-full">
                                <div className="relative h-full w-8 bg-background/20 dark:bg-foreground/10" />
                            </div>
                            <span className="relative z-10 flex items-center gap-2 xl:gap-3 text-xs xl:text-base font-semibold tracking-[0.15em] uppercase">
                                {dict.contactMe}
                                <ArrowRight className="w-3.5 xl:w-5 h-3.5 xl:h-5 transition-transform duration-500 group-hover:translate-x-1" />
                            </span>
                        </button>

                        <button
                            onClick={scrollToProjects}
                            className="w-fit group relative flex h-12 xl:h-16 cursor-pointer items-center justify-center px-6 xl:px-10 text-muted-foreground transition-all duration-500 hover:text-foreground hover:bg-secondary/15 rounded-full border border-border sm:border-transparent hover:border-border/30 backdrop-blur-sm"
                        >
                            <span className="relative z-10 text-xs xl:text-base font-semibold tracking-[0.15em] uppercase flex items-center gap-2 xl:gap-3">
                                <Mouse className="w-3.5 xl:w-5 h-3.5 xl:h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                {dict.exploreProjects}
                            </span>
                        </button>
                    </div>
                </div>

            </motion.div>

            <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
        </section>
    );
}
