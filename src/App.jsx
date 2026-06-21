import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";
import AdminSidebar from "./components/AdminSidebar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookTicket from "./pages/BookTicket";
import MyTickets from "./pages/MyTickets";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminRatings from "./pages/admin/AdminRatings";
import CreateEvent from "./pages/CreateEvent";
import BookingConfirmed from "./pages/BookingConfirmed";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0A0908]">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Animated Glowing Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cream/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] bg-carrot/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animate-blob-delay" />
      <div className="absolute bottom-[-10%] left-1/3 w-80 h-80 bg-[#CCCCCC]/10 rounded-full mix-blend-screen filter blur-[100px] animate-float" />
    </div>
  );
}

function PublicLayout() {
  return (
    <div className="min-h-screen text-slate-100 font-['Space_Grotesk'] selection:bg-carrot/30 selection:text-white">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-0">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen text-slate-100 font-['Space_Grotesk'] selection:bg-carrot/30 selection:text-white flex flex-col">
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-1 relative">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 relative z-0 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookTicket />} />
          <Route path="/confirmed/:id" element={<BookingConfirmed />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/ratings" element={<AdminRatings />} />
        </Route>
      </Routes>
    </>
  );
}
