import { useState, useEffect } from "react";
import { Search, Plus, Edit, X, Tag } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminCoupons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [couponsList, setCouponsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("");

  const fetchCoupons = async () => {
    try {
      const data = await apiRequest("/admin/coupons");
      setCouponsList(data || []);
    } catch (err) {
      console.error("Error fetching admin coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;
    try {
      await apiRequest("/admin/coupons", {
        method: "POST",
        body: JSON.stringify({
          couponCode: newCouponCode.trim().toUpperCase(),
          couponDiscount: parseInt(newCouponDiscount),
        }),
      });
      setNewCouponCode("");
      setNewCouponDiscount("");
      setIsCreateOpen(false);
      fetchCoupons();
    } catch (err) {
      console.error("Error creating coupon:", err);
      alert(err.message || "Failed to create coupon.");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    try {
      await apiRequest(`/admin/coupons/${editingCoupon._id}`, {
        method: "PUT",
        body: JSON.stringify({
          couponCode: editingCoupon.couponCode.trim().toUpperCase(),
          couponDiscount: parseInt(editingCoupon.couponDiscount),
          isActive: editingCoupon.isActive,
        }),
      });
      setEditingCoupon(null);
      fetchCoupons();
    } catch (err) {
      console.error("Error saving coupon:", err);
      alert(err.message || "Failed to update coupon.");
    }
  };

  const handleStatusChange = async (coupon, newStatus) => {
    const isActive = newStatus === "true";
    try {
      await apiRequest(`/admin/coupons/${coupon._id}`, {
        method: "PUT",
        body: JSON.stringify({
          couponCode: coupon.couponCode,
          couponDiscount: coupon.couponDiscount,
          isActive,
        }),
      });
      fetchCoupons();
    } catch (err) {
      console.error("Error updating coupon status:", err);
      alert(err.message || "Failed to toggle status.");
    }
  };

  const filteredCoupons = couponsList.filter((c) =>
    (c.couponCode || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (isActive) => {
    if (isActive) return "bg-cream/10 text-cream border-cream/20 shadow-[0_0_10px_rgba(207,199,185,0.05)]";
    return "bg-white/5 text-slate-500 border-cream/10";
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading coupons list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
            Discount <span className="text-gradient">Coupons</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Configure and monitor promotional voucher codes and discounts.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search coupon codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141211] border border-cream/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk']"
            />
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-carrot hover:scale-[1.02] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,94,58,0.3)]"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table Container */}
      <div className="bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-cream/5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                <th className="px-6 py-4">Promo Code</th>
                <th className="px-6 py-4">Discount Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5 text-xs text-slate-300 font-medium">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-carrot" />
                      <span className="font-mono font-bold text-white tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-cream/10 group-hover:border-carrot/40 transition-colors uppercase">
                        {coupon.couponCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-carrot text-sm">
                    {coupon.couponDiscount}% OFF
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={coupon.isActive ? "true" : "false"}
                      onChange={(e) => handleStatusChange(coupon, e.target.value)}
                      className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest rounded-md border outline-none cursor-pointer appearance-none ${getStatusColor(
                        coupon.isActive
                      )}`}
                      style={{
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 4px center",
                        paddingRight: "24px",
                      }}
                    >
                      <option className="bg-[#141211] text-white" value="true">
                        Active
                      </option>
                      <option className="bg-[#141211] text-white" value="false">
                        Expired
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingCoupon(coupon)}
                        className="p-2 text-slate-400 hover:text-carrot hover:bg-carrot/10 rounded-lg transition-colors border border-transparent hover:border-carrot/20"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                    No coupons match search parameters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View (Row Form) */}
        <div className="flex flex-col gap-3 p-4 md:hidden bg-[#141211]">
          {filteredCoupons.map((coupon) => (
            <div key={coupon._id} className="relative bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-4 shadow-lg overflow-hidden backdrop-blur-sm group flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0 gap-1.5">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-carrot shrink-0" />
                  <span className="font-mono font-bold text-white tracking-widest bg-white/5 px-2 py-1 rounded border border-white/10 uppercase text-[10px] shadow-inner truncate">
                    {coupon.couponCode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-carrot text-xs">{coupon.couponDiscount}% OFF</span>
                  <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                  <span className={`text-[9px] font-extrabold uppercase tracking-widest ${coupon.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {coupon.isActive ? 'Active' : 'Expired'}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <select
                  value={coupon.isActive ? "true" : "false"}
                  onChange={(e) => handleStatusChange(coupon, e.target.value)}
                  className={`px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded border outline-none cursor-pointer appearance-none text-center ${
                    coupon.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-slate-500 border-white/10'
                  }`}
                >
                  <option className="bg-[#141211] text-white" value="true">Active</option>
                  <option className="bg-[#141211] text-white" value="false">Expired</option>
                </select>
                <button
                  onClick={() => setEditingCoupon(coupon)}
                  className="p-1.5 text-slate-400 hover:text-carrot bg-white/5 hover:bg-carrot/10 rounded-lg transition-colors border border-white/5 hover:border-carrot/20"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filteredCoupons.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
              No coupons match search parameters
            </div>
          )}
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0908]/90 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
          
          <div className="relative w-full max-w-md bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up text-left">
            <div className="flex items-center justify-between p-6 border-b border-cream/5">
              <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-carrot" /> Create Discount Coupon
              </h2>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-cream/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Promo Code</label>
                <input 
                  type="text" 
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="E.g. WELCOME20"
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(e.target.value)}
                  placeholder="E.g. 20"
                  min="1"
                  max="100"
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                  required
                />
              </div>

              <div className="pt-6 border-t border-cream/5 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-carrot text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,94,58,0.3)] hover:scale-[1.01]"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Coupon Modal */}
      {editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0908]/90 backdrop-blur-sm" onClick={() => setEditingCoupon(null)} />
          
          <div className="relative w-full max-w-md bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up text-left">
            <div className="flex items-center justify-between p-6 border-b border-cream/5">
              <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-carrot" /> Edit Discount Coupon
              </h2>
              <button 
                onClick={() => setEditingCoupon(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-cream/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Promo Code</label>
                <input 
                  type="text" 
                  value={editingCoupon.couponCode}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, couponCode: e.target.value })}
                  placeholder="E.g. WELCOME20"
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Discount Percentage (%)</label>
                <input 
                  type="number" 
                  value={editingCoupon.couponDiscount}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, couponDiscount: e.target.value })}
                  placeholder="E.g. 20"
                  min="1"
                  max="100"
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                  required
                />
              </div>

              <div className="pt-6 border-t border-cream/5 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingCoupon(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-carrot text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,94,58,0.3)] hover:scale-[1.01]"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

