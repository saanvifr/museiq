<div align="center">

# 🎵 MuseIQ

### AI-Powered Music Catalog Insights Platform

Search • Save • Analyze • Discover

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)]()
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot)]()
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql)]()
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)]()
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)]()

### 🌐 Live Demo

https://saanvifr-museiq.vercel.app

</div>

---

# ✨ Overview

MuseIQ is a full-stack music discovery platform that allows users to search the iTunes music catalog, build a personalized album library, visualize listening analytics, and receive AI-powered music recommendations.

The application combines a modern React frontend with a secure Spring Boot backend to deliver an engaging music exploration experience.

---

# 🚀 Features

- 🔍 Search albums using the iTunes Search API
- ❤️ Save albums to a personal music library
- ⭐ Rate albums and add personal notes
- ✏️ Edit and delete saved albums
- 📊 Interactive analytics dashboard
- 🤖 AI-generated music recommendations using Google Gemini
- 🔐 Secure JWT Authentication
- 📱 Responsive design across devices

---

# 📊 Analytics Dashboard

MuseIQ provides visual insights into your music collection.

- 📀 Albums by Genre
- 🎤 Albums by Artist
- 📅 Releases by Year
- ⭐ Highest Rated Albums

---

# 🤖 AI Feature

MuseIQ integrates **Google Gemini** to analyze the user's saved library and generate personalized music insights including:

- Similar artist recommendations
- Genre analysis
- Listening summary
- Album suggestions based on ratings

---

# 🏗 Architecture

```
React (Vite)
      │
      ▼
Spring Boot REST API
      │
      ▼
PostgreSQL Database
      │
      ▼
Google Gemini API

      +
iTunes Search API
```

---

# 🛠 Technology Stack

## 🎨 Frontend

- React.js (Vite)
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

---

## ⚙ Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

---

## 🗄 Database

- PostgreSQL

---

## 🌐 External APIs

- iTunes Search API
- Google Gemini API

---

# 🗃 Database Schema

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
| user_rating | Rating |
| user_notes | Notes |
| created_at | Created Timestamp |
| updated_at | Updated Timestamp |

---

# 🔗 REST APIs

```
POST   /auth/register
POST   /auth/login

GET    /api/search

GET    /api/library
POST   /api/library
PUT    /api/library/{id}
DELETE /api/library/{id}
```

---

# 🔐 Authentication

JWT Authentication secures all user-specific endpoints.

Protected Routes

- Library
- Analytics
- AI Insights

Public Routes

- Login
- Register
- Search Albums

---

# ⚙ Local Development

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

Runs on

```
http://localhost:8080
```

---

## Frontend

```bash
cd MuseIQ
npm install
npm run dev
```

Runs on

```
http://localhost:5173
```

---

# ☁ Production Deployment

- **Frontend:** Vercel
- **Backend:** Railway
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

# ⚖ Trade-offs

- Selected **Albums** as the primary entity because they provide richer metadata for analytics.
- Used the public iTunes Search API to avoid authentication complexity.
- Prioritized clean architecture, security, and maintainability over additional social features.

---

# 🚀 Future Enhancements

- Playlist Management
- Advanced Search Filters
- Infinite Scroll & Pagination
- Unit & Integration Testing
- Redis Caching
- Music Sharing
- Dark Mode
- Recommendation History

---

<div align="center">

## 👩‍💻 Developer

### **Saanvi Singh**

GitHub • https://github.com/saanvifr

LinkedIn • https://www.linkedin.com/in/saanvi-singh-9b4550324/

⭐ If you like this project, consider giving it a star!

</div>
