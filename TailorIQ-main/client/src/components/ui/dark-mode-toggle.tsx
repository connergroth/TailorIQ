/*
import { useUser } from "@/contexts/UserContext";
import { Button } from "./button";
import { Moon, Sun } from "lucide-react";

export function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useUser();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleDarkMode}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-full h-9 w-9 border-gray-200 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 
*/

// Temporarily disabled dark mode functionality
import { Button } from "./button";

export function DarkModeToggle() {
  return null; // Disabled component
} 