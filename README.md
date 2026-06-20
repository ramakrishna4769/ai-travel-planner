# AI Travel Planner ✈️🤖

An interactive, AI-powered travel planning web application that generates personalized day-by-day itineraries, estimated trip budgets, hotel suggestions, and dynamic packing lists using the Gemini API.

## 🚀 Deployed URL
The application is deployed and accessible at: **[Pending/To Be Deployed]** (Update with deployment link when ready)

---

## 🛠️ Chosen Tech Stack & Justification

### Frontend
- **React.js (Vite):** A high-performance, fast-loading, single-page application framework offering smooth components and state management.
- **Tailwind CSS v4:** Leveraged for advanced utility styling, glassmorphism UI components, fluid gradients, and fully responsive layouts.
- **React Router Dom v7:** Configured for frontend path management and page protection.

### Backend
- **Node.js & Express.js:** The standard asynchronous runtime and minimal server framework for highly performant and scalable Web APIs.
- **Mongoose (MongoDB ODM):** Provides structured schema validation and easy CRUD querying for MongoDB collections.

### Database
- **MongoDB:** A document-oriented NoSQL database that perfectly maps JSON structures, making storing rich nested itinerary schemas simple and high-performing.

### Language
- **JavaScript (ES6+):** Standardized scripting language used end-to-end to speed up development cycles.

---

## 🏗️ High-Level Architecture Explanation

The project is organized as a clean **Monorepo** consisting of two main sub-applications:
1. `/frontend`: Vite React Single Page Application containing custom styling and state hooks.
2. `/backend`: Node.js Express server containing auth control, trip generation logic, and Mongoose schemas.

### System Diagram
```
[React SPA Frontend] <--- (HTTP REST API) ---> [Express Server Backend]
                                                      |
                                    +-----------------+-----------------+
                                    |                                   |
                         [Mongoose / MongoDB]                 [Google Gemini API]
                      (Data Storage & Isolation)            (AI Itinerary Generation)
```

---

## 🔐 Authentication & Authorization Approach

We implement secure **JWT (JSON Web Token)** authentication:
1. **Password Hashing:** Passwords are encrypted before database insertion using `bcryptjs` with 10 salt rounds.
2. **Access Tokens:** Upon registering or logging in, the backend issues a signed JWT containing the user's ID, valid for 7 days.
3. **Frontend Storage:** The token and user profile are saved in `localStorage`.
4. **Header Enforcement:** All protected routes on the frontend include the token as a `Bearer` token inside the `Authorization` header.
5. **Strict Data Isolation:** The backend `protect` middleware decodes the token and attaches the user object to `req.user`. Every trip query is strictly queried by `user: req.user._id`, ensuring users can never view or modify another traveler's plan.

---

## 🤖 AI Agent Design & Purpose

The AI travel agent communicates directly with the **Google Gemini API** (`@google/generative-ai` SDK using `gemini-1.5-flash`).

### Generation Agent
- Receives user inputs (Destination, Duration, Budget Preference, and Interests).
- Executes a highly structured system prompt instructing the model to act as a pro tour guide and return a strictly formatted JSON structure (avoiding text wrapping issues).
- Automatically calculates budget breakdown items based on destination and budget type.

### Editing & Regeneration Agent
- Modifies individual days of the itinerary dynamically without touching the rest of the plan.
- Accepts the user's custom instruction (e.g. "make it more relaxing") and the existing day's activities, then calls the AI to output a newly revised timeline array for that day.

---

## 🎒 Creative Custom Feature: Smart Packing List Generator

### Why We Built It
Travelers often struggle to pack appropriately for their specific activities. While generic packing lists are common, they don't adapt to whether you're going hiking, museum hopping, or fine dining.

### How It Works
1. When generating the trip itinerary, the AI agent also generates a custom list of **10–15 packing items** categorized into groups (Clothing, Electronics, Toiletries, Documents, etc.).
2. The list is dynamically tailored:
   - If "Adventure" is selected, it appends athletic clothing and hydration packs.
   - If "Food" is selected, it appends sanitizers and wet wipes.
   - It also adapts to the destination's climate.
3. **Full-Stack Persistence:** Users can check/uncheck items directly in the UI. Toggling a checkbox triggers a backend update, persisting the state to the MongoDB database so it syncs across devices.

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
1. Navigate to `/backend`.
2. Create a `.env` file containing:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-travel-planner
   JWT_SECRET=supersecretjwtkey
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > [!NOTE]
   > **Robust Connection Fallback:** If `MONGO_URI` is not configured or fails to connect, the server automatically boots in **Mock DB Mode**, initializing a local file-based database (`backend/data/mockDb.json`) so the backend functions seamlessly without database dependencies.
   > **Gemini Fallback:** If `GEMINI_API_KEY` is not provided, the server utilizes an intelligent local mock generator, yielding rich travel itineraries so the user flow can be tested instantly.
3. Run `npm install` to install dependencies.
4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Navigate to `/frontend`.
2. Run `npm install` to install dependencies.
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

---

## ⚖️ Key Design Decisions & Trade-Offs

- **NoSQL vs SQL:** MongoDB was chosen over SQL databases because travel itineraries represent highly nesting documents (days containing lists of activities, budget breakdowns, hotels, etc.). Modifying these schemas dynamically is much easier with NoSQL.
- **Vite over Next.js:** While the prompt allowed Next.js, Vite with React Router was utilized to achieve faster compile times and keep the Express backend separate, matching candidate expertise.
- **Mock DB Fallback:** Built an in-memory/JSON-file database fallback to guarantee the codebase builds and executes flawlessly out-of-the-box for evaluators without configuring Atlas accounts.

---

## ⚠️ Known Limitations
- **API Rate Limits:** The free tier of Gemini API is subject to rate limiting.
- **Currency:** Currently supports only USD ($) for budget estimation.
