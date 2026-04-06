/**
 * ThemeContext.tsx — Gestion dark/light/system
 *
 * - Détecte automatiquement la préférence système (prefers-color-scheme)
 * - Persiste le choix utilisateur dans localStorage
 * - Applique data-theme="dark"|"light" sur <html>
 * - Met à jour en temps réel si la préférence système change
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Theme } from '../types';

interface ThemeContextType {
  theme: Theme;                     // Préférence de l'utilisateur: dark | light | system
  resolvedTheme: 'dark' | 'light'; // Thème effectivement appliqué
  setTheme: (theme: Theme) => void;
  isDark: boolean;                  // Raccourci : resolvedTheme === 'dark'
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  isDark: true,
});

const STORAGE_KEY = 'gymx_theme';

const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme: Theme): 'dark' | 'light' => {
  if (theme === 'system') return getSystemTheme();
  return theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialiser depuis localStorage, défaut = 'dark' (identité GymX)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'dark';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(
    () => resolveTheme(theme)
  );

  // Appliquer le thème sur <html>
  const applyTheme = useCallback((resolved: 'dark' | 'light') => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);

    // Met aussi la meta color-scheme pour les scrollbars et éléments natifs
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', resolved);
    } else {
      const m = document.createElement('meta');
      m.name = 'color-scheme';
      m.content = resolved;
      document.head.appendChild(m);
    }
  }, []);

  // Quand le thème change
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [applyTheme]);

  // Au montage : appliquer le thème sauvegardé
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Écouter les changements de préférence système
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const resolved = e.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    // API moderne
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback API ancienne
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      resolvedTheme,
      setTheme,
      isDark: resolvedTheme === 'dark',
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
