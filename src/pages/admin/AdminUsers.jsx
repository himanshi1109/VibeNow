import { useState, useEffect } from "react";
import { Search, Edit, Trash2, X, ShieldAlert, Users } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest("/admin/users");
      const mapped = data.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.isAdmin ? "ADMIN" : "USER",
        credits: u.credits || 0,
        status: u.isActive ? "Active" : "Disabled",
        isActive: u.isActive
      }));
      setUsersList(mapped);
    } catch (err) {
      console.error("Error fetching admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = usersList.filter((u) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const originalUser = usersList.find(u => u.id === editingUser.id);
    if (!originalUser) return;

    try {
      const creditDiff = editingUser.credits - originalUser.credits;
      if (creditDiff !== 0) {
        await apiRequest(`/admin/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify({ credits: creditDiff })
        });
      }

      const statusChanged = editingUser.status !== originalUser.status;
      if (statusChanged) {
        const isActive = editingUser.status === "Active";
        await apiRequest(`/admin/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify({ isActive })
        });
      }

      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("Error saving user details:", err);
      alert(err.message || "Failed to update user.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading registered users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
            Manage <span className="text-gradient">Users</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review registered user accounts, roles, and credit balances.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 bg-[#141211] border border-cream/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk']"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-cream/5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                <th className="px-6 py-4">User Detail</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Credit Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/5 text-xs text-slate-300 font-medium">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-white group-hover:text-carrot transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-carrot/10 border border-carrot/20 flex items-center justify-center font-['Syne'] font-extrabold text-carrot uppercase text-[10px]">
                      {user.name.charAt(0)}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-6 py-4 max-w-[150px] truncate text-slate-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-md border ${
                      user.role === 'ADMIN' 
                      ? 'bg-carrot/10 text-carrot border-carrot/20 shadow-[0_0_10px_rgba(255,94,58,0.15)]' 
                      : 'bg-white/5 text-slate-400 border-cream/10'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    ₹{user.credits}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest ${
                        user.status === 'Disabled' ? 'text-red-400' : 'text-cream'
                     }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Disabled' ? 'bg-red-400 animate-pulse' : 'bg-cream'}`} />
                        {user.status}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                       <button 
                         onClick={() => handleEditClick(user)}
                         className="p-2 text-slate-400 hover:text-carrot hover:bg-carrot/10 rounded-lg transition-colors border border-transparent hover:border-carrot/20"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/25">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                    No users match current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View (Row Form) */}
        <div className="flex flex-col gap-3 p-4 md:hidden bg-[#141211]">
          {filteredUsers.map((user) => (
            <div key={user.id} className="relative bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-4 shadow-lg overflow-hidden backdrop-blur-sm group flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-carrot/10 border border-carrot/20 flex items-center justify-center font-['Syne'] font-extrabold text-carrot uppercase text-xs shadow-inner shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm tracking-wide truncate">{user.name}</p>
                    <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest rounded border shrink-0 ${
                      user.role === 'ADMIN' ? 'bg-carrot/10 text-carrot border-carrot/20' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest ${
                      user.status === 'Disabled' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${user.status === 'Disabled' ? 'bg-red-400' : 'bg-emerald-400'}`} />
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="font-mono font-bold text-white text-xs bg-white/5 px-2 py-1 rounded-lg border border-white/5">₹{user.credits}</p>
                <button 
                  onClick={() => handleEditClick(user)}
                  className="p-1.5 text-slate-400 hover:text-carrot bg-white/5 hover:bg-carrot/10 rounded-lg transition-colors border border-white/5 hover:border-carrot/20"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
              No users match current filters
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0908]/90 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
          
          <div className="relative w-full max-w-md bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up text-left">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream/5">
              <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-carrot" /> Edit User Profile
              </h2>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-cream/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              
              <div className="space-y-1 bg-[#1A1817] p-4 rounded-xl border border-cream/5">
                <p className="text-white font-bold text-sm">{editingUser.name}</p>
                <p className="text-slate-400 text-xs font-mono">{editingUser.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">User Role</label>
                <select 
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] appearance-none text-sm"
                  style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%23cbd5e1" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option className="bg-[#141211]" value="USER">Base User</option>
                  <option className="bg-[#141211]" value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Credit Points Balance (₹)</label>
                <input 
                  type="number" 
                  value={editingUser.credits}
                  onChange={(e) => setEditingUser({...editingUser, credits: parseInt(e.target.value) || 0})}
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Account Status</label>
                <select 
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                  className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] appearance-none text-sm"
                  style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%23cbd5e1" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                >
                  <option className="bg-[#141211]" value="Active">Active</option>
                  <option className="bg-[#141211]" value="Disabled">Disabled</option>
                </select>
              </div>

              {editingUser.status === 'Disabled' && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-200 mt-2">
                   <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
                   <p>Warning: Disabling this user restricts them from accessing bookings and login screens.</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-6 border-t border-cream/5 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-carrot text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,94,58,0.3)] hover:scale-[1.01]"
                >
                  Save Profile
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
