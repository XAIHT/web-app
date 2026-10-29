export const BANNER_SPEED = 300;
export const BANNER_MAX_SPEED = 6000;
export const BANNER_GLIDE_SECONDS = 2.8;

export function createPhraseDeck(phrases: readonly string[], random = Math.random) {
  let remaining: string[] = [];
  let previous: string | undefined;
  const unique = [...new Set(phrases.filter(phrase => phrase.trim()))];

  return () => {
    if (!remaining.length) {
      remaining = [...unique];
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      // Keep the boundary between shuffled rounds free of immediate repeats.
      const last = remaining.length - 1;
      if (last > 0 && remaining[last] === previous) {
        [remaining[0], remaining[last]] = [remaining[last], remaining[0]];
      }
    }
    previous = remaining.pop();
    return previous;
  };
}

export function createBannerMotion() {
  let peak = BANNER_SPEED;
  let elapsed = BANNER_GLIDE_SECONDS;
  const speed = () => BANNER_SPEED + (peak - BANNER_SPEED)
    * (1 - elapsed / BANNER_GLIDE_SECONDS) ** 3;

  return {
    get speed() { return speed(); },
    accelerate(pixelsPerSecond: number) {
      if (!Number.isFinite(pixelsPerSecond)) return;
      const next = Math.min(BANNER_MAX_SPEED, pixelsPerSecond);
      if (next <= speed()) return;
      peak = next;
      elapsed = 0;
    },
    advance(seconds: number) {
      if (!Number.isFinite(seconds) || seconds <= 0) return 0;
      const before = elapsed;
      elapsed = Math.min(BANNER_GLIDE_SECONDS, elapsed + seconds);
      // Integrate the easing curve so travel is identical at 60, 120 and 144 Hz.
      return BANNER_SPEED * seconds + (peak - BANNER_SPEED) * BANNER_GLIDE_SECONDS / 4
        * ((1 - before / BANNER_GLIDE_SECONDS) ** 4
          - (1 - elapsed / BANNER_GLIDE_SECONDS) ** 4);
    },
    reset() {
      peak = BANNER_SPEED;
      elapsed = BANNER_GLIDE_SECONDS;
    },
  };
}

type PointerSample = { x: number; y: number; time: number };

export function createFlickTracker(start: PointerSample) {
  let axis: 'pending' | 'horizontal' | 'vertical' = 'pending';
  let samples = [start];

  return {
    get horizontal() { return axis === 'horizontal'; },
    sample(point: PointerSample) {
      const last = samples[samples.length - 1];
      if (point.time <= last.time) return 0;
      if (axis === 'pending') {
        const dx = Math.abs(point.x - start.x);
        const dy = Math.abs(point.y - start.y);
        if (dy > 6 && dy > dx) axis = 'vertical';
        else if (dx > 6 && dx > dy * 1.2) axis = 'horizontal';
      }
      if (point.x >= last.x) {
        samples = [point];
        return 0;
      }
      samples.push(point);
      while (samples.length > 2 && samples[0].time < point.time - 80) samples.shift();
      if (axis !== 'horizontal') return 0;
      const first = samples[0];
      return (first.x - point.x) * 1000 / (point.time - first.time);
    },
  };
}
