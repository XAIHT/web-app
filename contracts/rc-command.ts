// Tlamatini-RC — Angela López Mendoza · XAIHT
// Executable operations deliberately use a separate schema from inert v1 log messages.
import { z } from "zod";

export const RC_COMMAND_SCHEMA = "xaiht.tlamatini-rc.command/1";
export const RC_COMMAND_LIMITS = {
  promptCharacters: 16000,
  promptJsonBytes: 24000,
  queuedPerComputer: 100,
  urgentControlReserve: 8,
  discoveryReserve: 4,
  dispatchTtlMs: 5 * 60_000,
  leaseMs: 60_000,
  resultBytes: 128 * 1024,
  responseBodyBytes: 132 * 1024,
} as const;

export const RC_CONTROL_OPERATIONS = ["conversation.cancel", "conversation.permission"] as const;
export const RC_DISCOVERY_OPERATIONS = ["accounts.list", "application.status"] as const;
// operation.get remains normal: it may watch an operation for an unbounded time.
export function commandLane(operation: string): 0 | 1 | 2 {
  if ((RC_CONTROL_OPERATIONS as readonly string[]).includes(operation)) return 0;
  return (RC_DISCOVERY_OPERATIONS as readonly string[]).includes(operation) ? 1 : 2;
}
export function commandLaneCapacity(operation: string): number {
  const lane = commandLane(operation);
  return lane === 0 ? RC_COMMAND_LIMITS.urgentControlReserve : lane === 1 ? RC_COMMAND_LIMITS.discoveryReserve : RC_COMMAND_LIMITS.queuedPerComputer;
}

export const rcIdentity = z.string().regex(/^[a-f0-9]{32}$/);
const options = z.object({
  multi_turn_enabled: z.boolean().optional(),
  exec_report_enabled: z.boolean().optional(),
  acpx_enabled: z.boolean().optional(),
  self_modify_enabled: z.boolean().optional(),
  ask_execs_enabled: z.boolean().optional(),
  step_by_step_enabled: z.boolean().optional(),
}).strict().refine(value => value.multi_turn_enabled !== false || !(
  value.exec_report_enabled || value.acpx_enabled || value.ask_execs_enabled || value.step_by_step_enabled
), { message: "These execution options require Multi-Turn." });
const base = {
  computerId: z.number().int().positive().safe(),
  requestId: rcIdentity,
};
const binding = { ...base, bindingId: rcIdentity };
const empty = z.object({}).strict();
export const rcCommandInput = z.discriminatedUnion("operation", [
  z.object({ ...base, operation: z.literal("accounts.list"), payload: empty }).strict(),
  z.object({ ...binding, operation: z.literal("application.status"), payload: empty }).strict(),
  z.object({ ...binding, operation: z.literal("conversation.submit"), payload: z.object({
    text: z.string().trim().min(1).max(RC_COMMAND_LIMITS.promptCharacters).refine(
      value => new TextEncoder().encode(JSON.stringify(value)).length <= RC_COMMAND_LIMITS.promptJsonBytes,
      { message: "The prompt exceeds the native UTF-8 request limit." }),
    options: options.optional(),
  }).strict() }).strict(),
  z.object({ ...binding, operation: z.literal("operation.get"), payload: z.object({ operation_id: rcIdentity }).strict() }).strict(),
  z.object({ ...binding, operation: z.literal("conversation.cancel"), payload: z.object({ operation_id: rcIdentity }).strict() }).strict(),
  z.object({ ...binding, operation: z.literal("conversation.permission"), payload: z.object({
    operation_id: rcIdentity, request_id: z.string().min(1).max(128), decision: z.enum(["proceed", "deny"]),
  }).strict() }).strict(),
  z.object({ ...binding, operation: z.literal("conversation.history"), payload: empty }).strict(),
  z.object({ ...binding, operation: z.literal("response.content"), payload: z.object({
    ticket: z.string().min(1).max(4096), offset: z.number().int().min(0).max(8 * 1024 * 1024),
  }).strict() }).strict(),
]);
export type RcCommandInput = z.infer<typeof rcCommandInput>;
export type RcCommandOperation = RcCommandInput["operation"];

export const rcCommandResultInput = z.object({
  id: z.number().int().positive().safe(), request_id: rcIdentity, delivery_id: rcIdentity,
  sequence: z.number().int().positive().max(2147483647), status: z.enum(["running", "completed"]),
  ok: z.boolean(), result: z.unknown().optional(),
  error: z.object({ code: z.string().min(1).max(80), message: z.string().min(1).max(2000) }).strict().optional(),
}).strict().refine(value => value.ok ? !value.error : !!value.error, { message: "Failure results require an explicit error." });
export type RcCommandResultInput = z.infer<typeof rcCommandResultInput>;
export type RcCommandResponse = Pick<RcCommandResultInput, "ok" | "result" | "error">;

export type RcCommandEnvelope = {
  schema: typeof RC_COMMAND_SCHEMA;
  id: number;
  request_id: string;
  computer: { id: number; name: string };
  from: { site: "xaiht.org"; user_id: number; name: string | null };
  sent_at: string;
  expires_at: string;
  operation: RcCommandOperation;
  binding_id?: string;
  payload: RcCommandInput["payload"];
};
