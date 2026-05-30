// ─── GOD'S EYE X — Evidence Mock Data ───────────────────────────────
// 25 intelligence evidence items from top-tier sources

export const evidence = [
  {
    id: 'ev-001',
    source: 'Bloomberg',
    title: 'NVIDIA Blackwell Ultra Chips Sell Out Through 2027',
    snippet: 'NVIDIA\'s next-generation Blackwell Ultra AI accelerators are fully allocated through 2027, with hyperscalers committing $40B+ in advance orders. Demand continues to outstrip supply by 3x.',
    url: 'https://bloomberg.com/news/nvidia-blackwell-ultra-sellout-2027',
    publishedAt: '2026-05-28T14:30:00Z',
    trustScore: 0.96,
    category: 'Market Intelligence',
    relatedEntities: ['NVIDIA', 'Microsoft', 'Amazon AWS', 'Google DeepMind']
  },
  {
    id: 'ev-002',
    source: 'Reuters',
    title: 'EU Digital Sovereignty Act Mandates European AI for Government',
    snippet: 'The European Commission formally proposes the Digital Sovereignty Act, requiring all EU government agencies to use AI models trained and hosted within EU borders by 2028.',
    url: 'https://reuters.com/technology/eu-digital-sovereignty-act-ai-mandate',
    publishedAt: '2026-05-27T09:15:00Z',
    trustScore: 0.95,
    category: 'Regulatory',
    relatedEntities: ['Mistral AI', 'Aleph Alpha', 'France', 'Germany']
  },
  {
    id: 'ev-003',
    source: 'TechCrunch',
    title: 'Perplexity Raises $250M at $9B Valuation, Revenue Triples',
    snippet: 'AI search startup Perplexity closed a $250M Series B at a $9B valuation. The company reports revenue tripled year-over-year to $180M ARR as enterprise adoption accelerates.',
    url: 'https://techcrunch.com/2026/05/perplexity-series-b-9b-valuation',
    publishedAt: '2026-05-26T16:00:00Z',
    trustScore: 0.92,
    category: 'Funding',
    relatedEntities: ['Perplexity', 'NVIDIA', 'Jeff Bezos']
  },
  {
    id: 'ev-004',
    source: 'Wall Street Journal',
    title: 'Pentagon Awards Anduril $3.2B Counter-Drone Contract',
    snippet: 'Anduril Industries wins the largest autonomous defense contract in history — a $3.2B deal to deploy AI-powered counter-UAS systems across Indo-Pacific Command installations.',
    url: 'https://wsj.com/articles/anduril-pentagon-counter-drone-3b-contract',
    publishedAt: '2026-05-25T11:00:00Z',
    trustScore: 0.97,
    category: 'Defense',
    relatedEntities: ['Anduril', 'Palantir', 'USA']
  },
  {
    id: 'ev-005',
    source: 'ArXiv',
    title: 'Scaling Laws for AI Agent Systems: A Comprehensive Study',
    snippet: 'Researchers demonstrate that AI agent capabilities follow predictable scaling laws distinct from language model scaling. Agent performance scales with tool diversity, memory depth, and planning horizon.',
    url: 'https://arxiv.org/abs/2605.14892',
    publishedAt: '2026-05-24T08:00:00Z',
    trustScore: 0.88,
    category: 'Research',
    relatedEntities: ['OpenAI', 'Anthropic', 'Google DeepMind']
  },
  {
    id: 'ev-006',
    source: 'MIT Technology Review',
    title: 'Figure 02 Humanoid Robot Begins BMW Factory Deployment',
    snippet: 'Figure AI deploys its first batch of 50 humanoid robots at BMW\'s Spartanburg plant, performing assembly tasks alongside human workers with 94% task completion rate.',
    url: 'https://technologyreview.com/figure-ai-bmw-humanoid-deployment',
    publishedAt: '2026-05-23T13:45:00Z',
    trustScore: 0.93,
    category: 'Robotics',
    relatedEntities: ['Figure AI', 'Tesla', 'NVIDIA']
  },
  {
    id: 'ev-007',
    source: 'Financial Times',
    title: 'Anthropic in Talks for $5B Government AI Contract',
    snippet: 'Anthropic is in advanced negotiations with US intelligence agencies for a $5B multi-year contract to deploy Claude in classified environments, sources say.',
    url: 'https://ft.com/content/anthropic-government-ai-contract-negotiations',
    publishedAt: '2026-05-22T10:30:00Z',
    trustScore: 0.89,
    category: 'Defense',
    relatedEntities: ['Anthropic', 'Palantir', 'Scale AI', 'USA']
  },
  {
    id: 'ev-008',
    source: 'Nature',
    title: 'Quantum Error Correction Breakthrough Enables Practical Computing',
    snippet: 'Google Quantum AI achieves below-threshold error rates on a 1,000+ qubit processor, marking the first demonstration of fault-tolerant quantum computing at practical scale.',
    url: 'https://nature.com/articles/quantum-error-correction-google-2026',
    publishedAt: '2026-05-21T17:00:00Z',
    trustScore: 0.98,
    category: 'Research',
    relatedEntities: ['Google DeepMind', 'IBM']
  },
  {
    id: 'ev-009',
    source: 'The Information',
    title: 'OpenAI Revenue Hits $13B Run Rate, Plans IPO for 2027',
    snippet: 'OpenAI\'s annualized revenue reaches $13B, up from $5B a year ago. The company has begun preliminary IPO preparations targeting a 2027 public listing at $300B+ valuation.',
    url: 'https://theinformation.com/articles/openai-revenue-13b-ipo-plans',
    publishedAt: '2026-05-20T14:15:00Z',
    trustScore: 0.87,
    category: 'Market Intelligence',
    relatedEntities: ['OpenAI', 'Microsoft']
  },
  {
    id: 'ev-010',
    source: 'Wired',
    title: 'Groq Launches Cloud Inference Platform, Undercuts GPU Pricing 90%',
    snippet: 'Groq\'s public cloud inference service goes live, offering Llama 3 and Mixtral inference at 10% the cost of GPU-based alternatives with sub-100ms latency.',
    url: 'https://wired.com/story/groq-cloud-inference-launch-pricing',
    publishedAt: '2026-05-19T12:00:00Z',
    trustScore: 0.90,
    category: 'Product Launch',
    relatedEntities: ['Groq', 'NVIDIA', 'Together AI']
  },
  {
    id: 'ev-011',
    source: 'CNBC',
    title: 'Microsoft Azure AI Revenue Surges 78%, Exceeds $60B Annual Run Rate',
    snippet: 'Microsoft reports Azure AI services revenue growing 78% year-over-year, with Copilot enterprise adoption reaching 1.2 million paid seats across Fortune 500 companies.',
    url: 'https://cnbc.com/microsoft-azure-ai-revenue-surge-copilot',
    publishedAt: '2026-05-18T16:30:00Z',
    trustScore: 0.94,
    category: 'Earnings',
    relatedEntities: ['Microsoft', 'OpenAI', 'Amazon AWS']
  },
  {
    id: 'ev-012',
    source: 'SpaceNews',
    title: 'SpaceX Starship Completes First Orbital Refueling Mission',
    snippet: 'SpaceX successfully demonstrates propellant transfer between two Starship vehicles in orbit, a critical milestone for NASA\'s Artemis lunar landing program and Mars architecture.',
    url: 'https://spacenews.com/spacex-starship-orbital-refueling-success',
    publishedAt: '2026-05-17T20:00:00Z',
    trustScore: 0.95,
    category: 'Space',
    relatedEntities: ['SpaceX', 'USA']
  },
  {
    id: 'ev-013',
    source: 'Nikkei Asia',
    title: 'Japan Allocates $15B for AI Semiconductor Sovereignty',
    snippet: 'Japan announces a ¥2.3T package to establish domestic AI chip manufacturing, including partnerships with TSMC, Rapidus, and Sakana AI for next-generation computing.',
    url: 'https://asia.nikkei.com/japan-ai-semiconductor-sovereignty-15b',
    publishedAt: '2026-05-16T06:00:00Z',
    trustScore: 0.91,
    category: 'Regulatory',
    relatedEntities: ['Sakana AI', 'NVIDIA', 'Japan']
  },
  {
    id: 'ev-014',
    source: 'Defense One',
    title: 'AI-Powered Drone Swarms Successfully Tested in NATO Exercise',
    snippet: 'NATO\'s largest-ever autonomous systems exercise features 500+ AI-coordinated drones from Anduril and Shield AI performing complex multi-domain operations without human piloting.',
    url: 'https://defenseone.com/nato-ai-drone-swarm-exercise-2026',
    publishedAt: '2026-05-15T09:00:00Z',
    trustScore: 0.90,
    category: 'Defense',
    relatedEntities: ['Anduril', 'Palantir', 'USA', 'UK']
  },
  {
    id: 'ev-015',
    source: 'Sequoia Capital Blog',
    title: 'AI Agent Startups: The $70B Opportunity',
    snippet: 'Sequoia analysis reveals AI agent startups raised $12B in H1 2026, with enterprise deployment growing 340% year-over-year. Autonomous engineering and customer ops agents leading adoption.',
    url: 'https://sequoiacap.com/perspective/ai-agents-70b-opportunity',
    publishedAt: '2026-05-14T11:30:00Z',
    trustScore: 0.86,
    category: 'Market Intelligence',
    relatedEntities: ['OpenAI', 'Anthropic', 'Replit', 'Magic AI']
  },
  {
    id: 'ev-016',
    source: 'Forbes',
    title: 'CrowdStrike Charlotte AI Resolves 78% of Incidents Autonomously',
    snippet: 'CrowdStrike reports its Charlotte AI module now resolves 78% of security incidents without human analyst intervention, reducing mean response time from 4 hours to 12 seconds.',
    url: 'https://forbes.com/crowdstrike-charlotte-ai-autonomous-security',
    publishedAt: '2026-05-13T15:00:00Z',
    trustScore: 0.88,
    category: 'Product Launch',
    relatedEntities: ['CrowdStrike', 'Palantir']
  },
  {
    id: 'ev-017',
    source: 'VentureBeat',
    title: 'Databricks Acquires AI Startup for $1.2B, Expands Model Training',
    snippet: 'Databricks acquires frontier AI training startup to bolster its open-source model capabilities, as enterprise demand for private model training on the lakehouse platform surges.',
    url: 'https://venturebeat.com/databricks-acquisition-ai-training-startup',
    publishedAt: '2026-05-12T10:45:00Z',
    trustScore: 0.87,
    category: 'M&A',
    relatedEntities: ['Databricks', 'Together AI']
  },
  {
    id: 'ev-018',
    source: 'The Verge',
    title: 'Replit Agent Builds Full-Stack App from Single Prompt',
    snippet: 'Replit demonstrates its AI Agent building and deploying a complete e-commerce application from a natural language description in under 4 minutes, including database and payment integration.',
    url: 'https://theverge.com/replit-agent-full-stack-app-demo',
    publishedAt: '2026-05-11T13:20:00Z',
    trustScore: 0.85,
    category: 'Product Launch',
    relatedEntities: ['Replit', 'Poolside', 'Magic AI']
  },
  {
    id: 'ev-019',
    source: 'Ars Technica',
    title: 'Tesla Optimus Gen-3 Achieves Human-Level Dexterity Benchmark',
    snippet: 'Tesla\'s Optimus Gen-3 humanoid robot scores 92% on the YCB object manipulation benchmark, approaching human-level performance on fine motor tasks for the first time.',
    url: 'https://arstechnica.com/tesla-optimus-gen3-dexterity-benchmark',
    publishedAt: '2026-05-10T17:30:00Z',
    trustScore: 0.86,
    category: 'Robotics',
    relatedEntities: ['Tesla', 'Figure AI', 'NVIDIA']
  },
  {
    id: 'ev-020',
    source: 'South China Morning Post',
    title: 'China Unveils $40B National AI Compute Plan',
    snippet: 'China announces a 10-year, $40B initiative to build sovereign AI computing infrastructure, including 50 new data centers and domestic GPU alternatives to bypass US export restrictions.',
    url: 'https://scmp.com/china-national-ai-compute-plan-40b',
    publishedAt: '2026-05-09T04:00:00Z',
    trustScore: 0.83,
    category: 'Geopolitical',
    relatedEntities: ['NVIDIA', 'China', 'USA']
  },
  {
    id: 'ev-021',
    source: 'Gartner',
    title: 'AI-Native Security Platforms to Capture 60% of Enterprise Budgets',
    snippet: 'Gartner predicts AI-native cybersecurity platforms will capture 60% of enterprise security spending by 2028, displacing legacy SIEM and SOAR solutions that cannot match AI-powered threat response.',
    url: 'https://gartner.com/en/documents/ai-native-security-predictions-2028',
    publishedAt: '2026-05-08T09:00:00Z',
    trustScore: 0.91,
    category: 'Market Intelligence',
    relatedEntities: ['CrowdStrike', 'Palantir', 'Microsoft']
  },
  {
    id: 'ev-022',
    source: 'Science',
    title: 'Novel HTS Superconductor Reduces Fusion Magnet Costs 40%',
    snippet: 'MIT researchers develop a new high-temperature superconductor manufacturing process that reduces fusion magnet costs by 40%, directly benefiting Commonwealth Fusion Systems\' SPARC reactor timeline.',
    url: 'https://science.org/content/article/hts-superconductor-fusion-magnet-breakthrough',
    publishedAt: '2026-05-07T12:00:00Z',
    trustScore: 0.97,
    category: 'Research',
    relatedEntities: ['Commonwealth Fusion Systems', 'Helion Energy']
  },
  {
    id: 'ev-023',
    source: 'Rest of World',
    title: 'India\'s AI Startup Ecosystem Triples in 18 Months',
    snippet: 'India\'s AI startup ecosystem has grown from 1,200 to 3,600 companies in 18 months, fueled by government incentives, abundant engineering talent, and global demand for AI services.',
    url: 'https://restofworld.org/india-ai-startup-ecosystem-growth',
    publishedAt: '2026-05-06T08:30:00Z',
    trustScore: 0.82,
    category: 'Market Intelligence',
    relatedEntities: ['India', 'Cohere']
  },
  {
    id: 'ev-024',
    source: 'Politico EU',
    title: 'France and Germany Pledge €8B for Sovereign AI Compute',
    snippet: 'In a historic joint initiative, France and Germany commit €8B to building European sovereign AI computing clusters, with first deployments targeted at Mistral AI and Aleph Alpha workloads.',
    url: 'https://politico.eu/france-germany-sovereign-ai-compute-8b',
    publishedAt: '2026-05-05T14:00:00Z',
    trustScore: 0.90,
    category: 'Regulatory',
    relatedEntities: ['Mistral AI', 'Aleph Alpha', 'France', 'Germany']
  },
  {
    id: 'ev-025',
    source: 'Nature Biotechnology',
    title: 'AlphaFold 3 Enables First Fully AI-Designed Therapeutic Antibody',
    snippet: 'A therapeutic antibody designed entirely by AlphaFold 3 predictions enters Phase I clinical trials — the first drug candidate where no human scientist designed the molecular structure.',
    url: 'https://nature.com/nbt/alphafold3-therapeutic-antibody-trial',
    publishedAt: '2026-05-04T16:30:00Z',
    trustScore: 0.96,
    category: 'Research',
    relatedEntities: ['Google DeepMind', 'Recursion']
  }
];
