import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Github, Menu, X } from 'lucide-react';
import Link from '@/components/LocalizedLink';
import { useAuth } from '@/hooks/useAuth';
import { useEdition, useLanguage, useT } from '@/i18n/context';
import LanguageSwitch from '@/components/LanguageSwitch';
import './Navigation.css';

interface NavigationProps {
  dark?: boolean;
}

export default function Navigation({ dark = false }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const t = useT();
  const { lang } = useLanguage();
  const edition = useEdition();
  const isHome = location.pathname === '/';
  const isTlamatini = location.pathname === '/tlamatini';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = isTlamatini ? [
    { label: t.nav.overview, href: '#overview' },
    { label: t.nav.features, href: '#features' },
    { label: t.nav.installation, href: '#installation' },
    { label: t.nav.agents, href: '#agents' },
  ] : isHome ? [
    { label: t.nav.overview, href: '#overview' },
    { label: t.nav.architecture, href: '#architecture' },
    { label: t.nav.agents, href: '#agents' },
    { label: t.nav.tools, href: '#tools' },
  ] : [];

  function closeMenu() { setMenuOpen(false); }
  const pageLinks = (
    <>
      {!isHome && !isTlamatini && <Link to="/" onClick={closeMenu} className="nav-link">{t.nav.home}</Link>}
      {links.map(link => <a key={link.href} href={link.href} className="nav-link" onClick={event => {
        closeMenu();
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(`${location.pathname}${location.search}${link.href}`, { preventScrollReset: true });
        document.querySelector(link.href)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
        });
      }}>{link.label}</a>)}
      <Link to="/launch" onClick={closeMenu} className={`nav-link ${location.pathname === '/launch' ? 'active' : ''}`}>
        {lang === 'es' ? 'Lanzamiento' : 'Launch'}
      </Link>
      <Link to="/tlamatini" onClick={closeMenu} className={`nav-link ${isTlamatini ? 'active' : ''}`}>{t.nav.tlamatini}</Link>
    </>
  );
  const account = isAuthenticated && user ? (
    <button onClick={() => { closeMenu(); logout(); }} className="nav-link">{t.nav.logout}</button>
  ) : <Link to="/login" onClick={closeMenu} className="nav-link">{t.nav.login}</Link>;

  return (
    <nav className="site-navigation" aria-label={t.edition.navigation} data-solid={scrolled || dark}
      onKeyDown={event => {
        if (event.key === 'Escape' && menuOpen) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}>
      <div className="site-navigation-row">
        <Link to="/" className="site-brand" onClick={closeMenu} aria-label={`XAIHT · ${t.nav.home}`}>
          <img src="/images/campaign/xaiht-wordmark.svg" alt="XAIHT" />
        </Link>
        <div className="site-navigation-links">{pageLinks}</div>
        <div className="site-navigation-actions">
          <LanguageSwitch />
          <a href={edition.repoUrl} target="_blank" rel="noopener noreferrer" className="site-github"
            aria-label={`GitHub · ${edition.repository} · ${edition.language}`} title={`XAIHT / ${edition.repository}`}>
            <Github size={18} aria-hidden="true" /><span>GitHub</span>
          </a>
          <div className="site-account">{account}</div>
          <button ref={menuButton} className="site-menu-button" type="button" aria-expanded={menuOpen}
            aria-controls="site-mobile-menu" aria-label={menuOpen ? t.edition.closeMenu : t.edition.openMenu}
            onClick={() => setMenuOpen(open => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && <div id="site-mobile-menu" className="site-mobile-menu">
        <div className="site-mobile-links">{pageLinks}</div>
        <div className="site-mobile-product">
          <span>{edition.label} · {edition.tag}</span>
          <a href={edition.repoUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
            <Github size={17} aria-hidden="true" />{edition.repository}
          </a>
          {account}
        </div>
      </div>}
    </nav>
  );
}
