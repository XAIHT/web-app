import { useCallback, useRef, useState } from 'react';
import { useLanguage, useT } from '@/i18n/context';

/**
 * Number of sparkle particles emitted on each press. Angles are spread evenly
 * around the knob with per-particle jitter so every burst looks a little
 * different without needing randomness at render time.
 */
const SPARK_COUNT = 14;

interface Spark {
  angle: number;
  dist: number;
  delay: number;
  color: string;
}

const SPARK_COLORS = ['#c9a96e', '#40c4b4', '#f3d9a6', '#7a9e8e'];

function makeSparks(): Spark[] {
  return Array.from({ length: SPARK_COUNT }, (_, i) => {
    const base = (360 / SPARK_COUNT) * i;
    const jitter = (Math.random() - 0.5) * 22;
    return {
      angle: base + jitter,
      dist: 16 + Math.random() * 16,
      delay: Math.random() * 0.12,
      color: SPARK_COLORS[i % SPARK_COLORS.length],
    };
  });
}

/** Stylized Aztec sun-stone glyph that decorates the sliding knob. */
function SunStoneGlyph() {
  return (
    <svg
      className="lang-switch__glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7.5" />
      {/* Eight radial rays in the Sun Stone style. */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (Math.PI / 4) * i;
        const x1 = 12 + Math.cos(a) * 8.2;
        const y1 = 12 + Math.sin(a) * 8.2;
        const x2 = 12 + Math.cos(a) * 11;
        const y2 = 12 + Math.sin(a) * 11;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
      })}
    </svg>
  );
}

export default function LanguageSwitch() {
  const { lang, toggle } = useLanguage();
  const t = useT();

  // `burst` carries a fresh set of sparks plus a key so the layer remounts and
  // re-runs its CSS animation on every press. `turns` makes the knob keep
  // spinning in the same direction each time instead of unwinding.
  const [burst, setBurst] = useState<{ key: number; sparks: Spark[] } | null>(null);
  const turnsRef = useRef(0);
  const [turns, setTurns] = useState(0);

  const handleToggle = useCallback(() => {
    turnsRef.current += 1;
    setTurns(turnsRef.current);
    setBurst({ key: turnsRef.current, sparks: makeSparks() });
    toggle();
  }, [toggle]);

  const isEs = lang === 'es';
  const knobX = isEs ? 47 : 0;
  const label = isEs ? t.nav.switchToEnglish : t.nav.switchToSpanish;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isEs}
      aria-label={label}
      title={label}
      className="lang-switch"
      data-lang={lang}
      onClick={handleToggle}
    >
      <span className="lang-switch__track">
        {/* The language you'd switch to, shown faintly on the empty side. */}
        <span
          className={`lang-switch__target ${isEs ? 'lang-switch__target--en' : 'lang-switch__target--es'}`}
          aria-hidden="true"
        >
          {isEs ? 'EN' : 'ES'}
        </span>

        <span
          className="lang-switch__knob"
          style={{ transform: `translateX(${knobX}px) rotate(${turns * 180}deg)` }}
        >
          <SunStoneGlyph />
          <span className="lang-switch__code">{isEs ? 'ES' : 'EN'}</span>
        </span>

        {burst && (
          <span key={burst.key} aria-hidden="true">
            <span className="lang-spark-ring" />
            <span className="lang-switch__sparks">
              {burst.sparks.map((s, i) => (
                <span
                  key={i}
                  className="lang-spark"
                  style={
                    {
                      '--spark-angle': `${s.angle}deg`,
                      '--spark-dist': `${s.dist}px`,
                      '--spark-delay': `${s.delay}s`,
                      '--spark-color': s.color,
                    } as React.CSSProperties
                  }
                />
              ))}
            </span>
          </span>
        )}
      </span>
    </button>
  );
}
