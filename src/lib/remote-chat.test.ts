import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ResponseAssembly, operationReceipt } from './remote-chat';

function chunk(bytes: Buffer, offset = 0, length = bytes.length) {
  const next = Math.min(offset + length, bytes.length);
  return { encoding: 'base64', data: bytes.subarray(offset, next).toString('base64'), offset, next_offset: next,
    total: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), done: next === bytes.length };
}
describe('complete remote answers', () => {
  it('reassembles UTF-8 even when an emoji crosses chunk boundaries', async () => {
    const value = { text: 'Ángela 🌎 — respuesta completa', html: '<p>Ángela 🌎</p>' };
    const bytes = Buffer.from(JSON.stringify(value)); const assembly = new ResponseAssembly();
    while (!assembly.done) assembly.add(chunk(bytes, assembly.offset, 3));
    expect(await assembly.finish()).toEqual(value);
  });
  it('rejects reordered, repeated or missing chunks', async () => {
    const bytes = Buffer.from('{"text":"complete"}'); const assembly = new ResponseAssembly();
    expect(() => assembly.add(chunk(bytes, 3, 3))).toThrow();
    assembly.add(chunk(bytes, 0, 3));
    expect(() => assembly.add(chunk(bytes, 0, 3))).toThrow();
    await expect(assembly.finish()).rejects.toThrow();
  });
  it('rejects changed content, even when the total length is unchanged', () => {
    const bytes = Buffer.from('{"text":"one"}'); const other = Buffer.from('{"text":"two"}');
    const assembly = new ResponseAssembly(); assembly.add(chunk(bytes, 0, 3));
    expect(() => assembly.add(chunk(other, 3))).toThrow('changed');
  });
  it('checks the final digest instead of trusting the chunk labels', async () => {
    const bytes = Buffer.from('{"text":"one"}'); const assembly = new ResponseAssembly();
    assembly.add({ ...chunk(bytes), data: Buffer.from('{"text":"two"}').toString('base64') });
    await expect(assembly.finish()).rejects.toThrow('integrity');
  });
  it('bounds allocation and rejects false completion', () => {
    const bytes = Buffer.from('{"text":"x"}');
    expect(() => new ResponseAssembly().add({ ...chunk(bytes), total: 8 * 1024 * 1024 + 1 })).toThrow();
    expect(() => new ResponseAssembly().add({ ...chunk(bytes, 0, 2), done: true })).toThrow();
    expect(() => new ResponseAssembly().add({ ...chunk(bytes), data: '' })).toThrow();
  });
  it('extracts an operation receipt without treating a delivery acknowledgement as an answer', () => {
    expect(operationReceipt({ acknowledged: true })).toEqual({});
    expect(operationReceipt({ operation: { id: 'operation', state: 'running' } })).toEqual({ id: 'operation', state: 'running' });
  });
});
