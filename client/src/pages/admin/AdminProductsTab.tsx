import React, { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, Upload, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { adminProductsApi } from '../../api/admin';
import { adminCategoriesApi } from '../../api/admin';
import { Product, Category } from '../../api/products';

// ─── Product Form Modal ───────────────────────────────────────────────────────

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

const ProductForm = ({ product, categories, onClose, onSaved }: ProductFormProps) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    discount_price: product?.discount_price || '',
    stock_quantity: product?.stock_quantity ?? 0,
    category_id: product?.category?.id || '',
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    tags: product?.tags || '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      images.forEach(img => fd.append('uploaded_images', img));
      if (product) {
        await adminProductsApi.update(product.slug, fd);
      } else {
        await adminProductsApi.create(fd);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <h2 className="font-headline-md text-xl text-on-surface">
            {product ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mx-6 mt-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1.5">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Category *</label>
              <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm" required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Stock Quantity *</label>
              <input type="number" min="0" value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: Number(e.target.value)})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Price (₹) *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5">Discount Price (₹)</label>
              <input type="number" step="0.01" min="0" value={form.discount_price} onChange={e => setForm({...form, discount_price: e.target.value})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1.5">Description *</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm resize-none" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1.5">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
                className="w-full px-3 py-2.5 border border-outline-variant/40 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-surface text-sm"
                placeholder="organic, ayurvedic, supplement" />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({...form, is_active: !form.is_active})}>
                {form.is_active ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-outline-variant" />}
              </button>
              <span className="text-sm text-on-surface">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm({...form, is_featured: !form.is_featured})}>
                {form.is_featured ? <ToggleRight className="w-8 h-8 text-primary" /> : <ToggleLeft className="w-8 h-8 text-outline-variant" />}
              </button>
              <span className="text-sm text-on-surface">Featured</span>
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-1.5">
                {product ? 'Add More Images' : 'Product Images'}
              </label>
              <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
                onChange={e => setImages(Array.from(e.target.files || []))} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-outline-variant/60 rounded-xl text-sm text-on-surface-variant hover:bg-surface-container transition-colors">
                <Upload className="w-4 h-4" />
                {images.length > 0 ? `${images.length} file(s) selected` : 'Upload images'}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-outline-variant/20">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 border border-outline-variant/40 rounded-xl text-sm font-medium hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-opacity">
              {loading ? <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Admin Products Tab ───────────────────────────────────────────────────────

export const AdminProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prod, cats] = await Promise.all([
        adminProductsApi.list({ search }),
        adminCategoriesApi.list(),
      ]);
      setProducts(prod.results || prod || []);
      setCategories(Array.isArray(cats) ? cats : (cats as any).results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [search]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(slug);
    try {
      await adminProductsApi.delete(slug);
      setProducts(prev => prev.filter(p => p.slug !== slug));
    } catch (e) {
      alert('Failed to delete product.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline-variant" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 border border-outline-variant/30 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none bg-surface"
          />
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-outline-variant/10 rounded-xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">No products found.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-outline-variant/20">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Product</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant">Price</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface-variant hidden lg:table-cell">Status</th>
                <th className="text-right px-4 py-3 font-medium text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-on-surface truncate max-w-[180px]">{p.name}</div>
                    <div className="text-xs text-outline-variant font-mono">{p.sku}</div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">{p.category?.name}</td>
                  <td className="px-4 py-3 text-on-surface">
                    <div>₹{p.effective_price}</div>
                    {p.discount_price && <div className="text-xs text-outline-variant line-through">₹{p.price}</div>}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`font-medium ${p.stock_quantity === 0 ? 'text-error' : p.stock_quantity < 10 ? 'text-yellow-600' : 'text-on-surface'}`}>
                      {p.stock_quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-surface-container text-on-surface-variant'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {p.is_featured && <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-container text-on-secondary-container">Featured</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.slug)} disabled={deleting === p.slug}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-error-container text-on-surface-variant hover:text-error transition-colors disabled:opacity-50">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={fetchAll}
        />
      )}
    </div>
  );
};
