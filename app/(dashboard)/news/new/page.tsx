"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);

  async function createArticle() {
    if (!title.trim()) {
      alert("Article title is required");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("news")
      .insert({
        title,
        slug,
        content,
        status,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/news");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/news")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          Back to News
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Publish New Article
        </h1>
        <p className="mt-2 text-gray-600">
          Create and publish a news article to keep your community updated
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-8 space-y-8">
        {/* Article Content */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Article Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Q4 Updates and Announcements"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Slug
            </label>
            <input
              type="text"
              placeholder="e.g., q4-updates-announcements"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated URL-friendly name</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Article Content <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Write your article content here..."
              rows={8}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="space-y-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Publishing</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Status
            </label>
            <select
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <p className="text-xs text-gray-500">
            {status === "draft" 
              ? "This article will be saved as a draft and not visible to the public."
              : "This article will be published immediately and visible to everyone."}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/news")}
          className="px-6 py-2.5 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          onClick={createArticle}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {loading ? "Publishing..." : "Publish Article"}
        </button>
      </div>
    </div>
  );
}