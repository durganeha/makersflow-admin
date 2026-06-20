"use client";

import { useState } from "react";

export default function LessonsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lessons</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Lesson
        </button>
      </div>

      {showForm && (
        <div className="border rounded-lg p-4 mt-6 space-y-4">
          <input
            placeholder="Module ID"
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Lesson Title"
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Lesson Content"
            className="w-full border p-2 rounded min-h-[120px]"
          />

          <input
            placeholder="Video URL"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Position"
            className="w-full border p-2 rounded"
          />

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create Lesson
          </button>
        </div>
      )}

      <div className="mt-6 border rounded-lg p-4">
        No lessons found
      </div>
    </div>
  );
}