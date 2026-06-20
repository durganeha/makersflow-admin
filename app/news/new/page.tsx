"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");

  async function createArticle() {
    const { error } = await supabase
      .from("news")
      .insert({
        title,
        slug,
        content,
        status,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Article created successfully");

    router.push("/news");
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/news")}
          className="border px-4 py-2 rounded"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">
          Create Article
        </h1>
      </div>

      <div className="border rounded-lg p-6 space-y-4">

        <div>
          <label className="block mb-2 font-medium">
            Article Title
          </label>

          <input
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Slug
          </label>

          <input
            className="w-full border p-3 rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Article Content
          </label>

          <textarea
            className="w-full border p-3 rounded h-48"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Status
          </label>

          <select
            className="w-full border p-3 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">
              Published
            </option>
          </select>
        </div>

        <button
          onClick={createArticle}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Article
        </button>
      </div>
    </div>
  );
}