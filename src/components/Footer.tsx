import { Download } from 'lucide-react';
import { EditionLabel } from '@/components/EditionDetails';
import { useEdition, useT } from '@/i18n/context';

export default function Footer() {
  const t = useT();
  const edition = useEdition();
  return (
    <footer style={{ background: '#111', borderTop: '1px solid #222' }}>
      {/* CTA Area */}
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <h2
          className="font-bold mb-4"
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            color: '#f0f0f0',
          }}
        >
          {t.footer.ctaTitle}
        </h2>
        <p className="text-[#888] mb-8 max-w-md mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
          {t.footer.ctaDesc}
        </p>
        <div className="flex justify-center"><EditionLabel /></div>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href={edition.installerUrl} className="xaiht-btn xaiht-btn-filled"><Download size={16} aria-hidden="true" />{t.edition.download}</a>
          <a
            href={edition.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="xaiht-btn xaiht-btn-outline"
          >
            {t.edition.source}
          </a>
          <a href={edition.docsUrl} target="_blank" rel="noopener noreferrer" className="xaiht-btn xaiht-btn-outline">{t.edition.guide}</a>
        </div>
      </div>

      {/* Footer Row */}
      <div
        className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #222' }}
      >
        <span className="font-mono text-[11px] tracking-[0.1em] text-[#888] uppercase">
          XAIHT
        </span>
        <div className="flex items-center justify-center flex-wrap gap-6">
          <a
            href={edition.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors"
          >
            {t.edition.repository}
          </a>
          <a href={edition.docsUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors">{t.edition.guide}</a>
          <a
            href={edition.issuesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors"
          >
            {t.footer.reportIssue}
          </a>
        </div>
        <span className="font-mono text-[11px] text-[#555]">
          {t.footer.builtWith}
        </span>
      </div>
    </footer>
  );
}
