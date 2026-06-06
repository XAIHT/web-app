import { Link } from 'react-router';
import Navigation from '@/components/Navigation';
import { useT } from '@/i18n/context';

export default function NotFound() {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6 pt-14">
        <div className="text-center">
          <h1
            className="font-extrabold mb-4"
            style={{
              fontSize: 'clamp(4rem, 15vw, 8rem)',
              color: '#1a1a1a',
              lineHeight: 1,
            }}
          >
            404
          </h1>
          <p className="text-[#888] mb-8" style={{ fontSize: '1rem' }}>
            {t.notFound.message}
          </p>
          <Link to="/" className="xaiht-btn xaiht-btn-outline">
            {t.notFound.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
