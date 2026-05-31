import { useSettings } from "../context/SettingsContext";
import type { Locale, Theme } from "../i18n/translations";

interface SettingsPanelProps {
    className?: string;
}

interface OptionButtonProps<T extends string> {
    value: T;
    current: T;
    label: string;
    onSelect: (value: T) => void;
}

function OptionButton<T extends string>({ value, current, label, onSelect }: OptionButtonProps<T>) {
    const isActive = value === current;

    return (
        <button
            type="button"
            onClick={() => onSelect(value)}
            className={`flex-1 cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
        >
            {label}
        </button>
    );
}

function SettingsPanel({ className = "" }: SettingsPanelProps) {
    const { theme, locale, t, setTheme, setLocale } = useSettings();

    return (
        <div
            className={`rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
        >
            <p className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">{t.settings}</p>

            <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t.theme}
                </p>
                <div className="flex gap-2">
                    <OptionButton<Theme>
                        value="light"
                        current={theme}
                        label={t.lightMode}
                        onSelect={setTheme}
                    />
                    <OptionButton<Theme>
                        value="dark"
                        current={theme}
                        label={t.darkMode}
                        onSelect={setTheme}
                    />
                </div>
            </div>

            <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {t.language}
                </p>
                <div className="flex gap-2">
                    <OptionButton<Locale>
                        value="en"
                        current={locale}
                        label={t.english}
                        onSelect={setLocale}
                    />
                    <OptionButton<Locale>
                        value="pt"
                        current={locale}
                        label={t.portuguese}
                        onSelect={setLocale}
                    />
                </div>
            </div>
        </div>
    );
}

export default SettingsPanel;
