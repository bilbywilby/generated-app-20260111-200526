import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileSearch,
  Bookmark,
  Plus,
  Clock,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { CaseTimeline, UserBookmark } from '@shared/types';
export function DashboardPage() {
  const { data: timelinesData, isLoading: loadingTimelines } = useQuery({
    queryKey: ['timelines'],
    queryFn: () => api<{ items: CaseTimeline[] }>('/api/timelines')
  });
  const { data: bookmarksData, isLoading: loadingBookmarks } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api<{ items: UserBookmark[] }>('/api/bookmarks')
  });
  const timelines = timelinesData?.items || [];
  const bookmarks = bookmarksData?.items || [];
  const stats = [
    { label: "Active Analyses", value: timelines.length.toString(), icon: FileSearch, color: "text-blue-500" },
    { label: "Bookmarked Rights", value: bookmarks.length.toString(), icon: Bookmark, color: "text-yellow-600" },
    { label: "System Updates", value: "2", icon: TrendingUp, color: "text-green-500" },
  ];
  const isLoading = loadingTimelines || loadingBookmarks;
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
            <Button asChild variant="outline" size="lg">
              <Link to="/wiki">Browse Wiki</Link>
            </Button>
            <Button asChild size="lg" className="shadow-lg">
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
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2 px-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))
              ) : timelines.length === 0 && bookmarks.length === 0 ? (
                <Card className="border-dashed border-2 py-12 flex flex-col items-center justify-center text-center gap-4 bg-muted/20">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="max-w-xs px-4">
                    <p className="font-bold text-sm">No activity yet</p>
                    <p className="text-xs text-muted-foreground">Start by analyzing a case or bookmarking an article in the wiki.</p>
                  </div>
                </Card>
              ) : (
                <>
                  {timelines.slice(0, 5).map((caseItem) => (
                    <Card key={caseItem.id} className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer border-none ring-1 ring-border">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <FileSearch className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm group-hover:text-primary transition-colors">{caseItem.title}</span>
                            <span className="text-xs text-muted-foreground">Analysis • {new Date(caseItem.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-[10px]">Saved</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {bookmarks.slice(0, 5).map((bookmark) => (
                    <Card key={bookmark.id} className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer border-none ring-1 ring-border">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                            <Bookmark className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm group-hover:text-primary transition-colors">{bookmark.articleTitle}</span>
                            <span className="text-xs text-muted-foreground">Wiki • {bookmark.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[10px]">Bookmarked</Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-primary text-primary-foreground shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statutory Updates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white/10 rounded-xl space-y-1">
                  <p className="text-xs font-bold uppercase">Feb 2024</p>
                  <p className="text-sm font-medium">Record Copy Fees Updated</p>
                  <p className="text-[10px] text-white/60">New caps on per-page charges effective immediately.</p>
                </div>
                <div className="p-3 bg-white/10 rounded-xl space-y-1">
                  <p className="text-xs font-bold uppercase">Jan 2024</p>
                  <p className="text-sm font-medium">MCARE Reporting Extended</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}