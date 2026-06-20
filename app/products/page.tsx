"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

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

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">
            Manage store products
          </p>
        </div>

        <button
          onClick={() => router.push("/products/new")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <input
        placeholder="Search products..."
        className="w-full max-w-md border p-3 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Image</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    {product.thumbnail_url && (
                      <img
                        src={product.thumbnail_url}
                        alt={product.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                  </td>

                  <td className="p-4">{product.title}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">₹{product.price}</td>
                  <td className="p-4 capitalize">
                    {product.status}
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