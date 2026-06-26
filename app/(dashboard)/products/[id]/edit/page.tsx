"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    category: "",
    features: "",
    price: 0,
    original_price: 0,
    in_stock: true,
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
        slug: data.slug || "",
        description: data.description || "",
        category: data.category || "",
        features: Array.isArray(data.features)
          ? data.features.join(", ")
          : data.features || "",
        price: data.price || 0,
        original_price: data.original_price || 0,
        in_stock: data.in_stock ?? true,
        status: data.status || "available",
        thumbnail_url: data.thumbnail_url || "",
      });
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  async function uploadFile(file: File) {
    setUploadError("");

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Unsupported file type. Use PNG, JPG, WEBP, MP4, MOV, or WEBM.");
      return;
    }

    const isVideo = file.type.startsWith("video/");
    const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`File too large. Images: 5 MB max, Videos: 100 MB max.`);
      return;
    }

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${id}-${Date.now()}.${fileExt}`;

    const { error: uploadErr } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadErr) {
      setUploadError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    setForm((prev) => ({ ...prev, thumbnail_url: publicUrlData.publicUrl }));
    setUploading(false);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        ...form,
        features: form.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      })
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

        {/* Slug */}
        <div>
          <label className="text-sm font-medium text-gray-700">Slug</label>
          <input
            placeholder="e.g., premium-starter-bundle"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            placeholder="Describe your product in detail..."
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Features <span className="text-gray-400 font-normal">(comma separated)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Feature 1, Feature 2, Feature 3"
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            value={form.features}
            onChange={(e) => setForm({ ...form, features: e.target.value })}
          />
        </div>

        {/* Price + Original Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Sale Price (₹)</label>
            <input
              type="number"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Original Price (₹) <span className="text-gray-400 font-normal">(for strikethrough)</span>
            </label>
            <input
              type="number"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={form.original_price}
              onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
            />
          </div>
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

        {/* In Stock toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="in_stock"
            checked={form.in_stock}
            onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="in_stock" className="text-sm font-medium text-gray-700">
            In Stock
          </label>
        </div>

        {/* Product Media — upload */}
        <div>
          <label className="text-sm font-medium text-gray-700">Product Media</label>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-6 py-10 text-center cursor-pointer transition ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Upload size={28} className="text-gray-400" />
            <p className="font-medium text-gray-900">
              {uploading ? "Uploading..." : "Click or drag & drop to upload"}
            </p>
            <p className="text-xs text-gray-500">
              Images: PNG, JPG, WEBP &nbsp;|&nbsp; Videos: MP4, MOV, WEBM
            </p>
            <p className="text-xs text-gray-400">
              Up to 10 files · Images 5 MB · Videos 100 MB
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime,video/webm"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {uploadError && (
            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
          )}
        </div>

        {/* Thumbnail URL — manual entry still supported */}
        <div>
          <label className="text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            placeholder="https://..."
          />
          <p className="mt-1 text-xs text-gray-400">
            Set automatically when you upload a file above, or paste your own URL.
          </p>

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
          disabled={saving || uploading}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}