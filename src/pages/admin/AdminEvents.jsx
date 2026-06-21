import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon, CalendarDays, Check, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api";

export default function AdminEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const data = await apiRequest("/admin/events");
      const mapped = data.map(e => ({
        id: e._id,
        name: e.title,
        price: e.ticketPrice || 0,
        date: e.eventDate,
        location: e.eventLocation,
        city: e.eventLocation.split(",").pop().trim(),
        image: e.eventImage,
        isActive: e.isActive,
        status: e.isActive ? "approved" : "pending"
      }));
      setEvents(mapped);
    } catch (err) {
      console.error("Error fetching admin events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (event) => {
    setEditingEvent({ ...event });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editingEvent.name);
      formData.append("ticketPrice", editingEvent.price);
      formData.append("eventDate", editingEvent.date);
      formData.append("eventLocation", `${editingEvent.location}, ${editingEvent.city}`);
      formData.append("isActive", editingEvent.status === "approved");
      
      if (editingEvent.imageFile) {
        formData.append("eventImage", editingEvent.imageFile);
      }

      if (editingEvent.id) {
        await apiRequest(`/admin/events/${editingEvent.id}`, {
          method: "PUT",
          body: formData
        });
      }
      fetchEvents();
      setEditingEvent(null);
    } catch (err) {
      console.error("Error saving event details:", err);
      alert(err.message || "Failed to update event.");
    }
  };

  const handleDelete = (id) => {
    // Delete is not directly exposed on admin routes in backend, so we disable it
    alert("Delete operation is not supported by the backend REST API. Set status to pending to hide the event.");
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextActive = currentStatus === "pending";
    try {
      await apiRequest(`/admin/events/${id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: nextActive })
      });
      fetchEvents();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert(err.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading events list...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
            Manage <span className="text-gradient">Events</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Add, update, or approve active events and schedules.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by event name or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141211] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk']"
            />
          </div>
          <button 
            onClick={() => navigate("/create-event")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-carrot hover:scale-[1.02] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)]"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-[#141211] border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/[0.06] text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Price / Pass</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs text-slate-300 font-medium">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80"} 
                        alt="" 
                        className="w-12 h-12 rounded-xl object-cover border border-white/[0.08] shadow-lg" 
                      />
                      <div>
                        <p className="font-bold text-white group-hover:text-carrot transition-colors text-sm">{event.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(event.id, event.status || "pending")}
                      title="Click to toggle approval status"
                      className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest rounded-full border cursor-pointer hover:scale-105 transition-transform ${
                        (event.status || 'pending').toLowerCase() === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                      }`}
                    >
                      {event.status || 'pending'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-bold">{event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{event.date ? new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white">{event.city}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium mt-0.5">{event.location}</p>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    ₹{event.price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                       <button 
                         onClick={() => handleEditClick(event)}
                         className="p-2 text-slate-400 hover:text-carrot hover:bg-carrot/10 rounded-lg transition-colors border border-transparent hover:border-carrot/20"
                       >
                         <Edit className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDelete(event.id)}
                         className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/25"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                    No events match current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View (Row Form) */}
        <div className="flex flex-col gap-3 p-4 md:hidden bg-[#141211]">
          {filteredEvents.map((event) => (
            <div key={event.id} className="relative bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5 rounded-2xl p-4 shadow-lg overflow-hidden backdrop-blur-sm group flex items-center gap-4">
              <div className="relative shrink-0">
                <img 
                  src={event.image || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80"} 
                  alt="" 
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow-lg" 
                />
                <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"></div>
              </div>
              
              <div className="flex flex-col min-w-0 flex-1 justify-center py-1">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="font-bold text-white text-[13px] line-clamp-1 tracking-wide">{event.name}</p>
                  <button
                    onClick={() => handleToggleStatus(event.id, event.status || "pending")}
                    className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest rounded border cursor-pointer shrink-0 shadow-sm ${
                      (event.status || 'pending').toLowerCase() === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                    }`}
                  >
                    {event.status || 'pending'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[10px] text-slate-400 truncate">{event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{event.city}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 pl-2">
                    <p className="font-mono font-bold text-white text-[11px]">₹{event.price}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button 
                        onClick={() => handleEditClick(event)}
                        className="p-1 text-slate-400 hover:text-carrot bg-white/5 hover:bg-carrot/10 rounded transition-colors border border-white/5 hover:border-carrot/20"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="p-1 text-slate-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded transition-colors border border-white/5 hover:border-red-500/25"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredEvents.length === 0 && (
            <div className="py-12 text-center text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
              No events match current filters
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0908]/90 backdrop-blur-sm" onClick={() => setEditingEvent(null)} />
          
          <div className="relative w-full max-w-2xl bg-[#141211] border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up text-left">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-carrot" />
                {editingEvent.id ? "Edit Event Profile" : "Create Event Profile"}
              </h2>
              <button 
                onClick={() => setEditingEvent(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-6">
              
              {/* Event Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Event Name</label>
                <input 
                  type="text" 
                  value={editingEvent.name}
                  onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                  className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                  placeholder="E.g. Neon Light Festival"
                  required
                />
              </div>

              {/* Date & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={editingEvent.date ? new Date(editingEvent.date).toISOString().slice(0,16) : ''}
                    onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                    className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Ticket Price (₹)</label>
                  <input 
                    type="number" 
                    value={editingEvent.price === 0 ? '' : editingEvent.price}
                    onChange={(e) => setEditingEvent({...editingEvent, price: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                    placeholder="Price per ticket"
                    required
                  />
                </div>
              </div>

              {/* Location & City */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Venue Address</label>
                  <input 
                    type="text" 
                    value={editingEvent.location}
                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                    className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                    placeholder="E.g. Hall A, Exhibition Ground"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">City</label>
                  <input 
                    type="text" 
                    value={editingEvent.city}
                    onChange={(e) => setEditingEvent({...editingEvent, city: e.target.value})}
                    className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] text-sm"
                    placeholder="E.g. Mumbai"
                    required
                  />
                </div>
              </div>

              {/* Status Selector (If editing existing event) */}
              {editingEvent.id && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Event Approval Status</label>
                  <select 
                    value={editingEvent.status || 'pending'}
                    onChange={(e) => setEditingEvent({...editingEvent, status: e.target.value})}
                    className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] appearance-none text-sm"
                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%23cbd5e1" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                  >
                    <option className="bg-[#141211]" value="approved">Approved</option>
                    <option className="bg-[#141211]" value="pending">Pending</option>
                    <option className="bg-[#141211]" value="rejected">Rejected</option>
                  </select>
                </div>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-cream" /> Event Banner Image</label>
                <div className="flex items-center gap-4">
                  {editingEvent.image && (
                    <img src={editingEvent.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-white/[0.08]" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const fileUrl = URL.createObjectURL(e.target.files[0]);
                        setEditingEvent({...editingEvent, image: fileUrl, imageFile: e.target.files[0]});
                      }
                    }}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cream/10 file:text-cream hover:file:bg-cream/20 file:transition-colors text-slate-400 text-xs cursor-pointer border border-white/[0.08] rounded-full p-1 bg-[#1A1817]"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-carrot text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
                >
                  {editingEvent.id ? "Save Changes" : "Create Event"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
