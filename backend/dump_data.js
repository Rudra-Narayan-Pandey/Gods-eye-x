import { writeFileSync } from 'fs';
import { companies, countryScores } from '../src/data/companies.js';
import { technologies } from '../src/data/technologies.js';
import { startups } from '../src/data/startups.js';
import { opportunities } from '../src/data/opportunities.js';
import { anomalies } from '../src/data/anomalies.js';
import { evidence } from '../src/data/evidence.js';
import { trends } from '../src/data/trends.js';
import { sampleReports } from '../src/data/reports.js';
import { graphNodes, graphEdges } from '../src/data/graph-data.js';

const data = {
  companies,
  countryScores,
  technologies,
  startups,
  opportunities,
  anomalies,
  evidence,
  trends,
  sampleReports,
  graphNodes,
  graphEdges
};

writeFileSync('backend/data.json', JSON.stringify(data, null, 2));
console.log('Successfully dumped mock data to backend/data.json');
