"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-1 text-gray-600">
            Organize your store with categories
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Category</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Web Development"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Slug
              </label>
              <input
                placeholder="e.g., web-development"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated URL-friendly name</p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowForm(false);
                setCategoryName("");
                setCategorySlug("");
              }}
              className="px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Create Category
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="text-5xl mb-4">🏷️</div>
          <p className="text-gray-900 font-medium">No categories created yet</p>
          <p className="text-gray-600 text-sm mt-2">Create your first category to organize your store products</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Products</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: any) => (
                <tr key={category.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">{category.slug}</td>
                  <td className="px-6 py-4 text-gray-600">{category.count || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}