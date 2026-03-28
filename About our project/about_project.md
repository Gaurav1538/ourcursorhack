Personalized Travel Safety Assistant 

Hackathon Project Document | End-to-End Build Plan | Team of 3 

Project Summary 

A user enters a location, travel time, and traveler profile. The system returns a personalized safety score, risk explanation, safe-hours warning, micro-area risk, a heatmap/map view, emergency resources, and an AI assistant that answers follow-up questions. The product is designed as a polished, working hackathon MVP. 

1. Product Goal and Positioning 

The objective is to build a complete, end-to-end safety intelligence product that feels credible, useful, and demo-ready. The product should not look like a generic chatbot or a basic map app. It should feel like a decision-support system that combines live signals, structured scoring, and AI explanation. 

2. Core User Experience 

User opens the landing page and enters location, traveler type, time of travel, and travel mode. 

Frontend validates the input and sends it to the backend. 

Backend collects public signals using Exa and Apify, and falls back to mock data if a source fails. 

A scoring engine calculates a personalized safety score and breakdown. 

OpenAI turns the structured result into a readable explanation, checklist, and follow-up answer. 

Frontend renders score cards, heatmap/map, emergency panel, and chat assistant. 

The final report is stored in Convex so the user can revisit or share it. 

3. MVP Scope 

Location search with a clean, minimal form. 

Traveler profiles such as solo traveler, female traveler, family, student, and tourist. 

Time-aware safety logic: daytime, evening, late night. 

Personalized safety score with clear factor breakdown. 

AI-generated risk explanation and safety advice. 

Heatmap-style map view showing safer and riskier zones. 

Emergency resources panel with nearby police, hospital, and safe-place information. 

Follow-up AI assistant for questions like “Is this area safe after 10 PM?” 

4. What Not to Build 

Do not build a social network or review community. 

Do not build a full account system unless time remains. 

Do not train a machine-learning model from scratch. 

Do not over-integrate too many APIs. 

Do not expand beyond one strong workflow. 

Priority 

Include 

Reason 

Must have 

Score + explanation + map 

Needed for a complete demo 

Should have 

Emergency resources 

Adds real-world usefulness 

Could have 

Follow-up AI chat 

Makes the product feel advanced 

5. Recommended Tech Stack 

Layer 

Recommended tools 

Frontend 

Next.js, TypeScript, Tailwind CSS, shadcn/ui 

Backend 

Convex for storage, backend functions, and realtime updates 

AI 

OpenAI API for summaries, chat, and risk explanations 

Search 

Exa API for public web search 

Scraping 

Apify for structured extraction where needed 

Map 

Mapbox or Google Maps for map and heatmap visualization 

6. System Architecture 

Step 

Component 

Input 

Output 

1 

UI Form 

User location and profile 

Validated request payload 

2 

Data Fetcher 

Validated request 

Public signals from Exa/Apify 

3 

Scoring Engine 

Signals + profile + time 

Personalized safety score 

4 

AI Layer 

Score + breakdown + signals 

Readable explanation + advice 

5 

Visualization 

Scored result 

Heatmap, cards, chart, emergency panel 

6 

Persistence 

Final report 

Stored report in Convex 

7. Scoring Logic 

Use a deterministic weighted score in the MVP. This is safer and easier to debug than a complex model. The score should be explainable and consistent. 

Example weighted formula 

Safety Score = 0.35 × area risk + 0.25 × time risk + 0.20 × traveler profile risk + 0.10 × recent negative signals + 0.10 × emergency availability 

Area risk: high / medium / low based on retrieved signals. 

Time risk: daytime safer than night, and late night risk is highest. 

Traveler risk: solo, female, family, or student profiles change the weights. 

Recent signal risk: use recent public mentions or warnings. 

Emergency availability: better coverage slightly improves confidence. 

8. Data Strategy 

The app should degrade gracefully when a source fails. 

