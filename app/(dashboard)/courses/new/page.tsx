"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";

export default function NewCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [level, setLevel] = useState("beginner");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function createCourse() {
    if (!title.trim()) {
      alert("Course title is required");
      return;
    }

    setLoading(true);
    const finalPrice = isFree ? 0 : Number(price);

    const { error } = await supabase
      .from("courses")
      .insert({
        title,
        description,
        slug,
        thumbnail_url: thumbnailUrl,
        category,
        price: finalPrice,
        is_free: isFree,
        level,
        is_published: isPublished,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/courses");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/courses")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          Back to Courses
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="mt-2 text-gray-600">
          Add all the details about your course below
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Introduction to React"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => {
                const newTitle = e.target.value;
                setTitle(newTitle);
                setSlug(generateSlug(newTitle));
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe what students will learn in this course..."
              rows={4}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Slug
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="auto-generated-from-title"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                🔗 yoursite.com/courses/
                <span className="text-gray-800 font-medium">
                  {slug || "auto-generated-from-title"}
                </span>
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g., Web Development"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing & Level */}
        <div className="space-y-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pricing & Level</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Level
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Price
              </label>
              <input
                type="number"
                disabled={isFree}
                placeholder="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={isFree ? "0" : price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => {
                setIsFree(e.target.checked);
                if (e.target.checked) setPrice("0");
              }}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Make this course free
            </span>
          </label>
        </div>

        {/* Publishing */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Publishing</h2>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">
              Publish course immediately
            </span>
          </label>

          <p className="text-xs text-gray-500 ml-7">
            Published courses will be visible to students
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/courses")}
          className="px-6 py-2.5 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          onClick={createCourse}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {loading ? "Creating..." : "Create Course"}
        </button>
      </div>
    </div>
  );
}