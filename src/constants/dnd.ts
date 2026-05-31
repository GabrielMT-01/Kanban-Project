import type { AutoScrollOptions } from "@dnd-kit/core";

const COLUMN_SCROLL_CLASS = "column-scroll-area";

export function isColumnScrollContainer(element: Element): boolean {
    return element.classList.contains(COLUMN_SCROLL_CLASS);
}

export function isDocumentScrollContainer(element: Element): boolean {
    return element === document.documentElement || element === document.body;
}

/** Prevents infinite window scroll while dragging near viewport edges. */
export const safeAutoScroll: AutoScrollOptions = {
    threshold: { x: 0.12, y: 0.12 },
    acceleration: 6,
    interval: 10,
    canScroll(element) {
        if (isDocumentScrollContainer(element)) return false;
        return isColumnScrollContainer(element);
    },
};

export { COLUMN_SCROLL_CLASS };
