import {
    COLUMNS,
    emptyTasksByColumn,
    type Comment,
    type Priority,
    type Task,
    type TasksByColumn,
} from "../types/task";

const STORAGE_KEY = "kanban.tasks.v1";

function isPriority(value: unknown): value is Priority {
    return value === "Easy" || value === "Medium" || value === "Hard";
}

function isComment(value: unknown): value is Comment {
    if (typeof value !== "object" || value === null) return false;

    const comment = value as Record<string, unknown>;
    return (
        typeof comment.id === "number" &&
        typeof comment.content === "string" &&
        typeof comment.createdAt === "number"
    );
}

function isTask(value: unknown): value is Task {
    if (typeof value !== "object" || value === null) return false;

    const task = value as Record<string, unknown>;
    return (
        typeof task.id === "number" &&
        typeof task.title === "string" &&
        typeof task.description === "string" &&
        isPriority(task.priority) &&
        Array.isArray(task.technologies) &&
        task.technologies.every((item) => typeof item === "string") &&
        Array.isArray(task.comments) &&
        task.comments.every(isComment) &&
        typeof task.createdAt === "number"
    );
}

function isTasksByColumn(value: unknown): value is TasksByColumn {
    if (typeof value !== "object" || value === null) return false;

    const data = value as Record<string, unknown>;
    return COLUMNS.every(
        (columnId) =>
            columnId in data &&
            Array.isArray(data[columnId]) &&
            (data[columnId] as unknown[]).every(isTask)
    );
}

export function loadTasksByColumn(): TasksByColumn {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyTasksByColumn();

        const parsed: unknown = JSON.parse(raw);
        if (isTasksByColumn(parsed)) return parsed;
    } catch {
        // corrupted or unavailable storage
    }

    return emptyTasksByColumn();
}

export function saveTasksByColumn(data: TasksByColumn): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // quota exceeded or private browsing
    }
}
