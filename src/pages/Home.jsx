import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Ticket,
  Star,
  ArrowRight,
  Sparkles,
  Mail,
  Check,
  ChevronRight,
  TrendingUp,
  Volume2,
  Music,
  Flame,
  Zap,
  ArrowLeft,
  Heart,
  Clock
} from "lucide-react";
import { apiRequest } from "../utils/api";

const THEME_IMAGES = {
  hero: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80",
  live1: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80",
  live2: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
  live3: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80",
};

const getEventVibe = (title, location) => {
  const t = (title || "").toLowerCase();
  const l = (location || "").toLowerCase();
  if (t.includes("eras") || t.includes("taylor") || t.includes("rikhari") || t.includes("live") || t.includes("music") || t.includes("concert")) {
    return { label: "Concerts & Music", emoji: "🎤", icon: Music, color: "from-[#FFFFFF] to-[#8B5CF6]" };
  }
  if (l.includes("club") || l.includes("diner") || l.includes("bar") || t.includes("night") || t.includes("dj")) {
    return { label: "Nightlife & Party", emoji: "🔥", icon: Flame, color: "from-[#CCCCCC] to-[#EF4444]" };
  }
  return { label: "Social & Gatherings", emoji: "✨", icon: Sparkles, color: "from-[#3B82F6] to-[#06B6D4]" };
};

