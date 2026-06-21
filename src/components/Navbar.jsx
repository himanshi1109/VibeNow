import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut, Ticket } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY <= 80) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className={`sticky top-0 z-50 bg-[#0A0A0C]/85 backdrop-blur-[20px] border-b border-white/[0.06] transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Left: Glowing ticket icon and VibeNow name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:rotate-12 group-hover:scale-105 transition-all duration-300">
              <Ticket className="w-5 h-5 text-white transform -rotate-12" />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F3F4F6] group-hover:text-[#FFFFFF] transition-colors duration-200 font-['Syne']">
              VibeNow
            </span>
          </Link>

          {/* Nav Links Center: Home, Events, About, Contact */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-[14px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200 no-underline"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-[14px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200 no-underline"
            >
              Events
            </Link>
            <Link 
              to="/create-event" 
              className="text-[14px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200 no-underline"
            >
              Host Event
            </Link>

          </div>

          {/* CTA Right: Profile/Dashboard or Login/Register */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="text-[13px] font-bold text-[#FFFFFF] hover:text-[#CCCCCC] transition-colors duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] focus:outline-[2px] focus:outline-solid focus:outline-white/50"
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors duration-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-[14px] font-semibold text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white/20 text-white text-[14px] font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] focus:outline-[2px] focus:outline-solid focus:outline-white/50"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <label htmlFor="mobile-menu-toggle" className="md:hidden cursor-pointer p-2 text-[#9CA3AF] hover:text-[#F3F4F6]">
            <Menu className="w-6 h-6" />
          </label>
        </div>
      </div>

      {/* Mobile Menu */}
      <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
      <div className="peer-checked:max-h-[300px] max-h-0 overflow-hidden transition-all duration-300 md:hidden bg-[#0A0A0C]/95 backdrop-blur-[20px] border-t border-white/[0.06]">
        <div className="px-4 py-4 space-y-3">
          <Link to="/" className="block px-3 py-2 text-[15px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-all duration-200">
            Home
          </Link>
          <Link to="/events" className="block px-3 py-2 text-[15px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-all duration-200">
            Events
          </Link>
          <Link to="/create-event" className="block px-3 py-2 text-[15px] font-semibold text-[#9CA3AF] hover:text-[#FFFFFF] transition-all duration-200">
            Host Event
          </Link>

          
          <div className="h-px bg-white/[0.06] my-2" />
          
          {user ? (
            <div className="flex flex-col gap-2 pt-1">
              {user.isAdmin && (
                <Link to="/admin" className="block px-3 py-2 text-[15px] font-bold text-[#FFFFFF]">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/profile" className="block px-3 py-2 text-[15px] font-semibold text-[#9CA3AF]">
                Profile ({user.name})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-[15px] font-bold text-[#CCCCCC] flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link to="/login" className="text-center px-4 py-3 text-sm font-semibold text-[#9CA3AF] border border-white/[0.15] rounded-full">
                Login
              </Link>
              <Link to="/register" className="text-center px-4 py-3 text-sm font-bold text-white bg-white/20 rounded-full">
                Register Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
