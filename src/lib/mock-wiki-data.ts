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
  },
  {
    id: 'informed-consent-pa',
    title: 'Informed Consent Requirements',
    category: 'Consent',
    summary: 'Common law and MCARE Act requirements for surgical and high-risk procedures.',
    statuteReference: '40 P.S. § 1303.504',
    lastUpdated: '2024-03-01',
    content: `
### Scope of Consent
In Pennsylvania, physicians (not nurses or residents) have a non-delegable duty to obtain informed consent. 
### Required Disclosures
You must be informed of:
- The nature of the procedure.
- Risks and complications.
- Alternatives and their risks.
### High-Risk Procedures
Consent is required for surgeries, radiation, chemotherapy, blood transfusions, and experimental medications.
    `
  },
  {
    id: 'mental-health-act-63',
    title: 'Mental Health Records (Act 63)',
    category: 'Privacy',
    summary: 'Stricter privacy standards for psychiatric and substance abuse records in PA.',
    statuteReference: '50 P.S. § 7111',
    lastUpdated: '2024-01-05',
    content: `
### Confidentiality
Psychiatric records are more strictly protected than general medical records. Third-party disclosure requires a specific, separate authorization.
### Access
While you have the right to view your records, a provider can deny access if they believe viewing would be "detrimental" to your health, though this can be challenged.
    `
  },
  {
    id: 'nursing-home-rights',
    title: 'Nursing Home Bill of Rights',
    category: 'Quality',
    summary: 'Protections for residents in PA long-term care facilities.',
    statuteReference: '28 Pa. Code § 201.29',
    lastUpdated: '2023-12-15',
    content: `
### Key Protections
- Right to choose your own physician.
- Right to be free from chemical or physical restraints.
- Right to manage your own financial affairs.
### Discharge Rights
Residents must be given **30 days notice** before a non-emergency transfer or discharge.
    `
  }
];