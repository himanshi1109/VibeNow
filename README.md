# VibeNow 🎵

VibeNow is a modern, premium event booking and management platform built with React and Vite. It provides a seamless experience for users to discover, book, and review events, alongside a powerful admin dashboard for comprehensive platform management.

## 🌟 Features

### For Users
- **Discover Events**: Browse curated events, festivals, and concerts.
- **Event Details**: View in-depth event information, dates, locations, and pricing.
- **Secure Booking**: Easy checkout process with support for discount coupons.
- **User Profile**: Manage attended events, view ticket purchases, and track credit balance.
- **Reviews & Ratings**: Leave feedback and rate events after attending.

### For Administrators
- **Admin Dashboard**: Sleek, glassmorphic control panel designed for mobile and desktop.
- **Manage Events**: Create, edit, and approve events with image uploads.
- **Manage Users**: Monitor user roles, statuses, and assign platform credits.
- **Order Tracking**: Review all ticket reservations and invoice values.
- **Discount Coupons**: Generate and toggle promotional codes.
- **Review Moderation**: Filter and monitor user ratings and comments.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4 (Premium UI with Glassmorphism)
- **Icons**: Lucide React
- **Extras**: Canvas Confetti (for delightful checkout experiences)

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or newer recommended) installed.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd moodGo-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` (or the port specified by Vite).

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components (Nav, Sidebar, Cards, etc.)
├── pages/          # Main application pages (Home, Profile, Checkout, etc.)
│   └── admin/      # Dedicated Admin Dashboard pages
├── utils/          # Helper functions (API requests, formatting)
└── ...
```

## 🎨 Design Philosophy
VibeNow is built with a focus on **Rich Aesthetics**. It utilizes modern web design principles including vibrant tailored colors, sleek dark modes, smooth gradients, and subtle micro-animations to create a premium, dynamic user experience. The application is fully responsive, ensuring a perfect layout from ultra-wide monitors down to mobile screens.

## 📄 Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the app for production.
- `npm run preview` - Locally preview the production build.
- `npm run lint` - Runs ESLint to catch syntax and style issues.
