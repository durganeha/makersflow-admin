"use client";

import Link from "next/link";
import { BookOpen, Package, Newspaper} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

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
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-8 text-white">
        <h1 className="text-3xl font-bold">
          Welcome to MakersFlow Admin
        </h1>

        <p className="mt-2 text-slate-300">
          Manage courses, products, and news content from one place.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card className="shadow-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">
              Courses
            </CardTitle>
            <BookOpen className="h-5 w-5 text-indigo-600" />
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{courseCount}</p>
            <p className="mt-2 text-xs text-slate-500">
              Learning content
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">
              Products
            </CardTitle>
            <Package className="h-5 w-5 text-emerald-600" />
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{productCount}</p>
            <p className="mt-2 text-xs text-slate-500">
              Store inventory
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-slate-500">
              News Articles
            </CardTitle>
            <Newspaper className="h-5 w-5 text-amber-600" />
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">{newsCount}</p>
            <p className="mt-2 text-xs text-slate-500">
              Published updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/courses"
                className="rounded-xl border p-4 text-left hover:bg-slate-50 block"
              >
                <BookOpen className="mb-3 h-5 w-5" />
                <p className="font-medium">Create Course</p>
                <p className="text-xs text-slate-500">
                  Add new learning content
                </p>
              </Link>

              <Link
                href="/products"
                className="rounded-xl border p-4 text-left hover:bg-slate-50 block"
              >
                <Package className="mb-3 h-5 w-5" />
                <p className="font-medium">Add Product</p>
                <p className="text-xs text-slate-500">
                  Create store products
                </p>
              </Link>

              <Link
                href="/news"
                className="rounded-xl border p-4 text-left hover:bg-slate-50 block"
              >
                <Newspaper className="mb-3 h-5 w-5" />
                <p className="font-medium">Publish News</p>
                <p className="text-xs text-slate-500">
                  Share updates instantly
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="font-medium">
                No recent activity
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Activity will appear once content is created.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {courseCount === 0 &&
        productCount === 0 &&
        newsCount === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="mb-4 text-5xl">🚀</div>

              <h3 className="text-2xl font-semibold">
                Your Admin Portal is Ready
              </h3>

              <p className="mt-3 text-slate-500">
                Start by creating your first course,
                product, or news article.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}