import { ForensicEvent, ViolationResult } from '@/types/domain';
import { differenceInDays } from 'date-fns';
export function analyzeTimeline(events: ForensicEvent[]): ViolationResult[] {
  const violations: ViolationResult[] = [];
  // Rule 1: Medical Records Request (30 Day Limit - Act 169)
  const request = events.find(e => e.type === 'request');
  const receipt = events.find(e => e.type === 'receipt');
  if (request && receipt) {
    const days = differenceInDays(receipt.date, request.date);
    violations.push({
      id: 'v-act-169-30d',
      severity: days > 30 ? 'high' : 'low',
      title: 'Medical Records Delivery Deadline',
      description: days > 30 
        ? `Records were delivered in ${days} days, exceeding the PA 30-day statutory limit.`
        : `Records were delivered within the legal 30-day window (${days} days).`,
      statute: '42 Pa. C.S. § 6152',
      isTriggered: days > 30
    });
  }
  // Rule 2: Serious Event Disclosure (7 Day Limit - MCARE)
  const discharge = events.find(e => e.type === 'discharge');
  const filing = events.find(e => e.type === 'filing'); // Representing "Discovery of Event"
  if (filing && receipt) { // Logic: Receipt of notification vs filing date
     // Simplified mock rule
  }
  return violations;
}