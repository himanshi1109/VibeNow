import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Sliders } from "lucide-react";
import EventCard from "../components/EventCard";
import { apiRequest } from "../utils/api";

export default function Events() {
  const [myEvents, setMyEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState("dateAsc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiRequest("/events");
        const mapped = data.map(e => ({
          id: e._id,
          name: e.title,
          price: e.ticketPrice || 0,
          date: e.eventDate,
          location: e.eventLocation,
          city: e.eventLocation.split(",").pop().trim(), // extract city from location
          description: e.description,
          image: e.eventImage,
          rating: 5.0,
          seats: e.totalSeats,
          status: e.isActive ? "approved" : "pending"
        }));
        setMyEvents(mapped);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const approvedEvents = myEvents.filter(e => e.status === "approved" || !e.status);

  const cities = ["All", ...new Set(approvedEvents.map((e) => e.city))];

  const filteredEvents = useMemo(() => {
    let result = [...approvedEvents];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => e.name.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      );
    }

    if (selectedCity !== "All") {
      result = result.filter((e) => e.city === selectedCity);
    }

    switch (sortBy) {
      case "priceAsc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "dateAsc":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCity, sortBy, myEvents]);

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-carrot/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 animate-slide-up">
          <h1 className="font-['Syne'] text-4xl lg:text-5xl font-extrabold text-white mb-3">
            Discover My <span className="text-gradient">Experiences</span>
          </h1>
          <p className="text-slate-400 text-sm">Browse my hosted collection of events across the country.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters (Premium Dark Panel) */}
          <div className="lg:w-72 lg:shrink-0 space-y-6">
            <div className="bg-[#141211] p-6 rounded-[2rem] border border-white/[0.08] shadow-lg sticky top-24">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/[0.06]">
                <Sliders className="w-5 h-5 text-carrot" />
                <h2 className="font-['Syne'] font-extrabold text-sm uppercase tracking-[0.15em] text-white">Filters</h2>
              </div>

              {/* Search */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Keyword</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1817] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-carrot/50 transition-all font-['Space_Grotesk']"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">City</label>
                <div className="space-y-1.5">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                        selectedCity === city
                          ? "bg-carrot/10 text-carrot border border-carrot/20"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {city !== "All" && <MapPin className="w-3.5 h-3.5 text-cream" />}
                        {city}
                      </span>
                      {selectedCity === city && <div className="w-1.5 h-1.5 rounded-full bg-carrot" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#141211] border border-white/[0.08] rounded-2xl p-4 mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 sm:mb-0">
                Showing <span className="text-carrot">{filteredEvents.length}</span> events found
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap hidden sm:block">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto bg-[#1A1817] border border-white/[0.08] text-white text-xs font-bold rounded-xl px-4 py-2.5 outline-none focus:border-carrot/50 appearance-none animate-none"
                  style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%23cbd5e1" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
                >
                  <option value="dateAsc">Date - Soonest</option>
                  <option value="priceAsc">Price - Lowest</option>
                  <option value="priceDesc">Price - Highest</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {filteredEvents.map((event, i) => (
                  <div key={event.id} className="animate-slide-up" style={{ animationDelay: `${(i % 6) * 100}ms` }}>
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-[#141211] border border-white/[0.08] rounded-[2.5rem]">
                <div className="w-16 h-16 bg-[#1A1817] border border-white/[0.08] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">No events found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("All");
                  }}
                  className="mt-6 px-6 py-3 bg-carrot text-white text-xs font-bold uppercase tracking-wider rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
