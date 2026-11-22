import { editions, type Lang } from './editions';

// Only commands belong in code fences; the rest is readable, linked guidance.
export function installationSteps(lang: Lang): Record<string, string> {
  const edition = editions[lang];
  if (lang === 'en') return {
    install_tlamatini: `1. [Download Tlamatini ${edition.tag} for Windows 11 x64](${edition.installerUrl}). Choose **${edition.installerName}**, not GitHub's source-code archives. [Release page](${edition.releaseUrl}).
2. Right-click the ZIP and choose **Extract All**. Open the extracted folder and keep **pkg.zip** beside **Installer.exe**.
3. Open **Installer.exe**, choose your installation folder, review, and click **Install**. Python is included; you do not need to install it separately.
4. Launch Tlamatini from her shortcut. If the browser does not open, visit [Tlamatini on this computer](http://127.0.0.1:8000/). Sign in with **user** / **changeme** and change the password immediately.

Continue with Ollama below to connect your models. Tlamatini is free and open-source.`,
    install_ollama: `1. [Download Ollama for Windows](https://ollama.com/download/windows) and run its installer. Leave Ollama running.
2. Create or sign in to your [Ollama account](https://ollama.com).
3. Connect that account from the terminal in the next step.

The default cloud models need internet and access through your Ollama account. Local models require suitable hardware and different model choices.`,
    sign_in_ollama: `Open **Windows Terminal** or **PowerShell** from the Start menu. Run:

~~~powershell
ollama signin
~~~

Follow the browser sign-in using **your Ollama account**. Return to the terminal when sign-in is confirmed. If Windows cannot find **ollama**, close and reopen the terminal after installation.`,
    download_models: `In the same terminal, run these four commands **one at a time**, waiting for each to finish:

~~~powershell
ollama pull nomic-embed-text
ollama pull deepseek-v4.1-flash:cloud
ollama pull mistral-large-4:cloud
ollama pull gemma4:cloud
~~~

**What you are preparing:** nomic-embed-text runs locally to index your project. DeepSeek V4.1 Flash handles chat, reasoning, and text tasks. Mistral Large 4 and Gemma 4 handle image and video analysis.

The **:cloud** tags connect to models running in Ollama's cloud; their large weights are not downloaded to your PC. They use your signed-in account and its usage allowance. These are the current defaults for new installations; optional voice and specialist agents may need additional setup.`,
    configure_models: `1. Open **Config -> Models**: **deepseek-v4.1-flash:cloud** for chat, **mistral-large-4:cloud** and **gemma4:cloud** for vision, **nomic-embed-text** for embeddings. Existing installations may retain earlier choices.
2. Click **Save**, review **Model Brain Auto-tuning**, and reconnect chat. Saving does not download models. For local Ollama, leave its **Access Keys Wizard** token blank.
3. Enable **Multi-Turn**. In **Catalog of Prompts -> Getting Started**, choose an example and enable its tools in Configure, including when using **Compact mode**.
4. Send: **“Plan a project step by step. Wait for my answer.”**

Use **Step-by-Step** for guided work. The **microphone beside Send** dictates prompts or editable drafts; choose in **Config -> Mic**. Check **About -> Usage** for cloud credits and recorded activity.

**Try the Canvas:** open up to 32 documents in tabs. **Use as context** selects snapshots; **Chat context** confirms them. After edits, click **Update context**. Saving and updating context are separate. An asterisk marks unsaved work; save every document before closing.

[Model guide](${edition.repoUrl}/blob/main/docs/model_configuration.md) · [Canvas guide](${edition.repoUrl}/blob/main/docs/canvas-editing.md).`,
    configure_torrenter: `Torrenter is optional: **you do not need it to start chatting**. It uses the separately installed **Tlachihuani Jobs and XT** companion.

1. Obtain Tlachihuani's complete Windows installation ZIP from your distributor. Extract it, read **START-HERE.html**, and run **Installer.exe**. Services start **Stopped / Manual**; starting XT at sign-in starts only the tray icon.
2. Right-click **XT -> Start Services**, then open **Panels -> Torrenter Workspace** in Tlamatini. No pairing code is needed; use your normal account and enable Torrenter and Chat-Agent-Torrenter in Configure.
3. Add a magnet or .torrent, inspect its metadata, choose files, and download. Extra metadata requests queue when all four slots are busy. Waiting is not completion.
4. Check **Verified output** for the actual saved path and SHA-256. Files normally go to Windows Downloads/Torrenter, with this edition's content_generated/Torrenter as fallback. If both fail, delivery reports an error.

Closing chat does not stop active downloads. **Remove record keeps files**; **Erase files** needs approval in XT. [Full Torrenter guide](${edition.repoUrl}/blob/main/docs/torrenter.md).`,
  };
  return {
    install_tlamatini: `1. [Descarga Tlamatini en español ${edition.tag} para Windows 11 x64](${edition.installerUrl}). Elige **${edition.installerName}**, no los archivos de código fuente de GitHub. [Página de la versión](${edition.releaseUrl}).
2. Haz clic derecho en el ZIP y elige **Extraer todo**. Abre la carpeta extraída y conserva **pkg.zip** junto a **Installer.exe**.
3. Abre **Installer.exe**, elige la carpeta de instalación, revisa y pulsa **Instalar**. Python viene incluido; no necesitas instalarlo por separado.
4. Inicia Tlamatini desde su acceso directo. Si el navegador no se abre, visita [Tlamatini en este equipo](http://127.0.0.1:8000/). Entra con **user** / **changeme** y cambia la contraseña de inmediato.

Continúa con Ollama abajo para conectar tus modelos. Tlamatini es gratuita y de código abierto.`,
    install_ollama: `1. [Descarga Ollama para Windows](https://ollama.com/download/windows) y ejecuta su instalador. Deja Ollama abierto.
2. Crea tu cuenta o inicia sesión en [Ollama](https://ollama.com).
3. Conecta esa cuenta desde la terminal en el siguiente paso.

Los modelos predeterminados en la nube necesitan internet y acceso mediante tu cuenta de Ollama. Los modelos locales requieren hardware adecuado y una selección de modelos distinta.`,
    sign_in_ollama: `Abre **Terminal de Windows** o **PowerShell** desde Inicio. Ejecuta:

~~~powershell
ollama signin
~~~

Completa el inicio de sesión en el navegador con **tu cuenta de Ollama**. Regresa a la terminal cuando se confirme. Si Windows no reconoce **ollama**, cierra y vuelve a abrir la terminal después de instalarlo.`,
    download_models: `En la misma terminal, ejecuta estos cuatro comandos **uno por uno**, esperando a que termine cada uno:

~~~powershell
ollama pull nomic-embed-text
ollama pull deepseek-v4.1-flash:cloud
ollama pull mistral-large-4:cloud
ollama pull gemma4:cloud
~~~

**Qué estás preparando:** nomic-embed-text indexa tu proyecto localmente. DeepSeek V4.1 Flash se ocupa del chat, razonamiento y tareas de texto. Mistral Large 4 y Gemma 4 analizan imágenes y videos.

Las etiquetas **:cloud** conectan con modelos que se ejecutan en la nube de Ollama; sus grandes pesos no se descargan a tu PC. Usan tu cuenta y su cuota disponible. Son los valores actuales de una instalación nueva; la voz y otros agentes especializados pueden necesitar configuración adicional.`,
    configure_models: `1. Abre **Config -> Modelos**: **deepseek-v4.1-flash:cloud** para chat, **mistral-large-4:cloud** y **gemma4:cloud** para visión, **nomic-embed-text** para embeddings. Una instalación existente puede conservar tus elecciones anteriores.
2. Pulsa **Guardar**, revisa **Model Brain Auto-tuning** y reconecta el chat. Guardar no descarga modelos. Con Ollama local, deja vacío su token de **Access Keys Wizard**.
3. Activa **Multi-Turn**. En **Catálogo de prompts -> Primeros pasos**, elige un ejemplo y activa sus herramientas en Configurar, también si usas **Compact mode**.
4. Envía: **«Planea un proyecto paso a paso. Espera mi respuesta».**

Usa **Step-by-Step** para avanzar con guía. El **micrófono junto a Enviar** dicta prompts o borradores editables; elige en **Config -> Mic**. Consulta créditos de nube y actividad registrada en **Acerca de -> Uso**.

**Prueba el Canvas:** abre hasta 32 documentos en pestañas. **Usar como contexto** elige copias; **Contexto del chat** confirma su aceptación. Tras editar, pulsa **Actualizar contexto**. Guardar y actualizar contexto son acciones independientes. Un asterisco marca cambios sin guardar; guarda todo antes de cerrar.

[Guía de modelos](${edition.repoUrl}/blob/main/docs/model_configuration.md) · [Guía del Canvas](${edition.repoUrl}/blob/main/docs/canvas-editing.md).`,
    configure_torrenter: `Torrenter es opcional: **no lo necesitas para empezar a conversar**. Utiliza **Tlachihuani Jobs y XT**, un complemento que se instala por separado.

1. Obtén el ZIP completo de Tlachihuani para Windows de tu distribuidor. Extrae todo, lee **START-HERE.html** y abre **Installer.exe**. Los servicios quedan **Detenidos / Manual**; iniciar XT con Windows sólo abre el icono de la bandeja.
2. Haz clic derecho en **XT -> Start Services** y abre **Paneles -> Descargas de Torrenter** en Tlamatini. Sin código de vinculación: usa tu cuenta habitual y activa Torrenter y Chat-Agent-Torrenter en Configurar.
3. Agrega un magnet o .torrent, revisa sus metadatos, elige archivos y descarga. Si las cuatro solicitudes de metadatos están ocupadas, las demás esperan en cola. Esperar no es completar.
4. Revisa **Verified output** para conocer la ruta real y SHA-256. El destino habitual es Descargas de Windows/Torrenter, con content_generated/Torrenter de esta edición como alternativa. Si ambos destinos fallan, se informa del error.

Cerrar el chat no detiene descargas activas. **Remove record conserva archivos**; **Erase files** necesita aprobación en XT. [Guía completa de Torrenter](${edition.repoUrl}/blob/main/docs/torrenter.md).`,
  };
}

