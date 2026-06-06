import { createContext, useContext } from 'react';
import { translations, type Lang, type Translations } from './translations';

export interface LanguageContextValue {
  /** Active UI language. */
  lang: Lang;
  /** Set the language explicitly. */
  setLang: (lang: Lang) => void;
  /** Flip between English and Spanish. */
  toggle: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Access the current language and the setters that drive the switch. */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>');
  }
  return ctx;
}

/** Convenience hook that returns the translation bundle for the active language. */
export function useT(): Translations {
  const { lang } = useLanguage();
  return translations[lang];
}
