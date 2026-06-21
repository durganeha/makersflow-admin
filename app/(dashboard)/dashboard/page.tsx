"use client";

import Link from "next/link";
import { BookOpen, Package, Newspaper, TrendingUp} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [courseCount, setCourseCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [newsCount, setNewsCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      const coursesResult = await supabase
        .from("courses")
        .select("*", { count: "exact", head: true });

      const productsResult = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const newsResult = await supabase
        .from("news")
        .select("*", { count: "exact", head: true });

      setCourseCount(coursesResult.count || 0);
      setProductCount(productsResult.count || 0);
      setNewsCount(newsResult.count || 0);
    }

    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome to MakersFlow
            </h1>

            <p className="mt-3 text-blue-100 max-w-xl">
              Manage courses, products, and news content from one centralized dashboard. Get insights, track performance, and streamline your operations.
            </p>
          </div>
          <div className="text-5xl opacity-20">📊</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Courses
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">{courseCount}</p>
              <p className="mt-2 text-xs text-gray-500">
                Learning content published
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Store Products
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">{productCount}</p>
              <p className="mt-2 text-xs text-gray-500">
                Items available in store
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <Package size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">
                News Articles
              </p>
              <p className="mt-2 text-4xl font-bold text-gray-900">{newsCount}</p>
              <p className="mt-2 text-xs text-gray-500">
                Published updates
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Newspaper size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/courses/new"
              className="rounded-lg border border-gray-200 p-4 text-left hover:bg-blue-50 hover:border-blue-300 block transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 mb-3">
                <BookOpen size={20} className="text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900">Create Course</p>
              <p className="text-xs text-gray-500 mt-1">
                Add new learning content
              </p>
            </Link>

            <Link
              href="/products/new"
              className="rounded-lg border border-gray-200 p-4 text-left hover:bg-emerald-50 hover:border-emerald-300 block transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 mb-3">
                <Package size={20} className="text-emerald-600" />
              </div>
              <p className="font-semibold text-gray-900">Add Product</p>
              <p className="text-xs text-gray-500 mt-1">
                Create store products
              </p>
            </Link>

            <Link
              href="/news/new"
              className="rounded-lg border border-gray-200 p-4 text-left hover:bg-orange-50 hover:border-orange-300 block transition"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 mb-3">
                <Newspaper size={20} className="text-orange-600" />
              </div>
              <p className="font-semibold text-gray-900">Publish News</p>
              <p className="text-xs text-gray-500 mt-1">
                Share updates instantly
              </p>
            </Link>
          </div>
        </div>

        {/* Activity */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Performance</h3>

          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mx-auto mb-3">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <p className="font-semibold text-gray-900">
              Analytics Coming Soon
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Advanced metrics and insights will be available here.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {courseCount === 0 &&
        productCount === 0 &&
        newsCount === 0 && (
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8 text-center">
            <div className="mb-4 text-5xl">🚀</div>

            <h3 className="text-2xl font-bold text-gray-900">
              Ready to Get Started?
            </h3>

            <p className="mt-3 text-gray-600 max-w-md mx-auto">
              Your admin portal is all set! Begin by creating your first course, product, or news article to get started.
            </p>

            <div className="mt-6 flex gap-4 justify-center">
              <Link
                href="/courses/new"
                className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Create First Course
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-white text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        )}
    </div>
  );
}