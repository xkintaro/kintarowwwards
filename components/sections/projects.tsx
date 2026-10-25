"use client";

import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/providers/language-provider";
import { useMediaQuery, BREAKPOINTS } from "@/hooks/use-media-query";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { ProjectModal } from "@/components/modals/project-modal";
import type { ProjectItem } from "@/types/project";
import { RichText } from "@/lib/markdown";

export default function Projects() {
    const { content, dict } = useLanguage();

    const isDesktop = useMediaQuery(BREAKPOINTS.xl);

    const targetRef = useRef<HTMLDivElement>(null);
    const horizontalContainerRef = useRef<HTMLDivElement>(null);

    const [measurements, setMeasurements] = useState({ scrollRange: 0, dynamicHeight: "auto" });
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isDesktop) {
            const frame = requestAnimationFrame(() => {
                setMeasurements({ scrollRange: 0, dynamicHeight: "auto" });
            });
            return () => cancelAnimationFrame(frame);
        }

        const updateMeasurements = () => {
            if (horizontalContainerRef.current) {
                const totalWidth = horizontalContainerRef.current.scrollWidth;
                const viewportW = window.innerWidth;
                const range = totalWidth - viewportW;
                const safeRange = range > 0 ? range : 0;

                setMeasurements({
                    scrollRange: safeRange,
                    dynamicHeight: `${safeRange + window.innerHeight}px`,
                });
            }
        };

        updateMeasurements();

        const timeout = setTimeout(updateMeasurements, 100);
        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateMeasurements);
        });

        if (horizontalContainerRef.current) {
            resizeObserver.observe(horizontalContainerRef.current);
        }

        return () => {
            clearTimeout(timeout);
            resizeObserver.disconnect();
        };
    }, [isDesktop, content.projects]);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], [0, -measurements.scrollRange]);
    const smoothX = useSpring(x, { stiffness: 400, damping: 60, restDelta: 0.5 });

    const handleOpenProject = (project: ProjectItem) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <section
            ref={targetRef}
            data-slot="projects"
            className="relative py-16 md:py-24 lg:py-32 xl:py-0"
            style={{ height: measurements.dynamicHeight }}
        >
            <div
                className={`
                    w-full 
                    ${isDesktop
                        ? "sticky top-0 h-screen flex items-center overflow-hidden"
                        : "relative flex flex-col"
                    }
                `}
            >

                {!isDesktop ? (
                    <>
                        <div className="flex flex-col gap-4 px-container mb-10">
                            <BlurReveal>
                                <span className="title-counter">
                                    [003]
                                </span>
                            </BlurReveal>

                            <BlurReveal>
                                <h2 className="title">
                                    {dict.title.projects}
                                </h2>
                            </BlurReveal>

                            <BlurReveal>
                                <p className="mt-4 text-muted-foreground text-lg">
                                    <RichText>{dict.projectsIntro}</RichText>
                                </p>
                            </BlurReveal>
                        </div>
                        <div className="flex flex-col w-full max-w-full px-container gap-container">
                            {content.projects.map((project: ProjectItem) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onClick={() => handleOpenProject(project)}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <motion.div
                        ref={horizontalContainerRef}
                        style={{ x: smoothX }}
                        className="flex px-container w-max items-center"
                    >
                        <div className="w-[60vw] xl:w-[40vw] shrink-0 flex flex-col justify-center">

                            <div className="flex flex-col gap-4">

                                <BlurReveal>
                                    <span className="title-counter">
                                        [003]
                                    </span>
                                </BlurReveal>

                                <BlurReveal>
                                    <h2 className="title">
                                        {dict.title.projects}
                                    </h2>
                                </BlurReveal>

                                <BlurReveal>
                                    <p className="mt-4 text-5xl font-light leading-tight">
                                        <RichText>{dict.projectsIntro}</RichText>
                                    </p>
                                </BlurReveal>

                                <BlurReveal>
                                    <div className="mt-12 flex items-center gap-4">
                                        <div className="h-px w-24 bg-border" />
                                        <span className="text-sm font-mono text-foreground/40 uppercase">
                                            {dict.projectsScrollText}
                                        </span>
                                    </div>
                                </BlurReveal>

                            </div>

                        </div>

                        {content.projects.map((project: ProjectItem) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => handleOpenProject(project)}
                            />
                        ))}

                        <div className="w-[40vw] h-[70vh] shrink-0 flex flex-col justify-center items-center">
                            <h3 className="text-[10vw] font-black tracking-tighter text-border uppercase">
                                {dict.projectsEndText}
                            </h3>
                        </div>
                    </motion.div>
                )}
            </div>

            <ProjectModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                project={selectedProject}
            />
        </section>
    );
}

const ProjectCard = React.memo(function ProjectCard({ project, onClick }: { project: ProjectItem; onClick?: () => void }) {
    return (
        <BlurReveal>
            <div
                className="group relative w-full xl:w-[45vw] aspect-4/3 shrink-0 xl:mx-6 perspective-1000 cursor-pointer"
            >
                <div className="relative w-full h-full overflow-hidden bg-muted border border-border/50 transition-all duration-700 ease-out group-hover:border-foreground/20 group-focus-within:border-foreground/20">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1280px) 100vw, 45vw"
                            loading="lazy"
                            className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 group-focus-within:opacity-100 group-focus-within:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0 group-focus-within:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
                    </div>

                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 xl:p-12">
                        <div className="flex justify-between items-start">
                            <div className="overflow-hidden">
                                <span className="block text-xs xl:text-sm font-mono tracking-widest text-muted-foreground uppercase transform translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 delay-100">
                                    {project.category}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="block text-xs xl:text-sm font-mono text-muted-foreground transform translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-500 delay-200">
                                    {project.year}
                                </span>
                            </div>
                        </div>

                        <h3 className="absolute bottom-6 md:bottom-8 2xl:bottom-12 left-6 md:left-8 2xl:left-12 text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tighter uppercase text-foreground opacity-10 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none">
                            {project.title}
                        </h3>
                    </div>

                </div>
                <button
                    type="button"
                    onClick={onClick}
                    aria-label={project.title}
                    aria-haspopup="dialog"
                    className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                />
            </div>
        </BlurReveal>
    );
});
