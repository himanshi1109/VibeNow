import { Link } from "react-router-dom";
import { MapPin, CalendarDays, Ticket } from "lucide-react";

export default function EventCard({ event }) {
  const id = event._id || event.id;
  const image = event.eventImage || event.image || "https://picsum.photos/seed/default/800/400";
  const name = event.title || event.name;
  const price = event.ticketPrice !== undefined ? event.ticketPrice : (event.price || 0);
  const rawLocation = event.eventLocation || event.location || "";
  const location = Array.from(new Set(rawLocation.split(',').map(s => s.trim()))).join(', ');
  const date = event.eventDate || event.date;

  return (
    <Link 
      to={`/events/${id}`} 
      onClick={() => console.error("DIAGNOSTIC: EventCard clicked with ID:", id)}
      className="group relative block bg-[#141211] border border-cream/10 rounded-[2rem] overflow-hidden hover:scale-[1.02] hover:border-carrot/30 hover:shadow-[0_20px_40px_rgba(255,255,255,0.08)] transition-all duration-500 focus:outline-none"
    >
      {/* Image Container with high-def zoom */}
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141211] via-[#141211]/40 to-transparent opacity-90 transition-opacity duration-300" />
        
        {/* Category Badge Removed */}
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 font-['Syne'] font-extrabold text-xs text-white bg-[#141211]/80 backdrop-blur-md rounded-full border border-cream/10">
          <Ticket className="w-3.5 h-3.5 text-carrot" />
          ₹{price.toLocaleString("en-IN")}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <h3 className="font-['Syne'] font-bold text-xl text-white mb-4 group-hover:text-carrot transition-colors duration-300 line-clamp-2">
          {name}
        </h3>
        
        <div className="space-y-3 mb-2">
          <div className="flex items-center text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            <MapPin className="w-4 h-4 mr-2.5 text-cream" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            <CalendarDays className="w-4 h-4 mr-2.5 text-carrot" />
            {date ? new Date(date).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }) : 'TBA'}
          </div>
        </div>
      </div>
    </Link>
  );
}
