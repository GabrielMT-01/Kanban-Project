import { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSettings } from "../context/SettingsContext";
import type { ColumnFilter, ColumnId, Task, TaskEditableFields } from "../types/task";
import { COLUMN_FILTER_OPTIONS, filterTasksByTitle, sortTasksByFilter } from "../types/task";
import { columnDroppableId } from "../utils/dnd";
import AnimatedPopover from "./AnimatedPopover";
import TaskCard from "./TaskCard";

const columnDotColors: Record<string, string> = {
    "To Do": "bg-blue-500",
    "In Progress": "bg-yellow-500",
    Review: "bg-purple-500",
    Done: "bg-green-500",
};

interface CardColsProps {
    titleCol: ColumnId;
    tasks: Task[];
    searchQuery: string;
    focusTaskId: number | null;
    isDragEnabled: boolean;
    onAddTask: () => void;
    onUpdateTask: (taskId: number, updates: Partial<TaskEditableFields>) => void;
    onAddComment: (taskId: number, content: string) => void;
    onDeleteTask: (taskId: number) => void;
    onFocusComplete: () => void;
}

function CardCols({
    titleCol,
    tasks,
    searchQuery,
    focusTaskId,
    isDragEnabled,
    onAddTask,
    onUpdateTask,
    onAddComment,
    onDeleteTask,
    onFocusComplete,
}: CardColsProps) {
    const { t, columnLabel, filterLabel } = useSettings();
    const menuRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<ColumnFilter>("Normal");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dotColor = columnDotColors[titleCol] ?? "bg-blue-500";
    const filteredTasks = filterTasksByTitle(tasks, searchQuery);
    const sortedTasks = sortTasksByFilter(filteredTasks, filter);
    const isSearching = searchQuery.trim().length > 0;
    const canDragInColumn = isDragEnabled && filter === "Normal";
    const displayTasks = canDragInColumn ? tasks : sortedTasks;
    const sortableIds = displayTasks.map((task) => task.id);

    const { setNodeRef, isOver } = useDroppable({
        id: columnDroppableId(titleCol),
        data: { columnId: titleCol },
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const handleFilterSelect = (option: ColumnFilter) => {
        setFilter(option);
        setIsMenuOpen(false);
    };

    return (
        <div className="flex h-128 w-full max-w-80 flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:max-w-none lg:h-[min(28rem,calc(50vh-3rem))] xl:h-[calc(100vh-7rem)] 2xl:rounded-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800 xl:px-5 xl:py-4">
                <div className="flex items-center gap-2 xl:gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full xl:h-3 xl:w-3 ${dotColor}`} />
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 xl:text-base 2xl:text-lg">
                        {columnLabel(titleCol)}
                    </h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400 xl:px-2.5 xl:py-1 xl:text-sm">
                        {isSearching ? filteredTasks.length : tasks.length}
                    </span>
                </div>

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        aria-label={t.sortColumn}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((open) => !open)}
                        className="cursor-pointer rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                    </button>

                    <AnimatedPopover
                        open={isMenuOpen}
                        className="absolute right-0 top-full z-10 mt-1 w-44 origin-top-right"
                    >
                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                            <span className="block px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                                {t.sortBy}
                            </span>
                            {COLUMN_FILTER_OPTIONS.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleFilterSelect(option)}
                                    className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                        filter === option
                                            ? "font-semibold text-gray-900 dark:text-gray-100"
                                            : "font-medium text-gray-600 dark:text-gray-400"
                                    }`}
                                >
                                    {filter === option && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                    <span className={filter === option ? "" : "pl-5"}>
                                        {filterLabel(option)}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </AnimatedPopover>
                </div>
            </div>

            <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                <div
                    ref={setNodeRef}
                    className={`column-scroll-area flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3 xl:gap-4 xl:p-4 2xl:p-5 ${
                        isOver ? "bg-gray-50/80 dark:bg-gray-800/40" : ""
                    }`}
                >
                    {displayTasks.length > 0 ? (
                        displayTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                columnId={titleCol}
                                autoFocus={task.id === focusTaskId}
                                isDragDisabled={!canDragInColumn}
                                onUpdate={(updates) => onUpdateTask(task.id, updates)}
                                onAddComment={(content) => onAddComment(task.id, content)}
                                onDelete={() => onDeleteTask(task.id)}
                                onAutoFocusComplete={onFocusComplete}
                            />
                        ))
                    ) : (
                        <div
                            className={`flex min-h-[4rem] flex-1 items-center justify-center rounded-lg border border-dashed border-gray-200 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500 ${
                                isOver ? "border-gray-400 bg-gray-50 dark:border-gray-500 dark:bg-gray-800/60" : ""
                            }`}
                        >
                            {canDragInColumn ? t.addATask : ""}
                        </div>
                    )}
                </div>
            </SortableContext>

            <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800 xl:px-5 xl:py-4">
                <button
                    type="button"
                    onClick={onAddTask}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm font-medium text-slate-600 transition-colors hover:bg-gray-50 hover:text-slate-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 xl:text-base 2xl:text-lg"
                >
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
                    {t.addATask}
                </button>
            </div>
        </div>
    );
}

export default CardCols;
