import { useToastContext } from "../context/ToastContext";

export default function useToast() {
    const { addToast } = useToastContext();

    const show = (type) => (message, duration = 3000, subMessage) =>
        addToast(message, type, duration, subMessage);

    return {
        success: show("success"),
        error: show("error"),
        info: show("info"),
        warning: show("warning"),
    };
}
