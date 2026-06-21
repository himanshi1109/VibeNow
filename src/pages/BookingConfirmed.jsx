import { useParams, Link } from "react-router-dom";
import { CheckCircle2, CalendarDays, MapPin, Ticket, Download, ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { apiRequest } from "../utils/api";

export default function BookingConfirmed() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId] = useState(() => Math.random().toString(36).substring(2, 10).toUpperCase());

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await apiRequest(`/events/${id}`);
        setEvent({
          id: data._id,
          name: data.title,
          image: data.eventImage,
          price: data.ticketPrice || 0,
          date: data.eventDate,
          location: data.eventLocation,
          city: data.eventLocation.split(",").pop().trim(),
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (event) {
      // Fire confetti on successful load
      const duration = 2500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFFFFF', '#CCCCCC', '#F3F4F6'],
          zIndex: 100
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFFFFF', '#CCCCCC', '#F3F4F6'],
          zIndex: 100
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [event]);

  if (loading) return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0A0908]">
      <p className="text-slate-400 text-sm animate-pulse">Loading booking details...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0A0908]">
      <h2 className="text-3xl font-bold text-white mb-4">Event Not Found</h2>
      <Link to="/events" className="text-carrot hover:underline">Go to all events</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen relative overflow-hidden flex items-center justify-center bg-[#0A0908]">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-carrot/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full mx-auto relative z-10 animate-fade-in text-center space-y-8">
        
        {/* Success Header */}
        <div className="animate-slide-up">
          <div className="w-20 h-20 bg-carrot/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-carrot/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <CheckCircle2 className="w-10 h-10 text-carrot" />
          </div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white mb-3">
            Booking <span className="text-gradient">Confirmed!</span>
          </h1>
          <p className="text-slate-400 text-sm">
            You're all set! Your digital ticket is ready.
          </p>
        </div>

        {/* Ticket Mockup */}
        <div className="bg-[#141211] p-1 rounded-[2.5rem] border border-cream/10 shadow-2xl animate-slide-up delay-200 text-left relative overflow-hidden">
           {/* Tear off circles */}
           <div className="absolute inset-x-0 top-[60%] -translate-y-1/2 flex justify-between pointer-events-none z-20">
              <div className="w-6 h-6 bg-[#0A0908] rounded-full -ml-3 border-r border-cream/10" />
              <div className="w-6 h-6 bg-[#0A0908] rounded-full -mr-3 border-l border-cream/10" />
           </div>
           
           <div className="bg-[#141211] rounded-[2.3rem] relative z-10">
              {/* Ticket Header Image */}
              <div className="h-44 w-full relative rounded-t-[2.3rem] overflow-hidden">
                 <img src={event.image || "https://picsum.photos/seed/default/800/400"} alt={event.name} className="w-full h-full object-cover opacity-60" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#141211] to-transparent" />
                 <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cream/10">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-carrot">General Admission</span>
                 </div>
              </div>

              {/* Ticket Info */}
              <div className="p-8 border-t border-dashed border-cream/10">
                <h3 className="font-['Syne'] text-2xl font-bold text-white mb-4 line-clamp-1">{event.name}</h3>
                
                <div className="grid grid-cols-2 gap-5 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date</span>
                    <p className="text-slate-200 font-bold flex items-center gap-1.5">
                       <CalendarDays className="w-4 h-4 text-cream" /> {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time</span>
                    <p className="text-slate-200 font-bold flex items-center gap-1.5">
                       <Clock className="w-4 h-4 text-carrot" /> {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Venue</span>
                    <p className="text-slate-200 font-bold flex items-center gap-1.5">
                       <MapPin className="w-4 h-4 text-cream" /> {event.location}, {event.city}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Order Reference</span>
                    <p className="font-mono text-carrot font-bold">#{orderId}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ticket Type</span>
                    <p className="text-slate-200 font-bold">1x Guest Pass</p>
                  </div>
                </div>

                {/* Barcode Mockup */}
                <div className="mt-8 pt-6 border-t border-cream/5 flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center justify-center gap-[1.5px] h-10 w-full max-w-xs opacity-75">
                    <div className="w-1.5 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-1.5 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                    <div className="w-2 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-1 h-full bg-white" />
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-500">*{orderId}*</span>
                </div>
              </div>
              
              {/* Ticket Footer */}
              <div className="bg-[#1A1817] p-6 rounded-b-[2.3rem] flex justify-between items-center sm:flex-row flex-col gap-4 text-center sm:text-left border-t border-cream/5">
                  <p className="text-[10px] text-slate-400 max-w-[220px]">Show barcode at the entrance desk for scanning. Standard ID matching required.</p>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-carrot text-white hover:scale-105 rounded-xl text-xs font-bold uppercase tracking-wider transition-transform shadow-md">
                    <Download className="w-4 h-4" /> Save Stub
                  </button>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up delay-300">
           <Link to="/my-tickets" className="flex items-center justify-center gap-2 px-8 py-4 bg-carrot text-white rounded-full text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.15)]">
             <Ticket className="w-4 h-4" /> My Tickets
           </Link>
           <Link to="/" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#141211] border border-cream/10 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
             More Events <ArrowRight className="w-4 h-4 text-carrot" />
           </Link>
        </div>

      </div>
    </div>
  );
}
