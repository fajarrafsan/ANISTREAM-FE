import { useState, useEffect } from "react";
import { useLocation, useMatch, Route, Routes } from "react-router-dom";

import Header from "./layout/headers/Header";
import Footer from "./layout/footer/Footer";

import HomePage from "./pages/home/HomePage";
import UnauthorizedPage from "./pages/unauthorized/Unauthorizedpage";
import AniStreamProfilePage from "./pages/AnimeStreamProfilePage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthModal from "./components/Auth/AuthModal";

import { ToastProvider } from "./context/ToastContext";
import AuthProvider from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { WishlistProvider } from "./context/WishlistContext";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import MovieCatalogPage from "./pages/MovieKatalogPage";
import WeeklySchedulePage from "./pages/WeeklySchedulePage";

export default function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <AuthModalProvider>
                    <WishlistProvider>
                        <AppContent />
                    </WishlistProvider>
                </AuthModalProvider>
            </AuthProvider>
        </ToastProvider>
    );
}

function AppContent() {
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("beranda");

    // Efek untuk menyelaraskan activeTab secara otomatis saat URL berubah
    useEffect(() => {
        const currentPath = location.pathname.split("/")[1] || "beranda";
        setActiveTab(currentPath);
    }, [location.pathname]);

    const isUnauthorized =
        location.pathname === "/unauthorized" ||
        location.pathname === "/403";

    const isProfile = location.pathname === "/profile";

    const isDetails = useMatch("/anime/detail/:slug");
    const isWatchPage = useMatch("/episode/:episodeId");

    // Halaman yang tidak memakai Header/Footer
    const hideLayout =
        isUnauthorized ||
        isDetails ||
        isWatchPage;

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden transition-colors duration-300">

            {/* HEADER */}
            {!hideLayout && (
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            )}

            {/* MAIN */}
            <main
                className={
                    hideLayout
                        ? ""
                        : "pt-[60px] md:pt-[68px]"
                }
            >
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage />}
                    />

                    <Route
                        path="/unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    <Route
                        path="/403"
                        element={<UnauthorizedPage />}
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <AniStreamProfilePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/catalog"
                        element={
                            <ProtectedRoute>
                                <MovieCatalogPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/schedule"
                        element={
                            <ProtectedRoute>
                                <WeeklySchedulePage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/anime/detail/:slug"
                        element={
                            <ProtectedRoute>
                                <AnimeDetailsPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/episode/:episodeId"
                        element={
                            <ProtectedRoute>
                                <VideoPlayerPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </main>

            {/* FOOTER */}
            {!hideLayout && !isProfile && (
                <Footer />
            )}

            {/* AUTH MODAL */}
            {!hideLayout && (
                <AuthModal />
            )}
        </div>
    );
}