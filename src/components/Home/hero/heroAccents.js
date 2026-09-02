const ACCENTS = [
    { color: "#ef4444", rgb: "239,68,68" },
    { color: "#3b82f6", rgb: "59,130,246" },
    { color: "#f59e0b", rgb: "245,158,11" },
    { color: "#8b5cf6", rgb: "139,92,246" },
    { color: "#10b981", rgb: "16,185,129" },
    { color: "#ec4899", rgb: "236,72,153" },
];

export function getHeroAccent(index, status) {
    if (status === "ONGOING") return { color: "#ef4444", rgb: "239,68,68" };
    if (status === "COMPLETE") return { color: "#10b981", rgb: "16,185,129" };
    return ACCENTS[index % ACCENTS.length];
}
