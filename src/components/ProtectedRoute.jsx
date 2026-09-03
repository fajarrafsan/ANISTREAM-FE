import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, loadingFallback = null }) {
    const { isLoggedIn, isLoading } = useAuth();

    // Tunggu dulu sampai auth selesai load dari localStorage
    if (isLoading) return loadingFallback;

    // Kalau belum login → redirect ke 403
    if (!isLoggedIn) return <Navigate to="/403" replace />;

    return children;
}
