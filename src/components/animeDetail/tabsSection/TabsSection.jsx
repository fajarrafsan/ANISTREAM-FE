import { useTheme } from "../../../context/ThemeContext";
import TabButton from "./TabButton";
import CharactersTab from "./CharactersTab";
import RelationsTab from "./RelationsTab";
import CommentsTab from "../comments/CommentsTab";

const tabs = [
    {
        id: "characters",
        shortLabel: "Karakter",
        fullLabel: "Characters & Seiyuu",
        icon: "fa-users"
    },
    {
        id: "relations",
        shortLabel: "Relasi",
        fullLabel: "Karya Terkait",
        icon: "fa-diagram-project"
    },
    {
        id: "comments",
        shortLabel: "Komentar",
        fullLabel: "Diskusi & Ulasan",
        icon: "fa-comments"
    },
];

export default function TabsSection({ anime, activeTab, onTabChange, commentsApi }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className="space-y-4 pt-4">
            <div
                className={`rounded-2xl grid grid-cols-3 sm:flex sm:items-center sm:justify-start gap-1 sm:gap-1.5 p-1 sm:p-1.5 w-full sm:w-fit border select-none backdrop-blur-xl transition-all ${isDark
                    ? "bg-[#0b0406]/90 border-white/5 shadow-xl"
                    : "bg-white/90 border-slate-200 shadow-sm"
                    }`}
            >
                {tabs.map((tab) => {
                    const active = activeTab === tab.id;
                    const isComments = tab.id === "comments";

                    return (
                        <TabButton
                            key={tab.id}
                            active={active}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <span className="flex items-center justify-center gap-1 sm:gap-1.5">
                                <i className={`fa-solid ${tab.icon} text-[9px] sm:text-[11px] ${active ? "text-white" : isDark ? "text-slate-400" : "text-slate-500"}`} />
                                <span className="inline sm:hidden">{tab.shortLabel}</span>
                                <span className="hidden sm:inline">{tab.fullLabel}</span>

                                {isComments && (
                                    <span
                                        className={`inline-flex items-center justify-center rounded-full min-w-[14px] sm:min-w-[16px] px-1 py-0.5 text-[7px] sm:text-[9px] leading-none font-black ${active
                                            ? "bg-white/20 text-white"
                                            : isDark
                                                ? "bg-white/[0.08] text-slate-300"
                                                : "bg-slate-200 text-slate-600"
                                            }`}
                                    >
                                        {commentsApi.loading ? (
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        ) : (
                                            commentsApi.total
                                        )}
                                    </span>
                                )}
                            </span>
                        </TabButton>
                    );
                })}
            </div>

            {activeTab === "characters" && (
                <CharactersTab characters={anime?.characters ?? []} />
            )}

            {activeTab === "relations" && (
                <RelationsTab
                    relations={anime?.relations ?? []}
                    tags={anime?.tags ?? []}
                />
            )}

            {activeTab === "comments" && (
                <CommentsTab commentsApi={commentsApi} />
            )}
        </div>
    );
}