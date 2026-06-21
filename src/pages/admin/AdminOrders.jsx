import { useState, useEffect } from "react";
import { Search, Eye } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await apiRequest("/admin/orders");
      setOrdersList(data);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiRequest(`/admin/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setOrdersList(ordersList.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredOrders = ordersList.filter((o) => 
    o._id.toString().includes(searchTerm) || 
    (o.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.event?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'text-cream border-cream/20 bg-cream/5 shadow-[0_0_10px_rgba(207,199,185,0.05)]';
      case 'cancelled': return 'text-carrot border-carrot/20 bg-carrot/5 shadow-[0_0_10px_rgba(255,94,58,0.15)]';
      default: return 'text-slate-400 border-cream/10 bg-white/5';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading orders list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
            Manage <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review ticket reservations, booking states, and invoice values.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Order reference ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 bg-[#141211] border border-cream/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk']"
          />
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-cream/5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Event ID</th>
                <th className="px-6 py-4">Tickets Attained</th>
                <th className="px-6 py-4">Invoice Total</th>
                <th className="px-6 py-4">Booking Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5 text-xs text-slate-300 font-medium">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-white group-hover:text-carrot transition-colors">#{order._id.substring(order._id.length - 8)}</td>
                  <td className="px-6 py-4 font-bold text-white">
                    <p>{order.user?.name || 'Anonymous'}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{order.user?.email || ''}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-bold">{order.event?.title || 'Unknown Event'}</td>
                  <td className="px-6 py-4 font-bold text-slate-300">{order.seats}x General Pass</td>
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    ₹{order.billedAmount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest rounded-md border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-carrot hover:bg-carrot/10 rounded-lg transition-colors border border-transparent hover:border-carrot/20">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                    No orders match search parameters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View (Row Form) */}
        <div className="flex flex-col gap-3 p-4 md:hidden bg-[#141211]">
          {filteredOrders.map((order) => (
            <div key={order._id} className="relative bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-4 shadow-lg overflow-hidden backdrop-blur-sm group flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] text-slate-500 font-extrabold tracking-widest uppercase shrink-0">#{order._id.substring(order._id.length - 8)}</span>
                     <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest rounded border shrink-0 ${getStatusColor(order.status)}`}>
                       {order.status}
                     </span>
                   </div>
                   <span className="text-white font-bold text-sm truncate mt-1">{order.event?.title || 'Unknown Event'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                <div className="flex items-center gap-2.5 min-w-0">
                   <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0 shadow-inner">
                     {order.user?.name?.charAt(0) || '?'}
                   </div>
                   <div className="flex flex-col min-w-0">
                     <span className="text-[11px] text-white font-bold truncate">{order.user?.name || 'Anonymous'}</span>
                     <span className="text-[9px] text-slate-500 truncate">{order.seats}x Tickets</span>
                   </div>
                </div>
                <div className="flex flex-col items-end shrink-0 pl-3">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Total</span>
                   <span className="text-xs font-mono font-bold text-carrot">₹{order.billedAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
              No orders match search parameters
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
