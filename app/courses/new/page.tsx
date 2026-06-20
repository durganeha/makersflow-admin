"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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

  async function createCourse() {
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

    if (error) {
      alert(error.message);
      return;
    }

    alert("Course created successfully");

    router.push("/courses");
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/courses")}
          className="border px-3 py-2 rounded"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">
          Create Course
        </h1>
      </div>

      <div className="border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
        <label className="text-sm font-medium">
            Course Title
        </label>

        <input
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />
        </div>

        <div className="space-y-2">
        <label className="text-sm font-medium">
            Description
        </label>

        <textarea
            className="w-full border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
        />
        </div>

        <div className="space-y-2">
        <label className="text-sm font-medium">
            Slug
        </label>

        <input
            className="w-full border p-3 rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
        />
        </div>

        <div className="space-y-2">
        <label className="text-sm font-medium">
            Thumbnail URL
        </label>

        <input
            type="url"
            placeholder="https://" 
            className="w-full border p-3 rounded"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
        />
        </div>

        <div className="space-y-2">
        <label className="text-sm font-medium">
            Category
        </label>

        <input
            className="w-full border p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
        />
        </div>

        <div className="space-y-2">
        <label className="text-sm font-medium">
            Price
        </label>

        <input
            type="number"
            disabled={isFree}
            className="w-full border p-3 rounded"
            value={isFree ? "0" : price}
            onChange={(e) => setPrice(e.target.value)}
        />
        </div>

        <div className="space-y-2">
        <label className="text-sm font-medium">
            Level
        </label>

        <select
            className="w-full border p-3 rounded"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
        >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
        </select>
        </div>

        <div className="flex items-center gap-2">
        <input
            type="checkbox"
            checked={isFree}
            onChange={(e) => {
            setIsFree(e.target.checked);

            if (e.target.checked) {
                setPrice("0");
            }
            }}
        />

        <label className="text-sm font-medium">
            Free Course
        </label>
        </div>

        <div className="flex items-center gap-2">
        <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
        />

        <label className="text-sm font-medium">
            Publish Course
        </label>
        </div>

        <button
          onClick={createCourse}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Course
        </button>
      </div>
    </div>
  );
}