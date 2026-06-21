import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CalendarDays, ShoppingBag, Tag, Star, Home, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Events", path: "/admin/events", icon: CalendarDays },
  { name: "Orders", path: "/admin/orders", icon: ShoppingBag },
  { name: "Coupons", path: "/admin/coupons", icon: Tag },
  { name: "Ratings", path: "/admin/ratings", icon: Star },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path) => {
    if (path === "/admin" && location.pathname !== "/admin") return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Header & Toggle */}
      <div className="lg:hidden fixed top-20 left-0 right-0 h-14 bg-[#141211]/95 backdrop-blur-md z-40 border-b border-white/[0.06] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-['Syne'] font-extrabold text-white shadow-[0_0_10px_rgba(255,255,255,0.3)]">V</div>
          <span className="font-['Syne'] font-bold text-lg text-white tracking-wide">Admin</span>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-slate-300 hover:text-white">
          {isMobileOpen ? <X className="w-6 h-6" /> : <LayoutDashboard className="w-6 h-6 text-[#FFFFFF]" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`fixed top-20 bottom-0 left-0 z-40 w-64 bg-[#141211] border-r border-white/[0.06] transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 flex flex-col pt-14 lg:pt-0`}>
        
        {/* Desktop Logo */}
        <div className="hidden lg:flex items-center gap-2 h-20 px-4 border-b border-white/[0.06]">
          <span className="font-['Syne'] font-extrabold text-lg text-white tracking-wider">VibeNow</span>
          <span className="px-2 py-0.5 ml-auto text-[8px] font-extrabold uppercase tracking-widest bg-[#FFFFFF]/10 text-[#FFFFFF] rounded-md border border-[#FFFFFF]/20">Admin</span>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active 
                    ? "bg-white/5 text-white border border-white/[0.06] shadow-md" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                <link.icon className={`w-5 h-5 transition-transform duration-300 ${active ? "text-[#FFFFFF] scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "group-hover:text-[#FFFFFF] group-hover:scale-110"}`} />
                <span className="font-bold text-xs uppercase tracking-wider">{link.name}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FFFFFF] shadow-[0_0_8px_rgba(255,255,255,1)]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar Action */}
        <div className="p-4 border-t border-white/[0.06]">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/[0.06]"
          >
            <Home className="w-5 h-5 text-[#FFFFFF]" />
            Back to Website
          </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#0A0908]/90 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
