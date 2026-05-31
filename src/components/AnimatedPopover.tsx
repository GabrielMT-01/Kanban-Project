import { useEffect, useState, type ReactNode } from "react";
import { ANIMATION_MS } from "../constants/animation";

type AnimationVariant = "dropdown" | "modal" | "fade";

interface AnimatedPopoverProps {
    open: boolean;
    children: ReactNode;
    className?: string;
    variant?: AnimationVariant;
}

const inClasses: Record<AnimationVariant, string> = {
    dropdown: "animate-dropdown-in",
    modal: "animate-modal-in",
    fade: "animate-fade-in",
};

const outClasses: Record<AnimationVariant, string> = {
    dropdown: "animate-dropdown-out",
    modal: "animate-modal-out",
    fade: "animate-fade-out",
};

function AnimatedPopover({
    open,
    children,
    className = "",
    variant = "dropdown",
}: AnimatedPopoverProps) {
    const [mounted, setMounted] = useState(open);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (open) {
            setMounted(true);
            setClosing(false);
            return;
        }

        if (!mounted) return;

        setClosing(true);
        const timer = window.setTimeout(() => {
            setMounted(false);
            setClosing(false);
        }, ANIMATION_MS);

        return () => window.clearTimeout(timer);
    }, [open, mounted]);

    if (!mounted) return null;

    return (
        <div className={`${className} ${closing ? outClasses[variant] : inClasses[variant]}`}>
            {children}
        </div>
    );
}

export default AnimatedPopover;
