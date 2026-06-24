"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, PlayCircle, Clock } from "lucide-react";

type Course = {
  id: number;
  title: string;
};

type Module = {
  id: number;
  title: string;
  course_id: number;
};

type Lesson = {
  id: number;
  title: string;
  module_id: number;
  content: string;
  video_url: string;
  duration_secs: number;
  order_index: number;
  is_preview: boolean;
  modules?: { title: string };
};

const emptyForm = {
  title:        "",
  module_id:    0,
  content:      "",
  video_url:    "",
  duration:     0,   // shown in minutes in the UI
  order_index:  1,
  is_preview:   false,
};

export default function LessonsPage() {
  const [lessons, setLessons]     = useState<Lesson[]>([]);
  const [courses, setCourses]     = useState<Course[]>([]);
  const [modules, setModules]     = useState<Module[]>([]);

  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [saving, setSaving]       = useState(false);
  const [loading, setLoading]     = useState(true);

  // ── Load all data ───────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const [lessonsRes, coursesRes, modulesRes] = await Promise.all([
        supabase
          .from("lessons")
          .select("*, modules(title)")
          .order("order_index", { ascending: true }),
        supabase
          .from("courses")
          .select("id, title")
          .order("title", { ascending: true }),
        supabase
          .from("modules")
          .select("id, title, course_id")
          .order("order_index", { ascending: true }),
      ]);

      if (lessonsRes.error) console.error(lessonsRes.error);
      else setLessons(lessonsRes.data || []);

      if (coursesRes.error) console.error(coursesRes.error);
      else setCourses(coursesRes.data || []);

      if (modulesRes.error) console.error(modulesRes.error);
      else setModules(modulesRes.data || []);

      setLoading(false);
    }

    load();
  }, []);

  // ── Filter modules by selected course ──────────────────────
  const filteredModules = useMemo(() => {
    if (!selectedCourseId) return [];
    return modules.filter((m) => m.course_id === selectedCourseId);
  }, [selectedCourseId, modules]);

  // ── When course changes ────────────────────────────────────
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId ? Number(courseId) : null);
    setForm((prev) => ({ ...prev, module_id: 0 }));
  };

  // ── Open edit form ─────────────────────────────────────────
  const handleEditClick = (lesson: Lesson) => {
    const mod = modules.find((m) => m.id === lesson.module_id);
    setSelectedCourseId(mod?.course_id || null);
    setForm({
      title:       lesson.title,
      module_id:   lesson.module_id,
      content:     lesson.content    || "",
      video_url:   lesson.video_url  || "",
      duration:    lesson.duration_secs ? Math.round(lesson.duration_secs / 60) : 0,
      order_index: lesson.order_index || 1,
      is_preview:  lesson.is_preview  || false,
    });
    setEditingId(lesson.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Cancel form ────────────────────────────────────────────
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setSelectedCourseId(null);
    setForm(emptyForm);
  };

  // ── Save (create or update) ────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Lesson title is required.");
      return;
    }
    if (!form.module_id) {
      alert("Please select a module.");
      return;
    }

    setSaving(true);

    const payload = {
      title:         form.title,
      module_id:     form.module_id,
      content:       form.content,
      video_url:     form.video_url,
      duration_secs: form.duration * 60,  // convert minutes → seconds
      order_index:   form.order_index,
      is_preview:    form.is_preview,
    };

    if (editingId) {
      const { error } = await supabase
        .from("lessons")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Failed to update lesson.");
      } else {
        const modTitle = modules.find((m) => m.id === form.module_id)?.title || "";
        setLessons((prev) =>
          prev.map((l) =>
            l.id === editingId
              ? {
                  ...l,
                  ...payload,
                  modules: { title: modTitle },
                }
              : l
          )
        );
        handleCancel();
      }
    } else {
      const { data, error } = await supabase
        .from("lessons")
        .insert(payload)
        .select("*, modules(title)")
        .single();

      if (error) {
        console.error(error);
        alert("Failed to create lesson.");
      } else {
        setLessons((prev) => [...prev, data]);
        handleCancel();
      }
    }

    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    const confirmed = confirm(
      "Are you sure you want to delete this lesson? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeletingId(id);

    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete lesson.");
    } else {
      setLessons((prev) => prev.filter((l) => l.id !== id));
    }

    setDeletingId(null);
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="mt-1 text-gray-600">Create and manage course lessons</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={18} />
            Add Lesson
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingId ? "Edit Lesson" : "Create New Lesson"}
          </h3>

          <div className="space-y-4">

            {/* Step 1: Pick Course */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={selectedCourseId ?? ""}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                <option value="">— Select a course —</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            {/* Step 2: Pick Module */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Module <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                value={form.module_id || ""}
                onChange={(e) => setForm({ ...form, module_id: Number(e.target.value) })}
                disabled={!selectedCourseId}
              >
                <option value="">— Select a module —</option>
                {filteredModules.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
              {selectedCourseId && filteredModules.length === 0 && (
                <p className="text-xs text-orange-500 mt-1">
                  No modules found for this course. Create a module first.
                </p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Lesson Title <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="e.g., Understanding the Basics"
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Content</label>
              <textarea
                placeholder="Enter lesson content..."
                rows={4}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Video URL{" "}
                <span className="text-gray-400 text-xs">(YouTube, Vimeo, etc.)</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              />
            </div>

            {/* Duration + Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="30"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Order</label>
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={form.order_index}
                  onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Free preview toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_preview}
                onChange={(e) => setForm({ ...form, is_preview: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">
                Free Preview{" "}
                <span className="text-gray-400 font-normal">(visible without enrollment)</span>
              </span>
            </label>
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
              {saving ? "Saving..." : editingId ? "Update Lesson" : "Create Lesson"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-gray-500 text-sm">Loading lessons...</div>
      ) : lessons.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <div className="text-5xl mb-4">📖</div>
          <p className="text-gray-900 font-medium">No lessons created yet</p>
          <p className="text-gray-600 text-sm mt-2">
            Start by creating your first lesson in a module
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Order</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Lesson Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Module</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Duration</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Preview</th>
                <th className="text-center px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {lesson.order_index}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <PlayCircle size={16} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        {lesson.video_url && (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Watch video ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {lesson.modules?.title || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {lesson.duration_secs ? (
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {Math.round(lesson.duration_secs / 60)} min
                      </div>
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {lesson.is_preview ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Free
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Enrolled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEditClick(lesson)}
                        title="Edit lesson"
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        title="Delete lesson"
                        disabled={deletingId === lesson.id}
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
      {lessons.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{lessons.length}</span>{" "}
          lesson{lessons.length !== 1 ? "s" : ""} total
        </div>
      )}
    </div>
  );
}