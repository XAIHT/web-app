import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { LanguageContext } from './context';
import type { Lang } from './translations';

const STORAGE_KEY = 'xaiht-lang';

function isLang(value: string | null): value is Lang {
  return value === 'en' || value === 'es';
}

/** Read the persisted choice first, then fall back to the browser locale. */
function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isLang(stored)) return stored;
  return window.navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  // Keep <html lang> and localStorage in sync so the choice survives reloads
  // and assistive tech / browsers know the active language.
  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === 'en' ? 'es' : 'en')),
    [],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}
