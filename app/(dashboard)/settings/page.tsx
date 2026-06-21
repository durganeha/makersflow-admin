"use client";

import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Settings, Lock, Bell, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { profile, loading } = useProfile();
  const router = useRouter();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error);
      return;
    }

    router.replace("/login");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your account preferences and system settings
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings size={20} />
            General Settings
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Portal Name
              </label>
              <input
                type="text"
                value="MakersFlow Admin"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Environment
              </label>
              <input
                type="text"
                value="Production"
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Admin Email
              </label>
              <input
                type="text"
                value={loading ? "Loading..." : profile?.email || ""}
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Role
              </label>
              <input
                type="text"
                value={loading ? "Loading..." : profile?.role || "Administrator"}
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-gray-50 text-gray-600 text-sm capitalize"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
            <span className="text-sm font-medium text-gray-900">Email Notifications</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
            <span className="text-sm font-medium text-gray-900">Course Updates</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
            <span className="text-sm font-medium text-gray-900">Product Updates</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 cursor-pointer" />
            <span className="text-sm font-medium text-gray-900">News Alerts</span>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lock size={20} />
            Security
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            Update Password
          </button>
        </div>
      </div>

      {/* System Information */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
        </div>

        <div className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Version
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                v1.0.0
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Database
              </p>
              <p className="mt-2 text-lg font-semibold text-green-600">
                Connected
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Environment
              </p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                Production
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-3">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">
          Sign out of your account and close this session
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}