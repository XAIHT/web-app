import { Link } from 'react-router';

export default function Footer() {
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
          Run Tlamatini on Your Own Machine
        </h2>
        <p className="text-[#888] mb-8 max-w-md mx-auto" style={{ fontSize: '1rem', lineHeight: 1.65 }}>
          Tlamatini v1.8.0 brings her own self-knowledge map, optional self-modify builds, native nested-folder context, the 53-command Unreal MCP surface, Hybrid RAG with high-detail embedding opt-in, live Config, DB, and ACPX-Skills controls, 74-tool / 4096-iteration Multi-Turn orchestration, GPU-aware context loading, opt-in ACPX delegation, 24 skills, and 67 workflow agents to one local developer assistant.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/XAIHT/Tlamatini"
            target="_blank"
            rel="noopener noreferrer"
            className="xaiht-btn xaiht-btn-filled"
          >
            View Source
          </a>
          <Link to="/tlamatini" className="xaiht-btn xaiht-btn-outline">
            Documentation
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
            GitHub
          </a>
          <Link to="/tlamatini" className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors">
            Documentation
          </Link>
          <a
            href="https://github.com/XAIHT/Tlamatini/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#888] hover:text-[#f0f0f0] transition-colors"
          >
            Report Issue
          </a>
        </div>
        <span className="font-mono text-[11px] text-[#555]">
          Built with Django Channels + Ollama
        </span>
      </div>
    </footer>
  );
}
