"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClientWithRetry } from "@/lib/supabase-browser";
import { useSupabaseConfig } from "@/lib/supabase-config-inject";
import { useLanguage } from "@/lib/language-context";
import type { TranslationKeys } from "@/lib/i18n";
import type { User } from "@supabase/supabase-js";

export default function AccountPage() {
  const router = useRouter();
  const { isLoading: configLoading } = useSupabaseConfig();
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editName, setEditName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = await getSupabaseBrowserClientWithRetry();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/login");
          return;
        }
        setUser(session.user);
        setEditName(session.user.user_metadata?.full_name || "");
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    if (!configLoading) {
      loadUser();
    }
  }, [configLoading, router]);

  const handleLogout = async () => {
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      // fallback: clear and redirect
      router.push("/login");
    }
  };

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: editName.trim() },
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
      }
      setIsEditingName(false);
      setMessage(t("profileUpdated" as TranslationKeys));
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage(t("updateFailed" as TranslationKeys));
    } finally {
      setSaving(false);
    }
  };

  if (configLoading || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0A0A]">
        <div className="text-[#8A8580] text-sm tracking-[0.1em]">{t("loading" as TranslationKeys)}</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[80vh] bg-[#0A0A0A]">
      <div className="max-w-[700px] mx-auto px-6 py-16">
        <h1 className="font-serif text-3xl font-light text-[#F5F0EB] mb-10 tracking-[0.05em]">
          {t("myAccount" as TranslationKeys)}
        </h1>

        {/* Profile section */}
        <div className="border-t border-[#1A1A1A] pt-8">
          <h2 className="text-xs text-[#8A8580] tracking-[0.15em] uppercase mb-6">
            {t("profileInfo" as TranslationKeys)}
          </h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("displayName" as TranslationKeys)}
              </label>
              {isEditingName ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-[#111111] border border-[#333] text-[#F5F0EB] px-4 py-3 text-sm focus:outline-none focus:border-[#E8B4B8] transition-colors duration-300"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={saving}
                    className="border border-[#F5F0EB] text-[#F5F0EB] px-5 py-3 text-xs tracking-[0.1em] uppercase hover:bg-[#E8B4B8] hover:border-[#E8B4B8] hover:text-[#0A0A0A] transition-all duration-300 disabled:opacity-50"
                  >
                    {saving ? "..." : t("save" as TranslationKeys)}
                  </button>
                  <button
                    onClick={() => { setIsEditingName(false); setEditName(user.user_metadata?.full_name || ""); }}
                    className="border border-[#333] text-[#8A8580] px-5 py-3 text-xs tracking-[0.1em] uppercase hover:text-[#F5F0EB] transition-colors duration-300"
                  >
                    {t("cancel" as TranslationKeys)}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#F5F0EB]/80">
                    {user.user_metadata?.full_name || t("notSet" as TranslationKeys)}
                  </p>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-xs text-[#E8B4B8] hover:underline tracking-[0.05em]"
                  >
                    {t("edit" as TranslationKeys)}
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("email" as TranslationKeys)}
              </label>
              <p className="text-sm text-[#F5F0EB]/80">{user.email}</p>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-xs text-[#8A8580] tracking-[0.1em] uppercase mb-2">
                {t("userId" as TranslationKeys)}
              </label>
              <p className="text-sm text-[#F5F0EB]/50 font-mono">{user.id.slice(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mt-4 text-sm text-[#E8B4B8]">{message}</div>
        )}

        {/* Logout */}
        <div className="border-t border-[#1A1A1A] mt-10 pt-8">
          {showLogoutConfirm ? (
            <div className="space-y-4">
              <p className="text-sm text-[#F5F0EB]/70">{t("logoutConfirm" as TranslationKeys)}</p>
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="border border-red-500/50 text-red-400 px-5 py-3 text-xs tracking-[0.1em] uppercase hover:bg-red-500/10 transition-all duration-300"
                >
                  {t("confirmLogout" as TranslationKeys)}
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="border border-[#333] text-[#8A8580] px-5 py-3 text-xs tracking-[0.1em] uppercase hover:text-[#F5F0EB] transition-colors duration-300"
                >
                  {t("cancel" as TranslationKeys)}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="border border-[#333] text-[#8A8580] px-5 py-3 text-xs tracking-[0.1em] uppercase hover:text-red-400 hover:border-red-400/50 transition-all duration-300"
            >
              {t("signOut" as TranslationKeys)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
