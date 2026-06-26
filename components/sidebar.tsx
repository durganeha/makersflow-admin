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
  Users,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, loading } = useProfile();

  const linkClass = (path: string) =>
    `group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
      pathname === path
        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            MF
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">MakersFlow</h1>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <nav className="space-y-6">
          {/* Overview */}
          <div>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Overview
            </p>
            <Link href="/dashboard" className={linkClass("/dashboard")}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </div>

          {/* LMS */}
          <div>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              LMS
            </p>
            <div className="space-y-1">
              <Link href="/courses" className={linkClass("/courses")}>
                <BookOpen size={18} />
                Courses
              </Link>
            </div>
          </div>

          {/* Store */}
          <div>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Store
            </p>
            <div className="space-y-1">
              <Link href="/products" className={linkClass("/products")}>
                <Package size={18} />
                Products
              </Link>
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Content
            </p>
            <div className="space-y-1">
              <Link href="/news" className={linkClass("/news")}>
                <Newspaper size={18} />
                News
              </Link>
            </div>
          </div>

          {/* Users */}
          <div>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Users
            </p>
            <div className="space-y-1">
              <Link href="/users" className={linkClass("/users")}>
                <Users size={18} />
                Users
              </Link>
            </div>
          </div>

          {/* System */}
          <div>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              System
            </p>
            <div className="space-y-1">
              <Link href="/settings" className={linkClass("/settings")}>
                <Settings size={18} />
                Settings
              </Link>
              <Link href="/profile" className={linkClass("/profile")}>
                <UserCircle2 size={18} />
                Profile
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-600">Logged in as</p>
          <p className="mt-1 text-sm font-medium text-gray-900 truncate">
            {profile?.email || "Admin"}
          </p>
        </div>
      </div>
    </aside>
  );
}