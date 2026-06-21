import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarDays, MapPin, Ticket, QrCode, Download, ChevronRight, Star, X, Upload, Image as ImageIcon, Clock } from "lucide-react";
import { apiRequest } from "../utils/api";

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingData, setRatingData] = useState({ rating: 5, comment: '', image: null });
  const [viewQrTicket, setViewQrTicket] = useState(null);
  const [ticketsList, setTicketsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const data = await apiRequest("/order");
      setTicketsList(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCancelTicket = async (tid) => {
    if (!window.confirm("Are you sure you want to cancel this ticket booking?")) return;
    try {
      await apiRequest(`/order/${tid}`, {
        method: "PUT",
      });
      fetchTickets();
      alert("Ticket cancelled successfully. Credits refunded to your account.");
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      alert(err.message || "Failed to cancel ticket booking.");
    }
  };

  const myTickets = ticketsList.map(order => {
    if (!order.event) return order;
    return {
      ...order,
      id: order._id,
      tickets: order.seats,
      event: {
        ...order.event,
        id: order.event._id,
        name: order.event.title,
        location: order.event.eventLocation,
        city: order.event.eventLocation.split(",").pop().trim(),
        date: order.event.eventDate,
        image: order.event.eventImage,
        price: order.event.ticketPrice,
      }
    };
  });

  const upcoming = myTickets.filter(t => t.status === "confirmed");
  const past = myTickets.filter(t => t.status !== "confirmed");

  const displayTickets = activeTab === "upcoming" ? upcoming : past;

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-[#0A0908]">
        <p className="text-slate-400 text-sm animate-pulse">Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen relative overflow-hidden bg-[#0A0908]">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#FFFFFF]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#CFC7B9]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-12 animate-slide-up text-center md:text-left">
          <h1 className="font-['Syne'] text-4xl lg:text-5xl font-extrabold text-white mb-4">
            My <span className="text-gradient">Tickets</span>
          </h1>
          <p className="text-slate-400 text-base max-w-xl">
            Keep track of your upcoming events, digital entry passes, and look back at your past experiences.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 mb-10 border-b border-cream/10 pb-1 animate-slide-up delay-100">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 px-2 text-xs font-extrabold tracking-widest uppercase transition-all relative ${
              activeTab === "upcoming" 
                ? "text-carrot" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Upcoming Experiences
            {activeTab === "upcoming" && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-carrot rounded-t-full shadow-[0_0_15px_rgba(255,94,58,0.6)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`pb-4 px-2 text-xs font-extrabold tracking-widest uppercase transition-all relative ${
              activeTab === "past" 
                ? "text-cream" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Past Memories
            {activeTab === "past" && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-cream rounded-t-full shadow-[0_0_15px_rgba(207,199,185,0.6)]" />
            )}
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-8">
          {displayTickets.length > 0 ? (
            displayTickets.map((ticket, index) => (
              <div 
                key={ticket.id} 
                className="relative overflow-hidden bg-[#141211] rounded-[2rem] border border-cream/10 hover:border-cream/20 transition-all duration-300 shadow-2xl flex flex-col md:flex-row animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Visual tear-off circles (for horizontal/vertical split screens) */}
                {/* Desktop vertical divider cutouts */}
                <div className="hidden md:block absolute left-[70%] top-0 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#0A0908] rounded-full border-b border-cream/10 z-20" />
                <div className="hidden md:block absolute left-[70%] bottom-0 translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#0A0908] rounded-full border-t border-cream/10 z-20" />
                
                {/* Mobile horizontal divider cutouts */}
                <div className="md:hidden absolute inset-x-0 bottom-[160px] -translate-y-1/2 flex justify-between pointer-events-none z-20">
                  <div className="w-6 h-6 bg-[#0A0908] rounded-full -ml-3 border-r border-cream/10" />
                  <div className="w-6 h-6 bg-[#0A0908] rounded-full -mr-3 border-l border-cream/10" />
                </div>

                {/* Left Ticket Stub (Event details) - 70% width */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center md:max-w-[70%]">
                  {/* Event Poster */}
                  <div className="flex-shrink-0 relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-cream/10 group">
                    <img 
                      src={ticket.event?.image || "https://picsum.photos/seed/default/800/400"} 
                      alt={ticket.event?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141211]/80 to-transparent" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left space-y-2">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Order #{ticket.id}
                      </span>
                    </div>

                    <Link to={`/events/${ticket.event?.id}`} className="block group">
                      <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold text-white group-hover:text-carrot transition-colors line-clamp-1">
                        {ticket.event?.name}
                      </h3>
                    </Link>

                    <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                      <p className="flex items-center justify-center sm:justify-start gap-2">
                        <MapPin className="w-4 h-4 text-cream" /> 
                        {ticket.event?.location}, {ticket.event?.city}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        <p className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-carrot" /> 
                          {new Date(ticket.event?.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cream" /> 
                          {new Date(ticket.event?.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cream/5 flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-300">
                      <Ticket className="w-4 h-4 text-carrot" />
                      <span>{ticket.tickets}x General Admission Pass</span>
                    </div>
                  </div>
                </div>

                {/* Dashed Separator on Desktop */}
                <div className="hidden md:block w-px border-l border-dashed border-cream/15 relative z-10" />

                {/* Right Ticket Stub (Barcode & Actions) - 30% width */}
                <div className="w-full md:w-[30%] bg-[#1A1817] p-6 sm:p-8 flex flex-col justify-center items-center text-center gap-5 relative z-10 rounded-b-[2rem] md:rounded-b-none md:rounded-r-[2rem] border-t md:border-t-0 border-dashed border-cream/15 md:max-h-[220px]">
                  {activeTab === "upcoming" ? (
                    <>
                      {/* Barcode Mockup */}
                      <div className="flex flex-col items-center gap-1 w-full">
                        <div className="flex justify-center gap-[1px] h-8 w-40 opacity-60">
                          <div className="w-[3px] h-full bg-white" />
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[2px] h-full bg-white" />
                          <div className="w-[4px] h-full bg-white" />
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[3px] h-full bg-white" />
                          <div className="w-[2px] h-full bg-white" />
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[4px] h-full bg-white" />
                          <div className="w-[2px] h-full bg-white" />
                          <div className="w-[3px] h-full bg-white" />
                          <div className="w-[1px] h-full bg-white" />
                          <div className="w-[2px] h-full bg-white" />
                        </div>
                        <span className="text-[9px] font-mono tracking-widest text-slate-500">*{ticket.id}*</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full">
                        <button 
                          onClick={() => setViewQrTicket(ticket)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-carrot text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-md"
                        >
                          <QrCode className="w-4 h-4" /> View Entry Pass
                        </button>
                        <button 
                          onClick={() => handleCancelTicket(ticket.id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/70/15 border border-white/70/30 text-white/70 hover:bg-white/70/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Past Status Indicator */}
                      <div className="mb-1">
                        <span className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-white/5 text-slate-500 rounded-full border border-cream/10">
                          Attended
                        </span>
                      </div>

                      {/* Rate and Review button */}
                      <button 
                        onClick={() => setRatingModal(ticket)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-cream hover:bg-white text-[#0A0908] rounded-xl text-xs font-bold uppercase tracking-wider hover:scale-[1.02] transition-all shadow-md"
                      >
                        <Star className="w-4 h-4 fill-current" /> Rate experience
                      </button>
                    </>
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#141211] rounded-[2rem] border border-cream/10 animate-fade-in shadow-xl">
              <div className="w-20 h-20 bg-white/5 border border-cream/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="font-['Syne'] text-2xl font-bold text-white mb-2">No tickets found</h3>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto text-sm">
                {activeTab === "upcoming" 
                  ? "You don't have any upcoming experiences booked. Let's find your next event!" 
                  : "You haven't attended any events yet. Build some memories soon!"}
              </p>
              <Link 
                to="/events"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white bg-carrot rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* View Entry Pass (QR Code) Modal */}
        {viewQrTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-[#0A0908]/90 backdrop-blur-sm" onClick={() => setViewQrTicket(null)} />
            
            <div className="relative w-full max-w-md bg-[#141211] border border-cream/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up text-left">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cream/5">
                <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-carrot" /> Digital Entry Pass
                </h2>
                <button 
                  onClick={() => setViewQrTicket(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-cream/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
                <div>
                  <h3 className="font-['Syne'] text-2xl font-bold text-white mb-1.5">{viewQrTicket.event?.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-carrot" /> {viewQrTicket.event?.location}, {viewQrTicket.event?.city}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="bg-white p-6 rounded-3xl border border-cream/10 shadow-lg relative">
                  {/* Real-looking Mock QR Code using custom styling */}
                  <div className="w-48 h-48 bg-white flex flex-col justify-between p-1">
                    {/* Top QR row */}
                    <div className="flex justify-between h-12">
                      <div className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center"><div className="w-4 h-4 bg-black" /></div>
                      <div className="flex flex-col justify-between w-12 h-12 py-1"><div className="h-2 bg-black w-8 self-center" /><div className="h-2 bg-black w-6" /><div className="h-2 bg-black w-10 self-end" /></div>
                      <div className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center"><div className="w-4 h-4 bg-black" /></div>
                    </div>
                    {/* Middle QR row */}
                    <div className="flex justify-between h-16">
                      <div className="flex flex-col justify-between w-12 h-full py-2"><div className="h-2 bg-black w-6" /><div className="h-2 bg-black w-10 self-end" /><div className="h-2 bg-black w-8 self-center" /></div>
                      <div className="w-16 h-full border border-black flex flex-wrap gap-1 p-1">
                        <div className="w-3 h-3 bg-black" /><div className="w-4 h-4 bg-black" /><div className="w-2 h-2 bg-black" /><div className="w-3 h-2 bg-black" />
                        <div className="w-2 h-3 bg-black" /><div className="w-3 h-3 bg-black" /><div className="w-4 h-2 bg-black" /><div className="w-2 h-4 bg-black" />
                      </div>
                      <div className="flex flex-col justify-between w-12 h-full py-2"><div className="h-2 bg-black w-9 self-end" /><div className="h-2 bg-black w-5" /><div className="h-2 bg-black w-7 self-center" /></div>
                    </div>
                    {/* Bottom QR row */}
                    <div className="flex justify-between h-12">
                      <div className="w-12 h-12 border-4 border-black bg-white flex items-center justify-center"><div className="w-4 h-4 bg-black" /></div>
                      <div className="flex flex-col justify-between w-12 h-12 py-1"><div className="h-2 bg-black w-7" /><div className="h-2 bg-black w-9 self-center" /><div className="h-2 bg-black w-6 self-end" /></div>
                      <div className="w-12 h-12 border-4 border-black bg-white flex flex-col justify-between p-2"><div className="w-2 h-2 bg-black" /><div className="w-2 h-2 bg-black self-end" /></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-center font-bold text-xs uppercase tracking-wider text-slate-300">
                  <p>Order Reference: <span className="font-mono text-carrot">#{viewQrTicket.id}</span></p>
                  <p className="text-[10px] text-slate-400 font-medium lowercase italic">Show this code at the gate for check-in</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-[#1A1817] p-6 border-t border-cream/5 flex items-center gap-3">
                <button 
                  onClick={() => setViewQrTicket(null)}
                  className="w-full py-3 bg-[#141211] hover:bg-white/5 border border-cream/10 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rate & Review Modal */}
        {ratingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-[#0A0908]/90 backdrop-blur-sm" onClick={() => { setRatingModal(null); setRatingData({ rating: 5, comment: '', image: null }); }} />
            
            <div className="relative w-full max-w-lg bg-[#141211] border border-cream/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up text-left">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cream/5">
                <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-carrot fill-carrot" /> Rate Experience
                </h2>
                <button 
                  onClick={() => { setRatingModal(null); setRatingData({ rating: 5, comment: '', image: null }); }}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-cream/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={(e) => { e.preventDefault(); setRatingModal(null); setRatingData({ rating: 5, comment: '', image: null }); }} className="p-6 space-y-6">
                
                <div className="text-center">
                  <h3 className="font-bold text-lg text-white mb-2">{ratingModal.event?.name}</h3>
                  <p className="text-sm text-slate-400">Share your thoughts with the community</p>
                </div>

                <div className="flex justify-center gap-3 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingData({...ratingData, rating: star})}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star className={`w-10 h-10 ${star <= ratingData.rating ? "text-carrot fill-carrot drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "text-slate-700"}`} />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Your Review</label>
                  <textarea 
                    value={ratingData.comment}
                    onChange={(e) => setRatingData({...ratingData, comment: e.target.value})}
                    placeholder="Tell us what you liked about this event..."
                    className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk'] min-h-[100px] resize-y text-sm"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-cream" /> Attach Photo</label>
                  <div className="flex items-center gap-4">
                    {ratingData.image && (
                      <img src={ratingData.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-cream/10" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setRatingData({...ratingData, image: URL.createObjectURL(e.target.files[0])});
                        }
                      }}
                      className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-cream/10 file:text-cream hover:file:bg-cream/20 file:transition-colors text-slate-400 text-xs cursor-pointer border border-cream/10 rounded-full p-1 bg-[#1A1817]"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-6 border-t border-cream/5 flex items-center justify-end gap-3">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-carrot text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:scale-[1.01]"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
