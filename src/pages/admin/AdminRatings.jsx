import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { apiRequest } from "../../utils/api";

export default function AdminRatings() {
  const [filterRating, setFilterRating] = useState("All");
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const data = await apiRequest("/admin/comments");
      setCommentsList(data || []);
    } catch (err) {
      console.error("Error fetching admin ratings/comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const filteredRatings = filterRating === "All"
    ? commentsList
    : commentsList.filter((r) => r.rating === parseInt(filterRating));

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading ratings & feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
            Event <span className="text-gradient">Ratings</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Review feedback, rating scores, and attendee commentary.</p>
        </div>

        <div className="flex items-center gap-3 bg-[#141211] px-4 py-2 rounded-xl border border-cream/10">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Filter:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-transparent text-white text-xs font-bold uppercase tracking-wider outline-none border-none focus:outline-none focus:ring-0 focus:border-transparent cursor-pointer pr-4 appearance-none shadow-none"
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="%23cbd5e1" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right -4px center",
            }}
          >
            <option className="bg-[#141211] text-white border-none" value="All">
              All Scores
            </option>
            <option className="bg-[#141211] text-white border-none" value="5">
              5 Stars
            </option>
            <option className="bg-[#141211] text-white border-none" value="4">
              4 Stars
            </option>
            <option className="bg-[#141211] text-white border-none" value="3">
              3 Stars
            </option>
            <option className="bg-[#141211] text-white border-none" value="2">
              2 Stars
            </option>
            <option className="bg-[#141211] text-white border-none" value="1">
              1 Star
            </option>
          </select>
        </div>
      </div>

      {/* Ratings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRatings.map((review) => {
          const user = review.user;
          const event = review.event;

          return (
            <div
              key={review._id}
              className="bg-[#141211] p-6 rounded-[2rem] border border-cream/10 hover:border-cream/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex text-carrot drop-shadow-[0_0_8px_rgba(255,94,58,0.4)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-carrot" : "text-slate-800"}`} />
                    ))}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-carrot/10 border border-carrot/20 flex items-center justify-center font-['Syne'] font-extrabold text-carrot shadow-md text-xs uppercase">
                    {user?.name?.charAt(0) || "?"}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-semibold text-white text-xs mb-2 line-clamp-4 leading-relaxed">
                    "{review.text}"
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    By {user?.name || "Anonymous User"}
                  </p>
                </div>
              </div>

              {event && (
                <div className="pt-4 border-t border-cream/5 flex items-start gap-3 mt-4">
                  {event.eventImage && (
                    <img
                      src={event.eventImage}
                      alt={event.title}
                      className="w-10 h-10 rounded-lg object-cover border border-cream/10 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-carrot transition-colors">
                      {event.title}
                    </p>
                    <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
                      {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "TBD"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredRatings.length === 0 && (
        <div className="text-center py-20 bg-[#141211] rounded-[2rem] border border-cream/10">
          <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="font-['Syne'] text-xl font-bold text-white mb-1">No reviews found</h3>
          <p className="text-slate-400 text-sm">No attendee reviews match current filter criteria.</p>
        </div>
      )}
    </div>
  );
}

