# Deploy Digital Sentinel for free (hackathon)

You have **two pieces**: a **Spring Boot API** (`project/`) and a **Vite React app** (`digital-sentinel/`). The usual free pattern is:

| Piece | Free host | Notes |
|--------|-----------|--------|
| Frontend | **Vercel** or **Netlify** or **Cloudflare Pages** | Static build + SPA routing |
| Backend | **Railway** (no Docker) or **Render** (Docker) | Free tiers may **sleep** after idle |
| Database | **MongoDB Atlas** M0 | Free cluster; use env var for URI (rotate credentials if they were ever committed) |

**CORS:** Controllers use `@CrossOrigin`, so your deployed frontend origin can call the API. Set the frontend env **`VITE_GUARDIAN_API_URL`** to your **public API URL** (including `https://`).

---

## 1. Secrets and env vars (set on the host, never in Git)

| Variable | Where it’s used |
|----------|------------------|
| `SPRING_DATA_MONGODB_URI` | Full MongoDB connection string (Atlas → Connect → Drivers) |
| `gemini_Key` | Google AI / Gemini key for Spring AI (`application.properties`) |
| `apify_key` | Apify token (`apify.api.token`) |
| `PORT` | Usually **injected automatically** by Render/Railway (already mapped in `application.properties`) |

Optional: if you switch to OpenAI via Spring AI, follow Spring Boot env naming for that starter instead of `gemini_Key`.

**Security:** If your Mongo password ever appeared in a public repo, **rotate it** in Atlas before going live.

---

## 2. Deploy the API **without Docker** (Railway) — easiest for Java

Render’s **native** runtimes do **not** include Java (only Node, Python, Go, Rust, etc.), so Spring Boot on Render usually means **Docker**. To avoid Docker entirely, use **Railway** with **Nixpacks** (auto-detects Maven + `pom.xml`).

1. Push the repo to **GitHub**.
2. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
3. Add a **service** from this repo, then open **Settings**:
   - **Root Directory:** `project`  
   - **Builder:** Nixpacks (default).
4. **Variables** (same as below): `SPRING_DATA_MONGODB_URI`, `gemini_Key`, `apify_key`. Railway injects **`PORT`** automatically; this app already uses `server.port=${PORT:8081}`.
5. **Deploy** → copy the **public URL** (e.g. under **Networking** → generate domain).

`project/railway.toml` sets the **start command** to run the fat JAR:

`java -jar target/project-0.0.1-SNAPSHOT.jar`

If you change the artifact version in `pom.xml`, update that filename in `railway.toml` (or switch to a small script that picks `target/*.jar`).

**Note:** Railway’s free tier is credit-based; check current limits. If the first build fails, open **Deploy Logs** — sometimes `mvnw` must be executable on Linux (`git update-index --chmod=+x mvnw` once from the `project/` folder).

---

## 3. Deploy the API **with Docker** (Render)

1. Push the repo to **GitHub**.
2. Go to [render.com](https://render.com) → **New +** → **Web Service**.
3. Connect the repo; use these settings:
   - **Root directory:** leave empty or set to repo root (see below).
   - **Environment:** **Docker**.
   - **Dockerfile path:** `project/Dockerfile`
   - **Docker context:** `project` (directory that contains `Dockerfile` and `pom.xml`).

   If Render only allows Dockerfile at root, either:
   - set **Root Directory** to `project` and **Dockerfile Path** to `./Dockerfile`, or  
   - keep **Root Directory** empty and set **Dockerfile Path** to `project/Dockerfile` and **Docker Build Context** to `project` (Render’s UI labels vary slightly).

4. **Instance type:** Free (expect **~30–60 s cold start** after idle).
5. **Environment variables** (Render dashboard → Environment):
   - `SPRING_DATA_MONGODB_URI` = your Atlas URI  
   - `gemini_Key` = your Gemini API key  
   - `apify_key` = your Apify token (or a placeholder if you disable Apify paths)

6. Deploy and copy the service URL, e.g. `https://digital-sentinel-api.onrender.com`.

7. Smoke test: open `https://YOUR-API.onrender.com/swagger-ui.html` (if springdoc is enabled) or hit a simple GET you know exists.

---

## 4. Deploy the frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the same GitHub repo.
2. **Root Directory:** `digital-sentinel`
3. **Framework Preset:** Vite (auto-detected).
4. **Environment Variables** → add:
   - **Name:** `VITE_GUARDIAN_API_URL`  
   - **Value:** your API URL (e.g. `https://xxxx.up.railway.app` or `https://YOUR-API.onrender.com`) — no trailing slash

5. Deploy. Vite bakes this URL into the build; if you change the API URL later, **redeploy** the frontend.

`vercel.json` in `digital-sentinel/` already includes SPA **rewrites** so `/map`, `/insights`, etc. work on refresh.

---

## 5. Alternative frontends (Netlify / Cloudflare Pages)

- **Netlify:** Root = `digital-sentinel`, build = `npm run build`, publish = `dist`.  
  `public/_redirects` copies into `dist` and fixes SPA routes.

- **Cloudflare Pages:** Same build command/output; add a **SPA fallback** rule:  
  `/*` → `/index.html` (200) in Pages settings.

Always set **`VITE_GUARDIAN_API_URL`** in the platform’s env UI before build.

---

## 6. Other API options

- **Railway + Dockerfile:** Set root to `project` and switch the builder to **Dockerfile** if you prefer the same image as Render.
- **Fly.io:** Typically uses a Dockerfile; `fly launch` in `project/`, then `fly secrets set` for env vars.

---

## 7. Hackathon demo checklist

1. Hit the **API URL** once before judges arrive (warms cold start).  
2. Open the **Vercel URL** in an incognito window to confirm fresh load.  
3. Confirm **Atlas IP allowlist**: `0.0.0.0/0` for hackathon demo (tighten later).  
4. If AI chat fails, check `gemini_Key` and logs on Render/Railway.

---

## 8. Local Docker test (optional)

```bash
cd project
docker build -t sentinel-api .
docker run --rm -p 8080:8080 ^
  -e PORT=8080 ^
  -e SPRING_DATA_MONGODB_URI="your-uri" ^
  -e gemini_Key="your-key" ^
  -e apify_key="your-token" ^
  sentinel-api
```

(Use `\` instead of `^` on macOS/Linux.)

Then build the frontend with `VITE_GUARDIAN_API_URL=http://localhost:8080` and `npm run build && npm run preview`.
