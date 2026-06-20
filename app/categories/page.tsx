"use client";

import { useState } from "react";

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 mt-6 space-y-4">
          <input
            placeholder="Category Name"
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Slug"
            className="w-full border p-2 rounded"
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create Category
          </button>
        </div>
      )}

      <div className="mt-6 border rounded-lg p-4">
        No categories found
      </div>
    </div>
  );
}