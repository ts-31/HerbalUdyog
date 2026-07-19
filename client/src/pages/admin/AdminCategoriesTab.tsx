import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';
import { adminCategoriesApi } from '../../api/admin';
import { Category } from '../../api/products';

// ─── Category Form (inline) ───────────────────────────────────────────────────

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

const CategoryForm = ({ category, onClose, onSaved }: CategoryFormProps) => {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (category) {
        await adminCategoriesApi.update(category.slug, { name, description });
      } else {
        await adminCategoriesApi.create({ name, description });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h2 className="font-headline-md text-xl text-on-surface">
            {category ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Category Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm"
              required
              placeholder="e.g. Ayurvedic Supplements"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm resize-none"
              placeholder="Short description of this category..."
            />
          </div>
          <div className="flex gap-3 pt-2 border-t border-outline-variant/20">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-outline-variant/40 rounded-xl text-sm font-medium hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity">
              {loading ? <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {category ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Admin Categories Tab ─────────────────────────────────────────────────────

export const AdminCategoriesTab = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await adminCategoriesApi.list();
      setCategories(Array.isArray(data) ? data : (data as any).results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category must be reassigned first.`)) return;
    setDeleting(slug);
    try {
      await adminCategoriesApi.delete(slug);
      setCategories(prev => prev.filter(c => c.slug !== slug));
    } catch (e: any) {
      alert(e.message || 'Failed to delete category. It may have products assigned to it.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-on-surface-variant">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
        </p>
        <button
          onClick={() => { setEditCategory(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Category
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-outline-variant/10 rounded-2xl animate-pulse" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">No categories yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-on-surface text-sm">{cat.name}</h3>
                    <p className="text-xs text-outline-variant">{cat.product_count ?? 0} products</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => { setEditCategory(cat); setShowForm(true); }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(cat.slug, cat.name)} disabled={deleting === cat.slug}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {cat.description && (
                <p className="text-xs text-on-surface-variant line-clamp-2">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editCategory}
          onClose={() => setShowForm(false)}
          onSaved={fetchCategories}
        />
      )}
    </div>
  );
};
