import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Toast from "./Toast";

export default function ToastContainer({ toasts, onRemove }) {
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia("(min-width: 640px)").matches : false
    );

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 640px)");
        const handler = (e) => setIsDesktop(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed z-[99999] flex flex-col gap-2.5 sm:gap-3 pointer-events-none
                bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 right-3
                sm:bottom-6 sm:left-auto sm:right-6 sm:w-auto
                items-stretch sm:items-end"
            aria-label="Notifikasi"
        >
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        layout
                        className="pointer-events-auto w-full sm:w-auto max-w-[calc(100vw-24px)] sm:max-w-none"
                    >
                        <Toast toast={toast} onRemove={onRemove} isDesktop={isDesktop} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
