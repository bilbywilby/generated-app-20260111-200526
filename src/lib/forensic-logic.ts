import { ForensicEvent, ViolationResult } from '@/types/domain';
import { differenceInDays, isBefore, addDays, format } from 'date-fns';
export function analyzeTimeline(events: ForensicEvent[]): ViolationResult[] {
  const violations: ViolationResult[] = [];
  const getEventDate = (e: ForensicEvent) => new Date(e.date);
  const request = events.find(e => e.type === 'request');
  const receipt = events.find(e => e.type === 'receipt');
  if (request && receipt) {
    const days = differenceInDays(getEventDate(receipt), getEventDate(request));
    const isViolation = days > 30;
    violations.push({
      id: 'v-act-169-30d',
      severity: isViolation ? 'high' : 'low',
      title: 'Medical Records Delivery Deadline',
      description: isViolation
        ? `Records were delivered in ${days} days, exceeding the PA 30-day statutory limit (Act 169).`
        : `Records were delivered within the legal 30-day window (${days} days).`,
      statute: '42 Pa. C.S. § 6152',
      isTriggered: isViolation,
      remedy: isViolation ? "File a complaint with the PA Department of Health for non-compliance with Act 169." : undefined
    } as any);
  }
  const incident = events.find(e => e.type === 'filing');
  const notification = events.find(e => e.type === 'receipt' && e.label.toLowerCase().includes('notice'));
  if (incident && notification) {
    const days = differenceInDays(getEventDate(notification), getEventDate(incident));
    const isViolation = days > 7;
    violations.push({
      id: 'v-mcare-7d',
      severity: isViolation ? 'high' : 'low',
      title: 'Serious Event Disclosure (MCARE)',
      description: isViolation
        ? `The facility failed to provide written notice of a serious event within 7 days of discovery (${days} days elapsed).`
        : `Notice was provided within the 7-day mandatory disclosure window.`,
      statute: '40 P.S. § 1303.308',
      isTriggered: isViolation,
      remedy: isViolation ? "Request a formal review of the incident from the hospital Patient Safety Officer." : undefined
    } as any);
  }
  const procedure = events.find(e => e.label.toLowerCase().includes('surgery') || e.label.toLowerCase().includes('procedure'));
  if (procedure && receipt) {
    const hasConsent = receipt.notes?.toLowerCase().includes('consent') || receipt.label.toLowerCase().includes('signed');
    if (!hasConsent) {
      violations.push({
        id: 'v-consent-missing',
        severity: 'medium',
        title: 'Informed Consent Documentation',
        description: 'No signed informed consent form was identified in the provided medical records for the recorded procedure.',
        statute: '40 P.S. § 1303.504',
        isTriggered: true,
        remedy: "Request a specific copy of your signed consent form from the facility's Risk Management department."
      } as any);
    }
  }
  const denial = events.find(e => e.label.toLowerCase().includes('denial') || e.label.toLowerCase().includes('denied'));
  if (denial) {
    const today = new Date();
    const deadline = addDays(getEventDate(denial), 60);
    const isExpired = isBefore(deadline, today);
    violations.push({
      id: 'v-appeal-60d',
      severity: isExpired ? 'high' : 'medium',
      title: 'DOH Appeal Window',
      description: isExpired
        ? "The standard 60-day window for filing an appeal with the PA Department of Health has passed."
        : `You have until ${format(deadline, 'PPP')} to file a formal appeal (60 days from denial).`,
      statute: '28 Pa. Code § 51.3',
      isTriggered: !isExpired,
      remedy: !isExpired ? "Prepare and submit your appeal documentation to the DOH Bureau of Quality Assurance." : "Consult counsel regarding potential tolling of the appeal deadline."
    } as any);
  }
  return violations;
}