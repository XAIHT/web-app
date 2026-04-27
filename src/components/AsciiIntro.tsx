import { useEffect, useRef } from 'react';

const PHRASES = [
  'eXtended',
  'Artificial Intelligence',
  'Humanly Tempered',
  '(XAIHT)',
];

const STAR_COUNT = 120;

function createStars() {
  return Array.from({ length: STAR_COUNT }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));
}

export default function AsciiIntro() {
  const trackRef = useRef<HTMLDivElement>(null);
  const phraseIndexRef = useRef(0);
  const posXRef = useRef(0);
  const rafRef = useRef<number>(0);
  const starsRef = useRef(createStars());

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const textEl = track.firstElementChild as HTMLDivElement;
    if (!textEl) return;

    // Start off-screen to the right
    posXRef.current = window.innerWidth;
    const SPEED = 3;

    function render() {
      const phrase = PHRASES[phraseIndexRef.current];
      textEl.textContent = phrase;

      let posX = posXRef.current;
      posX -= SPEED;
      posXRef.current = posX;

      const textWidth = textEl.offsetWidth;

      // Reset when fully off-screen left
      if (posX < -textWidth) {
        phraseIndexRef.current = (phraseIndexRef.current + 1) % PHRASES.length;
        posXRef.current = window.innerWidth;
      }

      textEl.style.transform = `translateX(${posX}px)`;
      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    const handleResize = () => {
      if (posXRef.current > window.innerWidth) {
        posXRef.current = window.innerWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const stars = starsRef.current;

  return (
    <section className="nasa-banner-container">
      {/* Starfield background */}
      <div className="nasa-banner-stars" aria-hidden="true">
        {stars.map((star, i) => (
          <div
            key={i}
            className="nasa-star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="nasa-banner-grid" aria-hidden="true" />

      {/* Scrolling text track */}
      <div ref={trackRef} className="nasa-banner-track">
        <div className="nasa-banner-text">eXtended</div>
      </div>

      {/* Scanlines */}
      <div className="nasa-banner-scanlines" aria-hidden="true" />

      {/* Bottom fade */}
      <div className="ascii-fade-bottom" />
    </section>
  );
}
