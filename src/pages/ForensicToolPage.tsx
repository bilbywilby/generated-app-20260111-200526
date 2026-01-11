import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ForensicEvent } from '@/types/domain';
import { analyzeTimeline } from '@/lib/forensic-logic';
import { TimelineViz } from '@/components/TimelineViz';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash2, AlertTriangle, CheckCircle2, History, LayoutPanelLeft, Save } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
export function ForensicToolPage() {
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<ForensicEvent[]>([]);
  const [newType, setNewType] = useState<ForensicEvent['type']>('request');
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const saveMutation = useMutation({
    mutationFn: (data: { title: string, events: ForensicEvent[] }) => 
      api('/api/timelines', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      toast.success("Case saved to dashboard");
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
    setEvents([...events, event].sort((a, b) => a.date.getTime() - b.date.getTime()));
    setNewDate('');
    setNewLabel('');
  };
  const removeEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
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
            <CardHeader>
              <CardTitle className="text-lg">Add Timeline Event</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
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
                <Label htmlFor="label">Label</Label>
                <Input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. Request to Mercy Hosp" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <Button onClick={addEvent} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add to Timeline
              </Button>
              <div className="mt-8">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-4">
                  <History className="h-4 w-4 text-muted-foreground" /> Event History
                </h4>
                <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2">
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-2 rounded border bg-muted/20 group">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase text-primary/70">{event.type}</span>
                        <span className="text-sm font-medium truncate">{event.label}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeEvent(event.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Tabs defaultValue="visual" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="visual"><LayoutPanelLeft className="mr-2 h-4 w-4" /> Visual</TabsTrigger>
                  <TabsTrigger value="report"><AlertTriangle className="mr-2 h-4 w-4" /> Report</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3">
                  <Input 
                    placeholder="Case Name..." 
                    className="w-48 h-9" 
                    value={caseTitle} 
                    onChange={e => setCaseTitle(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
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
                <Card><CardContent className="pt-6 space-y-4">
                  {violations.map(v => (
                    <div key={v.id} className={cn("p-4 rounded-lg border-l-4", v.isTriggered ? "bg-destructive/5 border-l-destructive" : "bg-emerald-50/50 border-l-emerald-500")}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{v.title}</span>
                        <Badge variant={v.isTriggered ? "destructive" : "secondary"}>{v.isTriggered ? "Violation" : "Compliant"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                    </div>
                  ))}
                </CardContent></Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}