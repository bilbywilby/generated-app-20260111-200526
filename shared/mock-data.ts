import type { User, Chat, ChatMessage, WikiArticle, HealthRate, CountyMapping } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_HEALTH_RATES: HealthRate[] = [
  { id: 'r1', carrier: 'Highmark', planType: 'Silver', ratingArea: 1, basePremium2026: 542.50, projectedIncrease: 4.8 },
  { id: 'r2', carrier: 'UPMC Health Plan', planType: 'Silver', ratingArea: 1, basePremium2026: 510.00, projectedIncrease: 5.2 },
  { id: 'r3', carrier: 'Independence Blue Cross', planType: 'Silver', ratingArea: 9, basePremium2026: 620.00, projectedIncrease: 6.1 },
  { id: 'r4', carrier: 'Geisinger', planType: 'Silver', ratingArea: 6, basePremium2026: 485.00, projectedIncrease: 3.9 },
  { id: 'r5', carrier: 'Capital Blue Cross', planType: 'Silver', ratingArea: 4, basePremium2026: 525.00, projectedIncrease: 4.5 },
];
export const MOCK_COUNTY_MAPPINGS: CountyMapping[] = [
  { id: 'c-all', county: 'Allegheny', ratingArea: 1 },
  { id: 'c-phi', county: 'Philadelphia', ratingArea: 9 },
  { id: 'c-dau', county: 'Dauphin', ratingArea: 4 },
  { id: 'c-eri', county: 'Erie', ratingArea: 1 },
  { id: 'c-cen', county: 'Centre', ratingArea: 6 },
  { id: 'c-luc', county: 'Luzerne', ratingArea: 3 },
  { id: 'c-ber', county: 'Berks', ratingArea: 8 },
  { id: 'c-lan', county: 'Lancaster', ratingArea: 7 },
  { id: 'c-buc', county: 'Bucks', ratingArea: 9 },
];
export const MOCK_WIKI_ARTICLES: WikiArticle[] = [
  {
    id: 'pa-act-169',
    title: 'Medical Records Access (Act 169)',
    category: 'Access',
    summary: 'Pennsylvania law regarding a patient’s right to access and copy their medical records.',
    statuteReference: '42 Pa. C.S. § 6152',
    lastUpdated: '2024-01-15',
    authorObf: 'admin-001',
    content: `### Overview\nUnder Pennsylvania law, healthcare providers must provide access to medical records within 30 days of a written request.\n### Fees\nProviders may charge "reasonable costs" for copying. For 2024, these are capped at:\n- $1.81 per page for the first 20 pages.\n- $1.34 per page for pages 21-60.\n- $0.47 per page for pages 61+.\n### Deadlines\nThe facility has **30 days** to respond to your request. If the records are off-site, they may take up to 60 days but must notify you in writing of the delay.`
  },
  {
    id: 'insurance-actuarial-2026',
    title: '2026 Actuarial Trends & Premium Drivers',
    category: 'Insurance',
    summary: 'Analysis of the 2026 PA health insurance market, focusing on GLP-1 costs and reinsurance.',
    statuteReference: 'PA Act 42 of 2018',
    lastUpdated: '2025-05-10',
    authorObf: 'actuary-092',
    content: `### 2026 Market Outlook\nThe Pennsylvania health insurance market is facing significant upward pressure for the 2026 plan year. Actuarial filings suggest a composite increase of 5.5% across all rating areas.\n\n### Primary Cost Drivers\n- **GLP-1 Utilization**: Prescription drug spend for GLP-1 weight-loss and diabetes treatments (e.g., Wegovy, Ozempic) is projected to account for 4.2% of total premium growth.\n- **Provider Consolidation**: Mergers in the central and western PA regions are reducing price competition.\n- **Reinsurance Program**: The PA Health Insurance Exchange Authority (Pennie) reinsurance program continues to mitigate volatility by subsidizing high-cost claims above $60k.`,
    actuarialSection: {
      analysis: "Projected GLP-1 utilization is the single largest variable factor in 2026 rate filings.",
      impactScore: 8.5,
      glp1Influence: true
    }
  },
  {
    id: 'mcare-act-13',
    title: 'MCARE Act Notifications',
    category: 'Quality',
    summary: 'The Medical Care Availability and Reduction of Error (MCARE) Act requirements for disclosure.',
    statuteReference: '40 P.S. § 1303.308',
    lastUpdated: '2023-11-20',
    authorObf: 'admin-001',
    content: `### Duty to Report\nHealthcare workers are required to report "serious events" and "incidents" to the Patient Safety Authority.\n### Disclosure to Patients\nMedical facilities must notify patients in writing if they were the subject of a "serious event" within **seven days** of its discovery.`
  }
];