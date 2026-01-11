import { WikiArticle } from '@/types/domain';
export const WIKI_ARTICLES: WikiArticle[] = [
  {
    id: 'pa-act-169',
    title: 'Medical Records Access (Act 169)',
    category: 'Access',
    summary: 'Pennsylvania law regarding a patient’s right to access and copy their medical records.',
    statuteReference: '42 Pa. C.S. § 6152',
    lastUpdated: '2024-01-15',
    content: `
### Overview
Under Pennsylvania law, healthcare providers must provide access to medical records within 30 days of a written request.
### Fees
Providers may charge "reasonable costs" for copying. For 2024, these are capped at:
- $1.81 per page for the first 20 pages.
- $1.34 per page for pages 21-60.
- $0.47 per page for pages 61+.
### Deadlines
The facility has **30 days** to respond to your request. If the records are off-site, they may take up to 60 days but must notify you in writing of the delay.
    `
  },
  {
    id: 'mcare-act-13',
    title: 'MCARE Act Notifications',
    category: 'Quality',
    summary: 'The Medical Care Availability and Reduction of Error (MCARE) Act requirements for disclosure.',
    statuteReference: '40 P.S. § 1303.308',
    lastUpdated: '2023-11-20',
    content: `
### Duty to Report
Healthcare workers are required to report "serious events" and "incidents" to the Patient Safety Authority.
### Disclosure to Patients
Medical facilities must notify patients in writing if they were the subject of a "serious event" within **seven days** of its discovery.
    `
  },
  {
    id: 'billing-surprises',
    title: 'PA No Surprises Act',
    category: 'Billing',
    summary: 'Protections against unexpected out-of-network medical bills.',
    statuteReference: 'Act 97 of 2020',
    lastUpdated: '2024-02-10',
    content: `
### Your Rights
In Pennsylvania, you are protected from "balance billing" for emergency services and certain non-emergency services at in-network facilities.
### Good Faith Estimates
Uninsured or self-pay patients have the right to a "Good Faith Estimate" of expected charges before service is provided.
    `
  }
];