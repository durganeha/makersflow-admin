"use client";

import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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
        <h1 className="text-3xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your MakersFlow admin portal preferences and system settings.
        </p>
      </div>

      {/* General */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          General Settings
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Portal Name
            </label>

            <input
              type="text"
              value="MakersFlow Admin"
              readOnly
              className="mt-2 w-full rounded-lg border p-3 bg-slate-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Environment
            </label>

            <input
              type="text"
              value="Production"
              readOnly
              className="mt-2 w-full rounded-lg border p-3 bg-slate-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Admin Email
            </label>

            <input
              type="text"
              value={loading ? "Loading..." : profile?.email || ""}
              readOnly
              className="mt-2 w-full rounded-lg border p-3 bg-slate-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Role
            </label>

            <input
              type="text"
              value={loading ? "Loading..." : profile?.role || ""}
              readOnly
              className="mt-2 w-full rounded-lg border p-3 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Admin Preferences
        </h2>

        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Email Notifications
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Course Update Alerts
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Product Update Alerts
            </span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">
              News Publication Alerts
            </span>
            <input type="checkbox" />
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Security
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <button className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
          Update Password
        </button>
      </div>

      {/* System Information */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          System Information
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Application Version
            </p>
            <p className="mt-1 font-semibold">
              v1.0.0
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Database
            </p>
            <p className="mt-1 font-semibold">
              Supabase Connected
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Environment
            </p>
            <p className="mt-1 font-semibold">
              Production
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">
              Last Updated
            </p>
            <p className="mt-1 font-semibold">
              June 2026
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
<div className="rounded-xl border border-red-200 bg-red-50 p-6">
  <h2 className="text-lg font-semibold text-red-600">
    Danger Zone
  </h2>

  <p className="mt-2 text-sm text-red-500">
    Logging out will end your current admin session.
  </p>

  <div className="mt-6 flex gap-3">
    <button
      onClick={handleLogout}
      className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
    >
      Logout
    </button>

    <button
      className="rounded-lg border border-red-600 px-4 py-2 text-red-600 hover:bg-red-100"
      onClick={() =>
        alert("Reset settings functionality coming soon")
      }
    >
      Reset Settings
    </button>
  </div>
</div>
    </div>
  );
}