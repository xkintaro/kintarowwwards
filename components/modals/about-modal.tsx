import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useLanguage } from "@/providers/language-provider";
import { useLenisModal } from "@/hooks/use-lenis-modal";
import { RichText } from "@/lib/markdown";

interface AboutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
    const { content, dict } = useLanguage();
    useLenisModal(open);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className="flex flex-col sm:max-w-[640px] max-h-[85vh] p-0 gap-0 border-border/50 bg-background/95 backdrop-blur-xl"
            >
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

                <div className="relative px-8 pt-8 pb-4 shrink-0">
                    <DialogHeader className="gap-3">
                        <DialogTitle className="text-2xl font-bold tracking-tight">
                            {dict.title.about}
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-2 flex-1" data-lenis-prevent="true">
                    <div className="flex flex-col gap-6">
                        <div className="text-sm text-foreground/80 leading-relaxed font-light">
                            <RichText>{content.about.full}</RichText>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />
            </DialogContent>
        </Dialog>
    );
}
