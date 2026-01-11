import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileSearch,
  Bookmark,
  Plus,
  Clock,
  ChevronRight,
  LayoutDashboard,
  BarChart3,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { CaseTimeline, UserBookmark } from '@shared/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeTimeline } from '@/lib/forensic-logic';
import { differenceInDays, format } from 'date-fns';
export function DashboardPage() {
  const { data: timelinesData, isLoading: loadingTimelines } = useQuery({
    queryKey: ['timelines'],
    queryFn: () => api<{ items: CaseTimeline[] }>('/api/timelines')
  });
  const { data: bookmarksData, isLoading: loadingBookmarks } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api<{ items: UserBookmark[] }>('/api/bookmarks')
  });
  const timelines = useMemo(() => timelinesData?.items || [], [timelinesData]);
  const bookmarks = useMemo(() => bookmarksData?.items || [], [bookmarksData]);
  const isLoading = loadingTimelines || loadingBookmarks;
  // Analytics Logic
  const chartData = useMemo(() => {
    const counts: Record<string, number> = { "Access": 0, "Privacy": 0, "Billing": 0, "Consent": 0, "Quality": 0 };
    timelines.forEach(t => {
      const violations = analyzeTimeline(t.events);
      violations.forEach(v => {
        if (v.isTriggered) {
          if (v.id.includes('act-169')) counts["Access"]++;
          if (v.id.includes('mcare')) counts["Quality"]++;
          if (v.id.includes('surprises')) counts["Billing"]++;
          if (v.id.includes('consent')) counts["Consent"]++;
        }
      });
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [timelines]);
  const avgRecordsDays = useMemo(() => {
    let totalDays = 0;
    let count = 0;
    timelines.forEach(t => {
      const req = t.events.find(e => e.type === 'request');
      const rec = t.events.find(e => e.type === 'receipt');
      if (req && rec) {
        totalDays += differenceInDays(new Date(rec.date), new Date(req.date));
        count++;
      }
    });
    return count > 0 ? Math.round(totalDays / count) : 0;
  }, [timelines]);
  const stats = useMemo(() => [
    { label: "Active Analyses", value: timelines.length.toString(), icon: FileSearch, color: "text-blue-500" },
    { label: "Avg Records Wait", value: `${avgRecordsDays} Days`, icon: Clock, color: "text-purple-500" },
    { label: "Bookmarked Rights", value: bookmarks.length.toString(), icon: Bookmark, color: "text-yellow-600" },
  ], [timelines.length, avgRecordsDays, bookmarks.length]);
  const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];
  return (
    <AppLayout>
      <div className="flex flex-col gap-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <LayoutDashboard className="h-4 w-4" />
              Advocate Hub
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Your Dashboard</h1>
            <p className="text-muted-foreground">Manage your medical rights cases and saved resources.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="lg" className="shadow-lg rounded-full">
              <Link to="/tool">
                <Plus className="mr-2 h-4 w-4" /> New Case Analysis
              </Link>
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-soft ring-1 ring-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-3xl font-bold">{stat.value}</p>}
                  </div>
                  <div className={cn("p-3 rounded-2xl bg-muted/50", stat.color)}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2 px-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
              ) : timelines.length === 0 ? (
                <Card className="border-dashed border-2 py-12 text-center bg-muted/20">
                  <p className="text-muted-foreground">No case analyses yet. Start one to see trends.</p>
                </Card>
              ) : (
                timelines.map((caseItem) => (
                  <Card key={caseItem.id} className="group hover:ring-2 hover:ring-primary/20 transition-all border-none ring-1 ring-border">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{caseItem.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {caseItem.updatedAt ? format(new Date(caseItem.updatedAt), 'PP') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/report/${caseItem.id}`}>View Report</Link>
                        </Button>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="shadow-soft ring-1 ring-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Violation Distribution
                </CardTitle>
                <CardDescription>Trends across your saved cases</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}