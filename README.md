<div align="center">

# 🎵 MuseIQ

### AI-Powered Music Catalog Insights Platform

Search • Save • Analyze • Discover

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)

## 🌐 Live Demo

### https://saanvifr-museiq.vercel.app

> **Note:** Please create a new account by signing up first, then log in using your registered credentials to access the application and all features.

</div>

---

# ✨ Overview

MuseIQ is a full-stack music discovery platform that enables users to search the iTunes music catalog, build a personalized album library, visualize listening analytics, and receive AI-powered music recommendations.

The application combines a modern React frontend with a secure Spring Boot backend to deliver an engaging music exploration experience.

---

# 🎯 Entity Choice

MuseIQ focuses on **Albums** as the primary entity because albums provide richer metadata such as genre, artwork, release date, and track count. This enables meaningful analytics and personalized AI-powered recommendations.

---

# 🚀 Features

- 🔍 Search albums using the iTunes Search API
- ❤️ Save albums to a personal music library
- ⭐ Rate albums and add personal notes
- ✏️ Edit and delete saved albums
- 📊 Interactive analytics dashboard
- 🤖 AI-powered music recommendations using Google Gemini
- 🔐 Secure JWT Authentication
- 📱 Responsive design across all devices

---

# 📊 Analytics Dashboard

The dashboard provides insights into the user's music library through interactive charts.

- 📀 Albums by Genre
- 🎤 Albums by Artist
- 📅 Releases by Year
- ⭐ Highest Rated Albums

---

# 🤖 AI Feature

MuseIQ integrates **Google Gemini** to analyze the user's saved library and generate personalized insights based on listening preferences.

Features include:

- 🎵 Album recommendations
- 🎤 Similar artist suggestions
- 📈 Genre insights
- 📝 Personalized listening summaries

---

# 🏗 Architecture

```text
                React (Vite)
                     │
                     ▼
          Spring Boot REST API
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
 PostgreSQL Database      Google Gemini API
         ▲
         │
 iTunes Search API
```

---

# 🛠 Technology Stack

## 🎨 Frontend

- React 19 (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

### Database

- PostgreSQL

### External APIs

- iTunes Search API
- Google Gemini API

---

# 🗄 Database Schema

| Field | Description |
|-------|-------------|
| id | Primary Key |
| apple_catalog_id | Apple Album ID |
| title | Album Title |
| artist_name | Artist Name |
| genre | Genre |
| release_date | Release Date |
| track_count | Number of Tracks |
| artwork_url | Album Artwork |
| user_rating | User Rating |
| user_notes | Personal Notes |
| created_at | Created Timestamp |
| updated_at | Updated Timestamp |

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone https://github.com/saanvifr/museiq.git
cd museiq
```

## Backend

```bash
cd museiq-backend
./mvnw spring-boot:run
```

Runs on:

```
http://localhost:8080
```

## Frontend

```bash
cd MuseIQ
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

# ☁️ Production Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL

---

# 🔑 Environment Variables

## Backend

```properties
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Frontend

```env
VITE_API_URL=http://localhost:8080
```

---

# ⚖️ Trade-offs

- Selected **Albums** as the primary entity because they provide richer metadata for analytics and AI insights.
- Used the public **iTunes Search API**, which simplifies integration but limits results to Apple's music catalog.
- Prioritized clean architecture, security, and maintainability over advanced features such as playlists, social sharing, and caching.

---
