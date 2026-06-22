"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    price: 0,
    status: "available",
    thumbnail_url: "",
  });

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setForm({
        title: data.title || "",
        category: data.category || "",
        price: data.price || 0,
        status: data.status || "available",
        thumbnail_url: data.thumbnail_url || "",
      });
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("products")
      .update(form)
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to save. Please try again.");
    } else {
      router.push("/products");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            type="number"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="available">Available</option>
            <option value="sold_out">Sold Out</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            placeholder="https://..."
          />
          {/* Preview */}
          {form.thumbnail_url && (
            <img
              src={form.thumbnail_url}
              alt="Thumbnail preview"
              className="mt-2 h-24 w-24 rounded-lg object-cover border border-gray-200"
            />
          )}
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