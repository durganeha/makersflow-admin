"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Search, Plus, ChevronRight, Edit2, Trash2 } from "lucide-react";

type Course = {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  is_free: boolean;
  is_published: boolean;
  created_at: string;
};

export default function CoursesPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      setCourses(data || []);
    }

    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch(level) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (published: boolean) => {
    return published ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-gray-600">
            Manage and create LMS courses
          </p>
        </div>

        <button
          onClick={() => router.push("/courses/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search courses by title..."
          className="w-full max-w-md border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Course Title</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Category</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Level</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Price</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="text-gray-600 font-medium">
                    {search ? "No courses found matching your search" : "No courses yet"}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {!search && "Create your first course to get started"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{course.title}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {course.category || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {course.is_free ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      `₹${course.price}`
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.is_published)}`}>
                      {course.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      {filteredCourses.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of <span className="font-semibold text-gray-900">{courses.length}</span> courses
        </div>
      )}
    </div>
  );
}