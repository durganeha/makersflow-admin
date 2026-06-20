"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: string;
};

export default function NewsPage() {
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setArticles(data || []);
    }

    loadArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News Articles</h1>
          <p className="text-gray-500">
            Manage news articles
          </p>
        </div>

        <button
          onClick={() => router.push("/news/new")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Article
        </button>
      </div>

      <input
        placeholder="Search articles..."
        className="w-full max-w-md border p-3 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredArticles.length === 0 ? (
              <tr>
                <td className="px-4 py-3" colSpan={3}>
                  No articles found
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => (
                <tr key={article.id} className="border-t">
                  <td className="px-4 py-3">
                    {article.title}
                  </td>
                  <td className="px-4 py-3">
                    {article.slug}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {article.status}
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