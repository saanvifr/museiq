<div align="center">

# 🎵 MuseIQ

### AI-Powered Music Catalog Insights Platform

**Search • Save • Analyze • Discover**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot)
![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)

### 🌐 [Live Demo](https://saanvifr-museiq.vercel.app)

[GitHub Repository](https://github.com/saanvifr/museiq)

> **Getting started:** Create an account using Sign Up, then log in with your registered credentials to explore the application.

</div>

---

## 📌 Overview

MuseIQ is a full-stack music discovery and analytics platform that helps users explore albums, manage their personal music libraries, understand their music preferences, and discover new music through AI-powered recommendations.

Users can search the iTunes music catalog, save albums, rate them, add personal notes, and visualize their music preferences through an interactive analytics dashboard.

The platform also integrates Google Gemini API to generate personalized music recommendations and insights based on users' saved albums.

---

## ✨ Features

- 🔍 **Album Search:** Search albums using the iTunes Search API.
- ❤️ **Personal Music Library:** Save albums to a personal collection.
- ⭐ **Ratings & Notes:** Rate albums and add personal notes.
- ✏️ **Library Management:** Edit and delete saved albums.
- 📊 **Analytics Dashboard:** Visualize music preferences through interactive charts.
- 🤖 **AI Recommendations:** Get personalized album recommendations using Google Gemini.
- 🎤 **Artist Suggestions:** Discover similar artists.
- 🔐 **JWT Authentication:** Secure user authentication.
- 📱 **Responsive UI:** Access the application across different screen sizes.

---

## 📊 Analytics Dashboard

The analytics dashboard provides visual insights into the user's saved album collection.

It includes:

- Albums by Genre
- Albums by Artist
- Albums by Release Year
- Highest-Rated Albums

Interactive charts are built using **Recharts**.

---

## 🤖 AI-Powered Music Insights

MuseIQ integrates the **Google Gemini API** to analyze users' saved music libraries and generate personalized insights.

AI-powered features include:

- 🎵 Personalized album recommendations
- 🎤 Similar artist suggestions
- 📈 Genre preference insights
- 📝 Personalized listening summaries

The backend prepares the relevant user-library information and sends it to Gemini to generate recommendations.

---

## 🏗️ System Architecture

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
          +---------+---------+
          |         |         |
          v         v         v
        MySQL    Gemini API   iTunes
       Database    API      Search API
```

### Application Workflow

1. The user interacts with the React frontend.
2. The frontend sends HTTP requests to the Spring Boot backend.
3. The backend handles application logic and database operations.
4. MySQL stores user information and saved album details.
5. The backend communicates with the iTunes Search API to retrieve album information.
6. Google Gemini processes relevant saved-library information to generate personalized music insights.
7. The backend returns the results to the frontend for display.

---

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite
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
- MySQL

### External APIs
- iTunes Search API
- Google Gemini API

---

## 🗄️ Database Design

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

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Java 17
- Node.js and npm
- MySQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/saanvifr/museiq.git
cd museiq
```

### 2. Set Up MySQL

Start MySQL and create the database:

```sql
CREATE DATABASE museiq;
```

Configure your database credentials in the backend environment or application configuration.

### 3. Configure Backend Environment Variables

Set the following values according to your backend configuration:

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/museiq
SPRING_DATASOURCE_USERNAME=your_mysql_username
SPRING_DATASOURCE_PASSWORD=your_mysql_password

JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the Backend

Open a terminal in the backend directory:

```bash
cd museiq-backend
```

Run the Spring Boot application:

**Windows:**

```bash
mvnw.cmd spring-boot:run
```

**Linux / macOS:**

```bash
./mvnw spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 5. Run the Frontend

Open another terminal in the frontend directory:

```bash
cd MuseIQ
npm install
```

Create or configure the frontend environment file:

```env
VITE_API_URL=http://localhost:8080
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## ☁️ Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MySQL |

The application uses environment variables to manage configuration and sensitive credentials.

---

## ⚖️ Design Decisions & Trade-offs

| Decision | Reason |
|---|---|
| Albums as the primary entity | Albums provide rich metadata for analytics and recommendations. |
| iTunes Search API | Provides access to Apple's music catalog without maintaining a separate music catalog. |
| MySQL | Stores structured application data and user-specific album collections. |
| Google Gemini API | Generates personalized recommendations and music insights. |
| React and Spring Boot | Separate frontend presentation from backend business logic. |

### Future Improvements

- Playlist creation and management
- Social sharing of music collections
- Recommendation history
- Caching for frequently searched albums
- More detailed music analytics

---

<div align="center">

## 🎵 Discover Music. Understand Your Taste. Explore More.

**Built with React, Java, Spring Boot, MySQL, and Google Gemini AI.**

</div>
