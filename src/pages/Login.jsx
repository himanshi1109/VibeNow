import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Sparkles, LogIn } from "lucide-react";
import { apiRequest } from "../utils/api";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      localStorage.setItem("user", JSON.stringify(data));
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
      window.location.reload();
    } catch (err) {
      setError(err.message || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-white/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob" />
      <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-white/70/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animate-blob-delay" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all">
              <span className="font-['Syne'] font-bold text-white text-xl">V</span>
            </div>
            <span className="font-['Syne'] font-extrabold text-2xl text-gradient">VibeNow</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2 font-['Syne']">Welcome Back</h2>
          <p className="text-slate-400">Enter your details to access your vibes.</p>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-white/70/15 border border-white/70/30 text-white/70 text-xs font-semibold text-center animate-fade-in">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-['Space_Grotesk']"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-['Space_Grotesk']"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-white/20 bg-white/5 text-white focus:ring-white/50 focus:ring-offset-[#020412]" />
                <span className="text-slate-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="#" className="text-white hover:text-white/70 font-medium transition-colors">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex items-center justify-center py-4 rounded-xl bg-gradient-to-r from-white/20 via-white/10 to-white/5 text-white font-bold tracking-wider overflow-hidden hover:scale-[1.02] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                {loading ? "Signing In..." : "Sign In"}{" "}
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-white/50 hover:text-white font-bold transition-colors">
              Create an account
            </Link>
          </div>
          

        </div>
      </div>
    </div>
  );
}
