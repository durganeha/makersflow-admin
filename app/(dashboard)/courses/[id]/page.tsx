"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

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

export default function ViewCoursePage() {
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setCourse(data);
      setLoading(false);
    }
    fetchCourse();
  }, [id]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!course) return <div className="p-6 text-red-500">Course not found.</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => router.push("/courses")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} /> Back to Courses
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium text-gray-900">{course.category || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Level</p>
            <p className="font-medium text-gray-900 capitalize">{course.level}</p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-medium text-green-600">{course.is_free ? "Free" : `₹${course.price}`}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium text-gray-900">{course.is_published ? "Published" : "Draft"}</p>
          </div>
          <div>
            <p className="text-gray-500">Created At</p>
            <p className="font-medium text-gray-900">{new Date(course.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <button
          onClick={() => router.push(`/courses/${id}/edit`)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Edit Course
        </button>
      </div>
    </div>
  );
}