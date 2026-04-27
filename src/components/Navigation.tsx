import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

interface NavigationProps {
  dark?: boolean;
}

export default function Navigation({ dark = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isHome = location.pathname === '/';
  const isTlamatini = location.pathname === '/tlamatini';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const homeLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Architecture', href: '#architecture' },
    { label: 'Agents', href: '#agents' },
    { label: 'Tools', href: '#tools' },
  ];

  const tlamatiniLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Features', href: '#features' },
    { label: 'Installation', href: '#installation' },
    { label: 'Agents', href: '#agents' },
  ];

  const navLinks = isTlamatini ? tlamatiniLinks : homeLinks;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300"
      style={{
        background: scrolled || dark ? 'rgba(17, 17, 17, 0.92)' : 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #222222',
        boxShadow: scrolled ? '0 1px 0 rgba(201,169,110,0.1)' : 'none',
      }}
    >
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-14 px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span
            className="font-mono text-[1.5rem] tracking-[0.15em] uppercase"
            style={{ color: '#c9a96e' }}
          >
            XAIHT
          </span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {isHome && navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          {isTlamatini && navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
          {!isHome && !isTlamatini && (
            <Link to="/" className="nav-link">Home</Link>
          )}
          <Link
            to="/tlamatini"
            className={`nav-link ${isTlamatini ? 'active' : ''}`}
          >
            Tlamatini
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/XAIHT/Tlamatini"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-[1.2rem] text-[#888] hover:text-[#c9a96e] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-[1.2rem] text-[#666]">{user.name || 'User'}</span>
              <button
                onClick={logout}
                className="text-[1.2rem] text-[#555] hover:text-[#999] transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[1.2rem] text-[#888] hover:text-[#c9a96e] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
