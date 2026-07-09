'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSupabaseBrowserClientAsync } from '@/lib/supabase-browser';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSupabaseBrowserClientAsync()
      .then(setSupabase)
      .catch(() => {
        setError('Failed to initialize authentication');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Authentication not ready');
      return;
    }
    setIsLoading(true);
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // 注册
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }

        // 注册成功后保存用户信息到 localStorage
        localStorage.setItem('fuzz_user', JSON.stringify({ email }));
        router.push('/m/profile');
      } else {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError(error.message);
          setIsLoading(false);
          return;
        }

        // 登录成功后保存用户信息到 localStorage
        localStorage.setItem('fuzz_user', JSON.stringify({ email }));
        router.push('/m/profile');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      setError('Authentication not ready');
      return;
    }
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
    <div style={{
      background: '#0A0A0A',
      minHeight: '100vh',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      {/* 顶部返回按钮 */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px'
      }}>
        <Link href="/m" style={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F5F0EB',
          fontSize: '28px',
          fontWeight: '300',
          textDecoration: 'none',
          transition: 'color 0.3s ease'
        }}>‹</Link>
      </div>

      {/* 品牌标识 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
          fontSize: '28px',
          fontWeight: '400',
          letterSpacing: '0.1em',
          color: '#F5F0EB',
          marginBottom: '8px'
        }}>FUZZ SOFA</div>
        <div style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '11px',
          fontWeight: '300',
          letterSpacing: '0.2em',
          color: '#8A8580',
          textTransform: 'uppercase'
        }}>studio</div>
      </div>

      {/* 标题 */}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
        fontSize: '24px',
        fontWeight: '300',
        letterSpacing: '0.05em',
        color: '#F5F0EB',
        textAlign: 'center',
        marginBottom: '12px'
      }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</div>

      {/* 副标题 */}
      <div style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '13px',
        fontWeight: '300',
        letterSpacing: '0.05em',
        color: '#8A8580',
        textAlign: 'center',
        marginBottom: '24px',
        lineHeight: '1.6'
      }}>{isSignUp ? 'Sign up to get started' : 'Sign in to sync your data across devices'}</div>
      
      {/* 错误提示 */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          padding: '12px 16px',
          borderRadius: '0',
          marginBottom: '24px',
          fontSize: '13px',
          fontFamily: "'Inter', -apple-system, sans-serif",
          letterSpacing: '0.02em'
        }}>
          {error}
        </div>
      )}

      {/* Google 登录按钮 */}
      <button 
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '16px 20px',
          background: 'transparent',
          border: '1px solid #333',
          borderRadius: '0',
          color: '#F5F0EB',
          fontSize: '13px',
          fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
          fontWeight: '500',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          marginBottom: '24px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#E8B4B8';
          e.currentTarget.style.color = '#E8B4B8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#333';
          e.currentTarget.style.color = '#F5F0EB';
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>{isLoading ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'}</span>
      </button>

      {/* 分隔线 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          flex: '1',
          height: '1px',
          background: '#1A1A1A'
        }}></div>
        <span style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          fontSize: '11px',
          fontWeight: '300',
          letterSpacing: '0.1em',
          color: '#8A8580',
          textTransform: 'uppercase'
        }}>{isSignUp ? 'or sign up with email' : 'or login with email'}</span>
        <div style={{
          flex: '1',
          height: '1px',
          background: '#1A1A1A'
        }}></div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <label style={{
            display: 'block',
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '11px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: '#8A8580',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>Email</label>
          <input 
            type="email" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            style={{
              width: '100%',
              background: '#111111',
              border: '1px solid #333',
              borderRadius: '0',
              color: '#F5F0EB',
              padding: '14px 16px',
              fontSize: '14px',
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontWeight: '300',
              letterSpacing: '0.02em',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#E8B4B8'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            fontFamily: "'Inter', -apple-system, sans-serif",
            fontSize: '11px',
            fontWeight: '300',
            letterSpacing: '0.1em',
            color: '#8A8580',
            textTransform: 'uppercase',
            marginBottom: '8px'
          }}>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            style={{
              width: '100%',
              background: '#111111',
              border: '1px solid #333',
              borderRadius: '0',
              color: '#F5F0EB',
              padding: '14px 16px',
              fontSize: '14px',
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontWeight: '300',
              letterSpacing: '0.02em',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#E8B4B8'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
          />
        </div>

        {/* 注册时显示确认密码 */}
        {isSignUp && (
          <div>
            <label style={{
              display: 'block',
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '11px',
              fontWeight: '300',
              letterSpacing: '0.1em',
              color: '#8A8580',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              style={{
                width: '100%',
                background: '#111111',
                border: '1px solid #333',
                borderRadius: '0',
                color: '#F5F0EB',
                padding: '14px 16px',
                fontSize: '14px',
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontWeight: '300',
                letterSpacing: '0.02em',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#E8B4B8'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
            />
          </div>
        )}

        {!isSignUp && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '12px',
              fontWeight: '300',
              color: '#8A8580',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#E8B4B8'
                }}
              /> 
              Remember me
            </label>
            <Link href="/m/auth/forgot-password" style={{
              fontFamily: "'Inter', -apple-system, sans-serif",
              fontSize: '12px',
              fontWeight: '300',
              color: '#E8B4B8',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >Forgot password?</Link>
          </div>
        )}

        <button 
          type="submit" 
          className="panel-confirm-btn"
          disabled={isLoading}
          style={{ 
            width: '100%',
            marginTop: '8px'
          }}
        >
          {isLoading ? (isSignUp ? 'CREATING ACCOUNT...' : 'SIGNING IN...') : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
        </button>
      </form>

      {/* 切换链接 */}
      <div style={{
        textAlign: 'center',
        marginTop: '32px',
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '13px',
        fontWeight: '300',
        color: '#8A8580',
        letterSpacing: '0.02em'
      }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button 
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError('');
          }}
          style={{
            color: '#E8B4B8',
            textDecoration: 'none',
            fontWeight: '400',
            transition: 'opacity 0.3s ease',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            font: 'inherit'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >{isSignUp ? 'Sign in' : 'Sign up'}</button>
      </div>

      {/* 条款说明 */}
      <div style={{
        textAlign: 'center',
        marginTop: '24px',
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: '10px',
        fontWeight: '300',
        color: 'rgba(138, 133, 128, 0.6)',
        lineHeight: '1.6',
        letterSpacing: '0.02em'
      }}>
        By {isSignUp ? 'signing up' : 'signing in'}, you agree to our{' '}
        <Link href="/m/profile/settings/terms" style={{
          color: 'rgba(232, 180, 184, 0.6)',
          textDecoration: 'none'
        }}>Terms of Service</Link>
        {' '}and{' '}
        <Link href="/m/profile/settings/privacy" style={{
          color: 'rgba(232, 180, 184, 0.6)',
          textDecoration: 'none'
        }}>Privacy Policy</Link>
      </div>
    </div>
  );
}