export function developerInstallation(lang: Lang): string {
  const edition = editions[lang];
  const commands = `cd ${edition.sourceFolder}
$env:TLAMATINI_VERSION = '${edition.version}'
python -m venv venv
.\\venv\\Scripts\\python.exe -m pip install -r requirements.txt
.\\venv\\Scripts\\python.exe Tlamatini/manage.py migrate
.\\venv\\Scripts\\python.exe Tlamatini/manage.py createsuperuser
.\\venv\\Scripts\\python.exe Tlamatini/manage.py runserver --noreload`;
  return lang === 'en'
    ? `This is an alternative for developers, not an extra installation step. Requires Python 3.12.10. [Download the ${edition.tag} source ZIP](${edition.sourceUrl}), extract it, then open PowerShell in its parent folder:

~~~powershell
${commands}
~~~

Open [Tlamatini](http://127.0.0.1:8000/) and sign in with the account you just created. Keep the terminal open. Continue with the same Ollama setup above. [Full installation and troubleshooting guide](${edition.docsUrl}#installation).`
    : `Es una alternativa para desarrolladores, no un paso adicional. Requiere Python 3.12.10. [Descarga el ZIP de código ${edition.tag}](${edition.sourceUrl}), extráelo y abre PowerShell en la carpeta que lo contiene:

~~~powershell
${commands}
~~~

Abre [Tlamatini](http://127.0.0.1:8000/) e inicia sesión con la cuenta que acabas de crear. Mantén la terminal abierta y sigue la misma configuración de Ollama indicada arriba. [Guía completa de instalación](${edition.docsUrl}).`;
}
