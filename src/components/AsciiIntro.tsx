import { useEffect, useMemo, useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import { EditionLabel } from '@/components/EditionDetails';
import { useEdition, useT } from '@/i18n/context';
import { createBannerMotion, createFlickTracker, createPhraseDeck } from '@/lib/banner-motion';

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
  const t = useT();
  const edition = useEdition();
  const phrases = t.ascii.phrases;
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stars = useMemo(() => createStars(), []);

  useEffect(() => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container || !phrases.length) return;

    const nextPhrase = createPhraseDeck(phrases);
    const motion = createBannerMotion();
    const items: { element: HTMLDivElement; width: number }[] = [];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    let width = container.clientWidth;
    let x = 0;
    let totalWidth = 0;
    let frame = 0;
    let lastTime = 0;
    let disposed = false;
    let gesture: { id: number; tracker: ReturnType<typeof createFlickTracker> } | undefined;

    function fillTrack() {
      // Only keep enough phrases to fill the viewport plus one incoming phrase.
      while (items.length < 2 || x + totalWidth < width + gap) {
        const phrase = nextPhrase();
        if (phrase === undefined) break;
        const element = document.createElement('div');
        element.className = 'nasa-banner-text';
        element.textContent = phrase;
        track!.append(element);
        const itemWidth = element.offsetWidth + gap;
        items.push({ element, width: itemWidth });
        totalWidth += itemWidth;
      }
    }

    function render(time: number) {
      // Absorb ordinary frame stalls, but don't jump through phrases after suspension.
      if (lastTime) x -= motion.advance(Math.min((time - lastTime) / 1000, 0.25));
      lastTime = time;
      while (items.length && x <= -items[0].width) {
        const item = items.shift()!;
        x += item.width;
        totalWidth -= item.width;
        item.element.remove();
      }
      fillTrack();
      track!.style.transform = `translate3d(${x}px, 0, 0)`;
      frame = requestAnimationFrame(render);
    }

    function measure() {
      if (disposed) return;
      width = container!.clientWidth;
      const oldWidth = items[0]?.width;
      totalWidth = 0;
      for (const item of items) {
        item.width = item.element.offsetWidth + gap;
        totalWidth += item.width;
      }
      if (oldWidth && x < 0) x *= items[0].width / oldWidth;
      fillTrack();
    }

    function endGesture() {
      const id = gesture?.id;
      gesture = undefined;
      delete container!.dataset.dragging;
      if (id !== undefined && container!.hasPointerCapture(id)) container!.releasePointerCapture(id);
    }

    function pointerDown(event: PointerEvent) {
      if (!event.isPrimary || event.button !== 0 || gesture) return;
      if (event.target instanceof Element && event.target.closest('a, button, input, select, textarea')) return;
      gesture = {
        id: event.pointerId,
        tracker: createFlickTracker({ x: event.clientX, y: event.clientY, time: event.timeStamp }),
      };
      container!.setPointerCapture(event.pointerId);
    }

    function pointerMove(event: PointerEvent) {
      if (!gesture || gesture.id !== event.pointerId) return;
      if (event.pointerType === 'mouse' && !(event.buttons & 1)) { endGesture(); return; }
      const samples = event.getCoalescedEvents?.();
      for (const sample of samples?.length ? samples : [event]) {
        motion.accelerate(gesture.tracker.sample({
          x: sample.clientX, y: sample.clientY, time: sample.timeStamp,
        }));
      }
      if (gesture.tracker.horizontal) container!.dataset.dragging = 'true';
    }

    function pointerEnd(event: PointerEvent) {
      if (event.pointerId === gesture?.id) endGesture();
    }

    function keyDown(event: KeyboardEvent) {
      if (event.target !== container || event.key !== 'ArrowLeft') return;
      event.preventDefault();
      motion.accelerate(Math.max(1200, motion.speed * 1.5));
    }

    function visibilityChange() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      endGesture();
      motion.reset();
      if (!document.hidden) frame = requestAnimationFrame(render);
    }

    fillTrack();
    frame = requestAnimationFrame(render);
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    void document.fonts.ready.then(measure);
    container.addEventListener('pointerdown', pointerDown);
    container.addEventListener('pointermove', pointerMove);
    container.addEventListener('pointerup', pointerEnd);
    container.addEventListener('pointercancel', pointerEnd);
    container.addEventListener('lostpointercapture', pointerEnd);
    container.addEventListener('keydown', keyDown);
    window.addEventListener('blur', endGesture);
    document.addEventListener('visibilitychange', visibilityChange);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      endGesture();
      container.removeEventListener('pointerdown', pointerDown);
      container.removeEventListener('pointermove', pointerMove);
      container.removeEventListener('pointerup', pointerEnd);
      container.removeEventListener('pointercancel', pointerEnd);
      container.removeEventListener('lostpointercapture', pointerEnd);
      container.removeEventListener('keydown', keyDown);
      window.removeEventListener('blur', endGesture);
      document.removeEventListener('visibilitychange', visibilityChange);
      track.replaceChildren();
      track.style.transform = '';
    };
  }, [phrases]);

  return (
    <section ref={containerRef} className="nasa-banner-container" tabIndex={0} aria-label={t.ascii.label}>
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
      <div ref={trackRef} className="nasa-banner-track" aria-live="off" />

      {/* Scanlines */}
      <div className="nasa-banner-scanlines" aria-hidden="true" />

      {/* Bottom fade */}
      <div className="ascii-fade-bottom" />
      <div className="banner-edition">
        <div>
          <p className="banner-edition-name">Tlamatini</p>
          <EditionLabel />
        </div>
        <div className="banner-edition-actions">
          <a href={edition.installerUrl} className="xaiht-btn xaiht-btn-filled">
            <Download size={16} aria-hidden="true" />{t.edition.download}
          </a>
          <Link to="/tlamatini">{t.edition.explore}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
