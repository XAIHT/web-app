import { Link } from 'react-router';
import Navigation from '@/components/Navigation';

export default function NotFound() {
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
            The page you are looking for does not exist.
          </p>
          <Link to="/" className="xaiht-btn xaiht-btn-outline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
