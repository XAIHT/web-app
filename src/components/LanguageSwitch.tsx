import { useId } from 'react';
import { Languages } from 'lucide-react';
import { useLanguage, useT } from '@/i18n/context';
import './LanguageSwitch.css';

export default function LanguageSwitch() {
  const { lang, setLang } = useLanguage();
  const c = useT().edition;
  const name = useId();
  return (
    <fieldset className="edition-switch">
      <legend className="sr-only">{c.selector}</legend>
      <Languages size={15} aria-hidden="true" />
      <div className="edition-switch-options">
        {(['en', 'es'] as const).map((code) => (
          <label key={code} className="edition-switch-option" data-active={lang === code}>
            <input type="radio" name={name} value={code} checked={lang === code}
              onChange={() => setLang(code)} />
            <span lang={code}>{code === 'en' ? 'English' : 'Español'}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
