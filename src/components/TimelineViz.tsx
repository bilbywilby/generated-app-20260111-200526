import React from 'react';
import { ForensicEvent, ViolationResult } from '@shared/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Circle, AlertCircle } from 'lucide-react';
interface TimelineVizProps {
  events: ForensicEvent[];
  violations: ViolationResult[];
}
export function TimelineViz({ events, violations }: TimelineVizProps) {
  if (!events || events.length === 0) return null;
  const safeViolations = violations || [];
  return (
    <div className="relative py-10 px-4">
      {/* Vertical Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
      <div className="flex flex-col gap-12 relative">
        {events.map((event, index) => {
          const isEven = index % 2 === 0;
          const isViolationNode = safeViolations.some(v => v.isTriggered && v.title.toLowerCase().includes(event.type));
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col md:flex-row items-center gap-4 md:gap-0",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Content Side */}
              <div className={cn(
                "flex-1 w-full md:w-auto",
                isEven ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
              )}>
                <div className={cn(
                  "p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow",
                  isViolationNode ? "border-destructive/30 bg-destructive/5" : "border-border"
                )}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {event.type}
                    </span>
                    <h4 className="font-bold text-foreground">{event.label}</h4>
                    <time className="text-xs text-primary font-medium">
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </time>
                  </div>
                </div>
              </div>
              {/* Center Icon */}
              <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-primary shadow-sm">
                {isViolationNode ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <Circle className="h-3 w-3 fill-primary text-primary" />
                )}
              </div>
              {/* Spacer Side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}
      </div>
      {/* Summary Footer */}
      <div className="mt-16 flex items-center justify-center gap-6 text-sm text-muted-foreground border-t pt-8">
        <div className="flex items-center gap-2">
          <Circle className="h-3 w-3 fill-primary text-primary" />
          <span>Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span>Statutory Violation</span>
        </div>
      </div>
    </div>
  );
}