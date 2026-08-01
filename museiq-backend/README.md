# MuseIQ: Music Catalog Insights Platform

MuseIQ is a full-stack web application built to fulfill the Music Catalog Insights Platform assignment. It empowers users to search the public iTunes catalog, curate a personal music library, analyze their listening habits through an interactive dashboard, and receive dynamic, AI-powered insights and recommendations.

## 🚀 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, Recharts (for Analytics)
- **Backend:** Java, Spring Boot, Spring Security (JWT)
- **Database:** H2 Database (File-based persistence mode)
- **AI Integration:** Google Gemini 1.5 Flash API
- **External API:** iTunes Search API

## 🏃 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven

### 1. Backend Setup
1. Navigate to the backend directory: `cd museiq-backend`
2. Ensure you have your Gemini API key set in `src/main/resources/application.yml` (it is currently configured).
3. Start the Spring Boot server:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will run on `http://localhost:8080` and will automatically create a persistent database file in `./data/museiqdb`.*

### 2. Frontend Setup
1. Navigate to the frontend directory: `cd MuseIQ`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

## 🏗️ Design Decisions & Trade-offs

### Entity Choice: Albums
I chose **Albums** as the core entity focus. 
**Why?** Albums provide a richer dataset for analytics than individual songs. Tracking albums allows us to generate meaningful statistics like "Releases by Year," "Top Artists," and "Genre Distributions" based on full bodies of work, which makes the AI Insights and Analytics Dashboard significantly more interesting and data-rich.

### Database & Schema (SQL via H2)
I opted for a relational SQL database (H2 in persistent file mode). 
**Why SQL?** A user's music library is inherently relational (Users have Albums, Users have Playlists, Playlists contain Albums). SQL allows for strict schema enforcement, easy aggregations (which powers the Analytics API), and robust relationships via Hibernate/JPA.
**Why H2?** H2 was chosen to reduce local development friction. It runs embedded with the Spring Boot application and persists to a local file, requiring zero external database setup (like installing PostgreSQL) for reviewers, while still strictly enforcing standard SQL relational paradigms.

**Schema (Albums Table):**
- `db_id` (Primary Key, Auto-increment)
- `id` (String, iTunes Catalog ID)
- `title` (String)
- `artist` (String)
- `genre` (String)
- `release_year` (Integer)
- `cover_url` (String)
- `rating` (Integer, 1-5 user rating)
- `notes` (String, user-added notes)
- `user_id` (Foreign Key -> Users table)

*(Note: Date tracking for `created_at`/`updated_at` was omitted in favor of focusing on album-specific metadata like `release_year` for timeline analytics, and `track_count` was omitted as the iTunes API structure for albums prioritizes collections).*

### 🧠 AI Feature: Trend Summary & Recommendations
I implemented the AI feature using the **Google Gemini 1.5 Flash API**. 
When a user navigates to the **AI Insights** tab, the backend securely retrieves their entire curated library (including genres, artists, and their personal 1-5 star ratings) and constructs a dynamic prompt. 

Gemini processes this data to generate two things:
1. **Trend Summary:** A markdown-formatted analysis of their "Musical DNA" (identifying era biases and genre affinities).
2. **Recommendations:** 3 highly targeted album recommendations complete with a rationale based on their specific ratings and tastes.

**Trade-off:** By sending the library to Gemini rather than building a local machine learning recommendation engine, we trade off local compute for latency. However, utilizing an LLM provides significantly richer, natural-language insights that a simple collaborative filtering algorithm could never generate in a 3-day assignment window.
