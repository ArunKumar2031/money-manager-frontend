import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage safely on initial load
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]); // Only runs when isDark explicitly changes

  return (
    <button
      onClick={() => setIsDark(prev => !prev)}
      className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};

export default ThemeToggle;