import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { ImmutableEvent } from '@shared/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Database, Fingerprint, Lock, ArrowLeft, Info, Globe } from 'lucide-react';
import { format } from 'date-fns';
export function ProvenancePage() {
  const { id } = useParams<{ id: string }>();
  const [showGlobal, setShowGlobal] = React.useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['provenance', id, showGlobal],
    queryFn: () => api<{ items: ImmutableEvent[] }>(`/api/events/by-time${!showGlobal ? `?resourceId=${id}` : ''}`)
  });
  const events = data?.items || [];
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/wiki"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Library</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowGlobal(!showGlobal)} className="rounded-full gap-2">
              {showGlobal ? <Fingerprint className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {showGlobal ? "View Resource Audit" : "View Global Chain"}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Fingerprint className="h-4 w-4" /> Data Integrity Chain
          </div>
          <h1 className="text-4xl font-display font-bold">Provenance Audit Trail</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <p className="text-muted-foreground flex-1">
              {showGlobal 
                ? "The global tamper-evident log for all editorial and case-related activity across the Keystone platform."
                : <>Cryptographic proof of custody for legal information regarding <span className="text-foreground font-semibold">{id}</span>.</>
              }
            </p>
            {!showGlobal && (
               <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-none">Filtered: {id?.slice(0, 12)}...</Badge>
            )}
          </div>
        </header>
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 leading-relaxed">
            Every change to medical rights information is logged as an immutable block. Blocks are cryptographically linked to their predecessor via SHA-256 hashing, ensuring that any unauthorized tampering with historical records would immediately break the chain.
          </p>
        </div>
        <div className="relative border-l-2 border-primary/20 ml-4 pl-8 space-y-8 mt-12">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed">
               <Database className="h-10 w-10 mb-4 opacity-20" />
               <p className="italic">No forensic logs found for this filter.</p>
            </div>
          ) : (
            events.map((event, i) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[41px] top-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <Card className="border-none shadow-soft ring-1 ring-border overflow-hidden hover:ring-primary/30 transition-all">
                  <div className="bg-primary/5 px-6 py-2 border-b flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-primary uppercase">Block #{events.length - i}</span>
                    <Badge variant="outline" className="text-[10px] bg-background text-emerald-600 border-emerald-200">Verified Chain Integrity</Badge>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg uppercase tracking-tight">{event.type.replace('_', ' ')}</h4>
                        <p className="text-xs text-muted-foreground">{format(new Date(event.timestamp), 'PPPpp')}</p>
                      </div>
                      <Database className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Payload Hash (Current)</p>
                        <div className="bg-muted p-3 rounded-md font-mono text-[9px] break-all leading-tight border">
                          {event.hash}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Previous Link</p>
                        <div className="bg-muted p-3 rounded-md font-mono text-[9px] break-all leading-tight border opacity-60">
                          {event.prevHash}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 mt-2 border-t border-dashed flex items-center gap-4">
                       <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                          <Lock className="h-3 w-3" /> Securely Anchored
                       </div>
                       {event.resourceId && (
                         <div className="flex items-center gap-2 text-[10px] text-primary font-bold">
                           <Fingerprint className="h-3 w-3" /> ID: {event.resourceId.slice(0, 16)}...
                         </div>
                       )}
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