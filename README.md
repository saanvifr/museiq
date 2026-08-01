# MuseIQ 🎵

A full-stack, AI-powered music discovery and library application. Search for your favorite albums, build custom playlists, get AI-generated music insights, and track your listening history.


## Features 🚀

- **Discover Music**: Search the complete iTunes catalog for any artist, album, or genre.
- **My Library**: Save your favorite albums to your personal library for quick access.
- **Custom Playlists**: Create, edit, and organize your music into custom playlists.
- **Recently Played History**: Automatically track and view the albums you've listened to.
- **AI Music Insights**: Get personalized insights and recommendations powered by Google's Gemini AI.
- **User Profiles**: Secure authentication with custom display names and avatar image uploads.

## Tech Stack 💻

**Frontend:**
- React 18 (Vite)
- Tailwind CSS (Custom Design System)
- React Router DOM
- Context API for state management
- Lucide React (Icons)

**Backend:**
- Java 17
- Spring Boot 3
- Spring Security (JWT Authentication)
- Spring Data JPA
- PostgreSQL (Production) / H2 (Development)

## Getting Started (Local Development) 🛠️

### Prerequisites
- Node.js (v18+)
- Java 17
- Maven

### 1. Backend Setup
```bash
cd museiq-backend
# The database will automatically generate using a local H2 file database.
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 2. Frontend Setup
```bash
cd MuseIQ
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

### 3. Environment Variables
To enable AI features, you will need to add your Gemini API key to the backend configuration (`application.yml`):
```yaml
gemini:
  api:
    key: your_api_key_here
```

## Deployment 🌐
This project is configured for split deployment:
- **Frontend**: Configured for Vercel deployment (handles React Router SPA fallbacks via `vercel.json`).
- **Backend**: Configured for Railway deployment with a `nixpacks.toml` configuration and standard PostgreSQL environment variable support (`DATABASE_URL`).
