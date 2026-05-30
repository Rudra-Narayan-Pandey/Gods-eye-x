# 👁️ GOD'S EYE X

**Project Singularity** - An autonomous, generative AI intelligence engine that doesn't just search the web—it analyzes reality. Built on the Anakin API and a distributed cluster of ChatGPT verification agents.

## 🚀 The Vision

In a world drowning in disconnected data, **God's Eye X** serves as a centralized intelligence nexus. It ingests massive amounts of global news, financial data, and technological signals, and passes them through a pipeline of autonomous AI agents to build a living, breathing **3D Knowledge Graph** of reality.

We don't just extract entities. We calculate **Reality Drift**, detect hidden **Risks**, and predict future **Opportunities** using consensus-based LLM verification.

## 🧠 Architecture Overview

God's Eye X is built on a highly scalable, enterprise-grade architecture:

*   **Frontend:** Next.js 14, React, Tailwind CSS, WebGL (ForceGraph3D)
*   **Backend:** Python, FastAPI, SQLAlchemy
*   **AI Engine:** **Anakin API** (ChatGPT integration), G4F Fallback Cluster
*   **Primary Database:** PostgreSQL (Persistent relational storage)
*   **Graph Database:** Neo4j (Entity relationship mapping)
*   **Vector Memory:** Qdrant (Semantic similarity and anomaly detection)

### The Holocron Pipeline
When a search is initiated, the system triggers the **Holocron DAG** (Directed Acyclic Graph):
1.  **Ingestion:** Scrapes real-time signals via Anakin Wire API (or Google News fallback).
2.  **Extraction Agent:** Uses generative AI to identify critical entities (Companies, Technologies, Policies, Geopolitics).
3.  **Verification Agent:** Spawns multiple AI verification threads to generate a Consensus Score for each entity, computationally stripping away hallucinations.
4.  **Intelligence Engines:** 
    *   *Reality Drift Engine:* Compares the mainstream narrative to actual market vectors.
    *   *Risk & Opportunity Engines:* Uses LLMs to detect supply chain vulnerabilities and emerging market monopolies.
5.  **Graph Synthesis:** Persists all intelligence into Neo4j and visualizes it in a live 3D WebGL interface.

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js v18+
*   Python 3.10+
*   PostgreSQL
*   Neo4j Desktop (or AuraDB)
*   Qdrant (Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/Rudra-Narayan-Pandey/Gods-eye-x.git
cd Gods-eye-x
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # (Windows)
pip install -r requirements.txt
```
*Note: Ensure your PostgreSQL, Neo4j, and Qdrant instances are running, and update your `.env` file with the corresponding credentials.*

**Run the Backend:**
```bash
uvicorn backend.main:app --reload
```
The backend API documentation will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
The application will now be live at `http://localhost:3000`.

## 🛡️ Fallback Resilience (Bulletproof Architecture)
God's Eye X is designed to never crash. If the primary Anakin API hits rate limits or goes offline, the system instantly and seamlessly fails over to a secondary heuristic and NLP extraction cluster to ensure the intelligence pipeline and UI remain completely functional during live deployments.

## 🏆 Hackathon Submission
This project was built with a relentless focus on pushing the limits of generative AI, real-time data pipelines, and cinematic UX/UI design. It represents the future of autonomous research.
