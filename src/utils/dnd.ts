import { arrayMove } from "@dnd-kit/sortable";
import { COLUMNS, type ColumnId, type Task, type TasksByColumn } from "../types/task";

export const COLUMN_DROPPABLE_PREFIX = "column:";

export function columnDroppableId(columnId: ColumnId): string {
    return `${COLUMN_DROPPABLE_PREFIX}${columnId}`;
}

export function parseColumnDroppableId(id: string): ColumnId | null {
    if (!id.startsWith(COLUMN_DROPPABLE_PREFIX)) return null;
    const columnId = id.slice(COLUMN_DROPPABLE_PREFIX.length) as ColumnId;
    return COLUMNS.includes(columnId) ? columnId : null;
}

export function findColumnForTask(
    tasksByColumn: TasksByColumn,
    taskId: number
): ColumnId | null {
    for (const columnId of COLUMNS) {
        if (tasksByColumn[columnId].some((task) => task.id === taskId)) {
            return columnId;
        }
    }
    return null;
}

export function resolveDropTarget(
    tasksByColumn: TasksByColumn,
    overId: string | number
): { columnId: ColumnId; index: number } | null {
    const overIdStr = String(overId);
    const columnFromDroppable = parseColumnDroppableId(overIdStr);

    if (columnFromDroppable) {
        return { columnId: columnFromDroppable, index: tasksByColumn[columnFromDroppable].length };
    }

    const overTaskId = Number(overId);
    if (Number.isNaN(overTaskId)) return null;

    const columnId = findColumnForTask(tasksByColumn, overTaskId);
    if (!columnId) return null;

    const index = tasksByColumn[columnId].findIndex((task) => task.id === overTaskId);
    if (index === -1) return null;

    return { columnId, index };
}

export function moveTaskInBoard(
    tasksByColumn: TasksByColumn,
    activeTaskId: number,
    overId: string | number
): TasksByColumn | null {
    const fromColumn = findColumnForTask(tasksByColumn, activeTaskId);
    const dropTarget = resolveDropTarget(tasksByColumn, overId);

    if (!fromColumn || !dropTarget) return null;

    const { columnId: toColumn, index: toIndex } = dropTarget;
    const fromIndex = tasksByColumn[fromColumn].findIndex((task) => task.id === activeTaskId);

    if (fromIndex === -1) return null;
    if (fromColumn === toColumn && fromIndex === toIndex) return null;

    if (fromColumn === toColumn) {
        return {
            ...tasksByColumn,
            [fromColumn]: arrayMove(tasksByColumn[fromColumn], fromIndex, toIndex),
        };
    }

    const task = tasksByColumn[fromColumn][fromIndex];
    const nextFromTasks = tasksByColumn[fromColumn].filter((item) => item.id !== activeTaskId);
    const nextToTasks = [...tasksByColumn[toColumn]];
    nextToTasks.splice(toIndex, 0, task);

    return {
        ...tasksByColumn,
        [fromColumn]: nextFromTasks,
        [toColumn]: nextToTasks,
    };
}

export function findTaskById(tasksByColumn: TasksByColumn, taskId: number): Task | null {
    const columnId = findColumnForTask(tasksByColumn, taskId);
    if (!columnId) return null;
    return tasksByColumn[columnId].find((task) => task.id === taskId) ?? null;
}
