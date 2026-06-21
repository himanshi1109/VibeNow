import { Link } from "react-router-dom";
import { Instagram, Twitter, Youtube } from "lucide-react";

// Custom simple Discord icon since lucide-react does not have Discord icon built-in sometimes
function DiscordIcon(props) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0C] pt-20 pb-8 overflow-hidden border-t border-white/[0.06]">
      <div className="relative z-10 max-w-[1200px] mx-auto px-4">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          
          {/* Brand Info Left - 4 cols */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-[#F3F4F6]">
                VibeNow
              </span>
            </Link>
            <p className="text-[#9CA3AF] text-[14px] leading-relaxed max-w-sm">
              Discover and secure tickets for premium design panels, live music performances, and comedy shows that perfectly match your vibe.
            </p>
          </div>

          {/* Nav Link Columns Center - 5 cols (Quick Links, Company, Support) */}
          <div className="md:col-span-5 grid grid-cols-3 gap-4">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F3F4F6] mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="text-[13px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-[13px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F3F4F6] mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/about" className="text-[13px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200">
                    About
                  </Link>
                </li>
                <li>
                  <a href="#careers" className="text-[13px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F3F4F6] mb-4">
                Support
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/contact" className="text-[13px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200">
                    Contact
                  </Link>
                </li>
                <li>
                  <a href="#help" className="text-[13px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors duration-200">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons Right - 3 cols */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F3F4F6]">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#16161F] border border-white/[0.08] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#16161F] border border-white/[0.08] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#16161F] border border-white/[0.08] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#16161F] border border-white/[0.08] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-[#6B7280]">
            © {new Date().getFullYear()} VibeNow. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[13px] text-[#6B7280]">
            <a href="#privacy" className="hover:text-[#F3F4F6] transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#F3F4F6] transition-colors duration-200">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
