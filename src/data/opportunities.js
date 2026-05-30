// ─── GOD'S EYE X — Opportunities Mock Data ─────────────────────────
// 10 high-conviction strategic opportunities detected by intelligence analysis

export const opportunities = [
  {
    id: 'opp-001',
    title: 'AI Inference Chip Market Disruption',
    description: 'Custom silicon startups (Groq, Cerebras, Etched) are demonstrating 10-100x cost/performance gains over NVIDIA GPUs for inference workloads. The $85B inference market is ripe for disruption as cloud providers seek alternatives to NVIDIA dependency.',
    category: 'AI Infrastructure',
    confidenceScore: 0.89,
    impactScore: 0.94,
    evidence: [
      { source: 'Bloomberg', snippet: 'Groq\'s LPU architecture achieves 10x lower cost-per-token vs. H100 in independent benchmarks.', date: '2026-05-18' },
      { source: 'TechCrunch', snippet: 'AWS and Microsoft are both testing Groq and Cerebras chips for internal inference workloads.', date: '2026-05-14' },
      { source: 'ArXiv', snippet: 'Novel deterministic scheduling on LPU shows 18x throughput improvement on Llama 3 70B.', date: '2026-05-10' }
    ],
    relatedEntities: ['Groq', 'Cerebras', 'NVIDIA', 'Amazon AWS', 'Microsoft'],
    detectedAt: '2026-05-20T14:30:00Z',
    timeHorizon: 'medium',
    potentialValue: '$50B-85B addressable market by 2028'
  },
  {
    id: 'opp-002',
    title: 'European Sovereign AI Mandate',
    description: 'EU regulation requiring critical infrastructure AI to be trained and hosted within European borders is creating a massive captive market. European AI champions will capture $30B+ in government and enterprise contracts.',
    category: 'AI Infrastructure',
    confidenceScore: 0.82,
    impactScore: 0.88,
    evidence: [
      { source: 'Reuters', snippet: 'European Commission drafts Digital Sovereignty Act mandating EU-hosted AI for government operations.', date: '2026-05-22' },
      { source: 'Financial Times', snippet: 'Mistral AI and Aleph Alpha positioned as primary beneficiaries of EU sovereign AI procurement.', date: '2026-05-19' },
      { source: 'Politico EU', snippet: 'France and Germany jointly pledge €8B for sovereign AI compute infrastructure.', date: '2026-05-15' }
    ],
    relatedEntities: ['Mistral AI', 'Aleph Alpha', 'France', 'Germany', 'UK'],
    detectedAt: '2026-05-22T09:15:00Z',
    timeHorizon: 'medium',
    potentialValue: '$25B-40B European AI market by 2029'
  },
  {
    id: 'opp-003',
    title: 'Humanoid Robotics Commercialization Wave',
    description: 'Multiple humanoid robot startups are simultaneously reaching manufacturing readiness. BMW, Amazon, and Tesla factory deployments signal the beginning of a massive new labor automation market. First-mover advantage is critical.',
    category: 'Robotics',
    confidenceScore: 0.85,
    impactScore: 0.96,
    evidence: [
      { source: 'Wall Street Journal', snippet: 'Figure AI deploys 50 humanoid robots at BMW\'s Spartanburg plant for assembly line tasks.', date: '2026-05-25' },
      { source: 'MIT Technology Review', snippet: 'Foundation models for robotics enabling zero-shot task generalization in warehouse environments.', date: '2026-05-20' },
      { source: 'Bloomberg', snippet: 'Global humanoid robot market projected at $154B by 2030, up from $3B in 2025.', date: '2026-05-12' }
    ],
    relatedEntities: ['Figure AI', 'Tesla', 'NVIDIA', 'Boston Dynamics', '1X Technologies'],
    detectedAt: '2026-05-25T11:00:00Z',
    timeHorizon: 'medium',
    potentialValue: '$100B-154B market by 2030'
  },
  {
    id: 'opp-004',
    title: 'Fusion Energy Breakthrough Timeline Compressed',
    description: 'Commonwealth Fusion Systems and Helion Energy both report achieving key milestones ahead of schedule. Private fusion companies may demonstrate net energy gain 2-3 years earlier than expected, reshaping the energy investment landscape.',
    category: 'Energy',
    confidenceScore: 0.68,
    impactScore: 0.99,
    evidence: [
      { source: 'Nature Energy', snippet: 'CFS SPARC tokamak achieves record plasma temperatures using HTS magnets ahead of schedule.', date: '2026-05-21' },
      { source: 'TechCrunch', snippet: 'Helion Energy signs additional power purchase agreements totaling 1.5 GW with Microsoft and Nucor.', date: '2026-05-17' },
      { source: 'Science', snippet: 'New superconductor materials reduce cost of fusion magnets by 40%, accelerating commercialization.', date: '2026-05-08' }
    ],
    relatedEntities: ['Commonwealth Fusion Systems', 'Helion Energy', 'Microsoft', 'OpenAI'],
    detectedAt: '2026-05-21T16:45:00Z',
    timeHorizon: 'long',
    potentialValue: '$2T+ global energy market transformation'
  },
  {
    id: 'opp-005',
    title: 'AI Agent Platform Wars Begin',
    description: 'Enterprise AI agent platforms are emerging as the next major software category. Companies deploying autonomous AI agents for customer support, engineering, and operations are seeing 5-10x productivity gains. Platform lock-in dynamics are forming.',
    category: 'AI Infrastructure',
    confidenceScore: 0.91,
    impactScore: 0.90,
    evidence: [
      { source: 'Sequoia Capital', snippet: 'AI agent startups raised $12B in H1 2026, making it the fastest-growing enterprise category.', date: '2026-05-24' },
      { source: 'Forbes', snippet: 'Enterprise AI agent adoption jumped from 8% to 35% in the last 12 months.', date: '2026-05-20' },
      { source: 'The Information', snippet: 'Anthropic, OpenAI, and Google all launch competing agent frameworks within 30 days.', date: '2026-05-16' }
    ],
    relatedEntities: ['OpenAI', 'Anthropic', 'Google DeepMind', 'Microsoft', 'Replit'],
    detectedAt: '2026-05-24T08:30:00Z',
    timeHorizon: 'short',
    potentialValue: '$45B-70B enterprise agent market by 2028'
  },
  {
    id: 'opp-006',
    title: 'Autonomous Defense Systems Procurement Surge',
    description: 'NATO and Five Eyes nations are massively increasing procurement of autonomous defense systems following recent geopolitical tensions. Anduril, Palantir, and Shield AI are best positioned to capture this unprecedented spending cycle.',
    category: 'Defense',
    confidenceScore: 0.87,
    impactScore: 0.92,
    evidence: [
      { source: 'Defense One', snippet: 'Pentagon Replicator initiative orders 10,000 autonomous drones from Anduril and Shield AI.', date: '2026-05-23' },
      { source: 'Jane\'s Defence', snippet: 'NATO AI defense procurement budget increased 340% year-over-year to $18B.', date: '2026-05-18' },
      { source: 'Wall Street Journal', snippet: 'Anduril wins $3.2B contract for counter-UAS systems across Indo-Pacific command.', date: '2026-05-11' }
    ],
    relatedEntities: ['Anduril', 'Palantir', 'Scale AI', 'CrowdStrike'],
    detectedAt: '2026-05-23T13:20:00Z',
    timeHorizon: 'short',
    potentialValue: '$50B-80B annual defense AI spending'
  },
  {
    id: 'opp-007',
    title: 'Quantum Advantage in Drug Discovery',
    description: 'Quantum computing is reaching practical utility for molecular simulation in pharma. Early quantum-classical hybrid algorithms are outperforming classical methods for specific protein-ligand interactions, signaling a new era in drug design.',
    category: 'Quantum',
    confidenceScore: 0.62,
    impactScore: 0.88,
    evidence: [
      { source: 'Nature', snippet: 'IBM Heron processor demonstrates quantum advantage for small-molecule simulation with error mitigation.', date: '2026-05-19' },
      { source: 'STAT News', snippet: 'Pfizer and Roche invest $2B combined in quantum computing drug discovery pipelines.', date: '2026-05-15' },
      { source: 'ArXiv', snippet: 'Novel variational quantum eigensolver achieves chemical accuracy for drug candidate screening.', date: '2026-05-09' }
    ],
    relatedEntities: ['IBM', 'Google DeepMind', 'IonQ', 'Rigetti'],
    detectedAt: '2026-05-19T10:00:00Z',
    timeHorizon: 'long',
    potentialValue: '$15B-25B quantum pharma market by 2032'
  },
  {
    id: 'opp-008',
    title: 'Space-Based Data Center Infrastructure',
    description: 'Emerging convergence of orbital computing and Earth observation is creating a new space data infrastructure market. LEO constellations for edge computing could serve remote and latency-sensitive applications that ground infrastructure cannot reach.',
    category: 'Space',
    confidenceScore: 0.55,
    impactScore: 0.78,
    evidence: [
      { source: 'SpaceNews', snippet: 'SpaceX files FCC application for compute payload integration on next-gen Starlink satellites.', date: '2026-05-22' },
      { source: 'Wired', snippet: 'Microsoft and Lumen Orbit demonstrate GPU computing in orbit for satellite imagery processing.', date: '2026-05-16' },
      { source: 'TechCrunch', snippet: 'Orbital computing startup raises $180M to deploy AI inference nodes on satellite constellation.', date: '2026-05-10' }
    ],
    relatedEntities: ['SpaceX', 'Microsoft', 'Amazon AWS'],
    detectedAt: '2026-05-22T15:30:00Z',
    timeHorizon: 'long',
    potentialValue: '$8B-15B orbital compute market by 2033'
  },
  {
    id: 'opp-009',
    title: 'Synthetic Biology Manufacturing Revolution',
    description: 'AI-designed proteins and organisms are enabling bio-manufacturing of materials, fuels, and medicines at industrial scale. The convergence of generative AI and synthetic biology is creating entirely new supply chains.',
    category: 'Biotech',
    confidenceScore: 0.74,
    impactScore: 0.86,
    evidence: [
      { source: 'MIT Technology Review', snippet: 'Generative AI designs novel enzymes for plastic recycling with 95% degradation efficiency.', date: '2026-05-24' },
      { source: 'Bloomberg', snippet: 'Synthetic biology market reaches $28B, growing at 32% CAGR driven by AI-designed organisms.', date: '2026-05-18' },
      { source: 'Nature Biotechnology', snippet: 'AlphaFold 3 predictions enable first fully AI-designed therapeutic antibody entering Phase I trials.', date: '2026-05-12' }
    ],
    relatedEntities: ['Google DeepMind', 'Ginkgo Bioworks', 'Recursion'],
    detectedAt: '2026-05-24T12:00:00Z',
    timeHorizon: 'medium',
    potentialValue: '$80B-120B bio-manufacturing market by 2031'
  },
  {
    id: 'opp-010',
    title: 'AI-Native Cybersecurity Paradigm Shift',
    description: 'Traditional rule-based cybersecurity is failing against AI-powered attacks. Next-generation AI-native security platforms using autonomous threat hunting and real-time adaptive defense are capturing market share at unprecedented speed.',
    category: 'AI Infrastructure',
    confidenceScore: 0.86,
    impactScore: 0.84,
    evidence: [
      { source: 'CyberScoop', snippet: 'AI-generated phishing attacks increase 1400% year-over-year, overwhelming legacy security tools.', date: '2026-05-25' },
      { source: 'Gartner', snippet: 'AI-native security platforms to capture 60% of enterprise security budgets by 2028.', date: '2026-05-20' },
      { source: 'Dark Reading', snippet: 'CrowdStrike Charlotte AI autonomously resolves 78% of security incidents without human intervention.', date: '2026-05-14' }
    ],
    relatedEntities: ['CrowdStrike', 'Palantir', 'Microsoft', 'Google DeepMind'],
    detectedAt: '2026-05-25T09:45:00Z',
    timeHorizon: 'short',
    potentialValue: '$35B-55B AI security market by 2028'
  }
];
