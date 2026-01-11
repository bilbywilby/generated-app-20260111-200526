import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileSearch, 
  Bookmark, 
  Plus, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
export function DashboardPage() {
  const stats = [
    { label: "Active Analyses", value: "3", icon: FileSearch, color: "text-blue-500" },
    { label: "Bookmarked Rights", value: "12", icon: Bookmark, color: "text-yellow-600" },
    { label: "Potential Violations", value: "1", icon: AlertTriangle, color: "text-red-500" },
  ];
  const recentActivity = [
    { id: '1', type: 'Analysis', name: 'Mercy Hospital Records Request', date: '2 hours ago', status: 'In Progress' },
    { id: '2', type: 'Wiki', name: 'MCARE Act Serious Events', date: 'Yesterday', status: 'Bookmarked' },
    { id: '3', type: 'Analysis', name: 'ER Billing Review (St. Lukes)', date: '3 days ago', status: 'Violation Flagged' },
  ];
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-soft ring-1 ring-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-2 px-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((act) => (
                <Card key={act.id} className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer border-none ring-1 ring-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        act.type === 'Analysis' ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"
                      )}>
                        {act.type === 'Analysis' ? <FileSearch className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm group-hover:text-primary transition-colors">{act.name}</span>
                        <span className="text-xs text-muted-foreground">{act.type} • {act.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={act.status.includes('Violation') ? 'destructive' : 'secondary'} className="text-[10px]">
                        {act.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="ghost" className="w-full text-muted-foreground text-xs uppercase font-bold tracking-widest hover:text-primary">
                View All Activity
              </Button>
            </div>
          </div>
          {/* Quick Stats & News Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-primary text-primary-foreground shadow-lg border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statutory Updates
                </CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  New regulations in Pennsylvania
                </CardDescription>
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
                  <p className="text-[10px] text-white/60">Disclosure timelines now stricter for ASCs.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-dashed border-2 bg-muted/20">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm">Advocate Verification</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You've successfully mapped 3 case timelines this month. Good work!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}