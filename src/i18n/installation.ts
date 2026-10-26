import { editions, type Lang } from './editions';

// Commands and model identifiers remain literal; explanatory text follows the edition.
export function installationSteps(lang: Lang): Record<string, string> {
  const edition = editions[lang];
  const english = {
    install_tlamatini: `# Option A: Tlamatini ${edition.tag} Windows installer
${edition.releaseUrl}
# Download the Windows 11 x64 release asset:
# ${edition.installerName}
${edition.installerUrl}
# Choose this ZIP, not GitHub's Source code archives.
# Extract the complete ZIP, run Installer.exe,
# choose a destination, review, and click Install.
# Keep pkg.zip beside Installer.exe.
# Setup verifies a recovery copy before changing files.
# Errors stay visible with Retry, Change folder, and a log path.
# Launch Tlamatini from the desktop shortcut:
http://127.0.0.1:8000/
# Login: user / changeme; change the password immediately.
# If 8000 is reserved, set django_port in config.json.
# Updating later: About -> Check for updates
# The in-app updater keeps your existing Uninstaller.exe.
# Run the new Installer to refresh the uninstaller too.
# It keeps your Templates and documents, not Temp scratch.

# Option B: run Tlamatini ${edition.tag} from source
# Requires Python 3.12.10.
# Download and extract the ${edition.tag} source ZIP:
${edition.sourceUrl}
# From the folder where you extracted the ZIP:
cd ${edition.sourceFolder}
$env:TLAMATINI_VERSION = '${edition.version}'
python -m venv venv
.\\venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\venv\\Scripts\\python.exe Tlamatini/manage.py migrate
.\\venv\\Scripts\\python.exe Tlamatini/manage.py createsuperuser
.\\venv\\Scripts\\python.exe Tlamatini/manage.py runserver --noreload
# --noreload is optional; an explicit port also wins:
.\\venv\\Scripts\\python.exe Tlamatini/manage.py runserver 9100`,
    install_ollama: "# Install Ollama for Windows\nhttps://ollama.com/download\n# Ollama serves embedding, reasoning, and vision.\n# Local speech and direct cloud speech/Claude\n# use their own backends.",
    sign_in_ollama: "ollama signin",
    download_models: "# Local embedding model\nollama pull nomic-embed-text\n\n# Current cloud reasoning and vision defaults\nollama pull glm-5.3:cloud\nollama pull mistral-large-3:675b-cloud\nollama pull gemma4:cloud",
    configure_models: "# In the Tlamatini navbar:\nConfig -> Configure MCPs\nConfig -> Configure Agents\nConfig -> Models\n# Choose among 38 settings in six categories:\n# Core, Vision, Speech, Workflows, Documents,\n# and Monitoring & messaging.\n# Models must support their assigned role.\n# Lists models from each configured Ollama server.\n# Compact mode is a toolbar switch.\n# It clears Configure choices except live metrics,\n# file search, and time. Tick back what you need.\n# Saved Configure choices apply without a restart.\n# Each row shows its estimated token cost.\n# Small models lock Compact ON; bigger ones unlock\n# it without changing your picks. OFF enables all\n# rows and restores previously active External MCPs.\n# CONTEXT-WINDOW warns when a request was cut.\n# Self-modify includes self-knowledge\n# only when ON and the model can hold it.\n# Shown in source runs or --self-modify builds.\n# Save opens the live Model Brain Auto-tuning dialog.\n# See model-specific settings and their sources.\n# Your overrides win; learned profiles survive updates.\n# Save does not download models.\n# Then reconnect chat when prompted and\n# restart active agents to use the new models.\n# Agent fields set to \"@config\" inherit globals;\n# explicit model choices remain overrides.\n\nConfig -> Access Keys Wizard\n# Local Ollama: leave token blank.\n# Remote Ollama: paste the Ollama token.\n# Add any cloud-CLI keys, then click Save.\n\nConfig -> Voice\n# Optionally tune her animated browser voice,\n# answer reading, completion notice, or silence.\n\nConfig -> Mic\n# Choose Send automatically (default), or\n# Keep in the chat input to review before Send.\n# Select the HOST input, gain, gate and language.\n# Advanced: sample rate, channels, beam and VAD.\n# Preferences stay in this browser; Save applies\n# to the next recording. Reset + Save inherits.\n# Config -> Models -> Speech sets the recognizer.\n# Mic beside Send starts capture; wait for Listening.\n# A second click or Escape cancels dictation.\n# Mic preserves the draft and current chat modes.\n\nAbout -> Usage\n# Cloud credits, Chat activity, and Models.\n# Inspect reported balances and refill weeks/date.\n# Choose 7 or 30 days for recorded activity.\n# The monthly balance is separate from this range.\n# Local model totals cover recorded chat calls,\n# not earlier history, external apps, or child agents.\n# Refresh works while Tlamatini answers.\n# Missing data is explained, never assumed to be zero.\n\nPanels -> Agentic Control Panel\n# Design and save agent workflows as .flw.\nPanels -> Prompt Flow Panel\n# Design prompt conversations as .fpmt.\n# User Input asks; User Commentary is a static note.\n# Format and resize notes; resize Run output too.\n# Windows or chat opens either format in its editor.\n# Validate, then Play; opening never runs a file.\n# Keep the page and app open for scheduled steps.\n\n# Optional: LaTeXer PDF compilation needs TeX.\n# MiKTeX is recommended:\nhttps://miktex.org/download\n\n# Live Editor and guided learning:\n# Open or drop text, code, JSON, or Markdown.\n# Save As chooses a project folder on this computer.\n# Save checks disk revisions; conflicts are refused.\n# Save before closing: unsaved edits stay in memory.\n# PDF stays read-only; Save exports an original copy.\n# For tutoring, enable Multi-Turn, Interactor in\n# Config -> Configure MCPs/Tools, and Live editor.\n# Ask her to teach a file one segment at a time.\n# Continue, Another hint, and Explain selection\n# use your live buffer. Typing is not saving.\n# In a terminal lesson, say you will run commands:\n# Terminater leaves Enter to you until you hand back.\n\n# Personalize teaching, terminals, and narration:\nConfig -> Live Editor & Terminater\n# Also available from canvas/terminal Settings\n# in chat, Agentic Control Panel, and Prompt Flow Panel.\n# Tabs: Live Editor, Terminater, Voice.\n# Standard / Guided learning fill a draft.\n# Preview runs no commands, edits no files, saves nothing.\n# Save applies behavior to the next action.\n# Cancel / Escape discard unsaved settings.\n# Opening settings stops active editor teaching.\n# Behavior follows your account; appearance stays\n# with this account in the current browser.\n# Editor: 40-160 WPM, pauses 0-3 seconds, detail,\n# suggestions, ghost text/choices, cursor following.\n# Link editor and terminal speeds at 40-160 WPM.\n# Terminal: 20-160 WPM; choose an available shell,\n# advisor, command wait, silence and handoff waits.\n# I always press Enter keeps execution manual\n# across chat and both workflow panels.\n# Shell/advisor defaults affect new terminals.\n# A wait timeout does not kill the running process.\n# New flow nodes use Use my defaults; older flows\n# retain explicit values. Manual Enter and narration\n# remain account choices in either mode.\n# Voice: explanation, command/code, or both;\n# before, during, or after typing. Optionally wait\n# for before-typing narration to finish first.\n# Choose errors/input, all outcomes, or no notices.\n# Uses Config -> Voice, not the Talker agent.\n# Mute/listening override narration; Esc stops speech.\n# Secret-marked text and private input stay unspoken.\n# Missing voice offers Continue without voice or Stop.\n# Appearance: 12-24 px fonts, line numbers/wrap,\n# terminal cursor shape/blink and preferred layout.\n\n# Tick Multi-Turn and open Catalog of prompts to begin.",
  };
  if (lang === 'en') return english;
  return {
    install_tlamatini: `# Opción A: instalador de Tlamatini en español ${edition.tag}
${edition.releaseUrl}
# Descarga el ZIP de Windows 11 x64:
# ${edition.installerName}
${edition.installerUrl}
# Este es el instalador, no el archivo de código fuente.
# Extrae el ZIP completo; conserva pkg.zip junto a Installer.exe.
# Abre Installer.exe, elige la carpeta, revisa y pulsa Instalar.
# La instalación verifica una copia de recuperación antes de cambiar archivos.
# Si falla, muestra Reintentar, Cambiar carpeta y la ruta del registro.
# Abre la aplicación desde su acceso directo.
# El navegador abre la dirección local configurada.
# Usuario inicial: user / changeme; cambia la contraseña de inmediato.
# Actualizaciones: Acerca de -> Buscar actualizaciones.
# El actualizador conserva tu Uninstaller.exe.
# Ejecuta el nuevo Installer para renovar también el desinstalador.
# Conserva Templates y documentos, no los temporales de Temp.

# Opción B: ejecutar Tlamatini en español ${edition.tag} desde el código fuente
# Requiere Python 3.12.10.
# Descarga y extrae el ZIP de código de esta edición:
${edition.sourceUrl}
# Desde la carpeta donde extrajiste el ZIP:
cd ${edition.sourceFolder}
$env:TLAMATINI_VERSION = '${edition.version}'
python -m venv venv
.\\venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\venv\\Scripts\\python.exe Tlamatini/manage.py migrate
.\\venv\\Scripts\\python.exe Tlamatini/manage.py createsuperuser
.\\venv\\Scripts\\python.exe Tlamatini/manage.py runserver --noreload
# Inicia sesión con la cuenta que acabas de crear.
# --noreload es opcional; puedes indicar un puerto libre:
.\\venv\\Scripts\\python.exe Tlamatini/manage.py runserver 9100
# django_port en config.json configura el puerto predeterminado.`,
    install_ollama: '# Instala Ollama para Windows\nhttps://ollama.com/download\n# Sirve modelos de embeddings, razonamiento y visión.\n# La voz local y los servicios directos de nube usan sus propios motores.',
    sign_in_ollama: 'ollama signin',
    download_models: '# Modelo local de embeddings\nollama pull nomic-embed-text\n\n# Modelos predeterminados de razonamiento y visión en la nube\nollama pull glm-5.3:cloud\nollama pull mistral-large-3:675b-cloud\nollama pull gemma4:cloud',
    configure_models: "# En el menú de Tlamatini en español:\nConfig -> Configurar MCPs\nConfig -> Configurar Agents\nConfig -> Modelos\n# Elige modelos para razonamiento, visión, voz, flujos y documentos.\n# Deben admitir la función asignada; los nombres de modelo no se traducen.\n# Config muestra los modelos de cada servidor Ollama configurado.\n# Compact mode permite elegir las herramientas que recibe el modelo.\n# Cada fila indica su costo estimado en tokens.\n# Los modelos pequeños requieren Compact; los grandes permiten desactivarlo.\n# Tus elecciones se conservan. Revisa los avisos de CONTEXT-WINDOW.\n# Self-modify agrega autoconocimiento cuando está activo y cabe en el contexto.\n# Guardar abre el ajuste del Model Brain; no descarga los modelos.\n# Tus ajustes tienen prioridad; los perfiles aprendidos sobreviven a las actualizaciones.\n# Reconecta el chat cuando se solicite y reinicia los agentes activos.\n# Los campos @config heredan valores globales; las elecciones explícitas prevalecen.\n\nConfig -> Access Keys Wizard\n# Ollama local: deja el token vacío.\n# Ollama remoto: introduce su token.\n# Agrega las claves de los servicios externos que usarás y guarda.\n\nConfig -> Voz\n# Ajusta la voz del navegador, la lectura de respuestas y los avisos.\n# Talker genera voz por separado: su modelo se configura en Modelos.\n\nConfig -> Mic\n# Elige Enviar automáticamente o Dejar en el input del chat.\n# Selecciona el micrófono del anfitrión, ganancia, umbral e idioma.\n# Los ajustes avanzados incluyen frecuencia, canales, beam y VAD.\n# Guarda para aplicar a la siguiente grabación.\n# Mic inicia la captura; espera el indicador de escucha.\n# Otro clic o Escape cancela sin perder el borrador ni los modos del chat.\n\nAcerca de -> Uso\n# Consulta saldos y actividad registrada de chat y modelos.\n# Elige 7 o 30 días; el saldo mensual es independiente.\n# Los totales locales no incluyen llamadas ajenas a Tlamatini.\n# Los datos ausentes se explican: no se presentan como cero.\n\nPaneles\n# Agentic Control Panel: diseña flujos de agentes .flw.\n# Prompt Flow Panel: diseña conversaciones .fpmt.\n# User Input solicita datos; User Commentary agrega una nota.\n# Abre desde Windows o suelta el archivo en el editor correspondiente.\n# Valida antes de ejecutar: abrir nunca pone un flujo en marcha.\n# Mantén la aplicación y la página abiertas para pasos programados.\n\n# LaTeXer necesita TeX para compilar PDFs. Se recomienda MiKTeX:\nhttps://miktex.org/download\n\n# Edita código y Markdown junto al chat.\n# Guardar como permite elegir una carpeta local de proyecto.\n# Guarda antes de cerrar: las ediciones pendientes viven en memoria.\n# Los conflictos con cambios en disco se rechazan; los PDFs son de lectura.\n# Activa Multi-Turn, Interactor y Editor en vivo para aprender paso a paso.\n# Interactor lee el texto sin guardar; escribir no guarda ni ejecuta.\n# En una lección de terminal, dile que tú ejecutarás los comandos.\n\nConfig -> Live Editor & Terminater\n# Personaliza editor, terminales y voz desde las tres pestañas.\n# Prueba las preferencias sin ejecutar comandos ni editar archivos.\n# Guardar aplica a la siguiente acción; Cancelar o Escape descarta el borrador.\n# Abrir ajustes detiene una lección activa.\n# El comportamiento sigue a tu cuenta; la apariencia queda en este navegador.\n# Editor: 40-160 palabras/min, pausas de 0-3 s, detalle y sugerencias.\n# Terminal: 20-160 palabras/min, shell disponible, asesor y tiempos de espera.\n# Puedes vincular ambas velocidades entre 40 y 160 palabras/min.\n# Mantén Enter manual para controlar la ejecución en chat y ambos paneles.\n# Agotar una espera no termina el proceso.\n# Los nodos nuevos heredan tus preferencias; los antiguos conservan valores explícitos.\n# La narración puede explicar, leer código/comandos o hacer ambas cosas.\n# Elige antes, durante o después de escribir, con espera opcional a la voz.\n# El silencio global y la escucha del micrófono tienen prioridad.\n# Las entradas privadas y marcadas como secretas no se narran.\n# Si falta voz, puedes continuar sin ella o detenerte.\n# Ajusta fuente de 12-24 px, líneas, envoltura, cursor y distribución.\n\n# Activa Multi-Turn y abre el Catálogo de prompts para comenzar.",
  };
}
