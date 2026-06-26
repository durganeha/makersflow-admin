"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Search, Plus, Edit2, Trash2, Eye, BookOpen } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    }

    loadCourses();
  }, []);

  const handleView = (id: string) => {
    router.push(`/courses/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/courses/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this course? All modules and lessons will also be deleted. This cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete course. Please try again.");
    } else {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }

    setDeletingId(null);
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (published: boolean) =>
    published ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-gray-500 text-sm">
            Manage and create LMS courses
          </p>
        </div>

        <button
          onClick={() => router.push("/courses/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5
            rounded-lg hover:bg-blue-700 transition font-medium text-sm"
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search courses by title..."
          className="w-full border border-gray-300 pl-9 pr-4 py-2.5 rounded-lg text-sm
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Loading skeleton */}
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-48" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
                <div className="h-4 bg-gray-200 rounded w-16 ml-auto" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Course Title
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Level
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Price
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <BookOpen size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          {search ? "No courses match your search" : "No courses yet"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {!search
                            ? "Click 'Add Course' to create your first course"
                            : "Try a different search term"}
                        </p>
                      </div>
                      {!search && (
                        <button
                          onClick={() => router.push("/courses/new")}
                          className="flex items-center gap-1.5 text-sm text-blue-600
                            hover:text-blue-700 font-medium transition mt-1"
                        >
                          <Plus size={14} />
                          Create first course
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 transition group"
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">
                        {course.title}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {course.category || "—"}
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                          ${getLevelColor(course.level)}`}
                      >
                        {course.level
                          ? course.level.charAt(0).toUpperCase() +
                            course.level.slice(1)
                          : "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm">
                      {course.is_free ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        <span className="text-gray-900 font-medium">
                          ₹{course.price}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                          ${getStatusColor(course.is_published)}`}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {/* View — opens wizard at step 1 */}
                        <button
                          onClick={() => handleView(course.id)}
                          title="View course"
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => handleEdit(course.id)}
                          title="Edit course"
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(course.id)}
                          title="Delete course"
                          disabled={deletingId === course.id}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition
                            disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer count */}
      {!loading && filteredCourses.length > 0 && (
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredCourses.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{courses.length}</span>{" "}
          courses
        </p>
      )}
    </div>
  );
}