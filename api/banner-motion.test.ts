import { describe, expect, it } from 'vitest';
import { BANNER_GLIDE_SECONDS, BANNER_MAX_SPEED, BANNER_SPEED,
  createBannerMotion, createFlickTracker, createPhraseDeck } from '@/lib/banner-motion';
import { translations } from '@/i18n/translations';

describe('banner phrase selection', () => {
  it.each(['en', 'es'] as const)('includes every %s phrase once in each random round', lang => {
    const phrases = translations[lang].ascii.phrases;
    const next = createPhraseDeck(phrases);
    let previous: string | undefined;
    for (let round = 0; round < 5; round++) {
      const selected = Array.from({ length: phrases.length }, () => next());
      expect(new Set(selected)).toEqual(new Set(phrases));
      expect(selected[0]).not.toBe(previous);
      previous = selected.at(-1);
    }
  });

  it('changes the order with the random input, without mutating the catalog', () => {
    const phrases = ['Unreal Engine', 'Blender', 'STM32', 'ESP32'];
    const first = createPhraseDeck(phrases, () => 0);
    const second = createPhraseDeck(phrases, () => 0.99);
    expect(Array.from({ length: 4 }, first)).not.toEqual(Array.from({ length: 4 }, second));
    expect(phrases).toEqual(['Unreal Engine', 'Blender', 'STM32', 'ESP32']);
  });

  it('handles empty, blank, duplicate and single-entry lists', () => {
    expect(createPhraseDeck([])()).toBeUndefined();
    expect(createPhraseDeck([' '])()).toBeUndefined();
    const next = createPhraseDeck(['Talker', 'Talker', '']);
    expect([next(), next(), next()]).toEqual(['Talker', 'Talker', 'Talker']);
  });
});

describe('banner motion', () => {
  it('runs faster than the old 180px/s baseline and never stops while held', () => {
    const motion = createBannerMotion();
    expect(BANNER_SPEED).toBeGreaterThan(180);
    expect(motion.advance(1)).toBe(BANNER_SPEED);
    expect(motion.speed).toBe(BANNER_SPEED);
  });

  it('takes the measured pointer velocity and returns exactly to normal after 2.8s', () => {
    const motion = createBannerMotion();
    motion.accelerate(2400);
    expect(motion.speed).toBe(2400);
    motion.advance(1);
    expect(motion.speed).toBeGreaterThan(BANNER_SPEED);
    expect(motion.speed).toBeLessThan(2400);
    motion.advance(BANNER_GLIDE_SECONDS - 1);
    expect(motion.speed).toBe(BANNER_SPEED);
    expect(motion.advance(1)).toBe(BANNER_SPEED);
  });

  it.each([4, 10, 30, 60, 120, 144])('travels the same distance at %i frames per second', fps => {
    const motion = createBannerMotion();
    motion.accelerate(3000);
    let distance = 0;
    for (let frame = 0; frame < fps * 4; frame++) distance += motion.advance(1 / fps);
    const expected = BANNER_SPEED * 4 + (3000 - BANNER_SPEED) * BANNER_GLIDE_SECONDS / 4;
    expect(distance).toBeCloseTo(expected, 7);
    expect(motion.speed).toBe(BANNER_SPEED);
  });

  it('never reverses, slows on a rightward gesture, or exceeds its safety ceiling', () => {
    const motion = createBannerMotion();
    for (const velocity of [-1000, 0, 10, NaN, Infinity]) motion.accelerate(velocity);
    expect(motion.speed).toBe(BANNER_SPEED);
    motion.accelerate(100000);
    expect(motion.speed).toBe(BANNER_MAX_SPEED);
    motion.accelerate(1000);
    expect(motion.speed).toBe(BANNER_MAX_SPEED);
    for (const seconds of [-1, 0, NaN, Infinity]) expect(motion.advance(seconds)).toBe(0);
  });

  it('accepts another flick during the glide and can reset after hiding the page', () => {
    const motion = createBannerMotion();
    motion.accelerate(2000);
    motion.advance(2);
    motion.accelerate(2500);
    expect(motion.speed).toBe(2500);
    motion.reset();
    expect(motion.advance(1)).toBe(BANNER_SPEED);
  });
});

describe('leftward mouse and touch velocity', () => {
  const sample = (x: number, time: number, y = 200) => ({ x, y, time });

  it('measures real displacement / time, so faster gestures travel faster', () => {
    const slow = createFlickTracker(sample(500, 0));
    const fast = createFlickTracker(sample(500, 0));
    expect(slow.sample(sample(300, 200))).toBe(1000);
    expect(fast.sample(sample(300, 50))).toBe(4000);
  });

  it('ignores rightward movement and does not count it in a later leftward flick', () => {
    const tracker = createFlickTracker(sample(100, 0));
    expect(tracker.sample(sample(300, 100))).toBe(0);
    expect(tracker.sample(sample(200, 200))).toBe(1000);
  });

  it('ignores taps, jitter, duplicate timestamps and stationary holds', () => {
    const tracker = createFlickTracker(sample(500, 0));
    expect(tracker.sample(sample(498, 1))).toBe(0);
    expect(tracker.sample(sample(200, 1))).toBe(0);
    expect(tracker.sample(sample(498, 20))).toBe(0);
    expect(tracker.horizontal).toBe(false);
  });

  it('leaves vertically initiated gestures to native page scrolling', () => {
    const tracker = createFlickTracker(sample(500, 0));
    expect(tracker.sample(sample(498, 10, 170))).toBe(0);
    expect(tracker.sample(sample(100, 20, 160))).toBe(0);
    expect(tracker.horizontal).toBe(false);
  });

  it('uses recent samples rather than the average over an entire long drag', () => {
    const tracker = createFlickTracker(sample(500, 0));
    tracker.sample(sample(490, 100));
    tracker.sample(sample(480, 200));
    tracker.sample(sample(400, 220));
    expect(tracker.sample(sample(300, 250))).toBe(3600);
  });
});
