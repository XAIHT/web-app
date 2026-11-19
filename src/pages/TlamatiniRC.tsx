// Tlamatini-RC on xaiht.org — Angela López Mendoza · XAIHT
//
// Signed-in page: shows each computer connected through Tlachihuani and whether
// it is online right now, creates the key that connects a computer, and sends a
// JSON message that Tlachihuani writes to Tlachihuani.log. The page follows each
// message until Tlachihuani confirms the write.
import { useEffect, useMemo, useState } from 'react';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useT } from '@/i18n/context';
import { trpc } from '@/lib/trpc';
import {
  RC_LEVELS, RC_LIMITS, RC_TARGETS, RC_TTL_MINUTES, RC_TYPES, buildRcPayload,
  type RcLevel, type RcTarget, type RcType,
} from '@contracts/rc';

const card = 'rounded-lg border border-[#222] bg-[#111] p-6';
const field = 'w-full rounded-md border border-[#333] bg-[#0d0d0d] px-3 py-2 text-[#f0f0f0] outline-none focus:border-[#c9a96e]';
const label = 'mb-1 block text-sm text-[#aaa]';

function time(value: Date | string | null | undefined): string {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function TlamatiniRC() {
  const { user, isAuthenticated, isLoading } = useAuth({ redirectOnUnauthenticated: true });
  const t = useT();
  const r = t.rc;
  const utils = trpc.useUtils();
  const computers = trpc.rc.computers.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 3000 });
  const messages = trpc.rc.messages.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 2000 });

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [computerId, setComputerId] = useState<number | null>(null);
  const [target, setTarget] = useState<RcTarget>('tlachihuani');
  const [type, setType] = useState<RcType>('text');
  const [level, setLevel] = useState<RcLevel>('info');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [ttl, setTtl] = useState<number>(60);
  const [newName, setNewName] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const list = useMemo(() => computers.data ?? [], [computers.data]);
  // The chosen computer, or else the first online one, or else the first one.
  const chosen = list.find((c) => c.id === computerId) ?? list.find((c) => c.online) ?? list[0] ?? null;

  const add = trpc.rc.addComputer.useMutation({
    onSuccess: async (data) => {
      setNewKey(data.key); setCopied(false); setNewName('');
      await utils.rc.computers.invalidate();
      setComputerId(data.computer.id);
    },
    onError: (error) => setNotice(error.message),
  });
  const remove = trpc.rc.removeComputer.useMutation({
    onSuccess: async () => { await utils.rc.invalidate(); },
    onError: (error) => setNotice(error.message),
  });
  const send = trpc.rc.send.useMutation({
    onSuccess: async () => {
      setNotice(r.sent); setMessage(''); setSubject('');
      await utils.rc.messages.invalidate();
    },
    onError: (error) => setNotice(error.message),
  });

  const preview = useMemo(() => {
    const sentAt = new Date(now);
    return buildRcPayload({
      id: null, sentAt, expiresAt: new Date(now + ttl * 60_000),
      from: { userId: user?.id ?? 0, name: user?.name ?? null },
      computer: { id: chosen?.id ?? 0, name: chosen?.name ?? '' },
      target, type, level, subject, message,
    });
  }, [now, ttl, user, chosen, target, type, level, subject, message]);

  if (isLoading || !isAuthenticated) {
    return <div className="min-h-screen" style={{ background: '#0a0a0a' }}><Navigation /></div>;
  }

  const canSend = chosen !== null && message.trim().length > 0 && !send.isPending;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#f0f0f0' }}>
      <Navigation />
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-28" data-testid="rc-page">
        <span className="font-mono text-xs uppercase tracking-[0.15em]" style={{ color: '#c9a96e' }}>Tlamatini-RC</span>
        <h1 className="mb-3 mt-2 text-3xl font-bold">{r.title}</h1>
        <p className="mb-8 max-w-3xl text-[#999]">{r.intro}</p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <section className="flex flex-col gap-6">
            <div className={card} data-testid="rc-computers">
              <h2 className="mb-4 text-lg font-semibold">{r.computersTitle}</h2>
              {list.length === 0 && <p className="text-sm text-[#888]">{r.noComputers}</p>}
              <ul className="flex flex-col gap-3">
                {list.map((c) => {
                  const seenAgo = c.lastSeenAt ? Math.max(0, Math.round((now - new Date(c.lastSeenAt).getTime()) / 1000)) : null;
                  return (
                    <li key={c.id} className="rounded-md border border-[#2a2a2a] p-3" data-testid={`rc-computer-${c.id}`}
                      data-online={c.online ? 'true' : 'false'}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: c.online ? '#3ecf8e' : '#555', boxShadow: c.online ? '0 0 8px #3ecf8e' : 'none' }} />
                          <span className="truncate font-medium">{c.name}</span>
                        </div>
                        <span className="shrink-0 text-sm" style={{ color: c.online ? '#3ecf8e' : '#888' }} data-testid="rc-online-label">
                          {c.online ? r.online : c.everConnected ? r.offline : r.neverConnected}
                        </span>
                      </div>
                      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs text-[#888]">
                        <dt>{r.lastSeen}</dt><dd>{seenAgo === null ? r.never : `${time(c.lastSeenAt)} (${seenAgo}${r.secondsAgo})`}</dd>
                        {c.hostName && <><dt>{r.host}</dt><dd>{c.hostName}</dd></>}
                        {c.clientVersion && <><dt>{r.version}</dt><dd>{c.clientVersion}</dd></>}
                        {c.lastIp && <><dt>{r.address}</dt><dd>{c.lastIp}</dd></>}
                        <dt>{r.key}</dt><dd className="font-mono">…{c.keyHint}</dd>
                      </dl>
                      <button type="button" className="mt-2 text-xs text-[#c97a6e] hover:underline"
                        onClick={() => { if (window.confirm(r.removeConfirm)) remove.mutate({ id: c.id }); }}>{r.remove}</button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={card}>
              <h2 className="mb-4 text-lg font-semibold">{r.addTitle}</h2>
              <form className="flex flex-col gap-3" onSubmit={(event) => {
                event.preventDefault();
                if (newName.trim()) add.mutate({ name: newName.trim() });
              }}>
                <label className={label} htmlFor="rc-new-name">{r.addName}</label>
                <input id="rc-new-name" className={field} value={newName} maxLength={RC_LIMITS.computerName}
                  placeholder={r.addPlaceholder} onChange={(event) => setNewName(event.target.value)} />
                <button type="submit" className="xaiht-btn xaiht-btn-outline self-start" style={{ fontSize: '1rem' }}
                  disabled={!newName.trim() || add.isPending}>{r.addButton}</button>
              </form>
              {newKey && (
                <div className="mt-4 rounded-md border border-[#c9a96e] p-3" data-testid="rc-new-key">
                  <p className="mb-1 font-semibold" style={{ color: '#c9a96e' }}>{r.keyTitle}</p>
                  <code className="block break-all rounded bg-[#0d0d0d] p-2 font-mono text-sm" data-testid="rc-new-key-value">{newKey}</code>
                  <p className="mt-2 text-sm text-[#aaa]">{r.keyWarning}</p>
                  <div className="mt-3 flex gap-3">
                    <button type="button" className="xaiht-btn xaiht-btn-filled" style={{ fontSize: '0.95rem', padding: '0.5rem 1rem' }}
                      onClick={async () => { await navigator.clipboard.writeText(newKey); setCopied(true); }}>{copied ? r.copied : r.copy}</button>
                    <button type="button" className="xaiht-btn xaiht-btn-outline" style={{ fontSize: '0.95rem', padding: '0.5rem 1rem' }}
                      onClick={() => setNewKey(null)}>{r.done}</button>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className={card}>
            <h2 className="mb-4 text-lg font-semibold">{r.formTitle}</h2>
            <form className="grid gap-4 sm:grid-cols-2" data-testid="rc-form" onSubmit={(event) => {
              event.preventDefault();
              if (!canSend || chosen === null) return;
              setNotice(null);
              send.mutate({ computerId: chosen.id, target, type, level, subject, message, ttlMinutes: ttl });
            }}>
              <div>
                <label className={label} htmlFor="rc-computer">{r.computer}</label>
                <select id="rc-computer" className={field} value={chosen?.id ?? ''} disabled={list.length === 0}
                  onChange={(event) => setComputerId(Number(event.target.value))}>
                  {list.length === 0 && <option value="">{r.chooseComputer}</option>}
                  {list.map((c) => <option key={c.id} value={c.id}>{c.name} · {c.online ? r.online : r.offline}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="rc-target">{r.target}</label>
                <select id="rc-target" className={field} value={target} onChange={(event) => setTarget(event.target.value as RcTarget)}>
                  {RC_TARGETS.map((value) => <option key={value} value={value}>{r.targets[value]}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="rc-type">{r.type}</label>
                <select id="rc-type" className={field} value={type} onChange={(event) => setType(event.target.value as RcType)}>
                  {RC_TYPES.map((value) => <option key={value} value={value}>{r.types[value]}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="rc-level">{r.level}</label>
                <select id="rc-level" className={field} value={level} onChange={(event) => setLevel(event.target.value as RcLevel)}>
                  {RC_LEVELS.map((value) => <option key={value} value={value}>{r.levels[value]}</option>)}
                </select>
              </div>
              <div>
                <label className={label} htmlFor="rc-subject">{r.subject}</label>
                <input id="rc-subject" className={field} value={subject} maxLength={RC_LIMITS.subject}
                  onChange={(event) => setSubject(event.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="rc-ttl">{r.expires}</label>
                <select id="rc-ttl" className={field} value={ttl} onChange={(event) => setTtl(Number(event.target.value))}>
                  {RC_TTL_MINUTES.map((value) => <option key={value} value={value}>{r.ttl[value]}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={label} htmlFor="rc-message">{r.message}</label>
                <textarea id="rc-message" name="message" className={`${field} min-h-32 font-mono text-sm`} value={message}
                  maxLength={RC_LIMITS.message} placeholder={r.messagePlaceholder} onChange={(event) => setMessage(event.target.value)} />
                <p className="mt-1 text-xs text-[#666]">{r.targetNote}</p>
              </div>
              <div className="sm:col-span-2">
                <span className={label}>{r.preview}</span>
                <pre className="max-h-72 overflow-auto rounded-md border border-[#2a2a2a] bg-[#0d0d0d] p-3 font-mono text-xs text-[#cfc6b4]"
                  data-testid="rc-preview">{JSON.stringify(preview, null, 2)}</pre>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button type="submit" className="xaiht-btn xaiht-btn-filled" data-testid="rc-send" disabled={!canSend}
                  style={{ opacity: canSend ? 1 : 0.5, minWidth: '9rem' }}>{send.isPending ? r.sending : r.send}</button>
                {chosen && !chosen.online && <span className="text-sm text-[#d9a05b]">{r.offlineWarning}</span>}
                {notice && <span className="text-sm text-[#aaa]" data-testid="rc-notice">{notice}</span>}
              </div>
            </form>
          </section>
        </div>

        <section className={`${card} mt-6`} data-testid="rc-history">
          <h2 className="mb-4 text-lg font-semibold">{r.historyTitle}</h2>
          {(messages.data ?? []).length === 0 ? <p className="text-sm text-[#888]">{r.noHistory}</p> : (
            <ul className="flex flex-col divide-y divide-[#222]">
              {(messages.data ?? []).map((m) => {
                const color = m.status === 'acknowledged' ? '#3ecf8e' : m.status === 'expired' ? '#c97a6e' : '#d9a05b';
                const when = m.status === 'acknowledged' ? m.acknowledgedAt : m.status === 'delivered' ? m.deliveredAt : m.createdAt;
                return (
                  <li key={m.id} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:gap-4" data-testid={`rc-message-${m.id}`}
                    data-status={m.status}>
                    <span className="w-14 shrink-0 font-mono text-xs text-[#666]">#{m.id}</span>
                    <span className="w-24 shrink-0 text-xs text-[#888]">{time(m.createdAt)}</span>
                    <span className="w-32 shrink-0 truncate text-sm">{m.computerName}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-sm text-[#ccc]">{m.message}</span>
                    <span className="shrink-0 text-sm" style={{ color }}>{r.status[m.status]} {when ? `${r.at} ${time(when)}` : ''}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
