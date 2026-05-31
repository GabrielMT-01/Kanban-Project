import Header from "./components/Header";
import CardCols from "./components/CardCols";
import TaskCard from "./components/TaskCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSettings } from "./context/SettingsContext";
import { safeAutoScroll } from "./constants/dnd";
import {
    COLUMNS,
    createEmptyTask,
    filterTasksByTitle,
    type ColumnId,
    type Comment,
    type Task,
    type TaskEditableFields,
    type TasksByColumn,
} from "./types/task";
import { findTaskById, moveTaskInBoard } from "./utils/dnd";
import { loadTasksByColumn, saveTasksByColumn } from "./utils/storage";

function App() {
    const { t } = useSettings();
    const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>(() => loadTasksByColumn());
    const [focusTaskId, setFocusTaskId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const isDragEnabled = searchQuery.trim().length === 0;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAddTask = useCallback((columnId: ColumnId) => {
        const newTask = createEmptyTask();

        setTasksByColumn((prev) => ({
            ...prev,
            [columnId]: [...prev[columnId], newTask],
        }));
        setFocusTaskId(newTask.id);
    }, []);

    const handleUpdateTask = (
        columnId: ColumnId,
        taskId: number,
        updates: Partial<TaskEditableFields>
    ) => {
        setTasksByColumn((prev) => ({
            ...prev,
            [columnId]: prev[columnId].map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
            ),
        }));
    };

    const handleAddComment = (columnId: ColumnId, taskId: number, content: string) => {
        const newComment: Comment = {
            id: Date.now(),
            content,
            createdAt: Date.now(),
        };

        setTasksByColumn((prev) => ({
            ...prev,
            [columnId]: prev[columnId].map((task) =>
                task.id === taskId
                    ? { ...task, comments: [...task.comments, newComment] }
                    : task
            ),
        }));
    };

    const handleDeleteTask = (columnId: ColumnId, taskId: number) => {
        setTasksByColumn((prev) => ({
            ...prev,
            [columnId]: prev[columnId].filter((task) => task.id !== taskId),
        }));
        setFocusTaskId((current) => (current === taskId ? null : current));
    };

    const handleFocusComplete = useCallback(() => {
        setFocusTaskId(null);
    }, []);

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            if (!isDragEnabled) return;

            const task = findTaskById(tasksByColumn, Number(event.active.id));
            setActiveTask(task);
            document.body.classList.add("is-dragging");
        },
        [isDragEnabled, tasksByColumn]
    );

    const handleDragOver = useCallback((event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setTasksByColumn((prev) => {
            const next = moveTaskInBoard(prev, Number(active.id), over.id);
            return next ?? prev;
        });
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        document.body.classList.remove("is-dragging");
        setActiveTask(null);

        if (!over || active.id === over.id) return;

        setTasksByColumn((prev) => {
            const next = moveTaskInBoard(prev, Number(active.id), over.id);
            return next ?? prev;
        });
    }, []);

    const handleDragCancel = useCallback(() => {
        document.body.classList.remove("is-dragging");
        setActiveTask(null);
    }, []);

    const visibleColumns = useMemo(() => {
        const query = searchQuery.trim();
        if (!query) return COLUMNS;

        return COLUMNS.filter(
            (columnId) => filterTasksByTitle(tasksByColumn[columnId], query).length > 0
        );
    }, [searchQuery, tasksByColumn]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            saveTasksByColumn(tasksByColumn);
        }, 400);

        return () => window.clearTimeout(timer);
    }, [tasksByColumn]);

    useEffect(() => {
        return () => document.body.classList.remove("is-dragging");
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddTask={handleAddTask}
            />
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                autoScroll={safeAutoScroll}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div className="grid w-full grid-cols-1 place-items-center gap-4 px-4 py-6 lg:grid-cols-2 lg:place-items-stretch lg:gap-4 xl:grid-cols-4 xl:gap-5 xl:px-8 2xl:gap-6 2xl:px-10">
                    {visibleColumns.length > 0 ? (
                        visibleColumns.map((columnId) => (
                            <CardCols
                                key={columnId}
                                titleCol={columnId}
                                tasks={tasksByColumn[columnId]}
                                searchQuery={searchQuery}
                                focusTaskId={focusTaskId}
                                isDragEnabled={isDragEnabled}
                                onAddTask={() => handleAddTask(columnId)}
                                onUpdateTask={(taskId, updates) =>
                                    handleUpdateTask(columnId, taskId, updates)
                                }
                                onAddComment={(taskId, content) =>
                                    handleAddComment(columnId, taskId, content)
                                }
                                onDeleteTask={(taskId) => handleDeleteTask(columnId, taskId)}
                                onFocusComplete={handleFocusComplete}
                            />
                        ))
                    ) : (
                        <p className="animate-fade-in py-12 text-sm text-gray-400 dark:text-gray-500">
                            {t.noTasksFound.replace("{query}", searchQuery.trim())}
                        </p>
                    )}
                </div>

                <DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(0.32, 0.72, 0, 1)" }}>
                    {activeTask ? (
                        <TaskCard
                            task={activeTask}
                            columnId={
                                COLUMNS.find((columnId) =>
                                    tasksByColumn[columnId].some((task) => task.id === activeTask.id)
                                ) ?? "To Do"
                            }
                            autoFocus={false}
                            isDragDisabled
                            isOverlay
                            onUpdate={() => {}}
                            onAddComment={() => {}}
                            onDelete={() => {}}
                            onAutoFocusComplete={() => {}}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export default App;
