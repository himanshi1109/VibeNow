import { useParams, Link, useNavigate } from "react-router-dom";
import { Ticket, CalendarDays, MapPin, ShieldCheck, ArrowLeft, Tag, Info } from "lucide-react";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { apiRequest } from "../utils/api";

export default function BookTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [userCredits, setUserCredits] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [contactData, setContactData] = useState({
    name: loggedInUser ? loggedInUser.name : "",
    email: loggedInUser ? loggedInUser.email : "",
    phone: loggedInUser ? loggedInUser.phone : ""
  });

  useEffect(() => {
    const fetchEventAndUser = async () => {
      try {
        const eventData = await apiRequest(`/events/${id}`);
        const rawLocation = eventData.eventLocation || "";
        const cityPart = rawLocation.includes(",") 
          ? rawLocation.split(",").pop().trim() 
          : rawLocation.trim() || "TBA";

        setEvent({
          id: eventData._id,
          name: eventData.title,
          image: eventData.eventImage,
          price: eventData.ticketPrice || 0,
          date: eventData.eventDate,
          location: rawLocation,
          city: cityPart,
        });

        if (loggedInUser) {
          const profile = await apiRequest(`/auth/${loggedInUser._id || loggedInUser.id}`);
          setUserCredits(profile.user.credits || 0);
        }
      } catch (err) {
        console.error("Error fetching checkout details:", err);
        setError("Failed to load checkout details. Event may not exist.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventAndUser();
  }, [id]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    if (!couponInput.trim()) return;
    try {
      const data = await apiRequest("/coupon/apply", {
        method: "POST",
        body: JSON.stringify({ couponCode: couponInput.trim() }),
      });
      setAppliedCoupon(data);
      setCouponInput("");
    } catch (err) {
      setCouponError(err.message || "Invalid Coupon Code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0A0908]">
        <p className="text-slate-400 text-sm animate-pulse">Loading checkout...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-[#0A0908]">
        <h2 className="text-3xl font-bold text-white mb-4">{error || "Event Not Found"}</h2>
        <Link to="/events" className="text-carrot hover:underline">Go to all events</Link>
      </div>
    );
  }

  const subtotal = event.price * ticketCount;
  const taxes = Math.round(subtotal * 0.18);
  const totalBeforeDiscount = subtotal + taxes;
  
  // Calculate discount from coupon
  const discountAmount = appliedCoupon ? Math.round((totalBeforeDiscount * appliedCoupon.couponDiscount) / 100) : 0;
  const total = Math.max(0, totalBeforeDiscount - discountAmount);
  const hasEnoughCredits = userCredits >= total;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!hasEnoughCredits) {
      setError("You do not have enough credits to complete this booking.");
      return;
    }
    setError("");
    setIsProcessing(true);
    
    try {
      const payload = {
        numberOfSeats: ticketCount,
        couponCode: appliedCoupon ? appliedCoupon.couponCode : "",
      };

      await apiRequest(`/order/${event.id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Confetti celebration
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FFFFFF', '#CCCCCC', '#F3F4F6'],
          zIndex: 100
        });
        confetti({
          particleCount: 5,
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

      setTimeout(() => {
        if (loggedInUser) {
          const updatedUser = {
            ...loggedInUser,
            credits: userCredits - total
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        navigate(`/confirmed/${event.id}`);
      }, 2500);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to secure booking. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen relative overflow-hidden bg-[#0A0908]">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-carrot/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cream/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-[#141211] hover:bg-[#1A1817] rounded-full text-white border border-cream/10 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-['Syne'] text-3xl font-extrabold text-white">Complete Booking</h1>
            <p className="text-slate-400 text-sm">Secure your tickets via credit balance checkout</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-white/70/15 border border-white/70/30 text-white/70 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form - Left 2 Cols */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Event Summary Card */}
            <div className="bg-[#141211] p-6 rounded-[2rem] border border-cream/10 flex flex-col sm:flex-row gap-6 items-center">
              <img src={event.image || "https://picsum.photos/seed/default/800/400"} alt={event.name} className="w-32 h-32 rounded-2xl object-cover shadow-lg shrink-0" />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <h3 className="font-['Syne'] text-2xl font-bold text-white leading-snug">{event.name}</h3>
                <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                  <p className="flex items-center gap-2 justify-center sm:justify-start"><MapPin className="w-4 h-4 text-cream" /> {event.location}</p>
                  <p className="flex items-center gap-2 justify-center sm:justify-start"><CalendarDays className="w-4 h-4 text-carrot" /> {new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Select Tickets */}
            <div className="bg-[#141211] p-6 rounded-[2rem] border border-cream/10">
              <h3 className="text-md font-extrabold uppercase tracking-widest text-white flex items-center gap-2 mb-6 border-b border-cream/5 pb-4">
                <Ticket className="w-5 h-5 text-carrot" /> Select Tickets
              </h3>
              
              <div className="flex items-center justify-between p-4 bg-[#1A1817] rounded-2xl border border-cream/5">
                <div>
                  <h4 className="font-bold text-white text-sm">General Admission</h4>
                  <p className="text-xs text-slate-400 mt-1">₹{event.price.toLocaleString("en-IN")} / Ticket</p>
                </div>
                <div className="flex items-center gap-4 bg-[#141211] p-2 rounded-xl border border-cream/10">
                  <button 
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-8 h-8 rounded-lg bg-[#1A1817] text-white hover:bg-carrot hover:text-white flex items-center justify-center font-bold text-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-white">{ticketCount}</span>
                  <button 
                    onClick={() => setTicketCount(Math.min(5, ticketCount + 1))}
                    className="w-8 h-8 rounded-lg bg-[#1A1817] text-white hover:bg-carrot hover:text-white flex items-center justify-center font-bold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 ml-1">Maximum 5 tickets allowed per user.</p>
            </div>

            {/* Attendee Details */}
            <div className="bg-[#141211] p-6 rounded-[2rem] border border-cream/10">
              <h3 className="text-md font-extrabold uppercase tracking-widest text-white mb-6 border-b border-cream/5 pb-4">Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={contactData.name} 
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 font-['Space_Grotesk'] text-sm" 
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    value={contactData.email} 
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 font-['Space_Grotesk'] text-sm" 
                    placeholder="name@example.com" 
                    required 
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Phone</label>
                  <input 
                    type="tel" 
                    value={contactData.phone} 
                    onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                    className="w-full bg-[#1A1817] border border-cream/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-carrot/50 font-['Space_Grotesk'] text-sm" 
                    placeholder="9876543210" 
                    required 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Order Summary - Right Col */}
          <div className="lg:col-span-1">
            <div className="bg-[#141211] p-6 rounded-[2rem] border border-cream/10 shadow-xl space-y-6 sticky top-24">
              <h3 className="text-md font-extrabold uppercase tracking-widest text-white border-b border-cream/5 pb-4">Order Summary</h3>
              
              <div className="space-y-4 text-xs font-bold">
                <div className="flex justify-between text-slate-300">
                  <span>{ticketCount}x Ticket{ticketCount > 1 ? 's' : ''}</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes & Fees (18%)</span>
                  <span>₹{taxes.toLocaleString("en-IN")}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-white/50">
                    <span>Coupon ({appliedCoupon.couponCode})</span>
                    <span>-{appliedCoupon.couponDiscount}% (₹{discountAmount})</span>
                  </div>
                )}

                <div className="h-px bg-cream/10 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-200 uppercase tracking-wider text-xs">Total Amount</span>
                  <span className="text-2xl font-['Syne'] font-extrabold text-white text-gradient">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Coupon input */}
              <div className="pt-4 border-t border-cream/5 space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Promo Coupon</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-white/50/10 border border-white/50/20 rounded-xl text-white/50 text-xs font-bold">
                    <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {appliedCoupon.couponCode} applied</span>
                    <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-white uppercase text-[9px] tracking-wider font-extrabold">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="SAVE20" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-[#1A1817] border border-cream/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-carrot/50 font-['Space_Grotesk'] text-xs uppercase" 
                    />
                    <button type="submit" className="px-4 py-2 bg-[#1A1817] border border-cream/10 hover:border-carrot/40 rounded-xl text-xs text-white font-bold transition-colors">Apply</button>
                  </form>
                )}
                {couponError && <p className="text-white/70 text-[10px] font-semibold">{couponError}</p>}
              </div>

              {/* User Credits Status */}
              <div className="p-4 bg-[#1A1817] rounded-xl border border-cream/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Your Credit Balance:</span>
                  <span className={hasEnoughCredits ? "text-white/50" : "text-white/70"}>₹{userCredits.toLocaleString("en-IN")}</span>
                </div>
                {!hasEnoughCredits && (
                  <p className="text-[10px] text-white/70 font-semibold leading-relaxed flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    Not enough credits to secure booking. Ask admin to add credits to your account.
                  </p>
                )}
              </div>

              <form onSubmit={handlePayment} className="space-y-4 pt-4 border-t border-cream/5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-cream mb-2">
                  <ShieldCheck className="w-4 h-4 text-carrot" /> Secure Credit Checkout
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing || !hasEnoughCredits}
                  className="w-full py-4 rounded-xl bg-carrot text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.15)] mt-4 cursor-pointer"
                >
                  {isProcessing ? "Processing Booking..." : `Book Tickets Using Credits`}
                </button>
              </form>
              
              <p className="text-center text-[10px] text-slate-500">
                Tickets are delivered instantly as digital stubs.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


