// Tlamatini-RC — Angela López Mendoza · XAIHT
import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/i18n/context';
import { trpc } from '@/lib/trpc';
import { answerText, delay, newRequestId, object, operationReceipt, ResponseAssembly, text } from '@/lib/remote-chat';
import type { RcCommandInput } from '@contracts/rc-command';

const field = 'w-full rounded-md border border-[#444] bg-[#0d0d0d] px-3 py-2 text-[#f0f0f0] focus:border-[#c9a96e]';
const button = 'rounded-md border border-[#555] px-3 py-2 text-sm hover:border-[#c9a96e] disabled:cursor-not-allowed disabled:opacity-40';
const copy = {
  en: {
    title: 'Talk to Tlamatini', computer: 'Computer', account: 'Tlamatini account', refresh: 'Refresh accounts',
    setup: 'Start Tlamatini on your computer, enable its Remote-Controller account, then approve that account in XT → xaiht.org → Accounts.',
    empty: 'No approved account is available.', choose: 'Choose an account', loading: 'Reading accounts from XT…', online: 'XT connected', offline: 'XT offline',
    prompt: 'Your prompt', placeholder: 'What would you like Tlamatini to do?', send: 'Send prompt', sending: 'Submitting…',
    retry: 'Retry this same request', uncertain: 'Delivery could not be confirmed. Retry uses the same request ID and will not create a second prompt.',
    multi: 'Multi-Turn', ask: 'Ask before protected actions', report: 'Execution report', stop: 'Cancel prompt',
    askHelp: 'Tlamatini’s Ask Execs policy decides which actions need approval. Monitor Netstat and other read-only checks can run without asking.',
    active: 'Your prompts and answers', none: 'Your conversation will appear here.', approve: 'Proceed', deny: 'Deny',
    permission: 'Tlamatini needs your approval', permissionNote: 'Review the complete action before proceeding.',
    queue: 'Queued — waiting for XT', delivered: 'Delivered to XT', running: 'Tlamatini is working', completed: 'Completed', expired: 'Expired before execution',
    failed: 'Failed', cancelled: 'Cancelled', accepted: 'Accepted by Tlamatini', unknown: 'Outcome unknown — inspect before retrying',
    reconnecting: 'Reconnecting to Tlamatini — execution status is not yet confirmed',
    full: 'Retrieve complete answer', retrieving: 'Retrieving complete answer…', partial: 'Preview only. The complete answer is available below.',
    partialUnavailable: 'This answer was truncated; a complete copy was not provided. Check the desktop conversation.',
    timeout: 'No response from XT yet. Check the connection and that XT supports remote prompts; submitted work may still be running.',
    statusError: 'Could not refresh prompt status. The last observed result is shown.',
    transport: 'Uses the existing HTTPS connection to xaiht.org. The relay handles prompt and answer content; this is not end-to-end or post-quantum encryption.',
    limit: 'Up to 16,000 characters and 24,000 encoded bytes.', accountOffline: 'This Tlamatini account is not ready. Start it on your computer, then refresh accounts.',
    signed: 'Selected account', cancelQueued: 'Cancel queued prompt', controls: 'Prompt options',
  },
  es: {
    title: 'Habla con Tlamatini', computer: 'Computadora', account: 'Cuenta de Tlamatini', refresh: 'Actualizar cuentas',
    setup: 'Inicia Tlamatini en tu computadora, habilita su cuenta de Remote-Controller y autoriza esa cuenta en XT → xaiht.org → Accounts.',
    empty: 'No hay cuentas autorizadas disponibles.', choose: 'Elige una cuenta', loading: 'Consultando las cuentas de XT…', online: 'XT conectado', offline: 'XT sin conexión',
    prompt: 'Tu instrucción', placeholder: '¿Qué quieres que haga Tlamatini?', send: 'Enviar instrucción', sending: 'Enviando…',
    retry: 'Reintentar la misma solicitud', uncertain: 'No se pudo confirmar la entrega. El reintento conserva el identificador y no crea otra instrucción.',
    multi: 'Multi-Turn', ask: 'Pedir permiso antes de acciones protegidas', report: 'Informe de ejecución', stop: 'Cancelar instrucción',
    askHelp: 'La política Ask Execs de Tlamatini determina qué acciones requieren autorización. Monitor Netstat y otras consultas de solo lectura pueden ejecutarse sin pedir permiso.',
    active: 'Tus instrucciones y respuestas', none: 'Tu conversación aparecerá aquí.', approve: 'Continuar', deny: 'Denegar',
    permission: 'Tlamatini necesita tu autorización', permissionNote: 'Revisa la acción completa antes de continuar.',
    queue: 'En cola — esperando a XT', delivered: 'Entregada a XT', running: 'Tlamatini está trabajando', completed: 'Completada', expired: 'Caducó antes de ejecutarse',
    failed: 'Falló', cancelled: 'Cancelada', accepted: 'Aceptada por Tlamatini', unknown: 'Resultado desconocido — revisa antes de reintentar',
    reconnecting: 'Reconectando con Tlamatini — el estado de ejecución aún no está confirmado',
    full: 'Obtener respuesta completa', retrieving: 'Obteniendo la respuesta completa…', partial: 'Sólo vista previa. Puedes obtener la respuesta completa abajo.',
    partialUnavailable: 'La respuesta está truncada y no incluye una copia completa. Revisa la conversación en la computadora.',
    timeout: 'XT aún no responde. Revisa la conexión y que XT admita instrucciones remotas; el trabajo enviado podría seguir en ejecución.',
    statusError: 'No se pudo actualizar el estado. Se muestra el último resultado recibido.',
    transport: 'Usa la conexión HTTPS existente con xaiht.org. El servidor intermediario procesa instrucciones y respuestas; no es cifrado de extremo a extremo ni poscuántico.',
    limit: 'Hasta 16,000 caracteres y 24,000 bytes codificados.', accountOffline: 'Esta cuenta de Tlamatini no está lista. Iníciala en tu computadora y actualiza las cuentas.',
    signed: 'Cuenta seleccionada', cancelQueued: 'Cancelar instrucción en cola', controls: 'Opciones de la instrucción',
  },
};
type Account = { id: string; display_name: string; edition: string; application_state: string };
type Computer = { id: number; name: string; online: boolean };
type Rpc = (input: RcCommandInput, signal: AbortSignal) => Promise<unknown>;

