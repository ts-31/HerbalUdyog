import React, { useState, useEffect } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { adminContactApi } from '../../api/admin';
import { ContactInquiry } from '../../api/core';

export const AdminContactTab = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const data = await adminContactApi.list();
      setInquiries(Array.isArray(data) ? data : (data as any).results || []);
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleToggleResolved = async (inquiry: ContactInquiry) => {
    if (!inquiry.id) return;
    try {
      const updated = await adminContactApi.markResolved(inquiry.id, !inquiry.is_resolved);
      setInquiries(prev => prev.map(i => i.id === inquiry.id ? updated : i));
    } catch {
      alert('Failed to update inquiry');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const unresolved = inquiries.filter(i => !i.is_resolved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <p className="text-sm text-on-surface-variant">{inquiries.length} total inquiries</p>
        {unresolved > 0 && (
          <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">{unresolved} unresolved</span>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <Mail className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map(inquiry => (
            <div key={inquiry.id} className={`bg-white rounded-2xl border ${inquiry.is_resolved ? 'border-outline-variant/20' : 'border-yellow-300'} overflow-hidden`}>
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-container/40 transition-colors"
                onClick={() => setExpanded(expanded === inquiry.id ? null : (inquiry.id as number))}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${inquiry.is_resolved ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface text-sm truncate">{inquiry.subject}</p>
                    <p className="text-xs text-on-surface-variant">{inquiry.name} • {inquiry.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-on-surface-variant">{new Date(inquiry.created_at!).toLocaleDateString()}</span>
                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${inquiry.is_resolved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {inquiry.is_resolved ? 'Resolved' : 'Open'}
                  </span>
                </div>
              </div>

              {expanded === inquiry.id && (
                <div className="px-5 pb-5 border-t border-outline-variant/10">
                  <p className="font-body-md text-on-surface-variant mt-4 leading-relaxed">{inquiry.message}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => handleToggleResolved(inquiry)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${inquiry.is_resolved ? 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {inquiry.is_resolved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      {inquiry.is_resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                    </button>
                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 px-4 py-2 border border-outline-variant/40 rounded-xl text-sm hover:bg-surface-container transition-colors">
                      <Mail className="w-4 h-4" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
