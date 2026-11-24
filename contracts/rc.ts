// Tlamatini-RC on xaiht.org — Angela López Mendoza · XAIHT
//
// One definition of the JSON message that xaiht.org sends to Tlachihuani on a
// computer. The Tlamatini-RC page builds the same object for its preview, and
// the server builds the real one, so what Angela sees before SEND is what
// Tlachihuani writes to Tlachihuani.log.

export const RC_SCHEMA = "xaiht.tlamatini-rc.message/1";

export const RC_TARGETS = ["tlachihuani", "tlamatini", "tlamatini-spanish"] as const;
export const RC_TYPES = ["text", "ping", "command"] as const;
export const RC_LEVELS = ["info", "warning", "error"] as const;
export const RC_TTL_MINUTES = [5, 60, 1440, 10080] as const;

export type RcTarget = (typeof RC_TARGETS)[number];
export type RcType = (typeof RC_TYPES)[number];
export type RcLevel = (typeof RC_LEVELS)[number];

export const RC_LIMITS = {
  computerName: 80,
  subject: 120,
  message: 4000,
  computersPerUser: 10,
  queuedPerComputer: 100,
  // Eight legacy messages plus eight executable commands stay below XT's
  // 512 KiB poll-body limit, even with maximum JSON control-character escaping.
  deliveryBatchSize: 8,
  // The computer counts as online while it is asking, or if it asked this recently.
  onlineWindowMs: 40_000,
  // Longest single wait of one request from Tlachihuani (nginx allows 60 s).
  pollWaitSeconds: 25,
  // A message given to the computer but not acknowledged is given again after this.
  redeliverAfterMs: 60_000,
} as const;

export type RcPayloadInput = {
  id: number | null;
  sentAt: Date;
  expiresAt: Date;
  from: { userId: number; name: string | null };
  computer: { id: number; name: string };
  target: RcTarget;
  type: RcType;
  level: RcLevel;
  subject: string;
  message: string;
};

export function buildRcPayload(input: RcPayloadInput) {
  return {
    schema: RC_SCHEMA,
    id: input.id,
    sent_at: input.sentAt.toISOString(),
    expires_at: input.expiresAt.toISOString(),
    from: { site: "xaiht.org", user_id: input.from.userId, name: input.from.name },
    computer: { id: input.computer.id, name: input.computer.name },
    target: input.target,
    type: input.type,
    level: input.level,
    subject: input.subject.trim() || null,
    message: input.message,
  };
}

export type RcPayload = ReturnType<typeof buildRcPayload>;
