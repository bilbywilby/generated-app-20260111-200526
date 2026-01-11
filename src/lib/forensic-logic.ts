import { ForensicEvent, ViolationResult } from '@/types/domain';
import { differenceInDays, isBefore, addDays } from 'date-fns';
export function analyzeTimeline(events: ForensicEvent[]): ViolationResult[] {
  const violations: ViolationResult[] = [];
  // Rule 1: Medical Records Request (30 Day Limit - Act 169)
  const request = events.find(e => e.type === 'request');
  const receipt = events.find(e => e.type === 'receipt');
  if (request && receipt) {
    const days = differenceInDays(receipt.date, request.date);
    const isViolation = days > 30;
    violations.push({
      id: 'v-act-169-30d',
      severity: isViolation ? 'high' : 'low',
      title: 'Medical Records Delivery Deadline',
      description: isViolation
        ? `Records were delivered in ${days} days, exceeding the PA 30-day statutory limit (Act 169).`
        : `Records were delivered within the legal 30-day window (${days} days).`,
      statute: '42 Pa. C.S. § 6152',
      isTriggered: isViolation
    });
  }
  // Rule 2: Serious Event Disclosure (7 Day Limit - MCARE)
  // We use "discharge" or "filing" (incident discovery) to check against "receipt" of notice
  const incident = events.find(e => e.type === 'filing');
  const notification = events.find(e => e.type === 'receipt' && e.label.toLowerCase().includes('notice'));
  if (incident && notification) {
    const days = differenceInDays(notification.date, incident.date);
    const isViolation = days > 7;
    violations.push({
      id: 'v-mcare-7d',
      severity: isViolation ? 'high' : 'low',
      title: 'Serious Event Disclosure (MCARE)',
      description: isViolation
        ? `The facility failed to provide written notice of a serious event within 7 days of discovery (${days} days elapsed).`
        : `Notice was provided within the 7-day mandatory disclosure window.`,
      statute: '40 P.S. § 1303.308',
      isTriggered: isViolation
    });
  }
  // Rule 3: Good Faith Estimate (3 Day Rule)
  const requestGFE = events.find(e => e.label.toLowerCase().includes('estimate request'));
  const receivedGFE = events.find(e => e.label.toLowerCase().includes('estimate received'));
  if (requestGFE && receivedGFE) {
    const days = differenceInDays(receivedGFE.date, requestGFE.date);
    const isViolation = days > 3;
    violations.push({
      id: 'v-no-surprises-3d',
      severity: isViolation ? 'medium' : 'low',
      title: 'Good Faith Estimate Timeliness',
      description: isViolation
        ? `The Good Faith Estimate was provided ${days} days after request, exceeding the 3-business-day standard for non-emergency care.`
        : `Good Faith Estimate provided within standard timeframe.`,
      statute: 'Title 45 CFR § 149.610',
      isTriggered: isViolation
    });
  }
  return violations;
}