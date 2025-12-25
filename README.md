# 🎵 Melodify - Music Streaming Client

A modern, Spotify-inspired music streaming web application built with React, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![Supabase](https://img.shields.io/badge/Supabase-Auth-green)

## ✨ Features

- 🎧 **Audio Player** - Full-featured player with play/pause, seek, volume, shuffle, repeat
- 🎵 **Music Library** - Browse tracks by genre, search, and discover new music
- 🎙️ **Podcasts** - Listen to podcasts with episode listings
- 📋 **Playlists** - Create, manage, and play custom playlists
- ❤️ **Favorites** - Like songs and access them in your Liked Songs
- 🕐 **Recently Played** - Track your listening history
- 🔍 **Search** - Search across tracks and podcasts
- 🔐 **Authentication** - Secure login/signup with Supabase Auth
- 👑 **Admin Panel** - Upload tracks and manage content (admin only)
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Auth**: Supabase Auth
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChetuM10/music_streaming_client.git
   cd music_streaming_client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── common/      # Reusable UI components
│   ├── layout/      # Layout, Sidebar, Navigation
│   ├── music/       # TrackCard, etc.
│   ├── player/      # MiniPlayer, ProgressBar, VolumeControl
│   └── podcast/     # PodcastCard, EpisodeCard
├── lib/
│   ├── api.js       # Axios instance
│   ├── supabase.js  # Supabase client
│   └── utils.js     # Helper functions
├── pages/           # Route pages
├── store/           # Zustand stores
└── App.jsx          # Main app with routing
```

## 🎨 Screenshots

_Coming soon_

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🔗 Related

- [Backend Server](https://github.com/ChetuM10/music_streaming_server)
