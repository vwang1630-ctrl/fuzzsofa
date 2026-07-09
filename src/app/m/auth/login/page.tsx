'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      router.push('/m/profile');
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/m/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="page page-login active" id="pageLogin">
      <div className="auth-header">
        <Link href="/m" className="log-detail-back">‹</Link>
      </div>
      <div className="auth-brand">
        <span className="brand-name">FUZZ SOFA</span>
        <span className="brand-sub">studio</span>
      </div>
      <div className="auth-title">Welcome Back</div>
      <div className="auth-subtitle">Sign in to sync your data across devices</div>
      
      {error && (
        <div className="auth-error" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          {error}
        </div>
      )}

      <form className="auth-form" id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <div className="form-row">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> Remember me
          </label>
          <Link href="/m/auth/forgot-password" className="forgot-link">Forgot password?</Link>
        </div>
        <button 
          type="submit" 
          className="btn-primary panel-confirm-btn"
          disabled={isLoading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      <div className="social-login">
        <button 
          className="social-btn social-btn-google"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '14px 20px',
            background: 'rgba(232, 180, 184, 0.06)',
            border: '1.5px solid rgba(232, 180, 184, 0.35)',
            borderRadius: '0',
            color: '#E8B4B8',
            fontSize: '14px',
            fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
            fontWeight: '500',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="auth-footer">
        Don't have an account? <Link href="/m/auth/register">Sign up</Link>
      </div>

      <div className="auth-terms" style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '11px',
        color: 'rgba(232, 180, 184, 0.4)',
        lineHeight: '1.6'
      }}>
        By signing in, you agree to our{' '}
        <Link href="/m/profile/settings/terms" style={{ color: 'rgba(232, 180, 184, 0.6)' }}>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/m/profile/settings/privacy" style={{ color: 'rgba(232, 180, 184, 0.6)' }}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
