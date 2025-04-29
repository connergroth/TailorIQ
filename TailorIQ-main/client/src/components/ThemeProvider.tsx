// Temporarily disabled dark mode functionality
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  return { theme: 'light', setTheme: () => {} };
} 