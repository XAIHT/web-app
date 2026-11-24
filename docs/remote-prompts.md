# Phone prompts through Tlachihuani

The signed-in `/tlamatini-rc` page sends prompts to a running Tlamatini account
and retrieves its answers through XT's existing outgoing website connection.
English and Spanish accounts remain distinct. Selecting a computer does not grant
access to every account on it.

## Recorded rollout and acceptance · 23 November

The matching website and native update were deployed and verified before phone
testing. The real isolated MySQL suite passed **7/7** and shut down cleanly. Source
integration passed **76/76** with one real model response per edition and separately
labelled deterministic control/storage cases. Anonymous headed production checks
passed **30/30** at 390px/320px in English/Spanish.

Angela confirmed a real English-account phone prompt/answer, persistence after
refreshing/reselecting the same account, and display of an actual Executer approval.
She then stopped tests; no phone Deny/no-execution or cancellation pass is claimed.
Netstat's no-dialog result is the intended read-only exemption and its runtime
request retained Ask Execs true. The source label/help correction passed
TypeScript, focused lint, **25/25** transport/response tests and the asset build.
Its separate cloud candidate succeeded but **was not promoted**. Do not equate
the source wording with the last deployed bundle.

Before release acceptance, review the saved but unrun executor/alias tests and
complete denied-action, cancellation, reconnect and account/edition checks when
Angela resumes testing. The detailed installed/source/phone evidence is in
Tlachihuani's `docs/verification/2026-11-23-hosted-prompts.md`. This documentation
pass neither deploys nor changes versions.

## Prepare the computer

1. Install the Tlachihuani version containing the executable website-command
   bridge and deploy the matching website client and backend together.
2. Start Remote-Controller in XT. Start Tlamatini normally, sign in to the intended
   local account, and enable that account's Remote-Controller integration.
3. Keep the existing XT → xaiht.org connection. Open its **Accounts…** dialog and
   check only the accounts that this website connection may control. Save.
4. On the signed-in website, select the computer, refresh accounts, and select the
   exact account and edition. Its state must be ready before sending a new prompt.

No incoming router port or public local-service listener is required. This feature
does not start Tlamatini, install services, or change the Windows login session.
Closing XT stops the website connection; a prompt already admitted to Tlamatini
may continue. Reconnect to retrieve its status, rather than sending it again.

## Use the phone interface

- Enter a prompt and choose Multi-Turn, execution-report and Ask-Execs options.
  Multi-Turn and Ask-Execs are enabled initially. The normal Tlamatini chat engine,
  account permissions, model configuration and execution checks remain in use.
- **Ask before protected actions** follows Tlamatini's existing Ask Execs policy.
  It does not request approval for every tool. Monitor Netstat and other read-only
  checks can run without asking; actions covered by that policy request approval.
- Read the status: queued, delivered, accepted, running, completed, cancelled,
  failed or outcome unknown. Delivery to XT is not a completed model answer.
- Review each requested action before choosing **Proceed** or **Deny**. A truncated
  permission description cannot be approved. Cancel requests cooperative
  cancellation through Tlamatini's existing mechanism; wait for its confirmation.
- If delivery cannot be confirmed, **Retry this same request** retains its request
  ID. Refreshing the page recovers active prompts and the latest 25 terminal
  prompts and receipts for the selected computer; it never automatically resubmits
  a prompt. A draft or uncertain submission requests a browser departure warning;
  browser policy controls whether that warning appears.
- A long answer may show a preview and **Retrieve complete answer**. That button
  retrieves bounded chunks, checks their order, length and SHA-256 digest, and
  displays the complete response as text. Returned HTML is never mounted as active
  page content. Expired or unavailable response tickets are reported as errors.
- **Connection diagnostics: test messages** preserves the earlier log-message
  test. Those messages, including their legacy `command` label, remain inert.

## Español: preparación y uso

Inicia Remote-Controller en XT y Tlamatini en la computadora. Inicia sesión en la
cuenta deseada y habilita su integración de Remote-Controller. En la conexión
**xaiht.org** de XT, abre **Accounts…**, marca las cuentas autorizadas y guarda.
En el teléfono, selecciona la computadora, actualiza las cuentas y elige el usuario
y la edición correctos. Envía la instrucción cuando la cuenta esté lista.

**Pedir permiso antes de acciones protegidas** aplica la política Ask Execs
existente de Tlamatini. No pide autorización para todas las herramientas:
Monitor Netstat y otras consultas de solo lectura pueden ejecutarse sin pedir
permiso. Las acciones incluidas en esa política solicitan autorización.

La página distingue la entrega de una instrucción de la respuesta de Tlamatini.
Puedes revisar y aprobar o denegar acciones, cancelar una instrucción y recuperar
una respuesta completa. Un reintento conserva el mismo identificador para evitar
ejecutar dos veces la misma instrucción. Recargar la página recupera el historial
reciente y las instrucciones activas; no vuelve a enviarlas automáticamente.
Cancelar solicita la cancelación cooperativa; espera a que Tlamatini la confirme.

## Transport, ownership and persistence

This connection uses ordinary HTTPS between XT and xaiht.org. The website handles
and stores prompt and response content. It is **not end-to-end encrypted and does
not implement the planned post-quantum transport**. The existing local-only/PQ
listener restrictions remain in place. Account access is a separate, explicit
local grant tied to the website origin, computer credential, website user and
immutable Tlamatini account binding. Revocation removes that grant; it cannot
undo actions that already completed.

Website commands use `xaiht.tlamatini-rc.command/1`, separately from inert log
messages. The browser uses authenticated same-origin `rcCommands` procedures.
Only an upgraded XT that advertises `X-Tlachihuani-Command-Protocol: 1` receives
commands from `/api/rc/poll`. It publishes bounded, sequenced receipts to
`/api/rc/result`. Old XT installations continue processing diagnostic messages
but cannot accidentally consume executable work.

The MySQL `rc_commands` table is created alongside the existing RC tables. Each
computer/request ID is unique. Publication, queue budgets, leases and result
updates use database transactions and row locks. A delivery lease lasts 60 seconds;
progress renews it. Dispatch expires after five minutes. Recovery checks the
durable local operation receipt before considering new execution. An unknown
outcome is not automatically retried as new work. Commands and replies persist
in the website database; removing the computer deletes its command rows through
the foreign key cascade. Completed local chat history remains owned by Tlamatini.

## Validation and deployment boundary

Run `npm run check`, `npm run lint`, `npm test` and `npm run build`. The local
`scripts/rc-local-server.ts` harness serves the real page and API on loopback with
an isolated signed-in test user and in-memory storage; it is never part of the
production server. Real MySQL transaction tests require an isolated test database.

Local browser/model checks do not prove Google sign-in, production Cloud SQL,
installed-service upgrades or a physical phone connection. After the matching
website and XT updates are deployed, complete a phone acceptance test: select the
intended account, send a fresh harmless prompt, verify the full answer, reload,
then check an approval denial and cancellation. Keep the original connection test
available for diagnosis.
