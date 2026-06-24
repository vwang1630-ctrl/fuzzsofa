"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";
import { useSupabaseConfig } from "@/lib/supabase-config-inject";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";

const APP_ICON_URL = "https://coze-coding-project.tos.coze.site/gen_project_icon/2026-06-23/7654546989807550515_1782214783.png?sign=4904325457-7930ebc813-0-0f176bb8905e9b5441da760664a918c7a329d80ac9ced10d908af1e7520fd4af";
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
        {/* App icon */}
        <div className="flex justify-center mb-4">
          <Image
            src={APP_ICON_URL}
            alt={APP_NAME}
            width={64}
            height={64}
            className="rounded-lg"
            unoptimized
          />
        </div>
        {/* App name */}
        <h1 className="text-center font-serif text-2xl font-light text-[#F5F0EB] tracking-[0.05em] mb-8">
          {APP_NAME}
        </h1>

        {/* Mode tabs - email only since phone is disabled */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-5">
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
