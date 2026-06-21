import { HelpCircle, Star, Sparkles, Award, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F3F4F6] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(217, 70, 239, 0.08), transparent)"
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#16161F] border border-white/[0.08] rounded-full">
            <Sparkles className="w-4 h-4 text-[#FFFFFF]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
              About VibeNow
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Curating Social Experiences
          </h1>
          <p className="text-[#9CA3AF] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            We build platforms that connect people with music, design conferences, and comedy shows that perfectly match their energy and aesthetic.
          </p>
        </div>

        {/* Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#16161F] border border-white/[0.08] rounded-2xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Our Mission</h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              To simplify real-world social discoverability. By introducing digital tear-off stubs, real-time seat allocations, and verified pass lists, we take event planning into a high-fidelity era.
            </p>
          </div>

          <div className="bg-[#16161F] border border-white/[0.08] rounded-2xl p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Secure Ticketing</h3>
            <p className="text-[#9CA3AF] text-sm leading-relaxed">
              Every ticket is linked with offline barcode scans and cryptographic QR entry passes, ensuring zero duplicate ticketing or scalping issues at the physical gates.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {[
              {
                q: "How do I download my ticket pass?",
                a: "Go to your 'My Tickets' dashboard from the top navigation panel, select your active ticket, and download the tear-off voucher stub or view the digital entry pass QR code."
              },
              {
                q: "Can I host my own event on VibeNow?",
                a: "Yes! Click the 'Host Event' or 'Create Event' link in your profile menu, fill in the pricing and location details, and submit. Admins will review and publish it."
              },
              {
                q: "What is the refund policy?",
                a: "Tickets are fully refundable up to 24 hours before the event starts. Refunds are processed back to your digital credit balance instantly."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-[#16161F] border border-white/[0.08] rounded-2xl p-6">
                <h4 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
                  <HelpCircle className="w-4 h-4 text-[#FFFFFF] flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-[#9CA3AF] text-xs sm:text-sm mt-3 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