export default function Home() {
  const navigate = useNavigate();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVibe, setSelectedVibe] = useState("All");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [followedEvents, setFollowedEvents] = useState({});

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 8,
    hours: 14,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiRequest("/events");
        if (Array.isArray(data)) {
          setEventsList(data);
        } else {
          setEventsList([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const normalizedEvents = useMemo(() => {
    return eventsList.map(e => {
      const vibe = getEventVibe(e.title, e.eventLocation);
      let dateStr = "DEC 31";
      if (e.eventDate) {
        try {
          const d = new Date(e.eventDate);
          const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          dateStr = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
        } catch (err) {}
      }
      return {
        id: e._id,
        name: e.title,
        image: e.eventImage,
        price: e.ticketPrice || 0,
        location: Array.from(new Set((e.eventLocation || "").split(',').map(s => s.trim()))).join(', '),
        description: e.description,
        date: dateStr,
        time: e.duration || "TBD",
        vibe: vibe,
        isActive: e.isActive
      };
    }).filter(e => e.isActive);
  }, [eventsList]);

  // Vibe filter options
  const vibeOptions = ["All", "Concerts & Music", "Nightlife & Party", "Social & Gatherings"];

  const filteredEvents = useMemo(() => {
    if (selectedVibe === "All") return normalizedEvents;
    return normalizedEvents.filter(e => e.vibe.label === selectedVibe);
  }, [normalizedEvents, selectedVibe]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const toggleFollow = (id) => {
    setFollowedEvents(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // How It Works
  const howItWorks = [
    {
      title: "Discover Events",
      description: "Browse through curated local events, from underground concerts to exclusive art shows.",
      icon: <Sparkles className="w-5 h-5 text-white" />
    },
    {
      title: "Book Securely",
      description: "Reserve your spot instantly with our secure one-tap booking and ticketing system.",
      icon: <Ticket className="w-5 h-5 text-white" />
    },
    {
      title: "Live the Vibe",
      description: "Show your digital pass at the venue and enjoy an unforgettable premium experience.",
      icon: <Flame className="w-5 h-5 text-white" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F3F4F6] overflow-x-hidden font-sans selection:bg-[#FFFFFF]/30 selection:text-white relative">
      
      {/* ─── radial meshes background ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FFFFFF]/5 rounded-full filter blur-[120px] animate-blob" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60vw] h-[60vw] bg-[#CCCCCC]/5 rounded-full filter blur-[150px] animate-blob-delay" />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-violet-600/5 rounded-full filter blur-[130px] animate-float" />
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[65vh] flex items-center justify-center pt-6 pb-16 px-4 sm:px-6 lg:px-8 z-10 overflow-hidden">
        {/* Full-bleed background concert image matching Tomorrowland reference */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none bg-[url('/bg-mobile.jpg')] md:bg-[url('/bg-desktop.jpg')]"
        />
        {/* Soft immersive overlays for high text contrast and glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C]/30 via-[#0A0A0C]/60 to-[#0A0A0C] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0C]/70 via-transparent to-[#0A0A0C]/70 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-[850px] w-full mx-auto text-center z-10 relative space-y-6 flex flex-col items-center justify-center">
          
          {/* Pulsing Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-[#FFFFFF] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#F3F4F6] font-['Space_Grotesk']">
              Next-Gen Event Portal • Live Bookings Open
            </span>
          </div>

          {/* Immersive Main Title */}
          <h1 className="font-['Syne'] text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight uppercase">
            LIVE YOUR <br />
            VIBE OUT LOUD
          </h1>

          {/* Subheadline */}
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal font-['Space_Grotesk']">
            Discover local nightlife, live acoustics, art galleries, and concerts that match your exact mood. Book tickets, collect credits, and get instant access pass stub files.
          </p>

          {/* Interactive Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button 
              onClick={() => {
                const el = document.getElementById("vibe-explorer");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4.5 bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] cursor-pointer"
            >
              Explore Vibes
            </button>
            <button 
              onClick={() => navigate("/create-event")}
              className="px-8 py-4.5 bg-[#16161F]/40 border border-white/10 text-white text-xs font-extrabold uppercase tracking-wider rounded-full hover:bg-white/5 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
            >
              Host An Event
              <ArrowRight className="w-4 h-4 text-[#FFFFFF]" />
            </button>
          </div>

        </div>
      </section>


      {/* ─── VIBE EXPLORER SECTION (THE NEW LANDING EXPERIENCER) ─── */}
      <section id="vibe-explorer" className="py-24 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* Header text */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFFFFF] font-['Space_Grotesk']">Curated Collections</span>
              <h2 className="font-['Syne'] text-3xl sm:text-5xl font-black text-white tracking-tight">
                FIND YOUR NEXT <span className="text-gradient">EXPERIENCE</span>
              </h2>
            </div>
            
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {vibeOptions.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => setSelectedVibe(vibe)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
                    selectedVibe === vibe
                      ? "bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      : "bg-[#16161F] text-[#9CA3AF] border border-white/5 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Event Grid */}
          {loading ? (
            <div className="text-center py-20 text-slate-400 text-sm animate-pulse">Loading event listings...</div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-[#16161F]/60 border border-white/5 rounded-[2rem] overflow-hidden hover:scale-[1.02] hover:border-[#FFFFFF]/30 hover:shadow-[0_20px_40px_rgba(255,255,255,0.08)] transition-all duration-500 flex flex-col h-full group"
                >
                  {/* Image banner */}
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={event.image || "https://picsum.photos/seed/default/800/400"} 
                      alt={event.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16161F] via-[#16161F]/30 to-transparent" />
                    
                    {/* Floating vibe bubble */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0A0A0C]/85 backdrop-blur-md rounded-full border border-white/10">
                      <span className="text-xs">{event.vibe.emoji}</span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-white font-['Space_Grotesk']">{event.vibe.label}</span>
                    </div>

                    {/* Floating Price */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/20 text-white text-[10px] font-black rounded-full shadow-md font-['Syne']">
                      ₹{event.price.toLocaleString("en-IN")}
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-['Syne'] font-extrabold text-xl text-white group-hover:text-[#FFFFFF] transition-colors leading-snug">
                        {event.name}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-3 font-['Space_Grotesk']">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                      {/* Location & date row */}
                      <div className="flex flex-col gap-2.5 text-xs text-[#9CA3AF] font-semibold font-['Space_Grotesk']">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#CCCCCC]" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-[#FFFFFF]" />
                          <span>{event.date} • {event.time}</span>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link 
                        to={`/events/${event.id}`}
                        className="w-full py-3.5 bg-[#16161F] hover:bg-gradient-to-r hover:from-[#FFFFFF] hover:to-[#CCCCCC] border border-white/10 hover:border-none text-white hover:text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#16161F]/40 border border-white/5 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-2">No events found for this vibe</h3>
              <p className="text-[#9CA3AF] text-sm">Check back later or try exploring other categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── LIVE EXPERIENCE TICKET STRIP (HAPPENING LIVE) ─── */}
      {normalizedEvents.length > 0 && (
        <section className="py-24 bg-[#111116]/40 border-t border-white/5 relative z-10 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]"></span>
                </span>
                <h2 className="font-['Syne'] text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  Happening Live Now
                </h2>
              </div>
              <Link 
                to="/events" 
                className="text-xs font-extrabold uppercase tracking-widest text-[#FFFFFF] hover:text-[#CCCCCC] flex items-center gap-1 transition-colors font-['Space_Grotesk']"
              >
                See All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Carousel row */}
            <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/5">
              {normalizedEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex-shrink-0 w-[300px] bg-[#16161F] border border-white/5 rounded-3xl overflow-hidden hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(255,255,255,0.1)] transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="h-48 w-full overflow-hidden relative">
                    <img 
                      src={event.image || "https://picsum.photos/seed/default/800/400"} 
                      alt={event.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 right-4 bg-[#EF4444] text-white text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded flex items-center gap-1 font-['Space_Grotesk'] shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      Live
                    </span>
                  </div>

                  <div className="p-6 space-y-5">
                    <h3 className="font-['Syne'] font-extrabold text-white text-lg group-hover:text-[#FFFFFF] transition-colors line-clamp-1">
                      {event.name}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] flex items-center gap-1.5 font-['Space_Grotesk']">
                      <TrendingUp className="w-4 h-4 text-[#FFFFFF]" />
                      4.8k Swifties & Fans attending
                    </p>

                    <button
                      onClick={() => toggleFollow(event.id)}
                      className={`w-full py-3 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                        followedEvents[event.id]
                          ? "bg-transparent border border-white/10 text-[#9CA3AF] hover:bg-white/5"
                          : "bg-white/20 text-white hover:scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      }`}
                    >
                      {followedEvents[event.id] ? "Following" : "Follow Event"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS SECTION ─── */}
      <section className="py-24 border-t border-white/5 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-20 space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FFFFFF] font-['Space_Grotesk']">Your Journey</span>
            <h2 className="font-['Syne'] text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
              How VibeNow Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            
            {howItWorks.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#16161F]/40 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 backdrop-blur-sm hover:border-[#FFFFFF]/20 hover:-translate-y-2 transition-all duration-300 relative z-10"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10">
                  {step.icon}
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-lg font-black text-white font-['Syne'] uppercase tracking-wide">{step.title}</h4>
                  <p className="text-[#9CA3AF] text-xs sm:text-sm leading-relaxed font-['Space_Grotesk']">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA NEWSLETTER REGISTRATION ─── */}
      <section className="relative py-28 overflow-hidden z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bg-newsletter.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-[#0A0A0C]/80 to-[#0A0A0C] pointer-events-none" />
        <div className="relative max-w-[800px] mx-auto text-center px-4 sm:px-6 space-y-8 z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full">
            <Sparkles className="w-5 h-5 text-[#FFFFFF]" />
          </div>

          <h2 className="font-['Syne'] text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Never Miss A Experience
          </h2>
          
          <p className="text-[#9CA3AF] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-['Space_Grotesk']">
            Join the inner circle. Subscribe to get notified the second booking passes launch for popular music events, standup comedy shows, and local club parties.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-grow">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input 
                type="email" 
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#111116] border border-white/10 rounded-full py-4 pl-12 pr-4 text-[13px] text-white placeholder-[#6B7280] focus:border-[#FFFFFF] outline-none transition-colors duration-200"
              />
            </div>
            
            <button 
              type="submit"
              disabled={subscribed}
              className="px-8 py-4 bg-white/20 text-white text-[13px] font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4" />
                  Subscribed!
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
