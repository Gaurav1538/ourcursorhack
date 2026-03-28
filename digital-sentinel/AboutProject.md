Digital Sentinel - Project Structure & Planning

1. Project Overview

Digital Sentinel is a premium, AI-powered safety intelligence web application. It processes millions of global data points, real-time law enforcement data, and infrastructure statuses to provide travelers with dynamic safe routing, real-time area safety indexes, and a global emergency SOS protocol.

2. Tech Stack & Architecture

Frontend Framework: React 18

Routing: React Router DOM (react-router-dom)

Styling: Tailwind CSS (with custom utility classes and animations)

Icons & Typography: Google Material Symbols, Inter (Body), Manrope (Headlines)

Maps & Geocoding: Leaflet.js, OpenStreetMap (Nominatim API), CARTO dark tiles

Backend API: Guardian Safety API (RESTful, OpenAPI 3.1.0) running on http://localhost:8081

3. Frontend Application Structure

While currently consolidated for sandbox previewing, the target production structure is modularized as follows:

digital-sentinel/
├── public/
│   └── index.html               # Main HTML with Leaflet & Tailwind CDN configs
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Global navigation & branding
│   │   │   └── Footer.jsx       # Global footer
│   │   └── ui/                  # Reusable UI elements (Buttons, Cards, Inputs)
│   ├── pages/
│   │   ├── Landing.jsx          # Entry point, destination & profile selection
│   │   ├── Dashboard.jsx        # Safety index, AI brief, and trend analytics
│   │   ├── MapDetail.jsx        # Interactive Leaflet map with route & hotspot layers
│   │   └── Emergency.jsx        # SOS dispatch, incident reporting, responder list
│   ├── services/
│   │   ├── api.js               # GuardianAPI client & fallback mock data
│   │   └── osm.js               # OpenStreetMap Nominatim geocoding service
│   ├── App.jsx                  # Main router setup and state management
│   ├── main.jsx                 # React root render
│   └── index.css                # Tailwind directives and custom animations
├── package.json
└── tailwind.config.js


4. Core Pages & Feature Mapping

4.1 Landing Page (/)

Purpose: Initial user onboarding and threat scan configuration.

Features:

Traveler profile selection (Solo, Female, Family, Student).

Destination input with immediate "Trending" quick-selects.

Departure timing (Immediate vs. Scheduled).

API Triggers: Prepares state payload for Dashboard.

4.2 Dashboard (/dashboard)

Purpose: High-level safety intelligence briefing.

Features:

Live Area Safety Index (0-100 score).

7-Day Trend Analysis (Bar chart representation).

Infrastructure Validation (Lighting, CCTV, Police Presence).

Live Incident Count (48h rolling window).

Guardian API Terminal (Integrated AI Chatbot).

API Triggers: /api/safety/analyze, /api/trends, /api/assistant/chat.

4.3 Intelligence Map (/map)

Purpose: Granular, geospatial threat visualization.

Features:

Interactive dark-themed Leaflet map.

Dynamic polyline generation for the safest route.

Heatmap overlays for general risk intensity.

Point-of-interest markers for recent live incidents.

Click-to-query exact coordinate risk scores.

API Triggers: OSM Geocoder, /api/route/analyze, /api/route/safe, /api/map/heatmap, /api/incidents/nearby, /api/risk/detailed.

4.4 Emergency Protocol (/emergency)

Purpose: Rapid response and incident reporting.

Features:

"Global SOS" primary action button.

Incident classification and reporting form.

Live feed of global/local network incidents.

Directory of nearby verified responders (Hospitals, Police).

API Triggers: /api/incidents (POST/GET), /api/emergency.

5. API Integration Matrix (Guardian Safety API)

Endpoint

Method

Component / Context

Description

/api/safety/analyze

POST

Dashboard.jsx

Generates the primary 0-100 safety score, risk levels, and AI insights.

/api/trends

GET

Dashboard.jsx

Fetches 7-day longitudinal data for the trending bar chart.

/api/assistant/chat

POST

Dashboard.jsx

Powers the natural language "Guardian API Terminal".

/api/route/analyze

POST

MapDetail.jsx

Calculates ETA, traffic, and identifies high/medium risk hotspots.

/api/route/safe

GET

MapDetail.jsx

Returns an array of lat/lng points used to draw the Leaflet Polyline.

/api/map/heatmap

GET

MapDetail.jsx

Returns intensity data to render blue radius overlays on the map.

/api/incidents/nearby

GET

MapDetail.jsx

Fetches specific recent events to drop as interactive red ! markers.

/api/risk/detailed

GET

MapDetail.jsx

Triggered onClick anywhere on the map to show a popup with exact risk.

/api/emergency

GET

Emergency.jsx

Locates nearest hospitals and police stations with distance/ETA.

/api/incidents

POST

Emergency.jsx

Submits user-generated incident reports (Theft, Assault, Hazard).

/api/incidents

GET

Emergency.jsx

Populates the rolling "Live Network Feed" log.

6. External Integrations

OpenStreetMap (Nominatim): https://nominatim.openstreetmap.org/search. Used to convert user-entered city strings (e.g., "Paris, FR") into precise latitude/longitude pairs so Leaflet and the Guardian API have exact coordinates to process.

Leaflet & CARTO: https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png. Used for the high-contrast, premium dark mode base map tiles.

7. Future Enhancements & Roadmap

Authentication (JWT): Implement user accounts to save customized profiles, private contact networks, and historical routes.

WebSocket Integration: Upgrade the /api/incidents and /api/emergency endpoints to WSS for true real-time push notifications without polling.

Turn-by-Turn Navigation: Enhance MapDetail with real-time geolocation tracking using the browser's navigator.geolocation API to move the user marker dynamically along the safe route.