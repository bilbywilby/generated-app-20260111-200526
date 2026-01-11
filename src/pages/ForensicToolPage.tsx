import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ForensicEvent } from '@/types/domain';
import { analyzeTimeline } from '@/lib/forensic-logic';
import { TimelineViz } from '@/components/TimelineViz';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Save, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function ForensicToolPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<ForensicEvent[]>([]);
  const [newType, setNewType] = useState<ForensicEvent['type']>('request');
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);
  const saveMutation = useMutation({
    mutationFn: (data: { title: string, events: ForensicEvent[] }) =>
      api<{ id: string }>('/api/timelines', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (res) => {
      toast.success("Case saved to dashboard");
      setSavedCaseId(res.id);
      queryClient.invalidateQueries({ queryKey: ['timelines'] });
    },
    onError: () => toast.error("Failed to save case")
  });
  const addEvent = () => {
    if (!newDate || !newLabel) return;
    const event: ForensicEvent = {
      id: crypto.randomUUID(),
      type: newType,
      date: new Date(newDate),
      label: newLabel,
    };
    setEvents([...events, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewDate('');
    setNewLabel('');
  };
  const handleSave = () => {
    if (events.length < 1) return toast.error("Add at least one event to save");
    const title = caseTitle.trim() || `Analysis ${format(new Date(), 'PPp')}`;
    saveMutation.mutate({ title, events });
  };
  const violations = analyzeTimeline(events);
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold tracking-tight">Forensic Timeline Analyzer</h1>
          <p className="text-muted-foreground max-w-2xl">
            Map out critical events to identify potential statutory violations in your case.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card className="lg:col-span-4 sticky top-24">
            <CardHeader><CardTitle className="text-lg">Add Timeline Event</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Event Type</Label>
                <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">Written Records Request</SelectItem>
                    <SelectItem value="receipt">Records Received</SelectItem>
                    <SelectItem value="discharge">Hospital Discharge</SelectItem>
                    <SelectItem value="filing">Incident Discovered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Label</Label>
                <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Request to Mercy Hosp" />
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <Button onClick={addEvent} className="w-full rounded-full">
                <Plus className="mr-2 h-4 w-4" /> Add to Timeline
              </Button>
            </CardContent>
          </Card>
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Tabs defaultValue="visual" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="rounded-full">
                  <TabsTrigger value="visual" className="rounded-full">Visual</TabsTrigger>
                  <TabsTrigger value="report" className="rounded-full">Findings</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3">
                  <Input placeholder="Case Name..." className="w-48 h-9" value={caseTitle} onChange={e => setCaseTitle(e.target.value)} />
                  <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="rounded-full">
                    <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? "Saving..." : "Save Case"}
                  </Button>
                </div>
              </div>
              <TabsContent value="visual">
                <Card><CardContent className="pt-6">
                  {events.length < 2 ? (
                    <div className="text-center py-20 text-muted-foreground">Add two events to start visualization</div>
                  ) : <TimelineViz events={events} violations={violations} />}
                </CardContent></Card>
              </TabsContent>
              <TabsContent value="report">
                <div className="flex flex-col gap-4">
                  {savedCaseId && (
                    <Button variant="secondary" onClick={() => navigate(`/report/${savedCaseId}`)} className="w-full h-12 shadow-sm">
                      <FileText className="mr-2 h-5 w-5" /> View Official Report Document
                    </Button>
                  )}
                  <div className="space-y-4">
                    {violations.map(v => (
                      <div key={v.id} className={cn("p-4 rounded-lg border-l-4", v.isTriggered ? "bg-destructive/5 border-l-destructive" : "bg-emerald-50/50 border-l-emerald-500")}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm">{v.title}</span>
                          <Badge variant={v.isTriggered ? "destructive" : "secondary"}>{v.isTriggered ? "Violation" : "Compliant"}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{v.description}</p>
                        {v.isTriggered && v.remedy && <p className="text-xs mt-3 font-bold text-destructive">REMEDY: {v.remedy}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}