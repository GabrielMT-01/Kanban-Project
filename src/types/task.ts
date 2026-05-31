export type ColumnId = "To Do" | "In Progress" | "Review" | "Done";

export type Priority = "Easy" | "Medium" | "Hard";

export interface Comment {
    id: number;
    content: string;
    createdAt: number;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    technologies: string[];
    comments: Comment[];
    createdAt: number;
}

export type TasksByColumn = Record<ColumnId, Task[]>;

export type TaskEditableFields = Pick<Task, "title" | "description" | "priority" | "technologies">;

export const COLUMNS: ColumnId[] = ["To Do", "In Progress", "Review", "Done"];

export const PRIORITY_OPTIONS: Priority[] = ["Easy", "Medium", "Hard"];

export const priorityTextStyles: Record<Priority, string> = {
    Easy: "text-green-700 dark:text-green-400",
    Medium: "text-yellow-700 dark:text-yellow-400",
    Hard: "text-red-700 dark:text-red-400",
};

export const priorityStyles: Record<Priority, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
};

export type ColumnFilter = "Normal" | "Easiest" | "Hardest" | "Newest" | "Oldest";

export const COLUMN_FILTER_OPTIONS: ColumnFilter[] = [
    "Normal",
    "Easiest",
    "Hardest",
    "Newest",
    "Oldest",
];

const priorityOrder: Record<Priority, number> = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
};

export function filterTasksByTitle(tasks: Task[], searchQuery: string): Task[] {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return tasks;

    return tasks.filter((task) => task.title.toLowerCase().includes(query));
}

export function sortTasksByFilter(tasks: Task[], filter: ColumnFilter): Task[] {
    if (filter === "Normal") return tasks;

    if (filter === "Newest") {
        return [...tasks].sort((a, b) => b.createdAt - a.createdAt);
    }

    if (filter === "Oldest") {
        return [...tasks].sort((a, b) => a.createdAt - b.createdAt);
    }

    const sorted = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return filter === "Hardest" ? sorted.reverse() : sorted;
}

export const emptyTasksByColumn = (): TasksByColumn => ({
    "To Do": [],
    "In Progress": [],
    Review: [],
    Done: [],
});

export const createEmptyTask = (): Task => ({
    id: Date.now(),
    title: "",
    description: "",
    priority: "Medium",
    technologies: [],
    comments: [],
    createdAt: Date.now(),
});
