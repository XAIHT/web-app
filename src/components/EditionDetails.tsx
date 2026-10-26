import { Download, Code2, BookOpen, ExternalLink } from 'lucide-react';
import { useEdition, useT } from '@/i18n/context';
import './EditionDetails.css';

export function EditionLabel() {
  const edition = useEdition();
  return <p className="edition-label"><span aria-hidden="true" />{edition.label} <span aria-hidden="true">/</span> {edition.tag}</p>;
}

export default function EditionDetails() {
  const edition = useEdition();
  const c = useT().edition;
  return (
    <div className="edition-details">
      <EditionLabel />
      <h3>{c.title}</h3>
      <p>{c.description}</p>
      <div className="edition-actions">
        <a className="xaiht-btn xaiht-btn-filled" href={edition.installerUrl}>
          <Download size={17} aria-hidden="true" />{c.download}
        </a>
        <a className="xaiht-btn xaiht-btn-outline" href={edition.sourceUrl}>
          <Code2 size={17} aria-hidden="true" />{c.source}
        </a>
        <a href={edition.docsUrl} target="_blank" rel="noopener noreferrer">
          <BookOpen size={17} aria-hidden="true" />{c.guide}
        </a>
      </div>
      <a className="edition-repository" href={edition.repoUrl} target="_blank" rel="noopener noreferrer">
        XAIHT / {edition.repository}<ExternalLink size={13} aria-hidden="true" />
      </a>
      <p className="edition-platform">Windows 11 x64 · ZIP · {edition.tag}</p>
    </div>
  );
}
