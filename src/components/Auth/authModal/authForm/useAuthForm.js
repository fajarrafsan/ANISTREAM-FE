import { useEffect, useRef, useState } from "react";
import { validate } from "../../../../validations/validate";
import useRegister from "../../../../hooks/useRegister";
import useLogin from "../../../../hooks/useLogin";
import useToast from "../../../../hooks/useToast";
import { useAuth } from "../../../../context/AuthContext";

export default function useAuthForm(activeTab, onSuccess, onChange) {
    const { register, loading: registerLoading, error: registerError } = useRegister();
    const { login, loading: loginLoading, error: loginError } = useLogin();
    const { login: contextLogin } = useAuth();
    const toast = useToast();

    const [errors, setErrors] = useState({});
    const [fields, setFields] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [submitError, setSubmitError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const hasMountedRef = useRef(false);

    const loading = registerLoading || loginLoading;
    const currentError = submitError || (activeTab === "register" ? registerError : loginError);

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            return undefined;
        }

        setIsTransitioning(true);
        const timer = setTimeout(() => {

            setFields({ username: "", email: "", password: "", confirmPassword: "" });
            setSubmitError("");
            setIsErrorVisible(false);
            setErrors({});
            setShowPassword(false);
            setShowConfirm(false);
            setIsTransitioning(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const setField = (key) => (e) => {
        setFields((prev) => ({ ...prev, [key]: e.target.value }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
        setSubmitError("");
        setIsErrorVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError("");
        setIsErrorVisible(false);

        const errs = validate(activeTab, fields);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            if (activeTab === "register") {
                const result = await register({
                    username: fields.username,
                    email: fields.email,
                    password: fields.password
                });
                const data = result?.data ?? result;

                setFields({ username: "", email: "", password: "", confirmPassword: "" });
                toast.success(`Selamat! Akun ${data.email} berhasil dibuat.`, 3000);

                setTimeout(() => {
                    onChange("login");
                    toast.info("Silakan masuk dengan akun Anda", 2000);
                }, 1000);

            } else {
                const result = await login({
                    email: fields.email,
                    password: fields.password
                });

                contextLogin(result?.data);

                setFields({ username: "", email: "", password: "", confirmPassword: "" });
                toast.success(`Selamat datang kembali! 👋`, 3000);

                setTimeout(() => {
                    onSuccess?.(result?.data);
                }, 500);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.errors || error.message || "Terjadi kesalahan";
            setSubmitError(errorMsg);
            setIsErrorVisible(true);
            toast.error(errorMsg, 3000);
        }
    };

    return {
        fields,
        errors,
        loading,
        currentError,
        isErrorVisible,
        isTransitioning,
        showPassword,
        showConfirm,
        setField,
        setShowPassword,
        setShowConfirm,
        setIsErrorVisible,
        handleSubmit,
    };
}
