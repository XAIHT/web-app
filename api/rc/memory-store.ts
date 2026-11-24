// Tlamatini-RC — Angela López Mendoza · XAIHT
//
// A memory copy of the database store, for vitest and the local check harness
// only. Production code never imports this file.
import type { RcComputer, RcMessage, RcStore } from "./store";
import { RC_LIMITS } from "@contracts/rc";

export function createMemoryRcStore(): RcStore {
  const computers: RcComputer[] = [];
  const messages: RcMessage[] = [];
  let nextComputer = 1;
  let nextMessage = 1;
  return {
    async createComputer(userId, name, tokenHash, tokenHint) {
      const row: RcComputer = {
        id: nextComputer++, userId, name, tokenHash, tokenHint, hostName: null, clientVersion: null,
        lastIp: null, lastSeenAt: null, createdAt: new Date(),
      };
      computers.push(row);
      return { ...row };
    },
    async listComputers(userId) {
      return computers.filter((c) => c.userId === userId).map((c) => ({ ...c }));
    },
    async getComputer(userId, id) {
      const row = computers.find((c) => c.id === id && c.userId === userId);
      return row ? { ...row } : undefined;
    },
    async removeComputer(userId, id) {
      const index = computers.findIndex((c) => c.id === id && c.userId === userId);
      if (index < 0) return false;
      computers.splice(index, 1);
      for (let i = messages.length - 1; i >= 0; i--) if (messages[i].computerId === id) messages.splice(i, 1);
      return true;
    },
    async findComputerByTokenHash(tokenHash) {
      const row = computers.find((c) => c.tokenHash === tokenHash);
      return row ? { ...row } : undefined;
    },
    async touchComputer(id, seen, at) {
      const row = computers.find((c) => c.id === id);
      if (!row) return;
      row.lastSeenAt = at;
      row.lastIp = seen.ip;
      row.clientVersion = seen.version;
      row.hostName = seen.hostName;
    },
    async createMessage(computerId, userId, expiresAt, build) {
      const id = nextMessage++;
      const row: RcMessage = {
        id, computerId, userId, payload: build(id), status: "queued", createdAt: new Date(), expiresAt,
        deliveredAt: null, acknowledgedAt: null,
      };
      messages.push(row);
      return { ...row };
    },
    async takeDeliverable(computerId, now, redeliverBefore) {
      const out: RcMessage[] = [];
      for (const m of messages) {
        if (m.computerId !== computerId) continue;
        if (m.status === "queued" && m.expiresAt < now) { m.status = "expired"; continue; }
        const due = m.status === "queued" || (m.status === "delivered" && m.deliveredAt !== null && m.deliveredAt < redeliverBefore);
        if (!due || out.length >= RC_LIMITS.deliveryBatchSize) continue;
        m.status = "delivered";
        m.deliveredAt = now;
        out.push({ ...m });
      }
      return out;
    },
    async acknowledge(computerId, ids, at) {
      let count = 0;
      for (const m of messages) {
        if (m.computerId !== computerId || !ids.includes(m.id)) continue;
        if (m.status !== "delivered" && m.status !== "queued") continue;
        m.status = "acknowledged";
        m.acknowledgedAt = at;
        count++;
      }
      return count;
    },
    async listMessages(userId, limit) {
      return messages.filter((m) => m.userId === userId).sort((a, b) => b.id - a.id).slice(0, limit).map((m) => ({ ...m }));
    },
    async countQueued(computerId, now) {
      return messages.filter((m) => m.computerId === computerId && m.status === "queued" && m.expiresAt >= now).length;
    },
  };
}
