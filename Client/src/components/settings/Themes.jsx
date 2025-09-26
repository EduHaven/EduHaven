import { Check } from "lucide-react";
import { useEffect, useState } from "react";

const themes = [
  {
    id: "light",
    label: "Light default",
    primary: "#dfddec",
    secondary: "#edecf2",
    tertiary: "#ffffff",
    text: "#1f2937",
    accent: "#7f23ca",
  },
  {
    id: "theme-ocean-breeze",
    label: "Ocean Breeze",
    primary: "#f0f9ff",
    secondary: "#e0f2fe",
    tertiary: "#ffffff",
    text: "#0c4a6e",
    accent: "#0ea5e9",
  },
  {
    id: "theme-arctic-mint",
    label: "Arctic Mint",
    primary: "#f0fdfa",
    secondary: "#ccfbf1",
    tertiary: "#ffffff",
    text: "#134e4a",
    accent: "#14b8a6",
  },
  {
    id: "theme-mint-dream",
    label: "Mint Dream",
    primary: "#f0fdf4",
    secondary: "#dcfce7",
    tertiary: "#ffffff",
    text: "#14532d",
    accent: "#10b981",
  },
  {
    id: "theme-rose-gold",
    label: "Rose Gold",
    primary: "#fef7f7",
    secondary: "#fce7e7",
    tertiary: "#ffffff",
    text: "#7c2d12",
    accent: "#e11d48",
  },
  {
    id: "theme-coral-reef",
    label: "Coral Reef",
    primary: "#fff5f5",
    secondary: "#fed7d7",
    tertiary: "#ffffff",
    text: "#c53030",
    accent: "#f56565",
  },
  {
    id: "theme-golden-hour",
    label: "Golden Hour",
    primary: "#fff8e1",
    secondary: "#ffecb3",
    tertiary: "#ffffff",
    text: "#bf360c",
    accent: "#ff9800",
  },
  {
    id: "theme-lavender-fields",
    label: "Lavender Fields",
    primary: "#faf5ff",
    secondary: "#f3e8ff",
    tertiary: "#ffffff",
    text: "#581c87",
    accent: "#8b5cf6",
  },
  {
    id: "dark",
    label: "Dark default",
    primary: "#111827",
    secondary: "#1f2937",
    tertiary: "#374151",
    text: "#d1d5db",
    accent: "#6b21a8",
  },
  {
    id: "theme-space-black",
    label: "Space Black",
    primary: "#000000",
    secondary: "#0a0a0a",
    tertiary: "#1a1a1a",
    text: "#e5e5e5",
    accent: "#8b5cf6",
  },
  {
    id: "theme-midnight-blue",
    label: "Midnight Blue",
    primary: "#020617",
    secondary: "#0f172a",
    tertiary: "#1e293b",
    text: "#cbd5e1",
    accent: "#3b82f6",
  },
  {
    id: "theme-obsidian",
    label: "Obsidian",
    primary: "#0c0c0c",
    secondary: "#1c1c1c",
    tertiary: "#2c2c2c",
    text: "#e5e5e5",
    accent: "#ff6b35",
  },
  {
    id: "theme-sapphire-dream",
    label: "Sapphire Dream",
    primary: "#0a0a2e",
    secondary: "#16213e",
    tertiary: "#1e3a5f",
    text: "#87ceeb",
    accent: "#4169e1",
  },
  {
    id: "theme-deep-purple",
    label: "Deep Purple",
    primary: "#1a0033",
    secondary: "#2d1b47",
    tertiary: "#44337a",
    text: "#ddd6fe",
    accent: "#a855f7",
  },
  {
    id: "theme-volcanic",
    label: "Volcanic",
    primary: "#1c0a00",
    secondary: "#2d1608",
    tertiary: "#3d2113",
    text: "#ff4500",
    accent: "#dc2626",
  },
  {
    id: "theme-forest",
    label: "Forest",
    primary: "#102820",
    secondary: "#1c3c2f",
    tertiary: "#235641",
    text: "#e0ffe0",
    accent: "#38a169",
  },
  {
    id: "theme-coffee",
    label: "Coffee",
    primary: "#2e1e12",
    secondary: "#3b2b1a",
    tertiary: "#4b3827",
    text: "#f4e9d8",
    accent: "#a9745f",
  },
  {
    id: "theme-neon-sunset",
    label: "Neon Sunset",
    primary: "#0a0a0f",
    secondary: "#1a0e2e",
    tertiary: "#2d1b47",
    text: "#ff6b9d",
    accent: "#00d4ff",
  },
  {
    id: "theme-cyberpunk",
    label: "Cyberpunk",
    primary: "#0f0f0f",
    secondary: "#1f1f1f",
    tertiary: "#2e2e2e",
    text: "#00ffe0",
    accent: "#ff00c8",
  },
  {
    id: "theme-matrix",
    label: "Matrix",
    primary: "#000000",
    secondary: "#001100",
    tertiary: "#002200",
    text: "#00ff00",
    accent: "#00ff41",
  },
];

