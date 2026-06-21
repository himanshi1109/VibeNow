import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Sparkles, Send, Loader2 } from "lucide-react";
import { apiRequest } from "../utils/api";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "init-1",
      text: "Hey! 👋 I'm VibeAI. What kind of vibe are you looking for tonight?",
      isBot: true,
    },
    {
      id: "init-2",
      text: "Tell me if you want something chill, high-energy, or maybe a mix!",
      isBot: true,
    },
  ]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    const textToSend = inputVal.trim();
    if (!textToSend || sending) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      text: textToSend,
      isBot: false,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setSending(true);

    try {
      // Check if user is logged in
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        throw new Error("Please log in to chat with VibeAI!");
      }

      const reply = await apiRequest("/chat", {
        method: "POST",
        body: JSON.stringify({ text: textToSend }),
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          text: typeof reply === "string" ? reply : reply.message || "I couldn't process that response.",
          isBot: true,
        },
      ]);
    } catch (err) {
      console.error("ChatBot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          text: err.message || "Sorry, I had trouble connecting. Please try again.",
          isBot: true,
          isError: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Panel */}
      <div
        className={`mb-4 w-80 sm:w-96 transition-all duration-300 transform origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-50 opacity-0 pointer-events-none"
        }`}
      >
        <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.2)] border border-white/10 flex flex-col h-[400px]">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-white/20 via-white/20 to-white/70/20 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#020412] rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white/70" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Syne']">VibeAI</h3>
                <p className="text-[10px] text-white/50">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 custom-scrollbar bg-[#020412]/60">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm shadow-sm border ${
                    msg.isBot
                      ? msg.isError
                        ? "bg-red-950/30 text-red-300 border-red-900/30 rounded-tl-sm"
                        : "glass-card text-slate-200 border-white/5 rounded-tl-sm"
                      : "bg-white/20 text-white border-none rounded-tr-sm shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm glass-card text-xs text-slate-400 border border-white/5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  VibeAI is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.02]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your mood..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50 transition-all font-['Space_Grotesk']"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending}
                className="absolute right-2 p-2 rounded-full bg-gradient-to-r from-white to-white text-white hover:scale-105 transition-transform shadow-[0_0_10px_rgba(255,255,255,0.4)] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#020412] border border-white/10 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300 relative group z-50 pointer-events-auto"
      >
        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-white/70 animate-pulse opacity-30 group-hover:opacity-50 transition-opacity" />
        {/* Glowing border outline */}
        <span className="absolute -inset-[2px] rounded-full bg-gradient-to-br from-white/20 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 blur-[6px] transition-opacity duration-500 -z-10" />

        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageCircle className="w-6 h-6 relative z-10" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white/50 rounded-full text-[8px] font-bold flex items-center justify-center text-[#020412] z-20 shadow-[0_0_10px_rgba(255,255,255,0.6)]">
            1
          </span>
        )}
      </button>
    </div>
  );
}

