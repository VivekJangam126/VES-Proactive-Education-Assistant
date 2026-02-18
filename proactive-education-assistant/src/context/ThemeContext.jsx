import { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Fixed to light theme only
  const theme = 'light';

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove dark theme classes
    root.classList.remove('dark');
    body.classList.remove('dark', 'dark-mode');
    
    // Ensure light theme
    root.classList.add('light');
    body.classList.add('light');
  }, []);

  const value = {
    theme,
    toggleTheme: () => {}, // No-op for compatibility
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
