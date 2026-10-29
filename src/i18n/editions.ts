export type Lang = 'en' | 'es';

export function isLang(value: string | null): value is Lang {
  return value === 'en' || value === 'es';
}

function edition(repository: string, version: string, label: string, language: string) {
  const repoUrl = `https://github.com/XAIHT/${repository}`;
  const tag = `v${version}`;
  const installerName = `${repository}_Release_${tag}_Win11x64.zip`;
  return {
    repository, version, tag, label, language, repoUrl, installerName,
    releaseUrl: `${repoUrl}/releases/tag/${tag}`,
    installerUrl: `${repoUrl}/releases/download/${tag}/${installerName}`,
    sourceUrl: `${repoUrl}/archive/refs/tags/${tag}.zip`,
    sourceFolder: `${repository}-${version}`,
    docsUrl: `${repoUrl}/blob/main/README.md`,
    issuesUrl: `${repoUrl}/issues`,
  };
}

// Each edition owns its release and assets, even when their version numbers match.
export const editions = {
  en: edition('Tlamatini', '1.91.1', 'English edition', 'English'),
  es: edition('Tlamatini-Spanish', '1.91.1', 'Edición en español', 'Español'),
} satisfies Record<Lang, ReturnType<typeof edition>>;

export function localizePath(path: string, lang: Lang): string {
  const url = new URL(path, 'https://xaiht.org');
  url.searchParams.set('lang', lang);
  return `${url.pathname}${url.search}${url.hash}`;
}
