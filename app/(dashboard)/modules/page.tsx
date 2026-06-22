"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, BookOpen } from "lucide-react";

type Course = {
  id: string;
  title: string;
};

type Module = {
  id: string;
  title: string;
  course_id: string;
  order: number;
  courses?: { title: string }; // joined from courses table
};

const emptyForm = { title: "", course_id: "", order: 1 };

export default function ModulesPage() {
  const [modules, setModules]     = useState<Module[]>([]);
  const [courses, setCourses]     = useState<Course[]>([]);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);

  // ── Load data ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      // Fetch modules joined with course title
      const { data: modulesData, error: modulesError } = await supabase
        .from("modules")
        .select("*, courses(title)")
        .order("order", { ascending: true });

      if (modulesError) console.error(modulesError);
      else setModules(modulesData || []);

      // Fetch courses for the dropdown
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("id, title")
        .order("title", { ascending: true });

      if (coursesError) console.error(coursesError);
      else setCourses(coursesData || []);

      setLoading(false);
    }

    load();
  }, []);

  // ── Open edit form ─────────────────────────────────────────
  const handleEditClick = (module: Module) => {
    setForm({
      title:     module.title,
      course_id: module.course_id,
      order:     module.order,
    });
    setEditingId(module.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Cancel form ────────────────────────────────────────────
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ── Save (create or update) ────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Module title is required.");
      return;
    }
    if (!form.course_id) {
      alert("Please select a course.");
      return;
    }

    setSaving(true);

    if (editingId) {
      // UPDATE
      const { error } = await supabase
        .from("modules")
        .update({ title: form.title, course_id: form.course_id, order: form.order })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Failed to update module.");
      } else {
        setModules((prev) =>
          prev.map((m) =>
            m.id === editingId
              ? {
                  ...m,
                  title:     form.title,
                  course_id: form.course_id,
                  order:     form.order,
                  courses:   { title: courses.find((c) => c.id === form.course_id)?.title || "" },
                }
              : m
          )
        );
        handleCancel();
      }
    } else {
      // CREATE
      const { data, error } = await supabase
        .from("modules")
        .insert({ title: form.title, course_id: form.course_id, order: form.order })
        .select("*, courses(title)")
        .single();

      if (error) {
        console.error(error);
        alert("Failed to create module.");
      } else {
        setModules((prev) => [...prev, data]);
        handleCancel();
      }
    }

    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this module? All its lessons may be affected."
    );
    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("modules").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete module.");
    } else {
      setModules((prev) => prev.filter((m) => m.id !== id));
    }

    setDeletingId(null);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modules</h1>
          <p className="mt-1 text-gray-600">Organize course content into modules</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={18} />
            Add Module
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit Module" : "Create New Module"}
          </h3>

          <div className="space-y-4">

            {/* Course dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={form.course_id}
                onChange={(e) => setForm({ ...form, course_id: e.target.value })}
              >
                <option value="">— Select a course —</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Module Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Introduction to Basics"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Order{" "}
                <span className="text-gray-400 text-xs">(display position within the course)</span>
              </label>
              <input
                type="number"
                min={1}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
            >
              <X size={16} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : editingId ? "Update Module" : "Create Module"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading modules...</div>
      ) : modules.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <p className="text-gray-900 font-medium">No modules created yet</p>
          <p className="text-gray-600 text-sm mt-2">
            Start by creating your first module for a course
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Order</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Module Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Course</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr
                  key={module.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {module.order}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen size={16} className="text-gray-400 shrink-0" />
                      <p className="font-medium text-gray-900">{module.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {module.courses?.title || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">

                      {/* EDIT */}
                      <button
                        onClick={() => handleEditClick(module)}
                        title="Edit module"
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => handleDelete(module.id)}
                        title="Delete module"
                        disabled={deletingId === module.id}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                      >
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

      {/* Footer count */}
      {modules.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{modules.length}</span> module{modules.length !== 1 ? "s" : ""} total
        </div>
      )}
    </div>
  );
}