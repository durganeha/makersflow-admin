"use client";

import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { profile, loading } = useProfile();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="rounded-xl border bg-white p-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading profile…</p>
        ) : profile ? (
          <>
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="mt-2 text-lg font-medium">{profile.email}</p>

            <p className="mt-4 text-sm text-slate-500">Role</p>
            <p className="font-medium">{profile.role}</p>
          </>
        ) : (
          <p className="text-sm text-slate-500">No profile data available.</p>
        )}
      </div>
    </div>
  );
}