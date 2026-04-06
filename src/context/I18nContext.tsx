/**
 * I18nContext.tsx — Internationalisation GymX
 *
 * Améliorations par rapport à la version initiale :
 * - Détection automatique de la langue système (navigator.language)
 * - Fallback FR si langue non supportée
 * - Support de clés imbriquées avec interpolation {variable}
 * - Export du type Language
 */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import fr from '../translations/fr.json';
import en from '../translations/en.json';
import type { Language } from '../types';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: Record<string, any> | string | number) => any;
}

const STORAGE_KEY = 'gymx_lang';
const SUPPORTED_LANGUAGES: Language[] = ['fr', 'en'];

/**
 * Détecte la langue du navigateur et retourne la langue supportée la plus proche.
 * navigator.language retourne des codes comme "fr-FR", "en-US", "fr", "en".
 */
const detectSystemLanguage = (): Language => {
  if (typeof window === 'undefined') return 'fr';

  const browserLang = navigator.language.toLowerCase().split('-')[0];

  if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language;
  }

  return 'fr'; // Fallback : Burkina Faso = francophone
};

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'fr';

  // 1. Préférence sauvegardée (choix explicite de l'utilisateur)
  const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;

  // 2. Langue du navigateur
  return detectSystemLanguage();
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Language, Record<string, unknown>> = { fr, en };

/**
 * Résout une clé de traduction imbriquée (ex: "nav.home")
 * et remplace les paramètres (ex: "Bienvenue, {name}")
 */
const resolveKey = (
  lang: Language,
  key: string,
  paramsOrOptions?: any
): any => {
  const keys = key.split('.');
  let value: unknown = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in (value as object)) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Clé introuvable → fallback EN → retourner la clé brute
      if (lang !== 'en') {
        return resolveKey('en', key, paramsOrOptions);
      }
      return key;
    }
  }

  // Si on attend un objet/tableau
  const returnObjects = typeof paramsOrOptions === 'object' && paramsOrOptions?.returnObjects === true;

  if (typeof value !== 'string') {
    if (returnObjects || typeof value === 'object') return value;
    return key;
  }

  // Interpolation des paramètres : {name} → valeur
  // On gère à la fois t(key, {name: 'Val'}) et t(key, name)
  const params = typeof paramsOrOptions === 'object' ? paramsOrOptions : null;

  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, k) =>
      k in params ? String(params[k]) : `{${k}}`
    );
  }

  return value;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    // Mettre à jour l'attribut lang de la page pour l'accessibilité
    document.documentElement.setAttribute('lang', lang);
  };

  const t = (key: string, options?: any): any => {
    return resolveKey(language, key, options);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
