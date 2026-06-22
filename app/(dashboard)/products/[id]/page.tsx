"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Edit2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  thumbnail_url: string;
  created_at: string;
};

export default function ViewProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

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

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!product) return <div className="p-6 text-red-500">Product not found.</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Thumbnail */}
        {product.thumbnail_url && (
          <img
            src={product.thumbnail_url}
            alt={product.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}

        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
            {formatStatus(product.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium text-gray-900">{product.category || "—"}</p>
          </div>
          <div>
            <p className="text-gray-500">Price</p>
            <p className="font-semibold text-gray-900">₹{product.price}</p>
          </div>
          <div>
            <p className="text-gray-500">Created At</p>
            <p className="font-medium text-gray-900">
              {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push(`/products/${id}/edit`)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Edit2 size={16} />
          Edit Product
        </button>
      </div>
    </div>
  );
}