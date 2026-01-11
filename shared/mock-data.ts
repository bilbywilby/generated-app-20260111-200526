import type { User, Chat, ChatMessage, WikiArticle, HealthRate, CountyMapping, PIDFiling } from './types';
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
// Comprehensive 2026 PA Health Rates across all 9 areas
export const MOCK_HEALTH_RATES: HealthRate[] = [
  // Area 1 (Pittsburgh/Western)
  { id: 'r1-1', carrier: 'Highmark', planType: 'Silver', ratingArea: 1, basePremium2026: 542.50, projectedIncrease: 4.8, glp1Covered: true, avgDeductible: 3500 },
  { id: 'r1-2', carrier: 'UPMC Health Plan', planType: 'Silver', ratingArea: 1, basePremium2026: 510.00, projectedIncrease: 5.2, glp1Covered: false, avgDeductible: 4000 },
  { id: 'r1-3', carrier: 'Aetna', planType: 'Silver', ratingArea: 1, basePremium2026: 525.00, projectedIncrease: 4.5, glp1Covered: true, avgDeductible: 3800 },
  // Area 2
  { id: 'r2-1', carrier: 'Highmark', planType: 'Silver', ratingArea: 2, basePremium2026: 555.00, projectedIncrease: 5.0, glp1Covered: true, avgDeductible: 3600 },
  { id: 'r2-2', carrier: 'Geisinger', planType: 'Silver', ratingArea: 2, basePremium2026: 490.00, projectedIncrease: 4.2, glp1Covered: false, avgDeductible: 4200 },
  // Area 3
  { id: 'r3-1', carrier: 'Geisinger', planType: 'Silver', ratingArea: 3, basePremium2026: 505.00, projectedIncrease: 4.5, glp1Covered: true, avgDeductible: 3700 },
  { id: 'r3-2', carrier: 'Highmark', planType: 'Silver', ratingArea: 3, basePremium2026: 535.00, projectedIncrease: 5.1, glp1Covered: true, avgDeductible: 3500 },
  // Area 4 (Harrisburg)
  { id: 'r4-1', carrier: 'Capital Blue Cross', planType: 'Silver', ratingArea: 4, basePremium2026: 525.00, projectedIncrease: 4.5, glp1Covered: true, avgDeductible: 3800 },
  { id: 'r4-2', carrier: 'Highmark', planType: 'Silver', ratingArea: 4, basePremium2026: 540.00, projectedIncrease: 4.9, glp1Covered: false, avgDeductible: 4000 },
  // Area 5
  { id: 'r5-1', carrier: 'Capital Blue Cross', planType: 'Silver', ratingArea: 5, basePremium2026: 515.00, projectedIncrease: 4.1, glp1Covered: true, avgDeductible: 3900 },
  // Area 6 (State College)
  { id: 'r6-1', carrier: 'Geisinger', planType: 'Silver', ratingArea: 6, basePremium2026: 485.00, projectedIncrease: 3.9, glp1Covered: false, avgDeductible: 4500 },
  { id: 'r6-2', carrier: 'Highmark', planType: 'Silver', ratingArea: 6, basePremium2026: 510.00, projectedIncrease: 4.7, glp1Covered: true, avgDeductible: 3600 },
  // Area 7
  { id: 'r7-1', carrier: 'Capital Blue Cross', planType: 'Silver', ratingArea: 7, basePremium2026: 530.00, projectedIncrease: 4.6, glp1Covered: true, avgDeductible: 3750 },
  // Area 8
  { id: 'r8-1', carrier: 'Highmark', planType: 'Silver', ratingArea: 8, basePremium2026: 560.00, projectedIncrease: 5.3, glp1Covered: true, avgDeductible: 3400 },
  // Area 9 (Philadelphia)
  { id: 'r9-1', carrier: 'Independence Blue Cross', planType: 'Silver', ratingArea: 9, basePremium2026: 620.00, projectedIncrease: 6.1, glp1Covered: true, avgDeductible: 3200 },
  { id: 'r9-2', carrier: 'Aetna', planType: 'Silver', ratingArea: 9, basePremium2026: 590.00, projectedIncrease: 5.8, glp1Covered: false, avgDeductible: 4100 },
  { id: 'r9-3', carrier: 'Jefferson Health Plan', planType: 'Silver', ratingArea: 9, basePremium2026: 605.00, projectedIncrease: 5.5, glp1Covered: true, avgDeductible: 3500 },
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
export const MOCK_PID_FILINGS: PIDFiling[] = [
  { id: 'f1', filingNumber: 'HM-2026-001', carrier: 'Highmark', status: 'Approved', dateSubmitted: '2025-04-10', description: '2026 Individual Market Rate Request - Western PA' },
  { id: 'f2', filingNumber: 'UPMC-2026-042', carrier: 'UPMC Health Plan', status: 'Pending', dateSubmitted: '2025-05-02', description: 'Comprehensive Silver Plan Revision - Rating Area 1' },
  { id: 'f3', filingNumber: 'IBC-2026-099', carrier: 'Independence Blue Cross', status: 'Disapproved', dateSubmitted: '2025-04-15', description: 'Initial 2026 Rate Filing - SEPA Region' },
  { id: 'f4', filingNumber: 'GEIS-2026-005', carrier: 'Geisinger', status: 'Approved', dateSubmitted: '2025-03-22', description: 'Actuarial Memorandum: GLP-1 Cost Mitigation Strategy' },
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
    content: `### 2026 Market Outlook\nThe Pennsylvania health insurance market is facing significant upward pressure for the 2026 plan year. Actuarial filings suggest a composite increase of 5.5% across all rating areas.\n\n### Primary Cost Drivers\n- **GLP-1 Utilization**: Prescription drug spend for GLP-1 weight-loss and diabetes treatments (e.g., Wegovy, Ozempic) is projected to account for 4.2% of total premium growth.\n- **Provider Consolidation**: Mergers in the central and western PA regions are reducing price competition.\n- **Reinsurance Program**: The PA Health Insurance Exchange Authority (Pennie) reinsurance program continues to mitigate volatility by subsidizing high-cost claims above $60k.\n\n### Regional Variance\nRating Area 9 (Philadelphia) continues to see the highest absolute premiums due to high utilization rates and provider labor costs, while Area 6 (Central) remains the most competitive due to lower claim frequency and efficient network management by regional carriers.`,
    actuarialSection: {
      analysis: "Projected GLP-1 utilization is the single largest variable factor in 2026 rate filings. Carriers covering these drugs are seeing a 12% higher drug spend trend than those with strict prior authorizations.",
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