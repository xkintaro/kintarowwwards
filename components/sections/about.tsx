"use client";

import { ArrowRight } from "lucide-react";
import { BlurReveal } from "@/components/effects/blur-reveal";
import { useLanguage } from "@/providers/language-provider";
import { useState } from "react";
import { AboutModal } from "@/components/modals/about-modal";
import { HangingProfile } from "@/components/widgets/hanging-profile";
import { RichText } from "@/lib/markdown";

export default function About() {
    const { content, dict } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="w-full container-void bg-background text-foreground overflow-hidden relative">
            <div className="container mx-auto px-container">
                <div className="flex flex-col xl:flex-row gap-12 xl:gap-32">

                    <div className="xl:w-1/4">
                        <div className="flex flex-col gap-4 sticky top-32">

                            <BlurReveal>
                                <span className="title-counter">
                                    [001]
                                </span>
                            </BlurReveal>

                            <BlurReveal>
                                <h2 className="title relative z-10">
                                    {dict.title.about}
                                </h2>
                            </BlurReveal>

                            <BlurReveal>
                                <div className="mt-8 hidden xl:block">
                                    <HangingProfile />
                                </div>
                            </BlurReveal>

                        </div>
                    </div>

                    <div className="xl:w-3/4 flex flex-col gap-24">

                        <div className="space-y-12">

                            <BlurReveal>
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-light leading-[1.1]">
                                    <RichText>{content.about.intro}</RichText>
                                </h3>
                            </BlurReveal>

                            <BlurReveal>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                                    <RichText>{content.about.description}</RichText>
                                </p>
                            </BlurReveal>

                            <BlurReveal>
                                <>
                                    <button
                                        onClick={() => setIsOpen(true)}
                                        className="group relative inline-flex cursor-pointer items-center gap-2 text-xl md:text-2xl font-medium py-2"
                                    >
                                        <span className="relative z-10 border-b-2 border-foreground/30 pb-1 group-hover:border-foreground transition-all duration-300">
                                            {dict.readFullVersion}
                                        </span>
                                        <ArrowRight className="w-6 h-6" />
                                    </button>

                                    <AboutModal open={isOpen} onOpenChange={setIsOpen} />
                                </>
                            </BlurReveal>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
