<div align="center">

# 🎵 MuseIQ

### AI-Powered Music Catalog Insights Platform

**Search • Save • Analyze • Discover**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)

</div>

---

# ✨ Overview

MuseIQ is a full-stack music discovery platform that enables users to search the iTunes music catalog, build a personalized album library, visualize music analytics, and receive AI-powered music recommendations.

Users can search for albums, save them to their personal library, rate albums, add personal notes, and analyze their music preferences through an interactive dashboard.

The application combines a React frontend with a Java Spring Boot backend, MySQL database, and Google Gemini API to deliver an engaging music discovery experience.

---

# 🎯 Entity Choice

MuseIQ focuses on **Albums** as its primary entity because albums provide richer metadata such as genre, artwork, release date, and track count.

This information enables meaningful analytics and personalized AI-powered music recommendations.

---

# 🚀 Features

- 🔍 **Album Search:** Search albums using the iTunes Search API.
- ❤️ **Personal Music Library:** Save albums to a personal collection.
- ⭐ **Ratings & Notes:** Rate albums and add personal notes.
- ✏️ **Library Management:** Edit and delete saved albums.
- 📊 **Analytics Dashboard:** Visualize music preferences through interactive charts.
- 🤖 **AI Recommendations:** Get personalized album recommendations using Google Gemini.
- 🎤 **Artist Suggestions:** Discover similar artists.
- 🔐 **JWT Authentication:** Secure user authentication.
- 📱 **Responsive Design:** Access the application across different screen sizes.

---

# 📊 Analytics Dashboard

The dashboard provides insights into the user's saved music library through interactive charts.

It includes:

- 📀 Albums by Genre
- 🎤 Albums by Artist
- 📅 Albums by Release Year
- ⭐ Highest-Rated Albums

Interactive visualizations are implemented using **Recharts**.

---

# 🤖 AI-Powered Music Insights

MuseIQ integrates the **Google Gemini API** to analyze users' saved music libraries and generate personalized music insights.

AI-powered features include:

- 🎵 Personalized album recommendations
- 🎤 Similar artist suggestions
- 📈 Genre preference insights
- 📝 Personalized listening summaries

The backend prepares relevant information from the user's saved library and sends it to Gemini to generate personalized recommendations and insights.

---

# 🏗️ System Architecture

MuseIQ follows a frontend-backend architecture.

```text
                    USER
                      |
                      v
                React Frontend
                      |
                HTTP Requests
                      |
                      v
             Spring Boot Backend
                      |
           +----------+----------+
           |          |          |
           v          v          v
         MySQL     Gemini API   iTunes
        Database     API      Search API
```

### Application Workflow

1. The user interacts with the React frontend.
2. React sends HTTP requests to the Spring Boot backend.
3. Spring Boot handles application logic and database operations.
4. MySQL stores user information and saved album details.
5. The backend communicates with the iTunes Search API to retrieve album information.
6. The backend sends relevant saved-library information to Google Gemini.
7. Gemini generates personalized music insights and recommendations.
8. The backend returns the results to the frontend for display.

---

# 🛠️ Technology Stack

### 🎨 Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Lucide React

### ⚙️ Backend

- Java 17
- Spring Boot 3
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate

### 🗄️ Database

- MySQL

### 🔗 External APIs

- iTunes Search API
- Google Gemini API

---

# 🗄️ Database Schema

Albums are the primary entity in MuseIQ.

The album information includes:

| Field | Description |
|---|---|
| id | Primary Key |
| apple_catalog_id | Apple Album ID |
| title | Album Title |
| artist_name | Artist Name |
| genre | Music Genre |
| release_date | Album Release Date |
| track_count | Number of Tracks |
| artwork_url | Album Artwork URL |
| user_rating | User Rating |
| user_notes | Personal Notes |
| created_at | Creation Timestamp |
| updated_at | Last Updated Timestamp |

User-specific album information is managed within the application's database.

---

# ⚙️ Local Setup

## Prerequisites

Make sure you have installed:

- Java 17
- Node.js and npm
- MySQL
- Git

## 1. Clone the Repository

```bash
git clone https://github.com/saanvifr/museiq.git
cd museiq
```

## 2. Set Up MySQL

Start MySQL and create the database:

```sql
CREATE DATABASE museiq;
```

Configure your MySQL database credentials in the backend configuration.

## 3. Configure Environment Variables

Configure the following values according to your backend implementation:

```properties
DATABASE_URL=your_mysql_database_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_gemini_api_key
```

Never commit actual passwords, API keys, or secret values to GitHub.

## 4. Run the Backend

Navigate to the backend directory:

```bash
cd museiq-backend
```

Run the Spring Boot application.

**Windows:**

```bash
mvnw.cmd spring-boot:run
```

**Linux / macOS:**

```bash
./mvnw spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

## 5. Run the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd MuseIQ
npm install
```

Configure the frontend environment variable:

```env
VITE_API_URL=http://localhost:8080
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# ☁️ Production Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MySQL |

Environment variables are used to manage application configuration and sensitive credentials.

---

# ⚖️ Design Decisions & Trade-offs

- **Albums as the primary entity:** Albums provide rich metadata for analytics and personalized recommendations.
- **iTunes Search API:** Simplifies music catalog integration without maintaining a separate music catalog.
- **MySQL:** Stores structured application data and user-specific album collections.
- **Google Gemini API:** Generates personalized music recommendations and insights.
- **React and Spring Boot:** Separate frontend presentation from backend business logic.

### Future Improvements

- Playlist creation and management.
- Social sharing of music collections.
- Recommendation history.
- Caching for frequently searched albums.
- More detailed music analytics.

---

<div align="center">

### 🎵 Discover Music. Understand Your Taste. Explore More.

**Built with React, Java, Spring Boot, MySQL, and Google Gemini AI.**

</div>
