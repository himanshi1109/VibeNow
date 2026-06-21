import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  CalendarDays,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Ticket,
  Star,
  IndianRupee,
  ChevronRight,
  Settings,
  Lock,
  Bell,
  CreditCard,
  Link2,
  LogOut,
  Pencil,
  Camera,
  X,
  Check,
  Heart,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import EventCard from "../components/EventCard";

export default function Profile() {
  const storedUser = localStorage.getItem("user");
  const localUser = storedUser ? JSON.parse(storedUser) : { name: "Guest User", email: "guest@vibenow.com", credits: 0 };
  const navigate = useNavigate();

  const [activeUser, setActiveUser] = useState(localUser);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = localUser._id || localUser.id;
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiRequest(`/auth/${uid}`);
        setProfileData(data);
        setActiveUser(data.user);
        
        // Update local storage
        const updated = {
          ...localUser,
          ...data.user,
        };
        localStorage.setItem("user", JSON.stringify(updated));
      } catch (err) {
        console.error("Error fetching profile details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: activeUser.name,
    bio: activeUser.bio || "No bio added yet. Tell us about yourself!",
    location: activeUser.location || "Not specified",
    phone: activeUser.phone || "Not specified",
    avatar: activeUser.avatar || null,
  });

  useEffect(() => {
    if (activeUser) {
      setFormData(prev => ({
        ...prev,
        name: activeUser.name,
        phone: activeUser.phone,
      }));
    }
  }, [activeUser]);

  // Derive user stats from live backend data
  const userOrders = profileData?.events || [];
  const userRatings = profileData?.comments || [];
  const totalSpent = userOrders.reduce((sum, o) => sum + o.billedAmount, 0);
  const attendedEvents = userOrders
    .map((o) => o.event) // populated from backend Order
    .filter(Boolean);

  const stats = [
    {
      label: "Events Attended",
      value: attendedEvents.length,
      icon: Ticket,
      color: "text-white/70",
      glow: "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    },
    {
      label: "Reviews Given",
      value: userRatings.length,
      icon: Star,
      color: "text-white",
      glow: "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-white/50",
      glow: "shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    },
  ];

  const settingsItems = [
    { icon: Lock, label: "Change Password", desc: "Update your secure credentials" },
    { icon: Bell, label: "Notification Preferences", desc: "Manage email & push alerts" },
    { icon: CreditCard, label: "Payment Methods", desc: "Add or remove payment cards" },
    { icon: Link2, label: "Linked Accounts", desc: "Connect social and SSO providers" },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
        setEditMode(true); // Automatically enter edit mode if they change their picture
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditMode(false);
    
    // Ensure we don't lose the token by merging with the existing localStorage data
    const existingData = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = { ...existingData, ...activeUser, ...formData };
    
    setActiveUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // In a real app this would call an API
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/70/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ████████ PROFILE HEADER ████████ */}
        <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.4)] mb-8 animate-slide-up relative overflow-hidden">
          {/* Background Mesh */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/15 rounded-full blur-[100px] animate-blob" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/70/15 rounded-full blur-[80px] animate-blob animate-blob-delay" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-white/5 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)] ring-4 ring-white/10 group-hover:ring-white/20 transition-all duration-500 overflow-hidden relative">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] relative z-10">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                  </span>
                )}
                {/* Dark overlay when in edit mode or hovering camera */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#020412]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-slate-300 hover:text-white hover:border-white/50 hover:bg-[#020412] transition-all shadow-lg z-20 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 w-full text-center md:text-left">
              {editMode ? (
                <div className="space-y-4 max-w-md mx-auto md:mx-0 text-left">
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-['Syne'] text-2xl font-bold focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all"
                  />
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all resize-none min-h-[80px] font-['Space_Grotesk']"
                  />
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-['Space_Grotesk']"
                  />
                </div>
              ) : (
                <>
                  <h1 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-white mb-2">
                    {formData.name}
                  </h1>
                  <p className="text-slate-300 max-w-lg mb-4 leading-relaxed">
                    {formData.bio}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-white/70" /> {formData.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-white" /> {activeUser.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4 text-white/50" /> Member since{" "}
                      {new Date(activeUser.joined || activeUser.createdAt || new Date()).toLocaleDateString("en-IN", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5 text-white/50 font-extrabold bg-white/50/10 px-2.5 py-1 rounded-full border border-white/50/20">
                      <IndianRupee className="w-3.5 h-3.5" /> Credits: {(activeUser.credits || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {/* Social Links */}
                  <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 glass-card px-3 py-1.5 rounded-full hover:text-white hover:border-white/20 transition-all cursor-pointer">
                      <Instagram className="w-3.5 h-3.5" /> {(activeUser.socialLinks && activeUser.socialLinks.instagram) || "@vibenow"}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 glass-card px-3 py-1.5 rounded-full hover:text-white hover:border-white/20 transition-all cursor-pointer">
                      <Twitter className="w-3.5 h-3.5" /> {(activeUser.socialLinks && activeUser.socialLinks.twitter) || "@vibenow"}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Edit / Save Button */}
            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="p-3 rounded-xl glass-card text-slate-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-white/5 text-white font-bold text-sm tracking-wider hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Save
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-3 rounded-xl glass-card text-slate-300 hover:text-white hover:border-white/20 transition-all font-bold text-sm tracking-wider flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  <Pencil className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ████████ STATS BAR ████████ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`glass-card p-6 rounded-2xl text-center hover:-translate-y-1 transition-all duration-300 animate-slide-up ${stat.glow}`}
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="font-['Syne'] text-2xl font-extrabold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ████████ INTERESTS ████████ */}
        <div className="mb-8 animate-slide-up delay-300">
          <h2 className="font-['Syne'] text-2xl font-extrabold text-white mb-5 flex items-center gap-3">
            <Heart className="w-6 h-6 text-white/70" /> My Interests
          </h2>
          <div className="flex flex-wrap gap-3">
            {(activeUser.interests || ["Music Festivals", "Comedy Shows", "Art Exhibits", "Nightlife", "Social Mixers"]).map((interest) => (
              <span
                key={interest}
                className="px-5 py-2.5 glass-card rounded-full text-sm font-bold text-slate-300 hover:text-white hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all duration-300 cursor-pointer"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* ████████ ATTENDED EVENTS ████████ */}
        <div className="mb-8 animate-slide-up delay-400">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-1 rounded-full bg-gradient-to-r from-white/70 to-white" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  My Journey
                </span>
              </div>
              <h2 className="font-['Syne'] text-3xl font-extrabold text-white">
                Events <span className="text-gradient">Attended</span>
              </h2>
            </div>
            <Link
              to="/my-tickets"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white hover:text-white/70 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {attendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {attendedEvents.map((event, i) => (
                <div
                  key={event.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass-panel rounded-[2rem] border border-white/5">
              <Ticket className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h3 className="font-['Syne'] text-xl font-bold text-white mb-2">
                No events yet
              </h3>
              <p className="text-slate-400 mb-6">
                Start exploring and create unforgettable memories!
              </p>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-white/20 via-white/10 to-white/5 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* ████████ ACCOUNT SETTINGS ████████ */}
        <div className="animate-slide-up delay-500">
          <h2 className="font-['Syne'] text-2xl font-extrabold text-white mb-5 flex items-center gap-3">
            <Settings className="w-6 h-6 text-white" /> Account Settings
          </h2>
          <div className="glass-panel rounded-[2rem] border border-white/10 overflow-hidden divide-y divide-white/5">
            {settingsItems.map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-5 px-6 sm:px-8 py-5 hover:bg-white/[0.03] transition-colors group text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:shadow-[0_0_10px_rgba(96,165,250,0.2)] transition-all">
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            ))}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-5 px-6 sm:px-8 py-5 hover:bg-white/70/5 transition-colors group text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-white/70/10 border border-white/70/20 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-white/70" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-white/70 text-sm">Log Out</p>
                <p className="text-xs text-slate-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
