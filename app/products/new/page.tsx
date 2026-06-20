"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

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
  const [video, setVideo] = useState<File | null>(null);

  async function createProduct() {
    if (images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        title,
        slug,
        description,
        price: Number(price),
        original_price: Number(originalPrice),
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

    if (error) {
      alert(error.message);
      return;
    }

    if (!product) {
      alert("Failed to create product");
      return;
    }

    const productId = product.id;

    // Upload images
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const path = `${productId}/${Date.now()}-${image.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, image);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      const { error: mediaError } = await supabase
        .from("product_media")
        .insert({
          product_id: productId,
          media_type: "image",
          media_url: data.publicUrl,
          display_order: i,
          is_thumbnail: i === thumbnailIndex,
        });

      if (mediaError) {
        console.error("Media insert failed:", mediaError);
      }
    }

    alert("Product created successfully");
    router.push("/products");
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push("/products")}
          className="border px-4 py-2 rounded"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold">Create Product</h1>
      </div>

      {/* Form */}
      <div className="border rounded-lg p-6 space-y-4">

        {/* Product Name */}
        <div>
          <label className="block mb-2 font-medium">Product Name</label>
          <input
            className="w-full border p-3 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            className="w-full border p-3 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block mb-2 font-medium">Slug</label>
          <input
            className="w-full border p-3 rounded"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        {/* Product Images */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Images
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files || []))}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload multiple product images
            </p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((file, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-2 bg-white shadow-sm"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <label className="flex items-center gap-2 mt-3 text-sm">
                    <input
                      type="radio"
                      name="thumbnail"
                      checked={thumbnailIndex === index}
                      onChange={() => setThumbnailIndex(index)}
                    />
                    Thumbnail
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Video */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Product Video
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] || null)}
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-2">Upload demo video</p>
          </div>

          {video && (
            <video controls className="w-full max-w-md rounded-xl border">
              <source src={URL.createObjectURL(video)} type={video.type} />
            </video>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block mb-2 font-medium">Price</label>
          <input
            type="number"
            className="w-full border p-3 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Original Price */}
        <div>
          <label className="block mb-2 font-medium">Original Price</label>
          <input
            type="number"
            className="w-full border p-3 rounded"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-2 font-medium">Category</label>
          <input
            className="w-full border p-3 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Subcategory */}
        <div>
          <label className="block mb-2 font-medium">Subcategory</label>
          <input
            className="w-full border p-3 rounded"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          />
        </div>

        {/* Features */}
        <div>
          <label className="block mb-2 font-medium">Features</label>
          <textarea
            placeholder="Feature 1, Feature 2, Feature 3"
            className="w-full border p-3 rounded"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>

        {/* In Stock */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label>In Stock</label>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 font-medium">Status</label>
          <select
            className="w-full border p-3 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Submit */}
        <button
          onClick={createProduct}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Product
        </button>

      </div>
    </div>
  );
}
