import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Tag, Check, X, Loader2, Save } from 'lucide-react';
import API from '../../services/api';

export default function CategoryManager({ onCategoriesChanged }) {
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    defaultDepartment: '',
    colorCode: '#3b82f6',
    icon: 'AlertTriangle',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
        if (onCategoriesChanged) onCategoriesChanged(res.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.defaultDepartment) return;

    try {
      setSubmitting(true);
      const res = await API.post('/categories', form);
      if (res.data.success) {
        fetchCategories();
        setShowAdd(false);
        setForm({ name: '', defaultDepartment: '', colorCode: '#3b82f6', icon: 'AlertTriangle', description: '' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name || !editingCategory.defaultDepartment) return;

    try {
      setSubmitting(true);
      const res = await API.put(`/categories/${editingCategory._id}`, editingCategory);
      if (res.data.success) {
        fetchCategories();
        setEditingCategory(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    try {
      const res = await API.delete(`/categories/${catId}`);
      if (res.data.success) {
        fetchCategories();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting category');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" /> Dynamic Category & Department Editor
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage complaint categories and auto-syncing municipal departments</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Create Category Form */}
      {showAdd && (
        <form onSubmit={handleCreate} className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Category Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Flyover Damage"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Assigned Department</label>
              <input
                type="text"
                required
                placeholder="e.g. Heavy Bridges Division"
                value={form.defaultDepartment}
                onChange={(e) => setForm({ ...form, defaultDepartment: e.target.value })}
                className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Badge Color Hex</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.colorCode}
                  onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
                  className="w-8 h-8 rounded border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={form.colorCode}
                  onChange={(e) => setForm({ ...form, colorCode: e.target.value })}
                  className="w-full text-xs p-2 bg-slate-900 border border-slate-700 text-white rounded-lg outline-none font-mono"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Category'}
            </button>
          </div>
        </form>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleUpdate}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setEditingCategory(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-indigo-400" /> Edit Category & Department
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Default Department Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.defaultDepartment || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, defaultDepartment: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Badge Color Hex</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingCategory.colorCode || '#3b82f6'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, colorCode: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingCategory.colorCode || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, colorCode: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 text-white rounded-xl font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1"
              >
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <> <Save className="w-3.5 h-3.5" /> Save Changes </>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div
            key={c._id}
            className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between group hover:border-indigo-500/50 transition"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: c.colorCode }}
              />
              <div>
                <h4 className="text-xs font-bold text-white">{c.name}</h4>
                <span className="text-[10px] text-slate-400 font-medium block">{c.defaultDepartment}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditingCategory(c)}
                className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-700 rounded-lg transition"
                title="Edit Category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(c._id, c.name)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
