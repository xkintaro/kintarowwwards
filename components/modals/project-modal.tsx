import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useLenisModal } from "@/hooks/use-lenis-modal";
import { useLanguage } from "@/providers/language-provider";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { ProjectItem } from "@/types/project";
import { ShineButton } from "@/components/ui/shine-button";
import { useRef } from "react";
import { RichText } from "@/lib/markdown";

interface ProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: ProjectItem | null;
}

export function ProjectModal({ open, onOpenChange, project }: ProjectModalProps) {
    const openerRef = useRef<HTMLElement | null>(null);
    useLenisModal(open);
    const { dict } = useLanguage();

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={() => {
                    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
                }}
                onCloseAutoFocus={(event) => {
                    if (openerRef.current?.isConnected) {
                        event.preventDefault();
                        openerRef.current.focus({ preventScroll: true });
                    }
                }}
                showCloseButton={true}
                className="flex flex-col sm:max-w-[800px] w-[95vw] max-h-[90vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl shrink-0"
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>{project.title}</DialogTitle>
                    <DialogDescription>{dict.projectDetails} {project.title}</DialogDescription>
                </DialogHeader>

                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="overflow-y-auto w-full h-full flex-1" data-lenis-prevent="true">

                    <div className="relative w-full h-[40vh] sm:h-[50vh] shrink-0">
                        {project.image && (
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 842px) 95vw, 800px"
                                className="object-cover rounded-lg"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-foreground mb-2">
                                    {project.title}
                                </h2>
                                <div className="flex items-center gap-3 text-sm font-mono tracking-widest text-muted-foreground uppercase">
                                    <span>{project.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-border" />
                                    <span>{project.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 flex flex-col gap-10">
                        <div>
                            <h3 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">{dict.aboutProject}</h3>
                            <p className="text-lg text-foreground/80 leading-relaxed font-light">
                                <RichText>{project.description}</RichText>
                            </p>
                        </div>

                        {project.stack && project.stack.length > 0 && (
                            <div>
                                <h3 className="text-sm tracking-widest text-muted-foreground uppercase mb-4">{dict.technologies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(project.demo || project.repo) && (
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
                                {project.demo && (
                                    <ShineButton
                                        href={project.demo}
                                        className="h-12 bg-foreground px-6 sm:px-8 text-background hover:bg-background hover:text-foreground shadow-lg hover:-translate-y-1"
                                        shineClassName="w-8 bg-background/20 dark:bg-foreground/10"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest uppercase">
                                            {dict.liveDemo}
                                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </span>
                                    </ShineButton>
                                )}

                                {project.repo && (
                                    <ShineButton
                                        href={project.repo}
                                        className="h-12 bg-secondary/10 backdrop-blur-md px-6 sm:px-8 text-foreground hover:bg-foreground hover:text-background shadow-sm hover:-translate-y-1"
                                        shineClassName="w-8 bg-foreground/10 dark:bg-background/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2 text-xs sm:text-sm font-medium tracking-widest uppercase">
                                            {dict.sourceCode}
                                            <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                                        </span>
                                    </ShineButton>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
