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
import { Plus, Trash2, AlertTriangle, CheckCircle2, History, LayoutPanelLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
export function ForensicToolPage() {
  const [events, setEvents] = useState<ForensicEvent[]>([]);
  const [newType, setNewType] = useState<ForensicEvent['type']>('request');
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const addEvent = () => {
    if (!newDate || !newLabel) return;
    const event: ForensicEvent = {
      id: Math.random().toString(36).substr(2, 9),
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
  const violations = analyzeTimeline(events);
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold tracking-tight">Forensic Timeline Analyzer</h1>
          <p className="text-muted-foreground max-w-2xl">
            Map out critical events to identify potential statutory violations in your case. 
            All processing is done locally for your privacy.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <Card className="lg:col-span-4 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Add Timeline Event</CardTitle>
              <CardDescription>Input dates from your records or correspondence.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">Written Records Request</SelectItem>
                    <SelectItem value="receipt">Records Received</SelectItem>
                    <SelectItem value="discharge">Hospital Discharge</SelectItem>
                    <SelectItem value="filing">Incident Discovered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="label">Label (e.g., "Request to Mercy Hospital")</Label>
                <Input id="label" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Friendly name..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date of Event</Label>
                <Input id="date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <Button onClick={addEvent} className="w-full shadow-lg">
                <Plus className="mr-2 h-4 w-4" /> Add to Timeline
              </Button>
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    Event History
                  </h4>
                  <Badge variant="outline">{events.length}</Badge>
                </div>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2">
                  {events.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-8 italic border rounded-lg border-dashed">
                      No events added yet.
                    </p>
                  )}
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-2 rounded border bg-muted/20 group hover:border-primary/30 transition-colors">
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] font-bold uppercase text-primary/70">{event.type}</span>
                        <span className="text-sm font-medium truncate">{event.label}</span>
                        <span className="text-[10px] text-muted-foreground">{format(event.date, 'PPP')}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeEvent(event.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Analysis & Visualization */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Tabs defaultValue="visual" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[300px] grid-cols-2">
                  <TabsTrigger value="visual" className="flex items-center gap-2">
                    <LayoutPanelLeft className="h-4 w-4" /> Visual
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Report
                  </TabsTrigger>
                </TabsList>
                {violations.some(v => v.isTriggered) && (
                  <Badge variant="destructive" className="animate-pulse">
                    Potential Violations Detected
                  </Badge>
                )}
              </div>
              <TabsContent value="visual" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    {events.length < 2 ? (
                      <div className="text-center py-20 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <Plus className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <div className="max-w-xs">
                          <p className="text-lg font-medium text-foreground">Awaiting Data</p>
                          <p className="text-sm text-muted-foreground">
                            Add at least two related events (like a request and receipt) to visualize your case timeline.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <TimelineViz events={events} violations={violations} />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="report" className="mt-0">
                <Card className="border-primary/20">
                  <CardHeader className="bg-primary/5">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      Legal Violation Report
                    </CardTitle>
                    <CardDescription>
                      Automated analysis based on Pennsylvania statutes and federal healthcare regulations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {violations.length === 0 && (
                      <div className="text-center py-12 flex flex-col items-center gap-3">
                        <CheckCircle2 className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">Add relevant events to trigger analyzer logic.</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-4">
                      {violations.map(v => (
                        <div key={v.id} className={cn(
                          "p-4 rounded-lg border-l-4 flex flex-col gap-2 shadow-sm transition-all",
                          v.isTriggered ? "bg-destructive/5 border-l-destructive" : "bg-emerald-50/50 border-l-emerald-500"
                        )}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm">{v.title}</span>
                            <Badge variant={v.isTriggered ? "destructive" : "secondary"}>
                              {v.isTriggered ? "Violation Flagged" : "Compliant"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{v.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] font-mono bg-muted px-2 py-1 rounded border">
                              {v.statute}
                            </span>
                            <Button variant="link" className="h-auto p-0 text-[10px] uppercase font-bold text-primary">
                              View Remedy Template
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="p-6 border rounded-xl bg-muted/30 border-dashed">
              <h3 className="text-xs font-bold mb-3 uppercase tracking-widest text-muted-foreground">Disclaimer</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This analyzer uses Pennsylvania's Medical Records Act (Act 169) and the MCARE Act (Act 13) to evaluate your timeline.
                This tool provides information, not legal advice. Data is stored only in your current session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}