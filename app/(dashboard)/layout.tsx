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
  Menu,
  X,
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search courses, products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-5 ml-8">
            <button
              onClick={() => alert("Notifications coming soon")}
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="border-l border-gray-200 pl-5">
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50 transition"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                    {profile?.email?.[0]?.toUpperCase() || "A"}
                  </div>

                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.email ? profile.email.split("@")[0] : "Admin"}
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>

                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/settings"
                      className="block w-full px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-50 border-t border-gray-100"
                    >
                      Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2.5 text-sm text-left text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto max-w-7xl px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}