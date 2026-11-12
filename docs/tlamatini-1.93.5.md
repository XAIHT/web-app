# Website refresh — Tlamatini 1.93.5

Tlamatini **1.93.5** is the latest released version in English and Spanish.
The public website presents that one version throughout its release labels,
downloads, source archives, metadata, and setup instructions.

## What changed

- Explain selection reads selected unsaved canvas text independently of chat checkboxes and the Live editor switch. It preserves the file, selection, and chat draft. Interactive tutoring remains a separate feature.
- Replies can keep playing while the page is covered or minimized. Browser speech remains first; a compatible Windows voice on the Tlamatini computer can recover interrupted playback. Talker and Whisperer retain their speech and listening roles.
- Executer returns captured output when a detached application’s launch script ends, while the application can remain open. Direct commands still wait for their own completion; this does not claim every task or response-delivery stall is resolved.
- Torrenter gains sortable, filtered, paged views saved for each account, clearer recovery details, and stable completed-download status. Stopping peer activity does not erase verified completion. Pausing, stopping, or cancelling a download ends a workflow’s wait for that download.
- Guided administrator creation uses Tlamatini’s native console, keeps passwords out of chat, and verifies the resulting account.

The update preserves the site’s layout, imagery, animation, navigation, and
paired English/Spanish content. Unreal Engine, Blender, STM32, ESP32, Talker,
and Whisperer remain prominent. The catalog stays at 87 agents, 68 wrapped
chat-agent launchers, 111 built-in Multi-Turn tools, and 29 skills.

## References

The copy follows both editions’ README, BookOfTlamatini, canvas-editing,
voice-playback, Torrenter, user-creation-wizard, and 12 November release notes.
Historical website release notes retain their original versions and dated evidence.

## Validation scope

Checks cover TypeScript, ESLint, existing content and API tests, the production
client/server build, and visible desktop/mobile views of the three public
routes in both languages. Download links are checked for the selected edition
and v1.93.5. Installer execution, Google sign-in, and remote asset availability
are outside this website-copy task.