function CompleteAnswer({ answer, computerId, bindingId, rpc }: { answer: unknown; computerId: number; bindingId: string; rpc: Rpc }) {
  const { lang } = useLanguage(); const c = copy[lang];
  const value = object(answer); const ticket = text(value.content_ticket);
  const [full, setFull] = useState<string | null>(null);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function retrieve() {
    controller.current?.abort(); const current = new AbortController(); controller.current = current;
    setBusy(true); setError('');
    try {
      const assembly = new ResponseAssembly();
      while (!assembly.done) {
        const part = await rpc({ computerId, bindingId, requestId: newRequestId(), operation: 'response.content', payload: { ticket, offset: assembly.offset } }, current.signal);
        assembly.add(part);
      }
      const result = await assembly.finish(); current.signal.throwIfAborted(); setFull(answerText(result));
    } catch (failure) { if (!current.signal.aborted) setError(failure instanceof Error ? failure.message : String(failure)); }
    finally { if (!current.signal.aborted) setBusy(false); }
  }
  return <div>
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed" data-testid="rc-answer">{full ?? answerText(value)}</div>
    {full === null && (ticket || value.truncated === true) && <p className="mt-3 text-sm text-amber-200">{ticket ? c.partial : c.partialUnavailable}</p>}
    {ticket && full === null && <button type="button" className={`${button} mt-2`} disabled={busy} onClick={() => void retrieve()}>{busy ? c.retrieving : c.full}</button>}
    {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
  </div>;
}

export default function RemoteChat({ computer, computers, onComputerChange, onPendingChange }: {
  computer: Computer; computers: Computer[]; onComputerChange: (id: number) => void; onPendingChange: (pending: boolean) => void;
}) {
  const { lang } = useLanguage(); const c = copy[lang]; const utils = trpc.useUtils();
  const [chosenBinding, setBindingId] = useState(''); const [notice, setNotice] = useState('');
  const [prompt, setPrompt] = useState(''); const [multi, setMulti] = useState(true); const [ask, setAsk] = useState(true); const [report, setReport] = useState(true);
  const [sending, setSending] = useState(false); const [attempt, setAttempt] = useState<RcCommandInput | null>(null);
  const [controlBusy, setControlBusy] = useState<string | null>(null);
  const controls = useRef(new Set<AbortController>());
  const recent = trpc.rcCommands.recent.useQuery({ computerId: computer.id }, { refetchInterval: 2000 });
  const rpc = useCallback<Rpc>(async (input, signal) => {
    signal.throwIfAborted();
    await utils.client.rcCommands.send.mutate(input);
    const deadline = Date.now() + 90_000;
    while (Date.now() < deadline) {
      signal.throwIfAborted();
      const result = await utils.client.rcCommands.get.query({ computerId: input.computerId, requestId: input.requestId });
      if (result?.status === 'completed') {
        if (!result.response?.ok) throw new Error(result.response?.error?.message || 'The remote request failed.');
        return result.response.result;
      }
      if (result?.status === 'expired') throw new Error('The remote request expired before execution.');
      await delay(500, signal);
    }
    throw new Error(c.timeout);
  }, [utils.client, c.timeout]);
  useEffect(() => { const active = controls.current; return () => { for (const controller of active) controller.abort(); }; }, []);
  useEffect(() => {
    if (!attempt && !prompt) return;
    const protectDraft = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', protectDraft);
    return () => window.removeEventListener('beforeunload', protectDraft);
  }, [attempt, prompt]);

  const accountQuery = useQuery({
    queryKey: ['rcApprovedAccounts', computer.id], enabled: computer.online, retry: false, refetchOnWindowFocus: false, refetchInterval: 30_000,
    queryFn: async ({ signal }): Promise<Account[]> => {
      const result = object(await rpc({ computerId: computer.id, requestId: newRequestId(), operation: 'accounts.list', payload: {} }, signal));
      return (Array.isArray(result.accounts) ? result.accounts : []).map(object).filter(value => /^[a-f0-9]{32}$/.test(text(value.id))).map(value => ({
        id: text(value.id), display_name: text(value.display_name), edition: text(value.edition), application_state: text(value.application_state),
      }));
    },
  });
  const accounts = accountQuery.data ?? [];
  // A refresh/revocation must never silently retarget an existing draft.
  const bindingId = chosenBinding;
  const selected = accounts.find(account => account.id === bindingId);
  const loading = accountQuery.isFetching;

  async function submit() {
    if (sending || !bindingId || (!attempt && !prompt.trim())) return;
    const input: RcCommandInput = attempt ?? { computerId: computer.id, bindingId, requestId: newRequestId(), operation: 'conversation.submit', payload: {
      text: prompt.trim(), options: { multi_turn_enabled: multi, ask_execs_enabled: multi && ask, exec_report_enabled: multi && report },
    } };
    onComputerChange(computer.id); onPendingChange(true);
    setAttempt(input); setSending(true); setNotice('');
    try {
      await utils.client.rcCommands.send.mutate(input);
      setAttempt(null); setPrompt(''); onPendingChange(false); await recent.refetch();
    } catch (failure) {
      const code = text(object(object(failure).data).code);
      if (['BAD_REQUEST', 'FORBIDDEN', 'NOT_FOUND', 'UNAUTHORIZED', 'TOO_MANY_REQUESTS'].includes(code)) { setAttempt(null); onPendingChange(false); }
      setNotice(`${code ? '' : `${c.uncertain} `}${failure instanceof Error ? failure.message : String(failure)}`);
    }
    finally { setSending(false); }
  }
  async function control(operation: 'conversation.cancel' | 'conversation.permission', operationId: string, requestId?: string, decision?: 'proceed' | 'deny') {
    const controller = new AbortController(); controls.current.add(controller); setControlBusy(operationId); setNotice('');
    try {
      const input: RcCommandInput = operation === 'conversation.cancel'
        ? { computerId: computer.id, bindingId, requestId: newRequestId(), operation, payload: { operation_id: operationId } }
        : { computerId: computer.id, bindingId, requestId: newRequestId(), operation, payload: { operation_id: operationId, request_id: requestId!, decision: decision! } };
      const result = operationReceipt(await rpc(input, controller.signal));
      await recent.refetch();
      if (result.state !== 'succeeded') throw new Error(text(result.error) || c.unknown);
    } catch (failure) { if (!controller.signal.aborted) setNotice(failure instanceof Error ? failure.message : String(failure)); }
    finally { controls.current.delete(controller); if (!controller.signal.aborted) setControlBusy(null); }
  }
  async function cancelQueued(requestId: string) {
    setControlBusy(requestId); setNotice('');
    try { await utils.client.rcCommands.cancelQueued.mutate({ computerId: computer.id, requestId }); await recent.refetch(); }
    catch (failure) { setNotice(failure instanceof Error ? failure.message : String(failure)); }
    finally { setControlBusy(null); }
  }
  const promptBytes = new TextEncoder().encode(JSON.stringify(prompt.trim())).length;
  const canSend = !sending && (!!attempt || (!!selected && selected.application_state === 'ready' && prompt.trim().length > 0 && promptBytes <= 24000));
  const rows = (recent.data ?? []).filter(row => row.bindingId === bindingId).slice().reverse();
  return <section className="min-w-0 rounded-lg border border-[#444] bg-[#111] p-4 sm:p-6" data-testid="rc-chat">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-semibold">{c.title}</h2>
      <span className={`text-sm ${computer.online ? 'text-emerald-300' : 'text-amber-200'}`}>{computer.online ? c.online : c.offline}</span></div>
    <label className="mb-1 block text-sm text-[#aaa]" htmlFor="chat-computer">{c.computer}</label>
    <select id="chat-computer" className={field} value={computer.id} disabled={sending || !!attempt} onChange={event => onComputerChange(Number(event.target.value))}>
      {computers.map(value => <option key={value.id} value={value.id}>{value.name}</option>)}
    </select>
    <div className="mt-4 flex flex-wrap items-end gap-2"><div className="min-w-0 flex-1">
      <label className="mb-1 block text-sm text-[#aaa]" htmlFor="chat-account">{c.account}</label>
      <select id="chat-account" className={field} value={selected ? bindingId : ''} disabled={!accounts.length || !!attempt || sending} onChange={event => { onComputerChange(computer.id); setBindingId(event.target.value); }}>
        <option value="">{accounts.length ? c.choose : loading ? c.loading : c.empty}</option>
        {accounts.map(value => <option key={value.id} value={value.id}>{value.display_name} · {value.edition} · {value.application_state}</option>)}
      </select></div><button className={button} type="button" onClick={() => void accountQuery.refetch()} disabled={loading}>{c.refresh}</button></div>
    {accountQuery.error && <p role="alert" className="mt-3 text-sm text-amber-200">{accountQuery.error.message}</p>}
    <p className="mt-3 text-xs leading-relaxed text-[#aaa]">{c.setup}</p>
    {selected && <p className="mt-4 text-sm" data-testid="rc-selected-account">{c.signed}: <strong className="text-[#c9a96e]">{selected.display_name}</strong> · {selected.edition}</p>}
    {selected && selected.application_state !== 'ready' && <p className="mt-2 text-sm text-amber-200">{c.accountOffline}</p>}
    <form className="mt-4" onSubmit={event => { event.preventDefault(); if (canSend) void submit(); }}>
      <label className="mb-2 block text-sm" htmlFor="chat-prompt">{c.prompt}</label>
      <textarea id="chat-prompt" className={`${field} min-h-32 resize-y`} placeholder={c.placeholder} value={prompt} maxLength={16000}
        disabled={!!attempt || sending} onChange={event => setPrompt(event.target.value)} />
      <p className={`mt-1 text-xs ${promptBytes > 24000 ? 'text-red-300' : 'text-[#999]'}`}>{c.limit}</p>
      <fieldset className="my-4 flex flex-wrap gap-x-5 gap-y-3 text-sm" disabled={!!attempt || sending}>
        <legend className="sr-only">{c.controls}</legend>
        <label className="flex items-center gap-2"><input type="checkbox" checked={multi} onChange={event => setMulti(event.target.checked)} />{c.multi}</label>
        <label className="flex items-center gap-2"><input type="checkbox" aria-describedby="rc-ask-policy" checked={multi && ask} disabled={!multi} onChange={event => setAsk(event.target.checked)} />{c.ask}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={multi && report} disabled={!multi} onChange={event => setReport(event.target.checked)} />{c.report}</label>
      </fieldset>
      <p id="rc-ask-policy" data-testid="rc-ask-policy" className="mb-4 text-xs leading-relaxed text-[#aaa]">{c.askHelp}</p>
      <button type="submit" className="xaiht-btn xaiht-btn-filled disabled:opacity-40" data-testid="rc-prompt-send" disabled={!canSend}>{sending ? c.sending : attempt ? c.retry : c.send}</button>
    </form>
    {notice && <p role="alert" className="mt-4 break-words text-sm text-amber-200" data-testid="rc-chat-notice">{notice}</p>}
    <section className="mt-7 border-t border-[#333] pt-5" aria-label={c.active}>
      <h3 className="mb-4 font-semibold">{c.active}</h3>
      {recent.error && <p role="alert" className="text-amber-200">{c.statusError}</p>}
      {!rows.length && <p className="text-sm text-[#999]">{c.none}</p>}
      <div className="flex flex-col gap-5">{rows.map(row => {
        const receipt = operationReceipt(row.response?.result); const progress = object(receipt.progress); const permission = object(receipt.pending_permission);
        const operationId = text(receipt.id); const state = text(receipt.state);
        const final = object(receipt.result); const answer = Object.keys(final).length ? final : progress.type === 'message' ? progress : null;
        const done = row.status === 'completed' || row.status === 'expired';
        const status = object(row.response?.result).relay_state === 'reconnecting' ? c.reconnecting : row.response?.error?.code === 'cancelled_before_dispatch' ? c.cancelled : row.response?.ok === false ? c.failed : state === 'outcome_unknown' ? c.unknown : state === 'failed' ? c.failed
          : final.cancelled === true || state === 'cancelled' ? c.cancelled : state === 'succeeded' ? c.completed : state === 'running' ? c.running : state === 'accepted' ? c.accepted
          : row.status === 'queued' ? c.queue : row.status === 'delivered' ? c.delivered : row.status === 'expired' ? c.expired : row.status === 'running' ? c.running : c.completed;
        return <article key={row.requestId} className="min-w-0 rounded-lg border border-[#333] p-4" data-testid="rc-conversation" data-status={state || row.status}>
          <p className="whitespace-pre-wrap break-words text-sm text-[#c9a96e]">{text(object(row.payload).text)}</p>
          <p className="my-3 text-xs text-[#aaa]" role="status">{status}</p>
          {row.response?.error && <p role="alert" className="break-words text-sm text-red-300">{row.response.error.message}</p>}
          {!!receipt.error && <p role="alert" className="break-words text-sm text-red-300">{text(receipt.error)}</p>}
          {answer && <CompleteAnswer key={`${row.requestId}:${text(answer.content_ticket)}:${done}`} answer={answer} computerId={computer.id} bindingId={bindingId} rpc={rpc} />}
          {text(permission.request_id) && !permission.decision && !done && <div className="mt-4 rounded border border-amber-700 p-3" data-testid="rc-permission">
            <h4 className="font-semibold text-amber-200">{c.permission}</h4><p className="my-2 text-xs text-[#bbb]">{c.permissionNote}</p>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-xs">{Object.entries(permission).filter(([key]) => ['tool_name', 'agent_display', 'kind', 'program', 'shell', 'parameters'].includes(key)).map(([key, value]) => `${key}: ${text(value)}`).join('\n')}</pre>
            <div className="mt-3 flex gap-3"><button type="button" className={button} disabled={controlBusy !== null || permission.truncated === true}
              onClick={() => void control('conversation.permission', operationId, text(permission.request_id), 'proceed')}>{c.approve}</button>
              <button type="button" className={button} disabled={controlBusy !== null} onClick={() => void control('conversation.permission', operationId, text(permission.request_id), 'deny')}>{c.deny}</button></div>
          </div>}
          {!done && operationId && <button type="button" className={`${button} mt-3`} disabled={controlBusy !== null} onClick={() => void control('conversation.cancel', operationId)}>{c.stop}</button>}
          {row.status === 'queued' && <button type="button" className={`${button} mt-3`} disabled={controlBusy !== null} onClick={() => void cancelQueued(row.requestId)}>{c.cancelQueued}</button>}
        </article>;
      })}</div>
    </section>
    <p className="mt-6 border-t border-[#333] pt-4 text-xs leading-relaxed text-[#999]">{c.transport}</p>
  </section>;
}
