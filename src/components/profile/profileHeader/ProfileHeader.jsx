// ProfileHeader.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { api } from '../../../api/axios';
import useToast from '../../../hooks/useToast';
import CoverBanner from './CoverBanner';
import AvatarSection from './AvatarSection';
import BioSection from './BioSection';

export default function ProfileHeader({ animeWatchedCount }) {
    const { user, logout, updateUser } = useAuth();
    const { theme } = useTheme();
    const toast = useToast();
    const navigate = useNavigate();
    const isDark = theme === "dark";

    const getImageUrl = (path, fallback) => {
        if (!path) return fallback;
        if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
        return fallback;
    };

    const avatar = getImageUrl(
        user?.profil?.avatar || user?.profile?.avatar || user?.avatar || null,
        null
    );
    const cover = getImageUrl(
        user?.profil?.cover || user?.profile?.cover || user?.cover || null,
        "/images/clean_header_bg_perfect.png"
    );

    const currentBio = user?.profil?.bio || user?.profile?.bio || user?.bio || "";

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    const displayAvatar = avatarPreview || avatar;
    const displayCover = coverPreview || cover;

    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [isSavingBio, setIsSavingBio] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const ANIME_PRESETS = [
        {
            name: "Sung Jin-woo",
            anime: "Solo Leveling",
            url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: "Satoru Gojo",
            anime: "Jujutsu Kaisen",
            url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: "Cyber Samurai",
            anime: "Neo Tokyo",
            url: "https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: "Anime Heroine",
            anime: "Oshi no Ko",
            url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: "Neon Shinobi",
            anime: "Cyberpunk Ninja",
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80"
        },
        {
            name: "Blade Master",
            anime: "Demon Slayer",
            url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80"
        }
    ];

    const [bio, setBio] = useState(currentBio);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [bioInput, setBioInput] = useState(currentBio);
    const bioRef = useRef(null);

    useEffect(() => {
        setBio(currentBio);
        setBioInput(currentBio);
    }, [user, currentBio]);

    useEffect(() => {
        if (isEditingBio && bioRef.current) {
            bioRef.current.focus();
            const len = bioRef.current.value.length;
            bioRef.current.setSelectionRange(len, len);
        }
    }, [isEditingBio]);

    const handleLogout = async () => {
        try {
            navigate("/");
            await logout();
        } catch (error) {
            console.error("Gagal logout:", error);
            toast.error("Terjadi kesalahan saat logout. Silakan coba kembali.");
        }
    };

    const handleBioSave = async () => {
        const trimmed = bioInput.trim();
        setIsSavingBio(true);
        try {
            const response = await api.put('/user/profile', { bio: trimmed });
            const result = response.data;
            if (response.status === 200 && result.success) {
                setBio(trimmed);
                setBioInput(trimmed);
                setIsEditingBio(false);
                if (updateUser) updateUser(result.data);
                toast.success("Deskripsi berhasil disimpan");
            } else {
                toast.error(result.message || "Gagal menyimpan deskripsi");
            }
        } catch (error) {
            toast.error(error.response?.data?.errors || "Terjadi kesalahan koneksi");
        } finally {
            setIsSavingBio(false);
        }
    };

    const handleBioCancel = () => {
        setBioInput(bio);
        setIsEditingBio(false);
    };

    const handleBioKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleBioSave(); }
        if (e.key === "Escape") handleBioCancel();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setAvatarPreview(localPreview);
        setIsUploadingAvatar(true);

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await api.put('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const result = response.data;
            if (response.status === 200 && result.success) {
                if (updateUser) updateUser(result.data);
                toast.success("Foto profil berhasil diperbarui");
            } else {
                toast.error(result.message || "Gagal mengunggah foto profil.");
            }
        } catch (error) {
            toast.error(error.response?.data?.errors || "Kesalahan jaringan saat mengunggah.");
        } finally {
            setIsUploadingAvatar(false);
            setAvatarPreview(null);
            URL.revokeObjectURL(localPreview);
        }
    };

    const handlePresetSelect = async (preset) => {
        setIsUploadingAvatar(true);
        setAvatarPreview(preset.url);
        try {
            const res = await fetch(preset.url);
            const blob = await res.blob();
            const file = new File([blob], `${preset.name.toLowerCase().replace(/\s+/g, '-')}.jpg`, { type: "image/jpeg" });
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.put('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const result = response.data;
            if (response.status === 200 && result.success) {
                if (updateUser) updateUser(result.data);
                toast.success(`Avatar ${preset.name} berhasil diterapkan!`);
                setShowAvatarModal(false);
            } else {
                toast.error(result.message || "Gagal mengubah avatar.");
            }
        } catch (error) {
            toast.error("Gagal menerapkan avatar preset.");
        } finally {
            setIsUploadingAvatar(false);
            setAvatarPreview(null);
        }
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const localPreview = URL.createObjectURL(file);
        setCoverPreview(localPreview);
        setIsUploadingCover(true);

        const formData = new FormData();
        formData.append('cover', file);

        try {
            const response = await api.put('/user/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const result = response.data;
            if (response.status === 200 && result.success) {
                if (updateUser) updateUser(result.data);
                toast.success("Sampul berhasil diperbarui");
            } else {
                toast.error(result.message || "Gagal mengunggah sampul.");
            }
        } catch (error) {
            toast.error(error.response?.data?.errors || "Kesalahan jaringan saat mengunggah.");
        } finally {
            setIsUploadingCover(false);
            setCoverPreview(null);
            URL.revokeObjectURL(localPreview);
        }
    };

    const getInitial = () => {
        if (user?.username) return user.username.charAt(0).toUpperCase();
        if (user?.email) return user.email.charAt(0).toUpperCase();
        return "U";
    };

    // Calculate cinephile rank based on watched count
    const cinephileRank = animeWatchedCount >= 30
        ? { rank: "RANK S", title: "Cinephile Master", color: "from-amber-400 to-rose-500 text-amber-300" }
        : animeWatchedCount >= 15
            ? { rank: "RANK A", title: "Elite Streamer", color: "from-[#ff1e56] to-rose-500 text-[#ff1e56]" }
            : animeWatchedCount >= 5
                ? { rank: "RANK B", title: "Anime Explorer", color: "from-blue-400 to-indigo-500 text-blue-400" }
                : { rank: "RANK C", title: "Novice Watcher", color: "from-slate-400 to-slate-500 text-slate-300" };

    const displayName = user?.username || user?.name || user?.email?.split("@")[0] || "User";

    return (
        <div className={`w-full rounded-3xl overflow-hidden border shadow-2xl relative transition-all duration-500 ${
            isDark
                ? "bg-gradient-to-b from-[#11050a] via-[#080204] to-[#050102] text-white border-white/[0.08]"
                : "bg-white text-neutral-800 border-neutral-200/80 shadow-xl"
        }`}>
            <CoverBanner
                displayCover={displayCover}
                isUploadingCover={isUploadingCover}
                coverInputRef={coverInputRef}
                onCoverChange={handleCoverChange}
            />

            <section className="relative px-3 sm:px-6 md:px-8 pb-6 -mt-12 sm:-mt-16 md:-mt-20 z-10 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-5 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-4 sm:gap-6 md:gap-7 w-full">

                        <AvatarSection
                            displayAvatar={displayAvatar}
                            isUploadingAvatar={isUploadingAvatar}
                            avatarInputRef={avatarInputRef}
                            onAvatarChange={handleAvatarChange}
                            displayName={displayName}
                            getInitial={getInitial}
                            onOpenAvatarModal={() => setShowAvatarModal(true)}
                        />

                        <div className="flex-1 flex flex-col md:flex-row items-center md:items-end justify-between gap-4 md:gap-6 w-full pb-1">
                            <div className="flex flex-col items-center md:items-start gap-2.5 w-full md:w-auto shrink-0">
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5">
                                        <h1 className={`font-display text-2xl min-[360px]:text-3xl sm:text-4xl font-black tracking-tight leading-none transition-colors duration-300 ${
                                            isDark ? "text-white" : "text-neutral-900"
                                        }`}>
                                            {displayName}
                                        </h1>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-[#ff1e56]/15 border border-[#ff1e56]/30 text-[#ff1e56] shadow-[0_0_12px_rgba(255,30,86,0.2)]`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e56] animate-pulse" />
                                                VIP CINEMA
                                            </span>
                                            <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-mono font-bold uppercase border ${
                                                isDark ? 'bg-white/[0.04] border-white/[0.08] text-amber-300' : 'bg-slate-100 border-slate-200 text-amber-600'
                                            }`}>
                                                ★ {cinephileRank.rank}
                                            </span>
                                        </div>
                                    </div>

                                    {user?.email && (
                                        <p className={`text-xs font-mono tracking-tight leading-none transition-colors duration-300 ${
                                            isDark ? "text-slate-400" : "text-neutral-500"
                                        }`}>
                                            {user.email}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                                    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-300 border ${
                                        isDark
                                            ? "bg-white/[0.03] border-white/[0.08]"
                                            : "bg-neutral-50 border-neutral-200"
                                    }`}>
                                        <i className="fa-solid fa-film text-xs text-[#ff1e56]" />
                                        <span className={`font-mono text-xs font-black ${isDark ? "text-white" : "text-neutral-800"}`}>
                                            {animeWatchedCount}
                                        </span>
                                        <span className={`text-[9px] tracking-wider font-bold uppercase font-mono ${isDark ? "text-slate-400" : "text-neutral-500"}`}>
                                            Anime Selesai
                                        </span>
                                    </div>

                                    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-300 border ${
                                        isDark
                                            ? "bg-white/[0.03] border-white/[0.08]"
                                            : "bg-neutral-50 border-neutral-200"
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className={`text-[9px] tracking-wider font-bold uppercase font-mono ${isDark ? "text-slate-400" : "text-neutral-500"}`}>
                                            Simulcast Ultra HD
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={`hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/10 to-transparent my-1 mx-2`} />

                            <div className="w-full md:flex-1 md:max-w-sm lg:max-w-md flex flex-col justify-end">
                                <BioSection
                                    bio={bio}
                                    bioInput={bioInput}
                                    setBioInput={setBioInput}
                                    isEditingBio={isEditingBio}
                                    setIsEditingBio={setIsEditingBio}
                                    isSavingBio={isSavingBio}
                                    bioRef={bioRef}
                                    onBioSave={handleBioSave}
                                    onBioCancel={handleBioCancel}
                                    onBioKeyDown={handleBioKeyDown}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-2 lg:mt-0 shrink-0 w-fit md:w-auto self-center lg:self-end">
                        <button onClick={handleLogout}
                            className={`inline-flex items-center justify-center gap-2 border border-rose-500/30 hover:border-rose-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                                isDark
                                    ? "bg-rose-500/10 hover:bg-[#ff1e56] text-rose-300 hover:shadow-[0_0_20px_rgba(255,30,86,0.4)]"
                                    : "bg-rose-50 hover:bg-[#ff1e56] text-rose-700 shadow-sm"
                            }`}>
                            <i className="fa-solid fa-arrow-right-from-bracket text-xs group-hover:translate-x-0.5 transition-transform" />
                            <span>LOGOUT</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ── AVATAR STUDIO MODAL ── */}
            {showAvatarModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-lg rounded-3xl border border-white/[0.12] bg-[#0c0407] p-5 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden space-y-4">
                        {/* Ambient ruby glow */}
                        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#ff1e56]/20 blur-[80px] pointer-events-none" />

                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] relative z-10">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-5 rounded-full bg-[#ff1e56]" />
                                <h3 className="font-display font-black text-base sm:text-lg text-white uppercase tracking-tight">
                                    Kustomisasi Foto Profil
                                </h3>
                            </div>
                            <button
                                onClick={() => !isUploadingAvatar && setShowAvatarModal(false)}
                                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
                            >
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        {/* Option A: Upload Custom File */}
                        <div className="relative z-10">
                            <button
                                onClick={() => {
                                    setShowAvatarModal(false);
                                    if (avatarInputRef?.current) avatarInputRef.current.click();
                                }}
                                className="w-full p-4 rounded-2xl border border-dashed border-[#ff1e56]/50 hover:border-[#ff1e56] bg-[#ff1e56]/10 hover:bg-[#ff1e56]/15 flex items-center justify-center gap-3 text-white transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#ff1e56] text-white flex items-center justify-center text-base shadow-[0_0_20px_rgba(255,30,86,0.6)] group-hover:scale-105 transition-transform">
                                    <i className="fa-solid fa-cloud-arrow-up" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-xs sm:text-sm text-white">Unggah Foto dari Laptop / HP</p>
                                    <p className="text-[10px] font-mono text-slate-400">Pilih gambar anime atau foto apa pun (Maks 5MB)</p>
                                </div>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 relative z-10 my-2">
                            <div className="flex-1 h-px bg-white/[0.08]" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                                Atau Pilih Karakter Anime Populer
                            </span>
                            <div className="flex-1 h-px bg-white/[0.08]" />
                        </div>

                        {/* Option B: 6 Presets */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 relative z-10">
                            {ANIME_PRESETS.map((preset, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePresetSelect(preset)}
                                    disabled={isUploadingAvatar}
                                    className="group/preset p-2 rounded-2xl border border-white/[0.08] hover:border-[#ff1e56] bg-white/[0.02] hover:bg-[#ff1e56]/10 transition-all flex flex-col items-center gap-2 text-center cursor-pointer disabled:opacity-50"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden relative shadow-md border border-white/10 group-hover/preset:scale-105 transition-transform">
                                        <img
                                            src={preset.url}
                                            alt={preset.name}
                                            className="w-full h-full object-cover"
                                            crossOrigin="anonymous"
                                        />
                                        <div className="absolute inset-0 bg-[#ff1e56]/20 opacity-0 group-hover/preset:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="w-full truncate">
                                        <p className="font-bold text-xs text-white truncate group-hover/preset:text-[#ff1e56]">
                                            {preset.name}
                                        </p>
                                        <p className="text-[8.5px] font-mono text-slate-400 truncate">
                                            {preset.anime}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {isUploadingAvatar && (
                            <div className="p-2.5 rounded-xl bg-[#ff1e56]/15 border border-[#ff1e56]/30 flex items-center justify-center gap-2 text-xs font-mono text-[#ff1e56] font-bold">
                                <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                                <span>Sedang memproses dan menyimpan avatar...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}