// Test/local-preview substitute. Production imports only the MySQL command store.
import { randomBytes } from "node:crypto";
import { RC_COMMAND_LIMITS, commandLane, commandLaneCapacity } from "@contracts/rc-command";
import { commandEnvelope, commandHash, commandResponse, duplicateResult, RcCommandStoreError, type RcCommand, type RcCommandStore } from "./command-store";
import { getRcStore } from "./store";

export function createMemoryRcCommandStore(): RcCommandStore {
  const rows: RcCommand[] = [];
  let nextId = 1;
  const clone = (row: RcCommand) => ({ ...row });
  return {
    async create(userId, name, input, now) {
      const computer = await getRcStore().getComputer(userId, input.computerId);
      if (!computer) throw new RcCommandStoreError("not_found", "That computer is not connected to your account.");
      const hash = commandHash(input);
      const existing = rows.find(row => row.computerId === computer.id && row.requestId === input.requestId);
      if (existing) {
        if (existing.requestHash !== hash) throw new RcCommandStoreError("conflict", "This request ID belongs to a different operation. Do not retry it with changed content.");
        return clone(existing);
      }
      for (const row of rows) if (row.computerId === computer.id && row.status === "queued" && row.expiresAt <= now) {
        row.status = "expired"; row.updatedAt = now;
      }
      const lane = commandLane(input.operation);
      const budget = commandLaneCapacity(input.operation);
      if (rows.filter(row => row.computerId === computer.id && commandLane(row.operation) === lane && ["queued", "delivered", "running"].includes(row.status)).length >= budget)
        throw new RcCommandStoreError("queue_full", "Too many operations are waiting for this computer. Reconnect it before sending more.");
      const id = nextId++;
      const expires = new Date(now.getTime() + RC_COMMAND_LIMITS.dispatchTtlMs);
      const row: RcCommand = {
        id, computerId: computer.id, userId, requestId: input.requestId, requestHash: hash,
        operation: input.operation, bindingId: "bindingId" in input ? input.bindingId : null,
        payload: JSON.stringify(commandEnvelope(id, userId, name, computer.name, input, now, expires)),
        status: "queued", deliveryId: null, sequence: 0, response: null,
        createdAt: now, updatedAt: now, expiresAt: expires, leaseUntil: null,
      };
      rows.push(row);
      return clone(row);
    },
    async get(userId, computerId, requestId) {
      if (!await getRcStore().getComputer(userId, computerId)) return undefined;
      const row = rows.find(item => item.computerId === computerId && item.userId === userId && item.requestId === requestId);
      return row ? clone(row) : undefined;
    },
    async recent(userId, computerId) {
      if (!await getRcStore().getComputer(userId, computerId)) return [];
      const owned = rows.filter(row => row.computerId === computerId && row.userId === userId && row.operation === "conversation.submit")
        .sort((a, b) => b.id - a.id);
      const active = owned.filter(row => ["queued", "delivered", "running"].includes(row.status));
      const recent = owned.filter(row => ["completed", "expired"].includes(row.status)).slice(0, 25);
      return [...active, ...recent].sort((a, b) => b.id - a.id).map(clone);
    },
    async cancelQueued(userId, computerId, requestId, now) {
      if (!await getRcStore().getComputer(userId, computerId)) throw new RcCommandStoreError("not_found", "That computer is not connected to your account.");
      const row = rows.find(item => item.computerId === computerId && item.userId === userId && item.requestId === requestId);
      if (!row) throw new RcCommandStoreError("not_found", "The operation was not found.");
      const cancelled = JSON.stringify({ ok: false, error: { code: "cancelled_before_dispatch", message: "Cancelled before dispatch." } });
      if (row.status === "completed" && row.response === cancelled) return clone(row);
      if (row.status !== "queued") throw new RcCommandStoreError("conflict", "The computer has already collected this operation. Use its running-operation Cancel control.");
      row.status = "completed"; row.response = cancelled; row.updatedAt = now;
      return clone(row);
    },
    async takeDeliverable(computerId, now) {
      const candidate = rows.find(row => row.computerId === computerId);
      if (candidate && !await getRcStore().getComputer(candidate.userId, computerId)) return [];
      const out: RcCommand[] = [];
      for (const row of [...rows].sort((a, b) => commandLane(a.operation) - commandLane(b.operation) || a.id - b.id)) {
        if (row.computerId !== computerId) continue;
        if (row.status === "queued" && row.expiresAt <= now) { row.status = "expired"; row.updatedAt = now; continue; }
        if (!(row.status === "queued" || (["delivered", "running"].includes(row.status) && row.leaseUntil && row.leaseUntil <= now)) || out.length >= 8) continue;
        row.status = "delivered"; row.deliveryId = randomBytes(16).toString("hex"); row.sequence = 0;
        row.leaseUntil = new Date(now.getTime() + RC_COMMAND_LIMITS.leaseMs); row.updatedAt = now;
        out.push(clone(row));
      }
      return out;
    },
    async saveResult(computerId, input, now) {
      const row = rows.find(item => item.id === input.id && item.computerId === computerId && item.requestId === input.request_id);
      if (!row || !await getRcStore().getComputer(row.userId, computerId)) return false;
      if (duplicateResult(row, input, now)) return true;
      if (row.deliveryId !== input.delivery_id || row.sequence >= input.sequence || !["delivered", "running"].includes(row.status) || !row.leaseUntil || row.leaseUntil <= now) return false;
      row.status = input.status; row.sequence = input.sequence; row.updatedAt = now;
      row.response = commandResponse(input);
      row.leaseUntil = input.status === "running" ? new Date(now.getTime() + RC_COMMAND_LIMITS.leaseMs) : null;
      return true;
    },
  };
}
