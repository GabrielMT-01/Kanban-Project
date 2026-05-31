import type { ColumnFilter, ColumnId, Priority } from "../types/task";

export type Locale = "en" | "pt";
export type Theme = "light" | "dark";

export interface Translations {
    appTitle: string;
    appSubtitle: string;
    searchPlaceholder: string;
    settings: string;
    addTask: string;
    selectColumn: string;
    cancel: string;
    openMenu: string;
    closeMenu: string;
    sortColumn: string;
    sortBy: string;
    addATask: string;
    taskTitle: string;
    taskTitleFallback: string;
    taskDescription: string;
    addTechnology: string;
    removeTechnology: string;
    taskPriority: string;
    deleteTask: string;
    comments: string;
    createdOn: string;
    noTasksFound: string;
    commentsTitle: string;
    noCommentsYet: string;
    writeComment: string;
    close: string;
    sendComment: string;
    closeModal: string;
    dragTask: string;
    theme: string;
    lightMode: string;
    darkMode: string;
    language: string;
    english: string;
    portuguese: string;
    columns: Record<ColumnId, string>;
    priorities: Record<Priority, string>;
    filters: Record<ColumnFilter, string>;
}

export const translations: Record<Locale, Translations> = {
    en: {
        appTitle: "Project Board",
        appSubtitle: "Manage your tasks and workflow",
        searchPlaceholder: "Search tasks...",
        settings: "Settings",
        addTask: "Add Task",
        selectColumn: "Select a column",
        cancel: "Cancel",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        sortColumn: "Sort column",
        sortBy: "Sort by",
        addATask: "Add a task",
        taskTitle: "Task title",
        taskTitleFallback: "Task title",
        taskDescription: "Task description",
        addTechnology: "Add technology (Enter)",
        removeTechnology: "Remove {name}",
        taskPriority: "Task priority",
        deleteTask: "Delete task",
        comments: "Comments",
        createdOn: "Created on {date}",
        noTasksFound: 'No tasks found for "{query}"',
        commentsTitle: "Comments",
        noCommentsYet: "No comments yet.",
        writeComment: "Write a comment...",
        close: "Close",
        sendComment: "Send comment",
        closeModal: "Close modal",
        dragTask: "Drag task",
        theme: "Theme",
        lightMode: "Light",
        darkMode: "Dark",
        language: "Language",
        english: "English",
        portuguese: "Portuguese",
        columns: {
            "To Do": "To Do",
            "In Progress": "In Progress",
            Review: "Review",
            Done: "Done",
        },
        priorities: {
            Easy: "Easy",
            Medium: "Medium",
            Hard: "Hard",
        },
        filters: {
            Normal: "Normal",
            Easiest: "Easiest",
            Hardest: "Hardest",
            Newest: "Newest",
            Oldest: "Oldest",
        },
    },
    pt: {
        appTitle: "Quadro de Projetos",
        appSubtitle: "Gerencie suas tarefas e fluxo de trabalho",
        searchPlaceholder: "Buscar tarefas...",
        settings: "Configurações",
        addTask: "Adicionar Tarefa",
        selectColumn: "Selecione uma coluna",
        cancel: "Cancelar",
        openMenu: "Abrir menu",
        closeMenu: "Fechar menu",
        sortColumn: "Ordenar coluna",
        sortBy: "Ordenar por",
        addATask: "Adicionar tarefa",
        taskTitle: "Título da tarefa",
        taskTitleFallback: "Título da tarefa",
        taskDescription: "Descrição da tarefa",
        addTechnology: "Adicionar tecnologia (Enter)",
        removeTechnology: "Remover {name}",
        taskPriority: "Prioridade da tarefa",
        deleteTask: "Excluir tarefa",
        comments: "Comentários",
        createdOn: "Criado em {date}",
        noTasksFound: 'Nenhuma tarefa encontrada para "{query}"',
        commentsTitle: "Comentários",
        noCommentsYet: "Nenhum comentário ainda.",
        writeComment: "Escreva um comentário...",
        close: "Fechar",
        sendComment: "Enviar comentário",
        closeModal: "Fechar modal",
        dragTask: "Arrastar tarefa",
        theme: "Tema",
        lightMode: "Claro",
        darkMode: "Escuro",
        language: "Idioma",
        english: "Inglês",
        portuguese: "Português",
        columns: {
            "To Do": "A Fazer",
            "In Progress": "Em Progresso",
            Review: "Revisão",
            Done: "Concluído",
        },
        priorities: {
            Easy: "Fácil",
            Medium: "Médio",
            Hard: "Difícil",
        },
        filters: {
            Normal: "Normal",
            Easiest: "Mais fácil",
            Hardest: "Mais difícil",
            Newest: "Mais recente",
            Oldest: "Mais antigo",
        },
    },
};
