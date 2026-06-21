import { useState } from "react";
import { Upload, Calendar, MapPin, IndianRupee, Image as ImageIcon, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    price: "",
    location: "",
    city: "",
    description: "",
    seats: "100",
    image: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.name);
      data.append("description", formData.description);
      data.append("eventDate", formData.date);
      data.append("eventLocation", `${formData.location}, ${formData.city}`);
      data.append("eventArtistName", "Various Artists"); // default artist
      data.append("totalSeats", parseInt(formData.seats) || 100);
      data.append("duration", "3 hours"); // default duration
      data.append("ticketPrice", parseFloat(formData.price) || 0);
      if (imageFile) {
        data.append("eventImage", imageFile);
      } else {
        throw new Error("Please upload an event poster image!");
      }

      await apiRequest("/events", {
        method: "POST",
        body: data,
      });

      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <div className="glass-panel p-10 rounded-3xl text-center max-w-md animate-fade-in border border-white/50/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          <div className="w-20 h-20 bg-white/50/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10 text-white/50" />
          </div>
          <h2 className="font-['Syne'] text-3xl font-bold text-white mb-4">Event Submitted!</h2>
          <p className="text-slate-400 mb-6">
            Your event has been successfully uploaded and is currently pending admin approval. You will be notified once it is live.
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-widest animate-pulse">Redirecting to Home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/70/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="font-['Syne'] text-4xl font-extrabold text-white mb-4">
            Host an <span className="text-gradient">Event</span>
          </h1>
          <p className="text-slate-400 text-lg">Partner with VibeNow to bring your incredible experiences to life.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-10 rounded-[2rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)] space-y-8">
          
          {error && (
            <div className="p-4 rounded-xl bg-white/70/15 border border-white/70/30 text-white/70 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Event Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Awesome Party 2025"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk']"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell people what makes this event special..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk'] min-h-[120px] resize-y"
              required
            />
          </div>

          {/* Date, Price & Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2"><Calendar className="w-3 h-3" /> Date & Time</label>
              <input 
                type="datetime-local" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk']"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2"><IndianRupee className="w-3 h-3" /> Ticket Price</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="0 for Free"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk']"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2"><Users className="w-3 h-3" /> Total Seats</label>
              <input 
                type="number" 
                value={formData.seats}
                onChange={(e) => setFormData({...formData, seats: e.target.value})}
                placeholder="100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk']"
                min="1"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2"><MapPin className="w-3 h-3" /> Venue Name</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Convention Center"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk']"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-2"><MapPin className="w-3 h-3" /> City</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Mumbai"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-all font-['Space_Grotesk']"
                required
              />
            </div>
          </div>

          <div className="h-px w-full bg-white/10 my-4" />

          {/* Event Poster Image Upload */}
          <div className="space-y-4">
             <label className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-white/70" /> 
               Upload Event Poster
             </label>
             <p className="text-xs text-slate-400">This image will be used as the main banner on the event detail page and tickets. High-resolution images work best.</p>
             
             <div className="relative group w-full h-48 sm:h-64 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center overflow-hidden hover:border-white/70/50 transition-colors cursor-pointer">
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-[#020412]/40" />
                    <div className="relative z-10 flex flex-col items-center">
                       <Upload className="w-8 h-8 text-white mb-2" />
                       <span className="text-sm font-bold text-white drop-shadow-md">Click to change image</span>
                    </div>
                  </>
                ) : (
                  <>
                     <Upload className="w-10 h-10 text-slate-500 mb-4 group-hover:text-white/70 transition-colors" />
                     <span className="text-sm font-medium text-slate-400">Click or drag image to upload</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setFormData({...formData, image: URL.createObjectURL(file)});
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
             </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="group relative w-full flex items-center justify-center py-4 rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-white/5 text-white font-bold uppercase tracking-wider overflow-hidden hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)] mt-4"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? "Submitting Event..." : "Submit Event for Approval"}
            </span>
          </button>

        </form>
      </div>
    </div>
  );
}
