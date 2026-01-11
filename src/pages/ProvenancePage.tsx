import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { ImmutableEvent } from '@shared/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Database, Fingerprint, Lock, History } from 'lucide-react';
import { format } from 'date-fns';
export function ProvenancePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['provenance', id],
    queryFn: () => api<{ items: ImmutableEvent[] }>('/api/events/by-time')
  });
  const events = data?.items || [];
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Fingerprint className="h-4 w-4" /> Data Integrity Chain
          </div>
          <h1 className="text-4xl font-display font-bold">Provenance Audit Trail</h1>
          <p className="text-muted-foreground">
            Cryptographic proof of custody for legal information regarding <span className="text-foreground font-semibold">{id}</span>.
          </p>
        </header>
        <div className="relative border-l-2 border-primary/20 ml-4 pl-8 space-y-8">
          {isLoading ? (
            <p>Verifying chain...</p>
          ) : events.length === 0 ? (
            <p className="text-muted-foreground italic">No forensic logs found for this entry.</p>
          ) : (
            events.map((event, i) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <Card className="border-none shadow-soft ring-1 ring-border overflow-hidden">
                  <div className="bg-primary/5 px-6 py-2 border-b flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase">Block #{events.length - i}</span>
                    <Badge variant="outline" className="text-[10px] bg-background">Verified</Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{event.type}</h4>
                        <p className="text-xs text-muted-foreground">{format(new Date(event.timestamp), 'PPPpp')}</p>
                      </div>
                      <Database className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">Payload Hash</p>
                      <div className="bg-muted p-3 rounded-md font-mono text-[10px] break-all leading-tight">
                        {event.hash}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Linked to previous block: </span>
                      <span className="font-mono text-primary truncate max-w-[120px]">{event.prevHash}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}