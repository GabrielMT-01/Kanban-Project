import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { translations, type Locale, type Theme, type Translations } from "../i18n/translations";
import type { ColumnFilter, ColumnId, Priority } from "../types/task";
import { applyTheme, loadPreferences, savePreferences } from "../utils/preferences";

interface SettingsContextValue {
    theme: Theme;
    locale: Locale;
    t: Translations;
    setTheme: (theme: Theme) => void;
    setLocale: (locale: Locale) => void;
    columnLabel: (columnId: ColumnId) => string;
    priorityLabel: (priority: Priority) => string;
    filterLabel: (filter: ColumnFilter) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => loadPreferences().theme);
    const [locale, setLocaleState] = useState<Locale>(() => loadPreferences().locale);

    const t = useMemo(() => translations[locale], [locale]);

    useEffect(() => {
        applyTheme(theme);
        document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
        savePreferences({ theme, locale });
    }, [theme, locale]);

    const setTheme = useCallback((next: Theme) => setThemeState(next), []);
    const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

    const columnLabel = useCallback(
        (columnId: ColumnId) => t.columns[columnId],
        [t]
    );

    const priorityLabel = useCallback(
        (priority: Priority) => t.priorities[priority],
        [t]
    );

    const filterLabel = useCallback(
        (filter: ColumnFilter) => t.filters[filter],
        [t]
    );

    const value = useMemo(
        () => ({
            theme,
            locale,
            t,
            setTheme,
            setLocale,
            columnLabel,
            priorityLabel,
            filterLabel,
        }),
        [theme, locale, t, setTheme, setLocale, columnLabel, priorityLabel, filterLabel]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within SettingsProvider");
    }
    return context;
}
