import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ForensicEvent, ViolationResult } from '@/types/domain';
import { analyzeTimeline } from '@/lib/forensic-logic';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
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
          <h1 className="text-3xl font-display font-bold">Forensic Timeline Analyzer</h1>
          <p className="text-muted-foreground">Map out critical events to identify potential statutory violations in your case.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <Card className="lg:col-span-5">
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
                <Label htmlFor="label">Event Label (e.g., "Request to Mercy Hospital")</Label>
                <Input id="label" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Friendly name..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <Button onClick={addEvent} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add to Timeline
              </Button>
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Event History</h4>
                <div className="flex flex-col gap-2">
                  {events.length === 0 && <p className="text-xs text-muted-foreground text-center py-4 italic">No events added yet.</p>}
                  {events.map(event => (
                    <div key={event.id} className="flex items-center justify-between p-2 rounded border bg-muted/20">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase text-primary/70">{event.type}</span>
                        <span className="text-sm font-medium">{event.label}</span>
                        <span className="text-[10px] text-muted-foreground">{format(event.date, 'PPP')}</span>
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
          {/* Analysis */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Legal Violation Report
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {violations.length === 0 && (
                  <div className="text-center py-12 flex flex-col items-center gap-3">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Add multiple events (e.g., Request and Receipt) to trigger analyzer logic.</p>
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  {violations.map(v => (
                    <div key={v.id} className={cn(
                      "p-4 rounded-lg border-l-4 flex flex-col gap-2 shadow-sm",
                      v.isTriggered ? "bg-destructive/5 border-l-destructive" : "bg-emerald-50/50 border-l-emerald-500"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{v.title}</span>
                        <Badge variant={v.isTriggered ? "destructive" : "secondary"}>
                          {v.isTriggered ? "Violation Flagged" : "Compliant"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{v.statute}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <div className="p-6 border rounded-lg bg-muted/10 border-dashed">
              <h3 className="text-sm font-bold mb-2 uppercase tracking-tight text-muted-foreground">About this Tool</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This analyzer uses Pennsylvania's Medical Records Act (Act 169) and the MCARE Act (Act 13) to evaluate your timeline. 
                Data is processed locally. This tool does not constitute legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}