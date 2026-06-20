"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-500">
            Manage LMS courses
          </p>
        </div>

        <button
          onClick={() => router.push("/courses/new")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Course
        </button>
      </div>

      <input
        placeholder="Search courses..."
        className="w-full max-w-md border p-3 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Level</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4">
                  No courses found
                </td>
              </tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course.id} className="border-t">
                  <td className="p-4">{course.title}</td>
                  <td className="p-4">{course.category}</td>
                  <td className="p-4">{course.level}</td>
                  <td className="p-4">
                    {course.is_free
                      ? "Free"
                      : `₹${course.price}`}
                  </td>
                  <td className="p-4">
                    {course.is_published
                      ? "Published"
                      : "Draft"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}