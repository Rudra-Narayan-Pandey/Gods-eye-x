# 👁️ GOD'S EYE X

**A Real-Time Global Intelligence Operating System.**

Built for the [Anakin Hackathon](https://anakin.io/).

---

## ⚡ What is God's Eye X?
God's Eye X is not a search engine. It is not a dashboard. It is an **autonomous intelligence infrastructure platform** that continuously watches the world, verifies information, reasons over data, and produces actionable intelligence. 

The system operates across **295 distinct subsystems** to answer the most critical questions:
- *What is happening?*
- *Why is it happening?*
- *What will likely happen next?*
- *What are the hidden asymmetric opportunities?*
- *What are the silent risks?*
- *Which public narratives contradict the raw reality?*

---

## 🚀 How it Works (Architecture)

### 1. Data Ingestion (Anakin Wire Engine)
God's Eye X utilizes a simulated **Anakin Wire** action layer to scrape the live internet without authentication headaches or selectors. When a user queries a concept, the system hits the Wikipedia Deep Index API to fetch the absolute latest, verifiable intelligence.

### 2. The Ultimate 295-Subsystem Pipeline
The raw signals are fed into our proprietary `UltimatePipelineEngine`. This engine runs deterministic NLP to calculate metrics across hundreds of domains:
- **Startup Intelligence:** Mentions, Funding Anomalies, Hiring Velocity, Hypergrowth Detection.
- **Technology Intelligence:** Emerging Tech, Patents, Adoption Velocity.
- **Policy & Risk Intelligence:** Regulatory Risks, Supply Chain Vulnerabilities, Threat Scores.
- **Reality Drift Engine:** One of our most advanced features. The engine mathematically compares the "Public Narrative" against the "Observed Reality" to identify dangerous narrative contradictions.

### 3. Knowledge Graph Engine (Neo4j)
Verified entities are extracted and pushed into a **Neo4j** graph database. The system models relationships like `RELATED_TO` and `FUNDS` to understand the massive web of global influence. 

### 4. The Neon Green Cyber Terminal
All of this data is rendered in a breathtaking, hardware-accelerated **3D Force Graph** built with `three.js` and a fully custom, zero-radius Neon Green Cyber Terminal interface. The UI is designed to look like a high-end defense intelligence terminal.

---

## 💻 Tech Stack
- **Frontend:** Next.js 14, Tailwind CSS, Three.js, React-Force-Graph-3D
- **Backend:** FastAPI, Python, SQLAlchemy
- **Data Layers:** Postgres (Relational), Neo4j (Graph), Anakin Wire (Ingestion)

---

## 🛠️ How to Run Locally

1. **Start the Databases**
   Make sure Docker Desktop is running, then execute:
   ```bash
   docker-compose up -d
   ```

2. **Start the Intelligence Pipeline (Backend)**
   ```bash
   .\venv\Scripts\activate
   uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
   ```

3. **Boot the Cyber Terminal (Frontend)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Terminal**
   Open `http://localhost:3000` in your browser. Navigate to the `/search` tab and enter any entity (e.g., "OpenAI", "Nvidia", "London") to watch the system dynamically scrape, process, and render the intelligence in real-time. Navigate to `/graph` to fly through the 3D intelligence network.

---

## 🏅 Hackathon Submission Details
- **Project Name:** God's Eye X
- **Primary API Used:** Anakin Wire / Holocron (Simulated API via Ingestion Engine)
