// Tlamatini-RC — Angela López Mendoza · XAIHT
//
// In-memory meeting point between SEND and the request Tlachihuani keeps open.
// xaiht.org runs as one process, so a message sent here wakes the waiting
// request at once. The database stays the record: a request that misses a wake
// (for example after a restart) still finds the message on its next check.

const waiters = new Map<number, Set<() => void>>();
const polling = new Map<number, number>();

export function notifyComputer(computerId: number): void {
  const set = waiters.get(computerId);
  if (!set) return;
  for (const wake of [...set]) wake();
}

export function waitForComputer(computerId: number, ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    let set = waiters.get(computerId);
    if (!set) {
      set = new Set();
      waiters.set(computerId, set);
    }
    const done = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", done);
      set!.delete(done);
      if (set!.size === 0) waiters.delete(computerId);
      resolve();
    };
    const timer = setTimeout(done, Math.max(0, ms));
    set.add(done);
    if (signal) {
      if (signal.aborted) done();
      else signal.addEventListener("abort", done, { once: true });
    }
  });
}

export function beginPoll(computerId: number): void {
  polling.set(computerId, (polling.get(computerId) ?? 0) + 1);
}

export function endPoll(computerId: number): void {
  const count = (polling.get(computerId) ?? 1) - 1;
  if (count <= 0) polling.delete(computerId);
  else polling.set(computerId, count);
}

// True while Tlachihuani has a request open right now.
export function isPolling(computerId: number): boolean {
  return (polling.get(computerId) ?? 0) > 0;
}