Primary data: Exa search results for public signals and context. 

Secondary data: Apify extraction for structured location or review information. 

Fallback data: mock data bundles stored in the app for demo reliability. 

Always cache the last successful result in Convex. 

Show a visible fallback badge when the app uses mock or partial data. 

9. Detailed Build Plan 

Phase 

Deliverable 

What to build 

1 

App shell 

Create the landing page, navigation, form layout, and result sections. 

2 

Mock demo 

Wire the form to mocked output so the entire flow works immediately. 

3 

Convex setup 

Create schema, save report mutation, and query recent reports. 

4 

Exa integration 

Fetch public context for the searched location. 

5 

Apify integration 

Add structured extraction only if it materially improves data quality. 

6 

Scoring engine 

Calculate personalized risk using the weighted formula. 

7 

OpenAI layer 

Generate explanation, checklist, and follow-up chat answers. 

8 

Map view 

Render heatmap and the area risk visualization. 

9 

Emergency mode 

Show nearby resources and quick safety actions. 

10 

Polish 

Add loading states, errors, micro-animations, and final demo cleanup. 

10. Team Division for 3 People 

Member 

Primary role 

Owns 

Deliverable 

1 

Frontend owner 

UI, pages, cards, map section, state handling 

Working polished app shell and dashboard 

2 

Backend owner 

Convex schema, data storage, API wiring, fallback logic 

Stable backend with save/load and safe failure handling 

3 

AI and scoring owner 

Prompting, score formula, explanation engine, demo script 

Accurate score logic and strong AI output 

11. Implementation Modules 

Module 

Function 

Notes 

Input validation 

validateSearchInput() 

Prevent empty or invalid requests 

Data fetching 

searchLocationSignals() 

Exa first, Apify if needed, mock fallback always available 

Scoring engine 

calculateBaseSafetyScore() 

Deterministic weighted risk calculation 

Risk summary 

generateRiskBreakdown() 

Convert numbers into readable categories 

AI explanation 

generateSafetyExplanation() 

Use OpenAI to produce human-friendly reasoning 

Chat assistant 

answerSafetyChatQuery() 

Answer follow-up questions in context 

Heatmap builder 

buildHeatmapData() 

Create visual safe/risk zones 

Emergency panel 

getEmergencyResources() 

Police, hospital, safe place, call shortcut 

Persistence 

saveSafetyReport() 

Store report and reuse it later 

12. Failure Handling and Error Strategy 

If Exa fails, use cached or mocked location context. 

If Apify fails, continue with the Exa output and scoring engine. 

If OpenAI fails, show a deterministic explanation template generated locally. 

If the map service fails, render a fallback risk bar instead of a blank page. 

Always show a user-friendly error state, never a raw exception. 

13. Demo Script for Judges 

Open the app and show the clean landing page. 

Enter a location, traveler type, and time of travel. 

Submit and show the score calculation in progress. 

Reveal the personalized score and factor breakdown. 

Open the map and heatmap visualization. 

Ask the AI assistant a follow-up question. 

Open emergency mode and show nearby resources. 

Show that the report is saved in Convex. 

14. Environment Variables 

Variable 

Purpose 

OPENAI_API_KEY 

OpenAI calls for explanation and chat 

EXA_API_KEY 

Public web search and context retrieval 

APIFY_TOKEN 

Structured scraping if required 

CONVEX_DEPLOYMENT 

Convex backend connection 

NEXT_PUBLIC_MAPBOX_TOKEN 

Map rendering and heatmap layers 

15. README Outline 

Project overview and demo flow 

Tech stack and setup requirements 

Environment variables 

How to run locally 

How each module works 

How to present the project in the hackathon 

16. Final Recommendation 

Build the first version as a reliable, clean, and visually polished decision tool. A focused product with one excellent workflow will outperform an overbuilt project with unstable features. The win condition is a smooth demo, a believable architecture, and a result that feels genuinely useful. 