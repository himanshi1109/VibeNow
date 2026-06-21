import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F3F4F6] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(217, 70, 239, 0.08), transparent)"
        }}
      />

      <div className="relative z-10 max-w-[1000px] mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Get in Touch
          </h1>
          <p className="text-[#9CA3AF] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions about ticket bookings, partnerships, or hosting an event? Send us a message and our support team will reply within 24 hours.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Left - 5 columns */}
          <div className="md:col-span-5 bg-[#16161F] border border-white/[0.08] rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Email Us</h4>
                  <p className="text-sm text-white font-medium mt-0.5">support@vibenow.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Call Support</h4>
                  <p className="text-sm text-white font-medium mt-0.5">+1 (800) 555-VIBE</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Headquarters</h4>
                  <p className="text-sm text-white font-medium mt-0.5">Silicon Valley, California</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Right - 7 columns */}
          <div className="md:col-span-7 bg-[#16161F] border border-white/[0.08] rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#111116] border border-white/[0.08] rounded-xl py-3 px-4 text-[13px] text-white placeholder-[#6B7280] focus:border-[#FFFFFF] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#111116] border border-white/[0.08] rounded-xl py-3 px-4 text-[13px] text-white placeholder-[#6B7280] focus:border-[#FFFFFF] outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Message</label>
                <textarea 
                  required
                  rows="4"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#111116] border border-white/[0.08] rounded-xl py-3 px-4 text-[13px] text-white placeholder-[#6B7280] focus:border-[#FFFFFF] outline-none transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={submitted}
                className="w-full py-4 bg-white/20 text-white text-[13px] font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
              >
                {submitted ? (
                  <>
                    <Check className="w-4 h-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
