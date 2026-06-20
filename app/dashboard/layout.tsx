"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/sidebar";
import { useProfile } from "@/hooks/useProfile";
import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const { profile } = useProfile();
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
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search courses, products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => alert("Notifications coming soon")}
              className="relative rounded-xl p-2 hover:bg-slate-100"
            >
              <Bell size={20} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {profile?.email?.[0]?.toUpperCase() || "A"}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.email ? profile.email : "Admin"}
                  </p>
                </div>

                <ChevronDown size={16} />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <Link
                    href="/profile"
                    className="block w-full px-4 py-3 text-left hover:bg-slate-50"
                  >
                    My Profile
                  </Link>

                  <Link
                    href="/settings"
                    className="block w-full px-4 py-3 text-left hover:bg-slate-50"
                  >
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-red-600 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-8 py-8">
          {children}
        </div>
      </main>
      </div>
    </div>
  );
}