"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";
import { useSupabaseConfig } from "@/lib/supabase-config-inject";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";

const APP_NAME = "Fuzz Sofa";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading: configLoading } = useSupabaseConfig();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) {
        if (oauthError.message.includes("provider is not enabled") || oauthError.message.includes("Unsupported provider")) {
          setError(t("googleNotConfigured" as TranslationKeys));
        } else {
          setError(oauthError.message);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google login failed";
      if (msg.includes("provider is not enabled") || msg.includes("Unsupported provider")) {
        setError(t("googleNotConfigured" as TranslationKeys));
      } else {
        setError(msg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError(t("loginInvalidCredentials" as TranslationKeys));
        } else {
          setError(authError.message);
        }
        return;
      }
      if (data.session) {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t("passwordMismatch" as TranslationKeys));
      return;
    }
    if (password.length < 6) {
      setError(t("passwordTooShort" as TranslationKeys));
      return;
    }
    setLoading(true);
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) {
        setError(authError.message);
        return;
      }
      // mailer_auto_confirm is true, so user is auto-confirmed
      if (data.session) {
        router.push("/");
      } else {
        // If no session returned, switch to login
        setMode("login");
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (configLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-[#8A8580] text-sm tracking-[0.1em]">{t("loading" as TranslationKeys)}</div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0A0A] px-4">
      <div className="w-full max-w-[400px]">
        {/* App name */}
        <h1 className="text-center font-serif text-2xl font-light text-[#F5F0EB] tracking-[0.05em] mb-8">
          {APP_NAME}
        </h1>

        {/* Mode tabs - email only since phone is disabled */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-[#333] text-[#F5F0EB] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "..." : t("googleLogin" as TranslationKeys)}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#1A1A1A]"></div>
              <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">{t("orLoginWithEmail" as TranslationKeys)}</span>
              <div className="flex-1 h-px bg-[#1A1A1A]"></div>
            </div>

            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("email" as TranslationKeys)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111111] border border-[#333] text-[#F5F0EB] px-4 py-3 text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors duration-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("password" as TranslationKeys)}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#111111] border border-[#333] text-[#F5F0EB] px-4 py-3 text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-[#F5F0EB] text-[#F5F0EB] py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? t("loggingIn" as TranslationKeys) : t("signIn" as TranslationKeys)}
            </button>

            <p className="text-center text-sm text-[#8A8580]">
              {t("noAccount" as TranslationKeys)}{" "}
              <button
                type="button"
                onClick={() => { setMode("register"); setError(""); }}
                className="text-[#E8B4B8] hover:underline"
              >
                {t("goRegister" as TranslationKeys)}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-[#333] text-[#F5F0EB] py-3 text-xs tracking-[0.15em] uppercase hover:border-[#E8B4B8] transition-all duration-300 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "..." : t("googleSignUp" as TranslationKeys)}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#1A1A1A]"></div>
              <span className="text-xs text-[#8A8580] tracking-[0.1em] uppercase">{t("orRegisterWithEmail" as TranslationKeys)}</span>
              <div className="flex-1 h-px bg-[#1A1A1A]"></div>
            </div>

            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("email" as TranslationKeys)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#111111] border border-[#333] text-[#F5F0EB] px-4 py-3 text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors duration-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("password" as TranslationKeys)}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#111111] border border-[#333] text-[#F5F0EB] px-4 py-3 text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8580] hover:text-[#E8B4B8] transition-colors"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("confirmPassword" as TranslationKeys)}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#111111] border border-[#333] text-[#F5F0EB] px-4 py-3 text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors duration-300"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-[#F5F0EB] text-[#F5F0EB] py-3 text-xs tracking-[0.15em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50"
            >
              {loading ? t("registering" as TranslationKeys) : t("signUp" as TranslationKeys)}
            </button>

            <p className="text-center text-sm text-[#8A8580]">
              {t("hasAccount" as TranslationKeys)}{" "}
              <button
                type="button"
                onClick={() => { setMode("login"); setError(""); }}
                className="text-[#E8B4B8] hover:underline"
              >
                {t("goLogin" as TranslationKeys)}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