// Theme preview component
const ThemePreview = ({ theme, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group w-full border-2 rounded-xl overflow-hidden transition-all duration-100 transform
        ${
          isSelected
            ? "border-[var(--bg-primary)] shadow-xl ring-4 ring-[var(--btn)] "
            : "border-gray-400/35 hover:scale-102 hover:shadow-lg"
        }
      `}
      style={
        isSelected ? { borderColor: theme.accent, ringColor: theme.accent } : {}
      }
    >
      {/* Mini UI Preview */}
      <div
        className="h-32 p-3 flex flex-col gap-2"
        style={{ backgroundColor: theme.primary }}
      >
        {/* Header bar */}
        <div
          className="h-3 rounded-full flex items-center justify-between px-2"
          style={{ backgroundColor: theme.secondary }}
        >
          <div className="flex gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: theme.accent }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full opacity-60"
              style={{ backgroundColor: theme.text }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full opacity-40"
              style={{ backgroundColor: theme.text }}
            ></div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex gap-2">
          <div className="flex-1 space-y-1">
            <div
              className="h-2 rounded"
              style={{ backgroundColor: theme.tertiary, opacity: 0.8 }}
            ></div>
            <div
              className="h-1.5 rounded"
              style={{ backgroundColor: theme.tertiary, opacity: 0.6 }}
            ></div>
            <div
              className="h-1.5 rounded w-3/4"
              style={{ backgroundColor: theme.tertiary, opacity: 0.4 }}
            ></div>
          </div>
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: theme.accent, opacity: 0.9 }}
          ></div>
        </div>

        {/* Bottom elements */}
        <div className="flex gap-1">
          <div
            className="h-1.5 w-8 rounded-full"
            style={{ backgroundColor: theme.accent }}
          ></div>
          <div
            className="h-1.5 w-6 rounded-full"
            style={{ backgroundColor: theme.tertiary, opacity: 0.5 }}
          ></div>
        </div>
      </div>

      {/* Theme name */}
      <div className="bg-ter px-3 py-2 text-sm font-medium txt">
        <div className="flex items-center justify-between">
          <span>{theme.label}</span>
          {isSelected && <Check size={14} className="text-[var(--btn)]" />}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 pointer-events-none"></div>
    </button>
  );
};

export default function Themes() {
  const [theme, setTheme] = useState("light");

  // Load saved preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved && themes.some((t) => t.id === saved)) {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  // Apply theme class to document
  const applyTheme = (id) => {
    const all = themes.map((t) => t.id);
    document.documentElement.classList.remove(...all);
    if (id !== "light") document.documentElement.classList.add(id);
  };

  const onSelectTheme = (id) => {
    setTheme(id);
    localStorage.setItem("theme", id);
    applyTheme(id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 ">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold txt">Choose Your Theme</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
          {themes.map((themeObj) => (
            <ThemePreview
              key={themeObj.id}
              theme={themeObj}
              isSelected={theme === themeObj.id}
              onClick={() => onSelectTheme(themeObj.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
