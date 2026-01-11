import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/components/layout/AppLayout';
import { analyzeTimeline } from '@/lib/forensic-logic';
import { CaseTimeline } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Printer, ArrowLeft, ShieldCheck, Scale, FileText } from 'lucide-react';
export function ReportViewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: timeline, isLoading, error } = useQuery({
    queryKey: ['timelines', id],
    queryFn: () => api<CaseTimeline>(`/api/timelines/${id}`),
    enabled: !!id
  });
  const handlePrint = () => window.print();
  if (isLoading) return <AppLayout><div className="flex items-center justify-center py-20">Loading report...</div></AppLayout>;
  if (error || !timeline) return <AppLayout><div className="text-center py-20">Report not found.</div></AppLayout>;
  const violations = analyzeTimeline(timeline.events);
  return (
    <AppLayout container={false}>
      <div className="bg-muted/30 min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between print:hidden">
          <Button variant="ghost" asChild>
            <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
          </Button>
          <Button onClick={handlePrint} className="shadow-lg">
            <Printer className="mr-2 h-4 w-4" /> Print Official Report
          </Button>
        </div>
        <div className="max-w-4xl mx-auto px-6 print:px-0">
          <Card className="shadow-2xl border-none print:shadow-none">
            <CardContent className="p-12 sm:p-16">
              {/* Letterhead */}
              <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-primary/20 pb-8 mb-10 gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl shadow-lg">
                    <ShieldCheck className="h-10 w-10" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-display font-black uppercase tracking-tighter leading-none">Keystone Health</h1>
                    <p className="text-sm font-bold text-primary tracking-widest uppercase">Advocate Platform</p>
                  </div>
                </div>
                <div className="text-right md:text-right text-sm text-muted-foreground">
                  <p className="font-bold text-foreground">Official Forensic Analysis</p>
                  <p>Generated: {format(new Date(), 'PPP')}</p>
                  <p>Case ID: {timeline.id.slice(0, 8)}</p>
                </div>
              </div>
              {/* Title */}
              <div className="mb-12">
                <h2 className="text-3xl font-display font-bold mb-2">Patient Rights Violation Report</h2>
                <p className="text-lg text-muted-foreground">Subject: {timeline.title}</p>
              </div>
              {/* Chronology */}
              <section className="mb-12">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-2">
                  <FileText className="h-5 w-5 text-primary" /> Case Chronology
                </h3>
                <div className="overflow-hidden border rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-bold">Date</th>
                        <th className="px-4 py-3 font-bold">Event Type</th>
                        <th className="px-4 py-3 font-bold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {timeline.events.map((e, idx) => (
                        <tr key={idx} className="hover:bg-muted/10">
                          <td className="px-4 py-3 font-medium">{format(new Date(e.date), 'MM/dd/yyyy')}</td>
                          <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{e.type}</Badge></td>
                          <td className="px-4 py-3">{e.label}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              {/* Findings */}
              <section className="mb-12">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6 border-b pb-2">
                  <Scale className="h-5 w-5 text-primary" /> Statutory Findings
                </h3>
                <div className="space-y-6">
                  {violations.map((v, idx) => (
                    <div key={idx} className={`p-6 rounded-xl border-l-4 ${v.isTriggered ? 'bg-destructive/5 border-l-destructive' : 'bg-emerald-50 border-l-emerald-500'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{v.title}</h4>
                        <Badge variant={v.isTriggered ? "destructive" : "secondary"}>
                          {v.isTriggered ? "VIOLATION DETECTED" : "COMPLIANT"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{v.description}</p>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-mono font-bold text-primary">CITING: {v.statute}</p>
                        {v.isTriggered && v.remedy && (
                          <div className="mt-2 pt-2 border-t border-destructive/20">
                            <p className="text-sm font-bold text-destructive">PROPOSED REMEDY:</p>
                            <p className="text-sm italic">{v.remedy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* Disclaimer */}
              <div className="mt-20 pt-8 border-t text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                Notice: This report is generated by Keystone Health Advocate for informational purposes only. It does not constitute legal advice. Users should consult with a licensed attorney for specific legal guidance regarding medical malpractice or statutory claims in the Commonwealth of Pennsylvania.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}