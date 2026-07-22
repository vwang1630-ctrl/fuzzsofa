'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }
    if (!password) {
      setError('请输入密码');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/public/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '登录失败，请重试');
        return;
      }

      // Check admin role
      if (data.user?.role !== 'admin') {
        setError('该账号没有管理员权限');
        return;
      }

      // Store token and redirect
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      router.push('/admin');
    } catch {
      setError('网络错误，请检查连接后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#F6F8FB' }}
    >
      {/* Login Card */}
      <div
        className="w-full max-w-[420px] rounded-2xl p-8"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#2F6BFF' }}
          >
            <PawPrint className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: '#152033' }}
            >
              FUZZ SOFA
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-md"
              style={{ background: '#EBF1FF', color: '#2F6BFF' }}
            >
              Admin
            </span>
          </div>
          <p className="text-sm mt-2" style={{ color: '#8993A6' }}>
            登录管理后台
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            id="login-error"
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg mb-5 text-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.06)',
              color: '#DC2626',
              border: '1px solid rgba(239, 68, 68, 0.15)',
            }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium"
              style={{ color: '#3D4A5C' }}
            >
              邮箱
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#A0AAB8', width: 16, height: 16 }}
              />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入管理员邮箱"
                autoComplete="email"
                className="w-full h-10 pl-9 pr-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  border: '1px solid #E2E6EE',
                  background: '#F8F9FC',
                  color: '#152033',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2F6BFF';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47, 107, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E2E6EE';
                  e.currentTarget.style.background = '#F8F9FC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium"
              style={{ color: '#3D4A5C' }}
            >
              密码
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#A0AAB8', width: 16, height: 16 }}
              />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                autoComplete="current-password"
                className="w-full h-10 pl-9 pr-3 rounded-lg text-sm outline-none transition-colors"
                style={{
                  border: '1px solid #E2E6EE',
                  background: '#F8F9FC',
                  color: '#152033',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2F6BFF';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(47, 107, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E2E6EE';
                  e.currentTarget.style.background = '#F8F9FC';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all mt-6 cursor-pointer"
            style={{
              background: loading ? '#6B93FF' : '#2F6BFF',
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#1D5BF0';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#2F6BFF';
              }
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: '#A0AAB8' }}
        >
          仅限授权管理员访问
        </p>
      </div>
    </div>
  );
}
