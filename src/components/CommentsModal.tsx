import { useEffect, useState, type FormEvent } from "react";
import { useSettings } from "../context/SettingsContext";
import type { Comment } from "../types/task";
import { ANIMATION_MS } from "../constants/animation";
import { formatCommentDate } from "../utils/date";

interface CommentsModalProps {
    isOpen: boolean;
    taskTitle: string;
    comments: Comment[];
    onClose: () => void;
    onAddComment: (content: string) => void;
}

function CommentsModal({ isOpen, taskTitle, comments, onClose, onAddComment }: CommentsModalProps) {
    const { t, locale } = useSettings();
    const [mounted, setMounted] = useState(isOpen);
    const [isClosing, setIsClosing] = useState(false);
    const [content, setContent] = useState("");

    useEffect(() => {
        if (isOpen) {
            setMounted(true);
            setIsClosing(false);
            setContent("");
            return;
        }

        if (!mounted) return;

        setIsClosing(true);
        const timer = window.setTimeout(() => {
            setMounted(false);
            setIsClosing(false);
        }, ANIMATION_MS);

        return () => window.clearTimeout(timer);
    }, [isOpen, mounted]);

    if (!mounted) return null;

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = content.trim();
        if (!trimmed) return;

        onAddComment(trimmed);
        setContent("");
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-50 bg-black/30 ${
                    isClosing ? "animate-overlay-fade-out" : "animate-overlay-fade-in"
                }`}
                onClick={handleClose}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="comments-modal-title"
                className={`fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-full max-w-md flex-col rounded-xl bg-white shadow-xl dark:bg-gray-900 ${
                    isClosing ? "animate-modal-out" : "animate-modal-in"
                }`}
            >
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                    <div>
                        <h2
                            id="comments-modal-title"
                            className="text-base font-semibold text-gray-900 dark:text-gray-100"
                        >
                            {t.commentsTitle}
                        </h2>
                        {taskTitle && (
                            <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                                {taskTitle}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        aria-label={t.closeModal}
                        onClick={handleClose}
                        className="cursor-pointer rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                    {comments.length === 0 ? (
                        <p className="animate-fade-in text-sm text-gray-400 dark:text-gray-500">
                            {t.noCommentsYet}
                        </p>
                    ) : (
                        comments.map((comment, index) => (
                            <div
                                key={comment.id}
                                className="animate-menu-content-in rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <p className="text-sm text-gray-700 dark:text-gray-200">{comment.content}</p>
                                <span className="mt-2 block text-xs text-gray-400 dark:text-gray-500">
                                    {formatCommentDate(comment.createdAt, locale)}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                <form onSubmit={handleSubmit} className="border-t border-gray-100 px-5 py-4 dark:border-gray-800">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t.writeComment}
                        rows={3}
                        className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-gray-500"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                            {t.close}
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
                        >
                            {t.sendComment}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default CommentsModal;
