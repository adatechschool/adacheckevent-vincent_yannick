import { useEffect, useState } from "react";

export function DarkMode() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <button>
      <div
        className="fixed top-4 right-4 px-4 py-2  w-24 h-10 flex items-center rounded-full cursor-pointer transition-all duration-300 shadow-2xl border border-gray-300"
        onClick={() => setDarkMode(!darkMode)}
        style={{
          backgroundImage: `url(${darkMode ? "./night.jpg" : "./day.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className={`w-8 h-8 rounded-full shadow-lg transition-transform transform duration-500 flex items-center justify-center ${
            darkMode
              ? "translate-x-[42px] bg-gradient-to-r from-gray-700 to-gray-900 shadow-inner"
              : "translate-x-[-10px] bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg"
          }`}
          style={{
            boxShadow:
              "inset 0px 2px 4px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.6)",
          }}
        >
          {darkMode ? <span>🌙</span> : <span>☀️</span>}
        </div>
      </div>
    </button>
  );
}
