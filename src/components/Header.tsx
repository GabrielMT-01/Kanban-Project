import { useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { COLUMNS, type ColumnId } from "../types/task";
import { ANIMATION_MS } from "../constants/animation";
import AnimatedPopover from "./AnimatedPopover";
import SettingsPanel from "./SettingsPanel";

const columnDotColors: Record<ColumnId, string> = {
    "To Do": "bg-blue-500",
    "In Progress": "bg-yellow-500",
    Review: "bg-purple-500",
    Done: "bg-green-500",
};

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddTask: (columnId: ColumnId) => void;
}

function SearchIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="text-gray-400 dark:text-gray-500"
        >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

interface ColumnPickerProps {
    onSelect: (columnId: ColumnId) => void;
    onCancel: () => void;
    className?: string;
}

function ColumnPicker({ onSelect, onCancel, className = "" }: ColumnPickerProps) {
    const { t, columnLabel } = useSettings();

    return (
        <div
            className={`rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900 ${className}`}
        >
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t.selectColumn}</p>
            <div className="flex flex-col gap-1.5">
                {COLUMNS.map((columnId) => (
                    <button
                        key={columnId}
                        type="button"
                        onClick={() => onSelect(columnId)}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        <span className={`h-2 w-2 rounded-full ${columnDotColors[columnId]}`} />
                        {columnLabel(columnId)}
                    </button>
                ))}
            </div>
            <button
                type="button"
                onClick={onCancel}
                className="mt-2 w-full cursor-pointer rounded-md py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
            >
                {t.cancel}
            </button>
        </div>
    );
}

function Header({ searchQuery, onSearchChange, onAddTask }: HeaderProps) {
    const { t } = useSettings();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [showMobileColumnPicker, setShowMobileColumnPicker] = useState(false);
    const [showMobileSettings, setShowMobileSettings] = useState(false);
    const [showDesktopColumnPicker, setShowDesktopColumnPicker] = useState(false);
    const [showDesktopSettings, setShowDesktopSettings] = useState(false);
    const desktopAddRef = useRef<HTMLDivElement>(null);
    const desktopSettingsRef = useRef<HTMLDivElement>(null);

    const closeMenu = () => {
        setIsClosing(true);
        setShowMobileColumnPicker(false);
        setShowMobileSettings(false);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, ANIMATION_MS);
    };

    const toggleMenu = () => {
        if (isMenuOpen) closeMenu();
        else setIsMenuOpen(true);
    };

    const handleMobileColumnSelect = (columnId: ColumnId) => {
        setShowMobileColumnPicker(false);
        onAddTask(columnId);
        setTimeout(() => closeMenu(), 50);
    };

    const handleDesktopColumnSelect = (columnId: ColumnId) => {
        setShowDesktopColumnPicker(false);
        onAddTask(columnId);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                desktopAddRef.current &&
                !desktopAddRef.current.contains(event.target as Node)
            ) {
                setShowDesktopColumnPicker(false);
            }

            if (
                desktopSettingsRef.current &&
                !desktopSettingsRef.current.contains(event.target as Node)
            ) {
                setShowDesktopSettings(false);
            }
        };

        if (showDesktopColumnPicker || showDesktopSettings) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showDesktopColumnPicker, showDesktopSettings]);

    return (
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 lg:px-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-col">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-gray-100 lg:text-2xl">
                        {t.appTitle}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.appSubtitle}</p>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-3">
                    <div className="relative w-full max-w-sm">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:bg-gray-800"
                        />
                    </div>

                    <div ref={desktopSettingsRef} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowDesktopSettings((open) => !open);
                                setShowDesktopColumnPicker(false);
                            }}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                        >
                            <SettingsIcon />
                            {t.settings}
                        </button>
                        <AnimatedPopover
                            open={showDesktopSettings}
                            className="absolute right-0 top-full z-20 mt-2 w-72 origin-top-right"
                        >
                            <SettingsPanel />
                        </AnimatedPopover>
                    </div>

                    <div ref={desktopAddRef} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setShowDesktopColumnPicker((open) => !open);
                                setShowDesktopSettings(false);
                            }}
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                        >
                            <PlusIcon />
                            {t.addTask}
                        </button>
                        <AnimatedPopover
                            open={showDesktopColumnPicker}
                            className="absolute right-0 top-full z-20 mt-2 w-52 origin-top-right"
                        >
                            <ColumnPicker
                                onSelect={handleDesktopColumnSelect}
                                onCancel={() => setShowDesktopColumnPicker(false)}
                            />
                        </AnimatedPopover>
                    </div>
                </div>

                <button
                    type="button"
                    aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
                    aria-expanded={isMenuOpen}
                    onClick={toggleMenu}
                    className="flex shrink-0 flex-col justify-center gap-1.5 rounded-md p-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
                >
                    <span
                        className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ease-in-out dark:bg-gray-200 ${
                            isMenuOpen ? "translate-y-2 rotate-45" : ""
                        }`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ease-in-out dark:bg-gray-200 ${
                            isMenuOpen ? "opacity-0 scale-x-0" : ""
                        }`}
                    />
                    <span
                        className={`block h-0.5 w-6 bg-gray-800 transition-all duration-300 ease-in-out dark:bg-gray-200 ${
                            isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                        }`}
                    />
                </button>
            </div>

            {isMenuOpen && (
                <>
                    <div
                        className={`fixed inset-0 z-40 bg-black/30 lg:hidden ${
                            isClosing ? "animate-overlay-fade-out" : "animate-overlay-fade-in"
                        }`}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />
                    <nav
                        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col gap-4 overflow-y-auto bg-white p-6 shadow-lg dark:bg-gray-900 lg:hidden ${
                            isClosing ? "animate-menu-slide-out" : "animate-menu-slide-in"
                        }`}
                    >
                        <div className="flex justify-end animate-menu-content-in">
                            <button
                                type="button"
                                aria-label={t.closeMenu}
                                onClick={closeMenu}
                                className="cursor-pointer rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="relative animate-menu-content-in">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder={t.searchPlaceholder}
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-gray-300 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-600 dark:focus:bg-gray-800"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <AnimatedPopover open={showMobileSettings} variant="fade">
                                <SettingsPanel />
                            </AnimatedPopover>

                            {!showMobileSettings && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMobileSettings(true);
                                        setShowMobileColumnPicker(false);
                                    }}
                                    className="animate-menu-content-in flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                                >
                                    <SettingsIcon />
                                    {t.settings}
                                </button>
                            )}

                            <AnimatedPopover open={showMobileColumnPicker} variant="fade">
                                <ColumnPicker
                                    onSelect={handleMobileColumnSelect}
                                    onCancel={() => setShowMobileColumnPicker(false)}
                                />
                            </AnimatedPopover>

                            {!showMobileColumnPicker && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMobileColumnPicker(true);
                                        setShowMobileSettings(false);
                                    }}
                                    className="animate-menu-content-in flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                                >
                                    <PlusIcon />
                                    {t.addTask}
                                </button>
                            )}
                        </div>
                    </nav>
                </>
            )}
        </header>
    );
}

export default Header;
