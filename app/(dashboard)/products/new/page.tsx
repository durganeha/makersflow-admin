"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [status, setStatus] = useState("active");
  const [inStock, setInStock] = useState(true);
  const [features, setFeatures] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  async function createProduct() {
    if (!title.trim()) {
      alert("Product name is required");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    setLoading(true);

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        title,
        slug,
        description,
        price: Number(price) || 0,
        original_price: Number(originalPrice) || 0,
        category,
        subcategory,
        status,
        in_stock: inStock,
        features: features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    if (!product) {
      alert("Failed to create product");
      return;
    }

    router.push("/products");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Product
        </h1>
        <p className="mt-2 text-gray-600">
          Add a new product to your store
        </p>
      </div>

      {/* Form */}
      <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-8 space-y-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Premium Starter Course Bundle"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your product in detail..."
              rows={4}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Slug
              </label>
              <input
                type="text"
                placeholder="e.g., premium-starter-bundle"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g., Courses"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subcategory
            </label>
            <input
              type="text"
              placeholder="e.g., Web Development"
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Features
            </label>
            <textarea
              placeholder="Feature 1, Feature 2, Feature 3"
              rows={3}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Sale Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Original Price
              </label>
              <input
                type="number"
                placeholder="0"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6 pb-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-900">Click to upload images</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
            </label>
          </div>

          {images.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-900">
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-2 cursor-pointer transition ${
                      thumbnailIndex === index ? "border-blue-600 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => setThumbnailIndex(index)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                    <label className="flex items-center gap-2 mt-2 text-xs">
                      <input
                        type="radio"
                        name="thumbnail"
                        checked={thumbnailIndex === index}
                        readOnly
                        className="cursor-pointer"
                      />
                      <span className="text-gray-600">
                        {thumbnailIndex === index ? "Thumbnail" : "Set as thumbnail"}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Availability</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/products")}
          className="px-6 py-2.5 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          onClick={createProduct}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {loading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </div>
  );
}
