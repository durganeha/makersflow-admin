"use client";

import { useState } from "react";

export default function ModulesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Modules</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Module
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 mt-6 space-y-4">
          <input
            placeholder="Course ID"
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Module Title"
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Position"
            className="w-full border p-2 rounded"
            type="number"
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create Module
          </button>
        </div>
      )}

      <div className="mt-6 border rounded-lg p-4">
        No modules found
      </div>
    </div>
  );
}