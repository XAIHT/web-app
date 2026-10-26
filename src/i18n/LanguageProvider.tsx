import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LanguageContext } from './context';
import { editions, isLang, localizePath, type Lang } from './editions';

const STORAGE_KEY = 'xaiht-lang';

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
  } catch { /* Language selection still works when storage is blocked. */ }
  return window.navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [preferred, setPreferred] = useState<Lang>(getInitialLang);
  const requested = new URLSearchParams(location.search).get('lang');
  const lang = isLang(requested) ? requested : preferred;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `XAIHT | Tlamatini | ${editions[lang].label}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', lang === 'es'
      ? 'Tlamatini en español: controla Unreal Engine y Blender, programa STM32 y ESP32, crea con Live Editor y Terminater. Descarga la edición en español.'
      : 'Tlamatini in English: control Unreal Engine and Blender, program STM32 and ESP32, build with Live Editor and Terminater. Download the English edition.');
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch { /* Optional persistence. */ }
  }, [lang]);

  useEffect(() => {
    if (!isLang(requested)) {
      navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, lang), {
        replace: true, preventScrollReset: true,
      });
    }
  }, [requested, lang, location.pathname, location.search, location.hash, navigate]);

  // Translated text can change section heights without remounting the scroll scenes.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setPreferred(next);
    navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, next), {
      preventScrollReset: true,
    });
  }, [location.pathname, location.search, location.hash, navigate]);
  const toggle = useCallback(() => setLang(lang === 'en' ? 'es' : 'en'), [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}
