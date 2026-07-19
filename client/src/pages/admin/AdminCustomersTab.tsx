import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { adminCustomersApi, AdminCustomer } from '../../api/admin';

export const AdminCustomersTab = () => {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await adminCustomersApi.list();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch customers', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = customers.filter(c =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-on-surface-variant">{customers.length} registered customers</p>
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border border-outline-variant/40 rounded-xl outline-none focus:ring-2 focus:ring-primary bg-surface"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="font-medium">No customers found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container text-on-surface-variant border-b border-outline-variant/20">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Email</th>
                  <th className="text-left px-5 py-3 font-medium">Joined</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-surface-container/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold shrink-0">
                          {(customer.first_name?.[0] || customer.email[0]).toUpperCase()}
                        </div>
                        <span className="font-medium text-on-surface">
                          {customer.first_name || customer.last_name
                            ? `${customer.first_name} ${customer.last_name}`.trim()
                            : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant">{customer.email}</td>
                    <td className="px-5 py-4 text-on-surface-variant">{new Date(customer.date_joined).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </span>
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
