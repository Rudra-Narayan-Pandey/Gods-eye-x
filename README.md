# 👁️ GOD'S EYE X

**Real-Time Global Intelligence Infrastructure**

> **Anakin Build-a-thon Submission**
> **Version:** 5.0 (Ultimate Edition)

![GOD'S EYE X UI](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

## 🌌 The Vision
In a world where data is generated faster than humans can process it, the organizations that win aren't the ones with the most data—they are the ones who can connect the dots the fastest. 

**GOD'S EYE X** is a real-time intelligence infrastructure designed for elite decision-makers (VCs, Hedge Funds, Intelligence Agencies). It doesn't just aggregate data; it synthesizes it into a living knowledge graph, detecting anomalies and surfacing hidden opportunities before the market reacts.

---

## ✨ Features (The 5-Screen Experience)

Our hackathon submission is a fully-fledged, ultra-premium web application containing 5 core modules:

1. **Reality Search Engine**: Omniscient, natural-language-driven search across all entities (Companies, Startups, Technologies, Events). Features a masonry grid layout, complex filtering, and a slide-out Intelligence Panel.
2. **Graph Intelligence Explorer**: A custom D3.js + HTML5 Canvas force-directed graph. Explore the relationships between entities physically. Features zoom/pan, node dragging, and dynamic filtering.
3. **Live Command Dashboard**: A real-time terminal showing incoming intelligence feeds, country-level heatmaps, anomaly detection alerts, and market momentum metrics.
4. **AI Report Generation**: Automated synthesis of complex data into structured, readable executive briefings.
5. **Cinematic Landing Page**: A visually stunning entry point featuring WebGL-style interactive particles, scroll-reveal animations, and glassmorphic design.

---

## 🛠️ Master Build Architecture (Holocron)

This is the production-grade **Master Build**, utilizing a distributed, multi-database agentic architecture orchestrated by **Holocron**.

* **Frontend**: **Next.js (App Router)** + React Server Components + D3.js Knowledge Graph
* **Backend**: **FastAPI** (Python 3.10+) running the Holocron orchestration pipeline
* **Data Ingestion**: **Anakin Wire** (Live RSS, Social, Company, and Market Signals via `yfinance` & `feedparser`)
* **Databases** (Dockerized):
  * **PostgreSQL**: Relational entities and application state
  * **Neo4j**: Graph database for the reality knowledge graph
  * **Qdrant**: Vector semantic memory
  * **Redis**: High-speed caching and Celery queues

## 🚀 Running Locally (Master Build)

We have provided a one-click startup script for Windows.

1. Ensure **Docker Desktop** is running.
2. Double-click the `start-master.bat` script in the root directory.

This script will automatically:
- Spin up PostgreSQL, Neo4j, Qdrant, and Redis via Docker Compose.
- Open a dedicated terminal for the Holocron FastAPI Backend (Port 8000).
- Open a dedicated terminal for the Next.js Frontend (Port 3000).

### Access Points:
- **Next.js Web App**: `http://localhost:3000`
- **FastAPI Docs (Swagger)**: `http://localhost:8000/docs`
- **Neo4j Browser**: `http://localhost:7474`
- **Qdrant Dashboard**: `http://localhost:6333/dashboard`


---

## 💎 Design Philosophy
We believe B2B and enterprise tools don't have to be ugly. GOD'S EYE X was designed with an uncompromising focus on aesthetics:
* **Glassmorphism**: Extensive use of `backdrop-filter: blur(16px)` layered over dark backgrounds.
* **Micro-interactions**: Every button, card, and input reacts to user input with subtle glows, transforms, and transitions.
* **Typography**: Inter (Body) for readability, paired with Orbitron (Display) for a futuristic, terminal-like feel. JetBrains Mono is used for data points.

## 🏆 Hackathon Notes
All UI components, routing logic, graph physics, and CSS design systems were built entirely from scratch for this hackathon. The data is currently mocked via rich JSON-like ES modules to demonstrate the exact UX of the final platform without requiring a backend for the demo.
