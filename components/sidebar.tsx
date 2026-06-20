"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Newspaper,
  FolderOpen,
  Layers,
  Settings,
  UserCircle2,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, loading } = useProfile();

  const linkClass = (path: string) =>
    `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      pathname === path
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
    }`;

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-[#0f172a]">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">
        <h1 className="text-xl font-bold text-white">
          MakersFlow
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Admin Portal
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <nav className="space-y-8">
          {/* Overview */}
          <div>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overview
            </p>

            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </div>

          {/* LMS */}
          <div>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              LMS
            </p>

            <div className="space-y-1">
              <Link href="/courses" className={linkClass("/courses")}>
                <BookOpen size={18} />
                Courses
              </Link>

              <Link href="/modules" className={linkClass("/modules")}>
                <Layers size={18} />
                Modules
              </Link>

              <Link href="/lessons" className={linkClass("/lessons")}>
                <FolderOpen size={18} />
                Lessons
              </Link>
            </div>
          </div>

          {/* Store */}
          <div>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Store
            </p>

            <div className="space-y-1">
              <Link href="/categories" className={linkClass("/categories")}>
                <FolderOpen size={18} />
                Categories
              </Link>

              <Link href="/products" className={linkClass("/products")}>
                <Package size={18} />
                Products
              </Link>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Content
            </p>

            <Link href="/news" className={linkClass("/news")}>
              <Newspaper size={18} />
              News Articles
            </Link>
          </div>

          {/* System */}
          <div>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              System
            </p>

            <Link href="/settings" className={linkClass("/settings")}>
              <Settings size={18} />
              Settings
            </Link>
          </div>
        </nav>
      </div>

      {/* User Section */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
          <UserCircle2
            size={38}
            className="text-slate-400"
          />

          <div>
            <p className="text-sm font-medium text-white">
              {loading ? "Loading..." : profile?.role ?? "Super Admin"}
            </p>

            <p className="text-xs text-slate-500">
              {profile?.email ?? "admin@makersflow.in"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}