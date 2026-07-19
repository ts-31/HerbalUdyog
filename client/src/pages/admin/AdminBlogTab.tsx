import React, { useState, useEffect } from 'react';
import { Newspaper, Trash2, Plus, Check, X } from 'lucide-react';
import { adminBlogApi } from '../../api/admin';
import { BlogPost } from '../../api/core';

export const AdminBlogTab = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', author_name: 'HerbalUdyog Team', is_published: true });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await adminBlogApi.list();
      setPosts(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err) {
      console.error('Failed to fetch blog posts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      await adminBlogApi.create(fd);
      setShowForm(false);
      setForm({ title: '', excerpt: '', content: '', author_name: 'HerbalUdyog Team', is_published: true });
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await adminBlogApi.delete(slug);
      setPosts(prev => prev.filter(p => p.slug !== slug));
    } catch {
      alert('Failed to delete post');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const updated = await adminBlogApi.update(post.slug, { is_published: !post.is_published });
      setPosts(prev => prev.map(p => p.slug === post.slug ? updated : p));
    } catch {
      alert('Failed to update post');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">{posts.length} articles</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-outline-variant/20 p-6">
          <h3 className="font-semibold text-on-surface mb-4">Create New Article</h3>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant/40 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Author</label>
                <input value={form.author_name} onChange={e => setForm({...form, author_name: e.target.value})}
                  className="w-full px-3 py-2 border border-outline-variant/40 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Excerpt</label>
              <textarea required rows={2} value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})}
                className="w-full px-3 py-2 border border-outline-variant/40 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">Content</label>
              <textarea required rows={6} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                className="w-full px-3 py-2 border border-outline-variant/40 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary resize-y" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="is_published" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="rounded" />
              <label htmlFor="is_published" className="text-sm font-medium text-on-surface">Publish immediately</label>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
                {submitting ? 'Saving...' : 'Publish'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-outline-variant/40 rounded-xl text-sm hover:bg-surface-container transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 text-on-surface-variant">
          <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No blog posts yet. Create your first article above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Author</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-5 py-4 font-medium text-on-surface max-w-[200px] truncate">{post.title}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{post.author_name}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {post.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleTogglePublish(post)} title={post.is_published ? 'Unpublish' : 'Publish'}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant">
                          {post.is_published ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(post.slug)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
