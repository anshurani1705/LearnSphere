import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { AdminNav } from '../../components/AdminNav';
import { CreditCard, CheckCircle, Clock, XCircle, Search, Filter, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'ALL' | 'REAL' | 'MOCK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/v1/admin/orders', { params: { size: 100 } });
        if (res.data?.success) {
          setOrders(res.data.data.content);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    // Mode filter
    if (filterMode === 'REAL' && o.provider === 'MOCK') return false;
    if (filterMode === 'MOCK' && o.provider !== 'MOCK') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchEmail = o.user?.email?.toLowerCase().includes(q);
      const matchName = o.user?.fullName?.toLowerCase().includes(q);
      const matchCourse = o.course?.title?.toLowerCase().includes(q);
      const matchRef = (o.razorpayOrderId || '')?.toLowerCase().includes(q);
      return matchNum || matchEmail || matchName || matchCourse || matchRef;
    }
    return true;
  });

  const getProviderBadge = (o: any) => {
    if (o.provider === 'MOCK') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <span>🧪</span>
          <span>MOCK SIMULATOR</span>
        </span>
      );
    }
    if (o.paymentMode === 'LIVE') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>RAZORPAY LIVE</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <span>⚡</span>
        <span>RAZORPAY TEST</span>
      </span>
    );
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-16">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Orders & Payment Transactions</h1>
            <p className="text-slate-500 text-sm mt-1">
              Audit trail of checkouts, payment gateway references, and clear separation of mock vs real transactions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterMode('REAL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'REAL'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Real Gateway ({orders.filter((o) => o.provider !== 'MOCK').length})
            </button>
            <button
              onClick={() => setFilterMode('MOCK')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === 'MOCK'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mock / Test ({orders.filter((o) => o.provider === 'MOCK').length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order #, student, course, reference..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID / Order #</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Provider / Mode</th>
                  <th className="px-6 py-4">Gateway Reference</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-sans">
                      Loading transactions...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-sans">
                      No orders found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/60 transition font-sans">
                      <td className="px-6 py-4">
                        <span className="text-[10px] text-slate-400 font-mono block">ID #{o.id}</span>
                        <span className="font-mono font-bold text-slate-900 block">{o.orderNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-slate-900">{o.user?.fullName || '—'}</p>
                          <p className="text-xs text-slate-400">{o.user?.email || '—'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {o.course?.title || '—'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ₹{o.amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            o.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : o.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getProviderBadge(o)}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 text-xs">
                        {o.razorpayOrderId || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
