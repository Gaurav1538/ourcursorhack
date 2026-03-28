# Digital Sentinel

**Digital Sentinel** is a safety intelligence web app that helps people plan and understand risk before and during travel. Users run a **Safety check** (here vs travel), see an **Insights** report with scores and trends, explore a **Live safety map** with heat layers and route context, and can open **Emergency** tools anytime. A **Spring Boot** backend exposes REST APIs (routes, risk, incidents, emergency POIs, AI chat), and the **React (Vite)** frontend (`digital-sentinel/`) delivers the experience.

---

## Tech stack (high level)

| Layer | Stack |
|--------|--------|
| Frontend | React, React Router, Leaflet, Tailwind-style utility classes |
| Backend | Java 21, Spring Boot 3, Spring Security (permit-all for demo APIs), Spring AI |
| Data | MongoDB (configurable), OpenStreetMap / Overpass for nearby emergency POIs |
| External APIs | Open-Meteo (weather in UI), Apify (backend actors), LLM via Spring AI |

---

## Repository layout

- `project/` — Spring Boot application (Maven). Local default port **8081** (cloud uses `PORT`).
- `digital-sentinel/` — Vite + React SPA. Point `VITE_GUARDIAN_API_URL` at your backend (e.g. `http://localhost:8081`).

### Deploy for free (hackathon)

See **[DEPLOY.md](./DEPLOY.md)**. **No Docker:** deploy the API on **Railway** (Nixpacks + `project/railway.toml`). **Docker:** use **Render** + `project/Dockerfile`. Frontend: **Vercel** / Netlify (`digital-sentinel/`, `vercel.json`, `public/_redirects`).

---

## Hackathon sponsor tools (how we use them)

We focused on these four sponsor resources to build faster and to align with specific tracks.

### Cursor (Title sponsor)

We used **Cursor** as our primary IDE to move quickly across the Java backend and React frontend: refactors, API wiring, Leaflet map behavior, and consistent UI copy. Cursor’s AI-assisted editing helped us iterate on features like the map **trip metrics**, **Sentinel chat**, and **route copilot** without losing context across files.

- Docs: [https://docs.cursor.sh](https://docs.cursor.sh)  
- Download: [https://cursor.sh](https://cursor.sh)

---

### Mobbin

**Mobbin** was our **UI and UX reference library**—we browsed patterns for dashboards, map-adjacent layouts, emergency flows, and chat panels to keep **Digital Sentinel** feeling modern and legible (clear hierarchy, strong CTAs for Safety check and Emergency, readable data density on Insights). Mobbin is used for **design inspiration**, not as a runtime dependency.

- Website: [https://mobbin.com](https://mobbin.com)

---

### Apify

**Apify** powers **structured data pulls** in the backend where we need real-world signals beyond mocks:

- **Crime / news context** — `ApifyService` calls Apify actors (e.g. news scraping flows) to fetch items relevant to a city, exposed via the API layer.
- **Weather-related pipelines** — `WeatherService` can use Apify actor endpoints (with `apify.api.token`) as part of the backend data story.

Configure the token in your environment (see `application.properties` for `apify.api.token`). If Apify is unavailable, the app is designed to degrade with fallbacks where implemented.

- Docs: [https://docs.apify.com](https://docs.apify.com)  
- Actor Store: [https://apify.com/store](https://apify.com/store)

---

### OpenAI

Our **conversational and reasoning layer** is built on **Spring AI**’s `ChatClient`: the **Sentinel chat** (`/api/assistant/chat`), one-shot **AI ask** (`/api/ai/ask`), and services like **AiService** / **AssistantService** send structured prompts (including optional JSON **trip context** from the SPA) to produce short, safety-focused answers, route copilot text on the map, and similar briefs.

> **Note:** This repository’s sample `application.properties` wires **Spring AI** to **Google GenAI (Gemini)** via `spring.ai.google.genai.*`. Spring AI supports multiple providers; for the **OpenAI** sponsor track you can align configuration with **OpenAI’s Chat Completions API** using Spring AI’s OpenAI model starter and keys as per [OpenAI’s platform docs](https://platform.openai.com/docs). The product features (chat, copilot, contextual briefs) map directly to that ecosystem.

- OpenAI docs: [https://platform.openai.com/docs](https://platform.openai.com/docs)  
- API reference: [https://platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)

---

## Quick start

### Backend

```bash
cd project
./mvnw.cmd spring-boot:run   # Windows
# or: ./mvnw spring-boot:run  # Unix
```

Set required env vars / secrets as needed (e.g. Mongo URI, model API keys, `apify_key`).

### Frontend

```bash
cd digital-sentinel
npm install
npm run dev
```

Create `.env` if needed:

```env
VITE_GUARDIAN_API_URL=http://localhost:8081
```

---

## Tip for hackathon teams

Pick a **sponsor track early**, read their docs, and thread one clear story through your demo (e.g. “Apify for signals → Spring AI for explanation → map for action”). Judges can follow that arc in under two minutes.

---

## License

Add your team’s license here if applicable.
