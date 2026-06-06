import { Link } from 'react-router';
import { useT } from '@/i18n/context';

export default function Footer() {
  const t = useT();
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
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/XAIHT/Tlamatini"
            target="_blank"
            rel="noopener noreferrer"
            className="xaiht-btn xaiht-btn-filled"
          >
            {t.footer.viewSource}
          </a>
          <Link to="/tlamatini" className="xaiht-btn xaiht-btn-outline">
            {t.footer.documentation}
          </Link>
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
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/XAIHT/Tlamatini"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors"
          >
            {t.footer.github}
          </a>
          <Link to="/tlamatini" className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors">
            {t.footer.documentation}
          </Link>
          <a
            href="https://github.com/XAIHT/Tlamatini/issues"
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
