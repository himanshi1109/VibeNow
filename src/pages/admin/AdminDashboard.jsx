import { useState, useEffect } from "react";
import { Users, CalendarDays, ShoppingBag, Star, TrendingUp, IndianRupee } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminDashboard() {
  const [usersList, setUsersList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersData, eventsData, ordersData, commentsData] = await Promise.all([
          apiRequest("/admin/users"),
          apiRequest("/admin/events"),
          apiRequest("/admin/orders"),
          apiRequest("/admin/comments"),
        ]);
        setUsersList(usersData);
        setEventsList(eventsData);
        setOrdersList(ordersData);
        setCommentsList(commentsData);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRevenue = ordersList.reduce((sum, order) => sum + (order.billedAmount || 0), 0);

  const stats = [
    { name: "Total Users", value: usersList.length, icon: Users, color: "text-cream", bg: "bg-cream/10 border-cream/25" },
    { name: "Total Events", value: eventsList.length, icon: CalendarDays, color: "text-carrot", bg: "bg-carrot/10 border-carrot/25" },
    { name: "Total Orders", value: ordersList.length, icon: ShoppingBag, color: "text-cream", bg: "bg-cream/10 border-cream/25" },
    { name: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-carrot", bg: "bg-carrot/10 border-carrot/25" },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading dashboard statistics...</p>
      </div>
    );
  }

  // Custom mock data for the weekly order bar chart
  const weeklyData = [
    { day: "Mon", count: 18 },
    { day: "Tue", count: 24 },
    { day: "Wed", count: 38 },
    { day: "Thu", count: 32 },
    { day: "Fri", count: 45 },
    { day: "Sat", count: 52 },
    { day: "Sun", count: 48 },
  ];

  const maxCount = Math.max(...weeklyData.map(d => d.count));

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
            <span className="text-gradient">Dashboard</span> Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time metrics and booking activity for VibeNow.</p>
        </div>
        <div className="bg-[#141211] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 border border-cream/10 shadow-md">
          Live Updates Enabled
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.name} 
            className="bg-[#141211] p-6 rounded-3xl border border-cream/10 relative overflow-hidden group hover:scale-[1.02] hover:border-cream/20 transition-all duration-300 shadow-xl"
          >
            {/* Background Accent Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-[40px] opacity-10 group-hover:opacity-25 transition-opacity ${stat.color === 'text-carrot' ? 'bg-carrot' : 'bg-cream'}`} />
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-slate-500 text-[10px] font-extrabold uppercase tracking-widest mb-1.5">{stat.name}</p>
                <h3 className="font-['Syne'] text-3xl font-extrabold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl border ${stat.bg} ${stat.color} shadow-lg`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-5 flex items-center gap-2 text-xs relative z-10">
              <span className="flex items-center text-carrot font-bold bg-carrot/10 px-2 py-0.5 rounded border border-carrot/25">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Graphs / Activity Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders Graph Mockup */}
        <div className="bg-[#141211] rounded-[2rem] border border-cream/10 overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-cream/5 flex items-center justify-between">
            <h2 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-carrot" /> Weekly Bookings
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-white/5 border border-cream/10 px-2.5 py-1 rounded-md">
              Order Volume
            </span>
          </div>

          <div className="p-8 flex-1 flex flex-col justify-between h-64">
            {/* Bars container */}
            <div className="flex items-end justify-between h-40 px-2 relative border-b border-cream/10 pb-2">
              {weeklyData.map((data) => {
                const heightPercentage = (data.count / maxCount) * 100;
                return (
                  <div key={data.day} className="flex flex-col items-center gap-2 group w-full">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-carrot text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded absolute -translate-y-10 shadow-lg pointer-events-none">
                      {data.count} Orders
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-8 rounded-t-lg bg-gradient-to-t from-carrot/40 to-carrot group-hover:from-carrot group-hover:to-carrot/80 transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(255,94,58,0.1)] group-hover:shadow-[0_0_20px_rgba(255,94,58,0.3)]"
                      style={{ height: `${heightPercentage}%`, minHeight: '8px' }}
                    />
                    <span className="text-[10px] font-bold text-slate-500">{data.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-2 font-medium">
              <span>Total Orders this week: {weeklyData.reduce((s, d) => s + d.count, 0)}</span>
              <span>Avg/day: 35</span>
            </div>
          </div>
        </div>

        {/* Recent Ratings & Reviews List */}
        <div className="bg-[#141211] rounded-[2rem] border border-cream/10 overflow-hidden flex flex-col shadow-xl">
          <div className="p-6 border-b border-cream/5 flex items-center justify-between">
            <h2 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-carrot fill-carrot" /> Recent Customer Reviews
            </h2>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-white/5 border border-cream/10 px-2.5 py-1 rounded-md">
              Feedback feed
            </span>
          </div>

          <div className="divide-y divide-cream/5 max-h-64 overflow-y-auto custom-scrollbar">
            {commentsList.slice(0, 4).map((r) => (
              <div key={r._id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors duration-300">
                <div className="min-w-0 pr-4">
                  <p className="text-white text-xs font-semibold mb-1 truncate max-w-[280px]">"{r.text}"</p>
                  <p className="text-[10px] text-slate-500 font-medium">Event: {r.event?.title || 'General'} • User: {r.user?.name || 'Anonymous'}</p>
                </div>
                <div className="flex text-carrot shrink-0 drop-shadow-[0_0_5px_rgba(255,94,58,0.4)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-current" : "text-slate-800"}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
