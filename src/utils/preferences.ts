import type { Locale, Theme } from "../i18n/translations";

const PREFS_KEY = "kanban.preferences.v1";

export interface UserPreferences {
    theme: Theme;
    locale: Locale;
}

const defaultPreferences: UserPreferences = {
    theme: "light",
    locale: "en",
};

function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark";
}

function isLocale(value: unknown): value is Locale {
    return value === "en" || value === "pt";
}

function isPreferences(value: unknown): value is UserPreferences {
    if (typeof value !== "object" || value === null) return false;

    const prefs = value as Record<string, unknown>;
    return isTheme(prefs.theme) && isLocale(prefs.locale);
}

export function loadPreferences(): UserPreferences {
    try {
        const raw = localStorage.getItem(PREFS_KEY);
        if (!raw) return defaultPreferences;

        const parsed: unknown = JSON.parse(raw);
        if (isPreferences(parsed)) return parsed;
    } catch {
        // corrupted or unavailable storage
    }

    return defaultPreferences;
}

export function savePreferences(prefs: UserPreferences): void {
    try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
        // quota exceeded or private browsing
    }
}

export function applyTheme(theme: Theme): void {
    document.documentElement.classList.toggle("dark", theme === "dark");
}
