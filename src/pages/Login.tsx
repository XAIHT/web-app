import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Paths } from '@contracts/constants';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a' }}>
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6 pt-14">
        <div className="xaiht-card w-full max-w-md text-center">
          <div className="mb-6">
            <span
              className="font-mono text-xs tracking-[0.15em] uppercase"
              style={{ color: '#c9a96e' }}
            >
              XAIHT
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#f0f0f0' }}>
            Welcome
          </h1>
          <p className="text-[#888] mb-8" style={{ fontSize: '0.9375rem' }}>
            Sign in to access your XAIHT account and save preferences.
          </p>
          <a
            href={Paths.oauthStart}
            className="xaiht-btn xaiht-btn-filled w-full justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                fill="currentColor"
                d="M21.35 11.1H12v3.2h5.35c-.23 1.4-1.65 4.1-5.35 4.1-3.22 0-5.85-2.66-5.85-5.95S8.78 6.5 12 6.5c1.83 0 3.06.78 3.76 1.45l2.57-2.48C16.79 4.06 14.6 3.1 12 3.1 6.97 3.1 2.9 7.17 2.9 12.2s4.07 9.1 9.1 9.1c5.25 0 8.74-3.69 8.74-8.88 0-.6-.07-1.06-.16-1.32z"
              />
            </svg>
            Sign in with Google
          </a>
          <p className="text-[#555] mt-6 text-xs">
            Authentication is handled securely via Google OAuth 2.0.
          </p>
        </div>
      </div>
    </div>
  );
}
