"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Search, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { deleteFromS3, extractS3Key } from "@/lib/s3Upload";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  thumbnail_url: string;
};

export default function ProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setProducts(data || []);
    }

    loadProducts();
  }, []);

  const handleView = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

const handleDelete = async (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this product? This action cannot be undone.");
  if (!confirmed) return;

  setDeletingId(id);

  try {
    // get the product's media URLs before deleting
    const { data: product } = await supabase
      .from("products")
      .select("thumbnail_url, images, videos")
      .eq("id", id)
      .single();

    // delete the product from Supabase first
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product. Please try again.");
      setDeletingId(null);
      return;
    }

    // update the UI
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // delete all media from S3
    if (product) {
      const allUrls = [
        ...(product.images || []),
        ...(product.videos || []),
      ];

      // delete all images and videos
      for (const url of allUrls) {
        const key = extractS3Key(url, 'products');
        if (key) await deleteFromS3(key);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    setDeletingId(null);
  }
};

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "sold_out":  return "bg-red-100 text-red-800";
      case "archived":  return "bg-gray-100 text-gray-800";
      default:          return "bg-blue-100 text-blue-800";
    }
  };

  const formatStatus = (status: string) => {
    if (!status) return "Active";
    return status.replace("_", " ").charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-gray-600">Manage your store products</p>
        </div>

        <button
          onClick={() => router.push("/products/new")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          placeholder="Search products by name..."
          className="w-full max-w-md border border-gray-300 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Product</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Category</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Price</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <div className="text-gray-600 font-medium">
                    {search ? "No products found matching your search" : "No products yet"}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {!search && "Add your first product to get started"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.thumbnail_url && (
                        <img
                          src={product.thumbnail_url}
                          alt={product.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      )}
                      <p className="font-medium text-gray-900">{product.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {product.category || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {formatStatus(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">

                      {/* VIEW */}
                      <button
                        onClick={() => handleView(product.id)}
                        title="View product"
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        <Eye size={16} />
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => handleEdit(product.id)}
                        title="Edit product"
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(product.id)}
                        title="Delete product"
                        disabled={deletingId === product.id}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      {filteredProducts.length > 0 && (
        <div className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">{products.length}</span>{" "}
          products
        </div>
      )}
    </div>
  );
}