import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-md border border-border/50 transition-all hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Toggle theme"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {/* Resplandor detrás del botón */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"></div>
      
      {/* Ícono de Balón de Fútbol (Soccer Ball) SVG Custom */}
      <motion.svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-7 w-7 transition-colors duration-300 ${isDark ? 'text-secondary' : 'text-primary'}`}
        initial={false}
        animate={{
          rotate: isDark ? 360 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 0-7.4 16.7" />
        <path d="M12 22a10 10 0 0 0 7.4-16.7" />
        {/* Pentágono central del balón */}
        <path d="m12 7-3.5 2.5 1.5 4h4l1.5-4Z" fill="currentColor" fillOpacity="0.2" />
        {/* Líneas conectando al pentágono */}
        <path d="M12 7V2" />
        <path d="m8.5 9.5-4-1.5" />
        <path d="m15.5 9.5 4-1.5" />
        <path d="m10 13.5-2.5 4.5" />
        <path d="m14 13.5 2.5 4.5" />
      </motion.svg>
      
      {/* Tooltip visible on hover for extra obviousness */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 scale-0 rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
        {isDark ? "Modo Claro" : "Modo Oscuro"}
      </span>
    </button>
  );
}
