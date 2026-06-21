import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Share2, 
  Heart,
  Users,
  CheckCircle2,
  Ticket,
  Sparkles,
  ArrowLeft,
  Star
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const safeFormatDate = (dateStr) => {
  if (!dateStr) return "Date TBA";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (e) {
    return dateStr;
  }
};

const safeFormatTime = (dateStr) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString("en-IN", {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return "";
  }
};

const safeFormatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num)) return "0";
  return num.toLocaleString("en-IN");
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      console.error("DIAGNOSTIC: EventDetail fetchEventDetails called with ID:", id);
      try {
        const data = await apiRequest(`/events/${id}`);
        // Normalize keys for UI safely:
        const rawLocation = data.eventLocation || "";
        const cityPart = rawLocation.includes(",") 
          ? rawLocation.split(",").pop().trim() 
          : rawLocation.trim() || "TBA";

        const normalized = {
          id: data._id,
          name: data.title,
          image: data.eventImage,
          price: data.ticketPrice || 0,
          date: data.eventDate,
          location: rawLocation,
          city: cityPart,
          description: data.description,
          seats: data.totalSeats,
        };
        setEvent(normalized);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message || "Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0A0908]">
        <p className="text-slate-400 text-sm animate-pulse">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0A0908] px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Event Not Found</h2>
        {error && (
          <p className="text-rose-400 text-sm max-w-md mb-6 bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-2xl">
            {error}
          </p>
        )}
        <Link to="/events" className="text-carrot hover:underline transition-all">Go to all events</Link>
      </div>
    );
  }

  return (
    <div className="pb-24 overflow-hidden relative min-h-screen bg-[#0A0908]">
      {/* Decorative glows */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-carrot/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* ─── IMMERSIVE BANNER HEADER ─── */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        {/* Blurred background backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-105" 
          style={{ backgroundImage: `url(${event.image})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/60 to-transparent" />
        
        {/* Navigation buttons */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#141211]/80 backdrop-blur-md text-white border border-cream/10 hover:border-carrot/30 hover:scale-115 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
            {/* Poster Card */}
            <div className="relative w-44 h-56 md:w-56 md:h-72 shrink-0 rounded-[2rem] overflow-hidden border border-cream/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-slide-up">
              <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
            </div>

            {/* Info details */}
            <div className="flex-1 animate-slide-up delay-100">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="flex items-center gap-1 text-xs font-bold text-carrot">
                  <Star className="w-4 h-4 fill-carrot" /> Trending Vibe
                </span>
              </div>
              <h1 className="font-['Syne'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {event.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300 font-bold">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4.5 h-4.5 text-cream" />
                  {safeFormatDate(event.date)}
                </div>
                {safeFormatTime(event.date) && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-carrot" />
                    {safeFormatTime(event.date)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT DETAILS & BOOKING DOCK ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main info (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up delay-200">
            {/* Description */}
            <div className="bg-[#141211] p-6 sm:p-8 rounded-[2rem] border border-cream/10 space-y-4">
              <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-carrot" /> Description
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                {event.description}
              </p>
              <p className="text-slate-300 leading-relaxed text-sm">
                Expect state-of-the-art acoustics production, curated food zones, custom interactive installations in {event.city}, and unforgettable memories.
              </p>
            </div>

            {/* Venue info */}
            <div className="bg-[#141211] p-6 sm:p-8 rounded-[2rem] border border-cream/10 flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/3 aspect-video bg-[#1A1817] border border-cream/10 rounded-2xl overflow-hidden relative group">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1540304899557-0130a8ed1295?w=500&q=80')] bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Location Map</span>
                <h3 className="text-lg font-bold text-white">{event.location}</h3>
                <p className="text-xs text-slate-400">{event.city}, India</p>
                <button className="inline-block mt-2 text-xs font-bold uppercase tracking-wider text-carrot hover:underline">
                  Get Directions
                </button>
              </div>
            </div>
          </div>

          {/* Booking Side Panel */}
          <div className="lg:col-span-1 animate-slide-up delay-300">
            <div className="bg-[#141211] p-6 sm:p-8 rounded-[2rem] border border-cream/10 sticky top-24 space-y-6 shadow-xl">
              
              {/* Interaction Buttons */}
              <div className="flex justify-end gap-3.5">
                <button className="p-3 bg-[#1A1817] rounded-full border border-cream/5 text-slate-300 hover:text-white hover:border-carrot/30 transition-all">
                  <Share2 className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-3 rounded-full transition-all border ${
                    isLiked 
                      ? "bg-carrot/15 text-carrot border-carrot/30" 
                      : "bg-[#1A1817] text-slate-300 border-cream/5 hover:text-white hover:border-carrot/30"
                  }`}
                >
                  <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-carrot text-carrot" : ""}`} />
                </button>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Starting Price</span>
                <h3 className="font-['Syne'] text-4xl font-extrabold text-white">
                  ₹{safeFormatPrice(event.price)}
                </h3>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-carrot" /> Includes platform handling charges
                </p>
              </div>

              {/* Perks */}
              <div className="p-4 bg-[#1A1817] rounded-2xl border border-cream/5 space-y-3.5">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Users className="w-4 h-4 text-cream" />
                  <span>Join 12,000+ attendees going</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <Ticket className="w-4 h-4 text-carrot" />
                  <span>Mobile ticketing accepted</span>
                </div>
              </div>

              {/* Book Action */}
              <Link 
                to={`/book/${event.id}`}
                className="w-full flex items-center justify-center py-4 bg-carrot text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                Book Ticket
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
