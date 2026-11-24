// Tlamatini-RC — Angela López Mendoza · XAIHT
// Decode untrusted relay results without executing returned HTML or URLs.
export type JsonObject = Record<string, unknown>;
export function object(value: unknown): JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as JsonObject : {};
}
export function text(value: unknown): string { return typeof value === 'string' ? value : ''; }
export function answerText(value: unknown): string {
  const answer = object(value);
  if (typeof answer.html === 'string' && answer.html) {
    // Parsing is inert. Only text reaches React; images, scripts and links never mount.
    const template = document.createElement('template');
    template.innerHTML = answer.html;
    template.content.querySelectorAll('script,style,template').forEach(node => node.remove());
    template.content.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
    template.content.querySelectorAll('p,div,li,h1,h2,h3,h4,pre,tr').forEach(node => node.append('\n'));
    return template.content.textContent?.trim() || text(answer.text);
  }
  return text(answer.text);
}
export function operationReceipt(value: unknown): JsonObject {
  const result = object(value);
  return typeof result.id === 'string' && typeof result.state === 'string' ? result : object(result.operation);
}
export function newRequestId(): string { return crypto.randomUUID().replaceAll('-', ''); }
export async function delay(ms: number, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted();
  await new Promise<void>((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}

/** Bounded, ordered byte assembly. Never concatenate partial UTF-8 strings. */
export class ResponseAssembly {
  private parts: Uint8Array[] = [];
  private expectedTotal: number | null = null;
  private expectedHash = '';
  offset = 0;
  done = false;
  add(value: unknown): void {
    const part = object(value);
    const total = part.total;
    const hash = text(part.sha256);
    if (this.done || part.encoding !== 'base64' || !Number.isSafeInteger(total) || typeof total !== 'number' || total < 1 || total > 8 * 1024 * 1024 ||
        part.offset !== this.offset || !/^[a-f0-9]{64}$/.test(hash) || typeof part.data !== 'string' ||
        part.data.length > 32768 || typeof part.done !== 'boolean') throw new Error('Invalid response chunk.');
    if (this.expectedTotal !== null && (total !== this.expectedTotal || hash !== this.expectedHash)) throw new Error('Response changed during download.');
    const bytes = Uint8Array.from(atob(part.data), char => char.charCodeAt(0));
    const next = this.offset + bytes.length;
    if (!bytes.length || next > total || part.next_offset !== next || part.done !== (next === total)) throw new Error('Incomplete response chunk.');
    this.expectedTotal = total;
    this.expectedHash = hash;
    this.parts.push(bytes);
    this.offset = next;
    this.done = part.done;
  }
  async finish(): Promise<unknown> {
    if (!this.done || this.expectedTotal !== this.offset) throw new Error('The full answer has not arrived.');
    const bytes = new Uint8Array(this.offset);
    let offset = 0;
    for (const part of this.parts) { bytes.set(part, offset); offset += part.length; }
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes));
    if (Array.from(digest, value => value.toString(16).padStart(2, '0')).join('') !== this.expectedHash) throw new Error('Answer integrity check failed.');
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  }
}
