"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function ModulesPage() {
  const [showForm, setShowForm] = useState(false);
  const [modules, setModules] = useState([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="mt-1 text-gray-600">
            Organize course content into modules
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus size={18} />
          Add Module
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Create New Module</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Course ID <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Select a course"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Module Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Introduction to Basics"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Order
              </label>
              <input
                type="number"
                placeholder="1"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
              Create Module
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {modules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-900 font-medium">No modules created yet</p>
          <p className="text-gray-600 text-sm mt-2">Start by creating your first module for a course</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Course</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Lessons</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module: any) => (
                <tr key={module.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{module.title}</td>
                  <td className="px-6 py-4 text-gray-600">{module.course}</td>
                  <td className="px-6 py-4 text-gray-600">{module.lessons}</td>
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