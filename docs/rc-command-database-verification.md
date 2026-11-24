# Remote commands: durable database verification

The ordinary test suite exercises the typed JSON contract, authenticated ownership,
same-origin mutations, queue limits, cancellation and lease/result ordering with an
in-memory store. Those tests are not evidence of MySQL transaction behavior.

`api/rc/command.mysql.test.ts` is a separate, opt-in integration suite that executes
the production MySQL store against a real local MySQL server. It covers concurrent
idempotent submission, complete payload publication, concurrent polling, owner
isolation, persistent answer retrieval, duplicate result acknowledgements, lease
rotation, queue capacity, cancellation/delivery races and foreign-key revocation.

## Completed real-database run · 23 November

The opt-in suite passed **7/7** against isolated MySQL **8.4.13**, using
application-owned scratch and loopback port 13316. The test schema was dropped
and the owned server stopped. Production Cloud SQL was not used for this suite.
Evidence is retained in the shared `artifacts/rc-rollout-20261123` directory as
`mysql-latest-result.json` and `mysql-qa-3b0058db/vitest.json`.

These results establish the tested transaction and persistence cases. They do
not certify denial/no-execution, phone cancellation or tool policy. Those checks
have separate evidence in [remote prompts](remote-prompts.md).

## Running locally

Use an existing, dedicated MySQL 8 test instance bound to loopback. The test account
needs permission to create and drop test databases. No production database or
Cloud SQL connection is used. Do not install or download a database image simply
to run the ordinary unit tests.

In a visible PowerShell window at the website root, set `RC_MYSQL_TEST_URL` to that
local instance, then run:

```powershell
$env:RC_MYSQL_TEST_URL = 'mysql://TEST_USER:TEST_PASSWORD@127.0.0.1:3306/'
npx vitest run api/rc/command.mysql.test.ts --reporter=verbose
Remove-Item Env:RC_MYSQL_TEST_URL
```

Replace the placeholders with the dedicated test account. Do not paste real
credentials into reports, screenshots or committed files. The suite rejects remote
hosts and URL query parameters, ignores the database name in the supplied URL,
creates a fresh `xaiht_rc_qa_<random>` database and drops that exact database during
teardown. It never falls back to the application's `DATABASE_URL`. If execution is
forcibly terminated, the isolated schema may remain; remove only the corresponding
`xaiht_rc_qa_` schema after confirming no verification process is using it.

Without `RC_MYSQL_TEST_URL`, these tests are explicitly skipped. A skipped database
suite must be reported as not run, even if the in-memory tests and website build pass.

No model, phone or native service is simulated as part of a successful MySQL result:
this suite proves persistence and transaction behavior, not a complete live prompt.
