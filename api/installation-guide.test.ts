import { describe, expect, it } from 'vitest';
import { developerInstallation, installationSteps } from '@/i18n/installation';
import { translations } from '@/i18n/translations';
import { editions } from '@/i18n/editions';

describe('first-time installation guide', () => {
  it.each(['en', 'es'] as const)('keeps the %s main path to five actionable steps', lang => {
    const copy = translations[lang].tlamatini.installation;
    const steps = installationSteps(lang);
    expect(copy.steps.map(step => step.id)).toEqual([
      'install_tlamatini', 'install_ollama', 'sign_in_ollama', 'download_models', 'configure_models',
    ]);
    expect(copy.desc.length).toBeLessThan(450);
    for (const { id } of copy.steps) {
      expect(steps[id].length).toBeLessThan(1500);
      expect(steps[id]).not.toMatch(/^# /m);
    }
    expect(steps.install_tlamatini).toContain(editions[lang].installerUrl);
    expect(steps.install_tlamatini).not.toMatch(/python -m venv|createsuperuser/);
    expect(steps.configure_models).toContain('Multi-Turn');
    expect(steps.configure_models).toContain('Step-by-Step');
  });

  it.each(['en', 'es'] as const)('explains model setup without plan or pricing copy in %s', lang => {
    const steps = installationSteps(lang);
    expect(JSON.stringify([steps, translations[lang]]))
      .not.toMatch(/\bOllama (?:Pro|Max)\b|ollama\.com\/pricing|subscription|suscripci[oó]n/i);
    expect(steps.install_ollama).toContain('https://ollama.com/download/windows');
    expect(steps.install_ollama).toContain('internet');
    expect(steps.sign_in_ollama).toMatch(/your Ollama account|tu cuenta de Ollama/);
    expect(steps.install_ollama).not.toMatch(/unlimited|ilimitad/i);
    expect(steps.sign_in_ollama).toContain('~~~powershell\nollama signin\n~~~');
  });

  it.each(['en', 'es'] as const)('prepares the current local and cloud model defaults in %s', lang => {
    const steps = installationSteps(lang);
    const commands = steps.download_models.match(/^ollama pull .+$/gm);
    expect(commands).toEqual([
      'ollama pull nomic-embed-text',
      'ollama pull deepseek-v4.1-flash:cloud',
      'ollama pull mistral-large-4:cloud',
      'ollama pull gemma4:cloud',
    ]);
    expect(steps.download_models).toMatch(/not downloaded to your PC|no se descargan a tu PC/);
    expect(steps.configure_models).toMatch(/Existing installations may retain|instalación existente puede conservar/);
    expect(steps.configure_models).toMatch(/does not download models|no descarga modelos/);
    expect(JSON.stringify([steps, translations[lang]])).not.toMatch(/glm-5\.3:cloud|mistral-large-3:675b-cloud|GLM synthesis|síntesis GLM/);
  });

  it.each(['en', 'es'] as const)('retains optional developer and companion paths in %s', lang => {
    const developer = developerInstallation(lang);
    expect(developer).toContain(editions[lang].sourceUrl);
    expect(developer).toContain('Python 3.12.10');
    expect(developer).toContain('python.exe Tlamatini/manage.py createsuperuser');
    expect(developer).toContain(`$env:TLAMATINI_VERSION = '${editions[lang].version}'`);
    expect(installationSteps(lang).configure_torrenter).toMatch(/do not need it to start chatting|no lo necesitas para empezar a conversar/);
  });
});
