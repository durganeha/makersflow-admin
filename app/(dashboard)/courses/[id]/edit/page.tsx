"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    thumbnail_url: "",
    category: "",
    level: "beginner",
    price: 0,
    is_free: true,
    is_published: false,
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (!error && data) setCategories(data);
    }

    async function fetchCourse() {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else
        setForm({
          title: data.title,
          description: data.description || "",
          slug: data.slug || "",
          thumbnail_url: data.thumbnail_url || "",
          category: data.category || "",
          level: data.level,
          price: data.price,
          is_free: data.is_free,
          is_published: data.is_published,
        });
      setLoading(false);
    }

    fetchCategories();
    fetchCourse();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("courses")
      .update(form)
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to save. Please try again.");
    } else {
      router.push("/courses");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => router.push("/courses")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} /> Back to Courses
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            placeholder="Describe what students will learn in this course..."
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-sm font-medium text-gray-700">Slug</label>
          <input
            placeholder="e.g., intro-to-react"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
          />
        </div>

        {/* Category dropdown */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">
              No categories found.{" "}
              <button
                type="button"
                onClick={() => router.push("/categories")}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Create one first
              </button>
            </p>
          )}
        </div>

        {/* Level */}
        <div>
          <label className="text-sm font-medium text-gray-700">Level</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Free toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_free"
            checked={form.is_free}
            onChange={(e) => setForm({ ...form, is_free: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="is_free" className="text-sm font-medium text-gray-700">
            Free Course
          </label>
        </div>

        {/* Price — only show if not free */}
        {!form.is_free && (
          <div>
            <label className="text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
        )}

        {/* Published toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_published"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
            Published
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}