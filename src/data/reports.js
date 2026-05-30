// ─── GOD'S EYE X — Reports Mock Data ───────────────────────────────
// 5 sample intelligence reports with full content

export const sampleReports = [
  {
    id: 'report-001',
    title: 'AI Infrastructure Arms Race: GPU Alternatives & Custom Silicon',
    topic: 'AI Hardware Competition',
    reportType: 'full_report',
    depth: 'comprehensive',
    status: 'completed',
    generatedAt: '2026-05-28T10:30:00Z',
    processingTimeMs: 14200,
    executiveSummary: 'The AI inference hardware market is undergoing a fundamental disruption as custom silicon startups demonstrate 10-100x cost/performance improvements over NVIDIA GPUs. NVIDIA retains dominance in training but faces mounting competition in inference, which represents 60% of total AI compute spend. We assess high probability that the inference market will fragment significantly within 18 months.',
    keyFindings: [
      'Groq LPU achieves 10x lower cost-per-token vs. H100 for inference workloads',
      'AWS, Microsoft, and Google are all testing non-NVIDIA chips for inference internally',
      'NVIDIA\'s inference market share declined from 95% to 82% in 12 months',
      'Custom silicon startups raised $4.2B in 2025, up 280% year-over-year',
      'Cerebras Wafer Scale Engine shows 5x training efficiency for models under 70B parameters',
      'Total addressable market for AI inference hardware projected at $85B by 2028'
    ],
    content: `## Market Overview

The AI compute infrastructure market has entered a period of unprecedented disruption. While NVIDIA has dominated AI hardware for the past decade with its GPU-based architecture, a new generation of purpose-built AI chips is challenging this hegemony — particularly in the critical inference segment.

The inference market, which accounts for approximately 60% of total AI compute spending, is fundamentally different from training. Inference workloads are latency-sensitive, cost-conscious, and increasingly standardized around transformer architectures. These characteristics create an opening for specialized hardware that can outperform general-purpose GPUs on specific workloads.

## Key Disruptors

**Groq** has emerged as the most visible challenger with its Language Processing Unit (LPU) architecture. Independent benchmarks confirm Groq's claims of 10x lower cost-per-token compared to NVIDIA H100 for inference workloads. The deterministic scheduling approach eliminates the memory bandwidth bottleneck that constrains GPU inference performance.

**Cerebras** takes a radically different approach with its Wafer Scale Engine — the world's largest chip at 46,225 mm². For training workloads under 70B parameters, Cerebras demonstrates 5x efficiency improvements by eliminating inter-chip communication overhead.

**Etched**, a newer entrant, has designed an ASIC specifically optimized for transformer inference, claiming 10x performance over H100 at a fraction of the power consumption.

## Hyperscaler Response

All three major cloud providers are actively hedging against NVIDIA dependency:

- **Amazon AWS** has accelerated Trainium2 development and is testing Groq chips for select inference workloads
- **Microsoft** is deploying its custom Maia AI accelerator in Azure data centers and evaluating Cerebras for research workloads
- **Google** continues to expand TPU capacity, with TPU v6 closing the performance gap with H100 for training

## NVIDIA's Strategic Position

NVIDIA retains critical advantages in training infrastructure, developer ecosystem (CUDA), and full-stack integration (networking, software, hardware). The Blackwell Ultra architecture maintains training leadership, and NVIDIA's inference optimizations (TensorRT-LLM) continue to improve GPU inference economics.

However, the company faces structural headwinds as inference grows faster than training and specialized architectures prove superior for standardized workloads. We project NVIDIA's inference market share will decline to 65-70% by 2028.

## Investment Implications

The AI hardware landscape is bifurcating: NVIDIA dominates training, but inference is fragmenting. Investors should consider:

1. Custom silicon startups (Groq, Cerebras, Etched) as potential high-growth positions
2. NVIDIA's moat is narrowing in inference but remains deep in training
3. Cloud providers with strong custom silicon programs (Google, Amazon) gain strategic advantage
4. The total AI compute market is large enough for multiple winners

## Risk Factors

Key risks to this thesis include: NVIDIA's aggressive inference optimization roadmap, potential consolidation among custom silicon startups, and the possibility that next-generation architectures (beyond transformers) may favor GPU flexibility over specialized hardware.

## Conclusion

The AI infrastructure arms race is entering its most dynamic phase. While NVIDIA remains the dominant force, the emergence of viable alternatives in inference computing represents a structural shift that will reshape the competitive landscape over the next 18-36 months. Organizations should begin diversifying their AI compute strategies to capture cost and performance advantages from specialized hardware.`
  },
  {
    id: 'report-002',
    title: 'Humanoid Robotics: From Lab to Factory Floor',
    topic: 'Robotics Commercialization',
    reportType: 'market_analysis',
    depth: 'comprehensive',
    status: 'completed',
    generatedAt: '2026-05-27T15:45:00Z',
    processingTimeMs: 18400,
    executiveSummary: 'The humanoid robotics industry has reached a critical inflection point with multiple companies simultaneously achieving commercial deployment milestones. Figure AI\'s BMW factory deployment, Tesla Optimus Gen-3 achieving human-level dexterity, and foundation models enabling rapid skill transfer collectively signal the beginning of a $154B market by 2030. First-mover advantage in manufacturing partnerships will determine market leaders.',
    keyFindings: [
      'Figure AI deploys 50 humanoid robots at BMW Spartanburg with 94% task completion rate',
      'Tesla Optimus Gen-3 scores 92% on YCB dexterity benchmark, approaching human-level',
      'Foundation models for robotics enable zero-shot task generalization across environments',
      'Global humanoid robot market projected at $154B by 2030 (from $3B in 2025)',
      'Amazon, FedEx, and DHL all running humanoid robot pilot programs in warehouses',
      'Robot unit economics reaching viability: $30K-50K per unit vs. $45K annual labor cost'
    ],
    content: `## The Inflection Point

After decades of incremental progress, humanoid robotics has reached its ChatGPT moment. The convergence of three technological breakthroughs — advanced actuators, foundation models for robotics, and efficient power systems — has made general-purpose humanoid robots commercially viable for the first time.

## Current State of Deployment

**Figure AI** leads commercial deployment with 50 humanoid robots operating alongside human workers at BMW's Spartanburg, South Carolina plant. The robots perform repetitive assembly tasks with a 94% task completion rate, and Figure reports that the units are operating at approximately 40% of human worker speed — a figure the company expects to double within 12 months.

**Tesla's Optimus** Gen-3 prototype has achieved a 92% score on the Yale-Columbia-Berkeley (YCB) object manipulation benchmark, approaching human-level performance on fine motor tasks. Tesla plans initial factory deployment at its Austin Gigafactory in Q4 2026.

**1X Technologies** (formerly Halodi Robotics) has deployed its EVE android in security and concierge roles across 30 commercial properties in Norway, demonstrating the viability of service-oriented humanoid applications.

## Foundation Models as the Catalyst

The single most important development enabling humanoid robot commercialization is the emergence of foundation models for robotics. These large-scale vision-language-action models, trained on diverse datasets of robot interactions, enable:

- **Zero-shot task generalization**: Robots can attempt tasks they've never been specifically trained for
- **Natural language instruction**: Workers can direct robots using conversational commands
- **Rapid skill transfer**: Skills learned in one environment transfer to others with minimal adaptation

NVIDIA's Project GR00T and Google DeepMind's RT-X are the leading foundation model frameworks, with OpenAI's investment in Figure AI providing additional vision-language capabilities.

## Market Opportunity

The addressable market for humanoid robots spans multiple sectors:

| Sector | Market Size (2030) | Key Use Cases |
|--------|-------------------|---------------|
| Manufacturing | $62B | Assembly, quality inspection, material handling |
| Warehousing | $38B | Pick-and-pack, inventory management, loading |
| Healthcare | $24B | Patient mobility, supply delivery, sanitation |
| Retail/Hospitality | $18B | Customer service, stocking, cleaning |
| Construction | $12B | Site preparation, material transport, inspection |

## Competitive Landscape

The humanoid robotics market is consolidating around five major players, each with distinct strategic positioning. Figure AI leads on commercial deployment velocity, Tesla on manufacturing scale and cost reduction, and Boston Dynamics on dynamic mobility and robustness.

## Investment Implications

We identify humanoid robotics as one of the highest-conviction investment themes for the next decade. The market dynamics mirror early automotive industry patterns — high initial capital requirements, rapid technology improvement, and massive total addressable market.

Early indicators of market winners include: manufacturing partnership volume, foundation model capability, and unit cost trajectory. Figure AI, Tesla, and 1X Technologies currently lead on these metrics.`
  },
  {
    id: 'report-003',
    title: 'European AI Sovereignty: Strategic Implications',
    topic: 'Geopolitical AI Strategy',
    reportType: 'executive_summary',
    depth: 'standard',
    status: 'completed',
    generatedAt: '2026-05-26T09:00:00Z',
    processingTimeMs: 8600,
    executiveSummary: 'The EU Digital Sovereignty Act and coordinated Franco-German AI investment represent a structural shift in global AI competition. European AI champions — Mistral AI, Aleph Alpha — are positioned to capture a $25-40B captive government and enterprise market. US AI companies face increasing regulatory barriers to European government deployments.',
    keyFindings: [
      'EU Digital Sovereignty Act mandates EU-hosted AI for all government operations by 2028',
      'France and Germany jointly pledge €8B for sovereign AI compute infrastructure',
      'Mistral AI and Aleph Alpha positioned as primary beneficiaries of EU procurement',
      'US AI companies face GDPR, AI Act, and sovereignty regulations creating triple barrier',
      'European AI market projected at $25-40B by 2029 with sovereignty premium pricing',
      'UK post-Brexit pursuing independent AI strategy with £4B investment package'
    ],
    content: `## Strategic Overview

Europe is making its most consequential bet on technological sovereignty since Airbus. The proposed EU Digital Sovereignty Act, combined with €8B+ in Franco-German AI investment, signals a fundamental restructuring of how AI is procured and deployed across the continent.

## Regulatory Framework

The Digital Sovereignty Act builds on the existing AI Act framework to mandate that all EU government agencies — from defense to healthcare to municipal services — must use AI systems trained and hosted within EU borders by 2028. This creates a massive captive market for European AI providers while erecting significant barriers for US competitors.

## Beneficiaries

**Mistral AI** (Paris) is the clear frontrunner, with its open-weight models already deployed across multiple French government agencies. The company's lean architecture and European data compliance give it a structural advantage.

**Aleph Alpha** (Heidelberg) focuses on sovereign AI for defense and critical infrastructure, with existing contracts across German intelligence services. The company emphasizes data sovereignty and auditability as core differentiators.

## Impact on US Companies

OpenAI, Anthropic, and Google face a challenging European landscape. While they can continue to serve European enterprises, government and critical infrastructure contracts — the highest-margin segments — will increasingly flow to European champions. Microsoft's Azure sovereign cloud offerings may provide a partial workaround, but the trend is clear.

## UK Strategy

Post-Brexit Britain is pursuing an independent AI strategy, investing £4B in compute infrastructure and positioning London as a global AI research hub. The UK's approach is more open than the EU's, welcoming US AI companies while building domestic capabilities through DeepMind and domestic startups.

## Implications

The AI sovereignty movement represents a permanent fragmentation of the global AI market. Companies and investors should prepare for a multipolar AI landscape with distinct regulatory regimes, procurement preferences, and competitive dynamics across US, EU, UK, China, and emerging markets.`
  },
  {
    id: 'report-004',
    title: 'AI Agent Economy: Competitive Analysis',
    topic: 'AI Agents Market',
    reportType: 'competitive_analysis',
    depth: 'comprehensive',
    status: 'completed',
    generatedAt: '2026-05-25T14:20:00Z',
    processingTimeMs: 22100,
    executiveSummary: 'The AI agent market has emerged as the fastest-growing enterprise software category in history, with $12B raised in H1 2026 alone. Three platform approaches are competing: integrated (OpenAI/Microsoft), modular (Anthropic/LangChain), and vertical (domain-specific startups). We assess that platform dynamics will consolidate the market around 3-4 major ecosystems within 24 months.',
    keyFindings: [
      'AI agent startups raised $12B in H1 2026 — fastest-growing enterprise category',
      'Enterprise AI agent adoption jumped from 8% to 35% in 12 months',
      'Three platform architectures competing: integrated, modular, and vertical',
      'Average enterprise deploys 4.2 distinct agent systems across departments',
      'AI agents achieving 5-10x productivity gains in software engineering and customer ops',
      'Platform lock-in dynamics forming — tool/memory ecosystems creating switching costs'
    ],
    content: `## Market Dynamics

The AI agent market has transitioned from experimental to essential in record time. Enterprise adoption of autonomous AI agents — systems that can plan, reason, use tools, and complete multi-step tasks — has grown from 8% to 35% of Fortune 500 companies in just 12 months.

## Competitive Framework

Three distinct platform architectures are competing for market dominance:

### 1. Integrated Platforms (OpenAI + Microsoft)
OpenAI's agent platform, deeply integrated with Microsoft 365 and Azure, offers the most seamless enterprise experience. Copilot Studio enables organizations to build custom agents that operate across the entire Microsoft ecosystem.

**Strengths**: Distribution through Microsoft's enterprise relationships, unified platform, strong model capabilities.
**Weaknesses**: Vendor lock-in concerns, pricing premium, limited customization depth.

### 2. Modular Platforms (Anthropic + Ecosystem)
Anthropic's Claude-based agent framework emphasizes composability, safety, and transparency. The MCP (Model Context Protocol) ecosystem enables integration with thousands of tools and data sources.

**Strengths**: Safety guarantees, tool flexibility, strong developer community, transparent reasoning.
**Weaknesses**: Requires more integration effort, smaller enterprise sales team, younger ecosystem.

### 3. Vertical Platforms (Domain-Specific)
Specialized agent platforms targeting specific domains — coding (Replit, Poolside), customer service (Sierra), legal (Harvey), healthcare (Hippocratic AI) — offer deeper domain expertise.

**Strengths**: Superior domain performance, faster time-to-value, industry-specific compliance.
**Weaknesses**: Limited scope, fragmentation risk, potential acquisition targets.

## Deployment Patterns

Enterprise agent deployment follows a consistent pattern:
1. **Pilot** (Month 1-3): Single department, supervised agent with human approval gates
2. **Expansion** (Month 4-8): Multi-department deployment, reduced supervision
3. **Autonomy** (Month 9-12): Full autonomous operation with exception-based human oversight
4. **Integration** (Month 12+): Multi-agent orchestration across business processes

## Productivity Impact

Independent studies confirm significant productivity gains from agent deployment:
- **Software Engineering**: 5-10x faster feature development with AI coding agents
- **Customer Operations**: 78% of tier-1 support resolved autonomously
- **Data Analysis**: Complex analyses completed in minutes vs. days
- **Content Creation**: Marketing content production increased 8x

## Market Forecast

We project the enterprise AI agent market will reach $45-70B by 2028, growing at 180% CAGR from 2025. Platform dynamics suggest consolidation around 3-4 major ecosystems, with vertical specialists persisting in regulated industries.

## Strategic Recommendations

Organizations should: (1) Begin agent pilot programs immediately to build internal expertise, (2) Evaluate platform lock-in implications before committing to an ecosystem, (3) Prioritize agent deployments in high-value, repetitive workflows, and (4) Establish AI agent governance frameworks before scaling.`
  },
  {
    id: 'report-005',
    title: 'Defense Tech Renaissance: Autonomous Systems & AI',
    topic: 'Defense Technology',
    reportType: 'full_report',
    depth: 'comprehensive',
    status: 'processing',
    generatedAt: '2026-05-29T08:00:00Z',
    processingTimeMs: null,
    executiveSummary: 'NATO and Five Eyes nations are executing the largest military modernization since the Cold War, centered on autonomous systems and AI. Defense AI procurement has grown 340% year-over-year, with Anduril, Palantir, and Shield AI emerging as the primary beneficiaries. We assess this represents a sustained multi-decade spending cycle.',
    keyFindings: [
      'NATO AI defense procurement budget increased 340% year-over-year to $18B',
      'Pentagon Replicator initiative orders 10,000 autonomous drones',
      'Anduril wins $3.2B counter-UAS contract — largest autonomous defense deal ever',
      'Palantir AIP being mandated across multiple DoD programs',
      'Traditional defense primes (Lockheed, Raytheon) losing share to tech-native companies',
      'Five Eyes nations coordinate on common autonomous systems interoperability standards'
    ],
    content: `## The New Defense Paradigm

The global defense landscape is undergoing its most significant transformation since the advent of precision-guided munitions. Recent conflicts have demonstrated that autonomous systems — drones, AI-powered surveillance, and algorithmic command and control — are not future concepts but present necessities.

## Spending Trajectory

NATO AI defense spending has reached $18B annually, growing 340% year-over-year. The US accounts for approximately 60% of this spending, with the UK, France, and Australia as the next largest contributors.

The Pentagon's Replicator initiative — designed to field autonomous systems at scale and speed — has placed orders for 10,000+ AI-powered drones from Anduril and Shield AI. This initiative represents a fundamental shift in DoD procurement philosophy: speed and software over traditional hardware programs.

## Key Players

**Anduril Industries** has established itself as the dominant new-generation defense technology company. The $3.2B counter-UAS contract for Indo-Pacific Command is the largest autonomous defense deal in history. Anduril's Lattice OS provides the software backbone for autonomous multi-domain operations.

**Palantir Technologies** has seen its government contract win rate climb to 87%, with AIP (Artificial Intelligence Platform) being mandated as the standard AI platform across multiple DoD programs. Palantir's ability to deploy LLMs in classified environments gives it a unique competitive advantage.

**Scale AI** provides the critical data infrastructure for defense AI, supplying training data, evaluation, and RLHF services for classified AI systems. Its partnership with Anduril and Palantir creates a powerful defense AI value chain.

## Disruption of Traditional Primes

Traditional defense contractors (Lockheed Martin, Raytheon, Northrop Grumman) are facing disruption from technology-native companies. The software-defined nature of modern defense systems favors companies with deep AI expertise over those with traditional hardware manufacturing capabilities.

## Geopolitical Context

The defense AI surge is driven by several factors: the demonstrated effectiveness of drones in recent conflicts, growing tensions in the Indo-Pacific, and the recognition that AI superiority will determine military outcomes. China's parallel $40B national AI compute plan adds urgency to Western spending.

## Outlook

We assess this as a sustained multi-decade spending cycle, similar to the Cold War defense buildup. Companies positioned at the intersection of AI, autonomy, and defense will benefit from predictable, growing government spending for the foreseeable future.`
  }
];
