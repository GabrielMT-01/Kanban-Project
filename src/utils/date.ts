import type { Locale } from "../i18n/translations";

function getDateLocale(locale: Locale): string {
    return locale === "pt" ? "pt-BR" : "en-US";
}

export function formatTaskDate(timestamp: number, locale: Locale = "en"): string {
    return new Date(timestamp).toLocaleDateString(getDateLocale(locale), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatCommentDate(timestamp: number, locale: Locale = "en"): string {
    return new Date(timestamp).toLocaleString(getDateLocale(locale), {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
