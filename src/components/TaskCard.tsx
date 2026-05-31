import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSettings } from "../context/SettingsContext";
import type { ColumnId, Priority, Task, TaskEditableFields } from "../types/task";
import { PRIORITY_OPTIONS, priorityTextStyles } from "../types/task";
import { ANIMATION_MS } from "../constants/animation";
import { formatTaskDate } from "../utils/date";
import AnimatedPopover from "./AnimatedPopover";
import CommentsModal from "./CommentsModal";

interface TaskCardProps {
    task: Task;
    columnId: ColumnId;
    autoFocus: boolean;
    isDragDisabled?: boolean;
    isOverlay?: boolean;
    onUpdate: (updates: Partial<TaskEditableFields>) => void;
    onAddComment: (content: string) => void;
    onDelete: () => void;
    onAutoFocusComplete: () => void;
}

function DragHandleIcon({ className = "h-4 w-4 sm:h-5 sm:w-5 xl:h-6 xl:w-6" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
        </svg>
    );
}

function TaskCard({
    task,
    columnId,
    autoFocus,
    isDragDisabled = false,
    isOverlay = false,
    onUpdate,
    onAddComment,
    onDelete,
    onAutoFocusComplete,
}: TaskCardProps) {
    const { t, locale, priorityLabel } = useSettings();
    const titleRef = useRef<HTMLInputElement>(null);
    const priorityRef = useRef<HTMLDivElement>(null);
    const [techInput, setTechInput] = useState("");
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [isPriorityOpen, setIsPriorityOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const formattedDate = formatTaskDate(task.createdAt, locale);

    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        disabled: isDragDisabled || isOverlay,
        data: { columnId, task },
    });

    const style = isOverlay
        ? undefined
        : {
              transform: CSS.Transform.toString(transform),
              transition,
          };

    useEffect(() => {
        if (autoFocus) {
            titleRef.current?.focus();
            onAutoFocusComplete();
        }
    }, [autoFocus, onAutoFocusComplete]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
                setIsPriorityOpen(false);
            }
        };

        if (isPriorityOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isPriorityOpen]);

    const handlePrioritySelect = (priority: Priority) => {
        onUpdate({ priority });
        setIsPriorityOpen(false);
    };

    const addTechnology = () => {
        const trimmed = techInput.trim();
        if (!trimmed || task.technologies.includes(trimmed)) {
            setTechInput("");
            return;
        }

        onUpdate({ technologies: [...task.technologies, trimmed] });
        setTechInput("");
    };

    const removeTechnology = (technology: string) => {
        onUpdate({ technologies: task.technologies.filter((item) => item !== technology) });
    };

    const handleTechKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTechnology();
        }
    };

    const handleDelete = () => {
        setIsDeleting(true);
        window.setTimeout(() => onDelete(), ANIMATION_MS);
    };

    return (
        <>
            <article
                ref={isOverlay ? undefined : setNodeRef}
                style={style}
                className={`flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 xl:gap-4 xl:p-5 2xl:p-6 ${
                    isOverlay
                        ? "cursor-grabbing shadow-xl ring-2 ring-gray-900/10 dark:ring-gray-100/10"
                        : isDragging
                          ? "opacity-40"
                          : isDeleting
                            ? "animate-task-exit"
                            : "animate-task-enter"
                }`}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {!isDragDisabled && !isOverlay && (
                            <button
                                ref={setActivatorNodeRef}
                                type="button"
                                aria-label={t.dragTask}
                                className="cursor-grab touch-none rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:cursor-grabbing sm:p-2 xl:p-2.5 2xl:p-3 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                                {...listeners}
                                {...attributes}
                            >
                                <DragHandleIcon />
                            </button>
                        )}

                        <div ref={priorityRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsPriorityOpen((open) => !open)}
                                aria-label={t.taskPriority}
                                aria-expanded={isPriorityOpen}
                                className={`cursor-pointer rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-semibold outline-none transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 xl:px-2.5 xl:py-1 xl:text-sm 2xl:text-base ${priorityTextStyles[task.priority]}`}
                            >
                                {priorityLabel(task.priority)}
                            </button>

                            <AnimatedPopover
                                open={isPriorityOpen}
                                className="absolute left-0 top-full z-10 mt-1 min-w-full origin-top-left"
                            >
                                <div className="overflow-hidden rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
                                    {PRIORITY_OPTIONS.map((priority) => (
                                        <button
                                            key={priority}
                                            type="button"
                                            onClick={() => handlePrioritySelect(priority)}
                                            className={`block w-full cursor-pointer bg-white px-3 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 ${priorityTextStyles[priority]}`}
                                        >
                                            {priorityLabel(priority)}
                                        </button>
                                    ))}
                                </div>
                            </AnimatedPopover>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span title={t.createdOn.replace("{date}", formattedDate)}>{formattedDate}</span>
                    </div>
                </div>

                <input
                    ref={titleRef}
                    type="text"
                    value={task.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder={t.taskTitle}
                    className="w-full border-none bg-transparent text-base font-semibold text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500 xl:text-lg 2xl:text-xl"
                />

                <textarea
                    value={task.description}
                    onChange={(e) => onUpdate({ description: e.target.value })}
                    placeholder={t.taskDescription}
                    rows={2}
                    className="w-full resize-none border-none bg-transparent text-sm text-gray-500 outline-none placeholder:text-gray-400 dark:text-gray-400 dark:placeholder:text-gray-500 xl:text-base 2xl:text-lg"
                />

                <div className="flex flex-wrap gap-2">
                    {task.technologies.map((technology) => (
                        <span
                            key={technology}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200 xl:px-3 xl:py-1 xl:text-sm"
                        >
                            {technology}
                            <button
                                type="button"
                                onClick={() => removeTechnology(technology)}
                                aria-label={t.removeTechnology.replace("{name}", technology)}
                                className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleTechKeyDown}
                    onBlur={addTechnology}
                    placeholder={t.addTechnology}
                    className="w-full rounded-md border border-dashed border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none transition-colors focus:border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:focus:border-gray-500 xl:px-3 xl:py-1.5 xl:text-sm"
                />

                {!isOverlay && (
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-gray-400 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            aria-label={t.deleteTask}
                            className="cursor-pointer rounded-md p-1 transition-colors hover:text-red-500 dark:hover:text-red-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsCommentsOpen(true)}
                            className="flex cursor-pointer items-center gap-1 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label={`${t.comments} (${task.comments.length})`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span className="text-xs">{task.comments.length}</span>
                        </button>
                    </div>
                )}
            </article>

            {!isOverlay && (
                <CommentsModal
                    isOpen={isCommentsOpen}
                    taskTitle={task.title || t.taskTitleFallback}
                    comments={task.comments}
                    onClose={() => setIsCommentsOpen(false)}
                    onAddComment={onAddComment}
                />
            )}
        </>
    );
}

export default TaskCard;
