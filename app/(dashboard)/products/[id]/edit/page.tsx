"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload, X, Star, Play } from "lucide-react";

type Category = { id: string; name: string };
type ExistingMedia = { url: string; type: "image" | "video" };

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Existing media from DB
  const [existingMedia, setExistingMedia] = useState<ExistingMedia[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

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
  });

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (!error && data) setCategories(data);
    }
    fetchCategories();
  }, []);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) { console.error(error); setLoading(false); return; }

      setForm({
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
      });

      setThumbnailUrl(data.thumbnail_url || "");

      // Build existing media list from images[] and videos[]
      const images: ExistingMedia[] = (data.images || []).map((url: string) => ({ url, type: "image" }));
      const videos: ExistingMedia[] = (data.videos || []).map((url: string) => ({ url, type: "video" }));
      setExistingMedia([...images, ...videos]);

      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  // Add new category inline
  async function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setAddingCategory(true);
    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug })
      .select("id, name")
      .single();
    if (error) {
      alert(error.message);
    } else if (data) {
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setForm((prev) => ({ ...prev, category: data.name }));
      setNewCategoryName("");
      setShowAddCategory(false);
    }
    setAddingCategory(false);
  }

  // Remove existing media
  async function removeExistingMedia(index: number) {
    const media = existingMedia[index];
    const updated = existingMedia.filter((_, i) => i !== index);
    setExistingMedia(updated);

    const images = updated.filter((m) => m.type === "image").map((m) => m.url);
    const videos = updated.filter((m) => m.type === "video").map((m) => m.url);
    const newThumb = thumbnailUrl === media.url ? (images[0] || "") : thumbnailUrl;
    setThumbnailUrl(newThumb);

    await supabase.from("products").update({
      images,
      videos,
      thumbnail_url: newThumb || null,
    }).eq("id", id);
  }

  // Set thumbnail
  function setAsThumbnail(url: string) {
    setThumbnailUrl(url);
  }

  // Upload new file
  async function uploadFile(file: File) {
    setUploadError("");
    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "video/mp4", "video/quicktime", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Unsupported file type.");
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
    if (uploadErr) { setUploadError(uploadErr.message); setUploading(false); return; }

    const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    const newUrl = publicUrlData.publicUrl;
    const newType: "image" | "video" = isVideo ? "video" : "image";
    const updatedMedia = [...existingMedia, { url: newUrl, type: newType }];
    setExistingMedia(updatedMedia);

    const images = updatedMedia.filter((m) => m.type === "image").map((m) => m.url);
    const videos = updatedMedia.filter((m) => m.type === "video").map((m) => m.url);
    const newThumb = thumbnailUrl || (newType === "image" ? newUrl : "");
    setThumbnailUrl(newThumb);

    await supabase.from("products").update({
      images,
      videos,
      thumbnail_url: newThumb || null,
    }).eq("id", id);

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
    const { error } = await supabase.from("products").update({
      ...form,
      thumbnail_url: thumbnailUrl || null,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    }).eq("id", id);
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
      <button onClick={() => router.push("/products")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        {/* Slug */}
        <div>
          <label className="text-sm font-medium text-gray-700">Slug</label>
          <input className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea rows={4} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        {/* Category dropdown with inline add */}
        <div>
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            value={form.category}
            onChange={(e) => {
              if (e.target.value === "__add_new__") {
                setShowAddCategory(true);
              } else {
                setForm({ ...form, category: e.target.value });
                setShowAddCategory(false);
              }
            }}
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
            <option value="__add_new__">➕ Add new category...</option>
          </select>

          {showAddCategory && (
            <div className="mt-2 flex gap-2 items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <input
                type="text"
                autoFocus
                placeholder="New category name..."
                className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCategory();
                  if (e.key === "Escape") { setShowAddCategory(false); setNewCategoryName(""); }
                }}
              />
              <button type="button" onClick={handleAddCategory} disabled={addingCategory || !newCategoryName.trim()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
                {addingCategory ? "Adding..." : "Add"}
              </button>
              <button type="button" onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }}
                className="px-3 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-100 transition">
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <label className="text-sm font-medium text-gray-700">Features <span className="text-gray-400 font-normal">(comma separated)</span></label>
          <textarea rows={3} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Sale Price (₹)</label>
            <input type="number" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Original Price (₹)</label>
            <input type="number" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={form.original_price} onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })} />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="available">Available</option>
            <option value="sold_out">Sold Out</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* In Stock */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="in_stock" checked={form.in_stock}
            onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} className="w-4 h-4" />
          <label htmlFor="in_stock" className="text-sm font-medium text-gray-700">In Stock</label>
        </div>

        {/* Product Media */}
        <div>
          <label className="text-sm font-medium text-gray-700">Product Media</label>

          {/* Existing media grid */}
          {existingMedia.length > 0 && (
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {existingMedia.map((media, index) => (
                <div key={index}
                  onClick={() => media.type === "image" && setAsThumbnail(media.url)}
                  className={`relative group rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                    thumbnailUrl === media.url ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {media.type === "image" ? (
                    <img src={media.url} alt="" className="w-full h-24 object-cover" />
                  ) : (
                    <div className="relative w-full h-24 bg-gray-900">
                      <video src={media.url} className="w-full h-full object-cover opacity-80" muted />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={24} className="text-white drop-shadow" />
                      </div>
                    </div>
                  )}

                  {thumbnailUrl === media.url && media.type === "image" && (
                    <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={9} /> Thumb
                    </div>
                  )}

                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-full capitalize">
                    {media.type}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); removeExistingMedia(index); }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mb-2">💡 Click an image to set it as thumbnail. Hover to remove.</p>

          {/* Upload drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-6 py-8 text-center cursor-pointer transition ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Upload size={24} className="text-gray-400" />
            <p className="text-sm font-medium text-gray-900">
              {uploading ? "Uploading..." : "Click or drag & drop to add more"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, WEBP · MP4, MOV, WEBM</p>
            <input ref={fileInputRef} type="file"
              accept="image/png,image/jpeg,image/webp,video/mp4,video/quicktime,video/webm"
              className="hidden" onChange={handleFileSelect} />
          </div>

          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>

        <button onClick={handleSave} disabled={saving || uploading}
          className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}