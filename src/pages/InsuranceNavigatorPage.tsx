import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { CountyMapping, HealthRate, SubsidyCalculation, WikiArticle, PIDFiling } from '@shared/types';
import { 
  Calculator, Map, TrendingUp, AlertCircle, Info, Users, 
  ArrowLeftRight, FileText, Search, Printer, Download 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, LineChart, Line 
} from 'recharts';
import { cn } from '@/lib/utils';
export function InsuranceNavigatorPage() {
  const [income, setIncome] = useState<number>(45000);
  const [householdSize, setHouseholdSize] = useState<number>(1);
  const [selectedCounty, setSelectedCounty] = useState<string>('Allegheny');
  const [calculating, setCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<SubsidyCalculation | null>(null);
  const [filingSearch, setFilingSearch] = useState('');
  // Dual comparison state
  const [compPlanA, setCompPlanA] = useState<string>('');
  const [compPlanB, setCompPlanB] = useState<string>('');
  // Queries
  const { data: countiesData } = useQuery({
    queryKey: ['insurance-counties'],
    queryFn: () => api<{ items: CountyMapping[] }>('/api/insurance-counties')
  });
  const { data: ratesData } = useQuery({
    queryKey: ['insurance-rates'],
    queryFn: () => api<{ items: HealthRate[] }>('/api/insurance-rates')
  });
  const { data: heatmapData } = useQuery({
    queryKey: ['insurance-heatmap'],
    queryFn: () => api<{ items: { ratingArea: number; avgPremium: number; avgIncrease: number }[] }>('/api/insurance-heatmap')
  });
  const { data: filingsData } = useQuery({
    queryKey: ['pid-filings', filingSearch],
    queryFn: () => api<{ items: PIDFiling[] }>(`/api/pid-filings?q=${filingSearch}`)
  });
  const { data: wikiData } = useQuery({
    queryKey: ['wiki-articles'],
    queryFn: () => api<{ items: WikiArticle[] }>('/api/wiki-articles')
  });
  // Memoized derived data for linting stability
  const counties = useMemo(() => countiesData?.items ?? [], [countiesData]);
  const rates = useMemo(() => ratesData?.items ?? [], [ratesData]);
  const heatmaps = useMemo(() => heatmapData?.items ?? [], [heatmapData]);
  const filings = useMemo(() => filingsData?.items ?? [], [filingsData]);
  const actuarialArticle = useMemo(() => 
    wikiData?.items.find(a => a.id === 'insurance-actuarial-2026'), 
  [wikiData]);
  const ratingArea = useMemo(() => {
    return counties.find(c => c.county === selectedCounty)?.ratingArea ?? 1;
  }, [selectedCounty, counties]);
  const localRates = useMemo(() => {
    return rates.filter(r => r.ratingArea === ratingArea);
  }, [ratingArea, rates]);
  // Set initial comparison plans when local rates load
  useEffect(() => {
    if (localRates.length >= 2) {
      setCompPlanA(localRates[0].id);
      setCompPlanB(localRates[1].id);
    }
  }, [localRates]);
  const planA = useMemo(() => rates.find(r => r.id === compPlanA), [rates, compPlanA]);
  const planB = useMemo(() => rates.find(r => r.id === compPlanB), [rates, compPlanB]);
  const handleCalculate = async () => {
    setCalculating(true);
    try {
      const silverRates = localRates
        .filter(r => r.planType === 'Silver')
        .sort((a, b) => a.basePremium2026 - b.basePremium2026);
      const benchmark = silverRates.length > 1 ? silverRates[1].basePremium2026 : silverRates[0]?.basePremium2026 ?? 500;
      const result = await api<SubsidyCalculation>('/api/insurance-calculator', {
        method: 'POST',
        body: JSON.stringify({ income, householdSize, ratingArea, benchmarkPremium: benchmark })
      });
      setCalcResult(result);
    } finally {
      setCalculating(false);
    }
  };
  const handlePrint = () => window.print();
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <TrendingUp className="h-4 w-4" /> Actuarial Intelligence v2.0
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Insurance Navigator</h1>
            <p className="text-muted-foreground max-w-2xl text-lg">
              Pennsylvania's official 2026 rate analysis and subsidy simulator. Decode regulatory filings and compare regional affordability.
            </p>
          </div>
          <div className="flex gap-3 print:hidden">
            <Button variant="outline" className="rounded-full gap-2" onClick={handlePrint}>
              <Printer className="h-4 w-4" /> Print Report
            </Button>
            <Button className="rounded-full gap-2">
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Multi-Factor Calculator */}
          <div className="lg:col-span-4 space-y-6 print:col-span-12">
            <Card className="shadow-soft border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Subsidy Simulator
                </CardTitle>
                <CardDescription>Household-weighted 2026 projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-2">
                  <Label>Region</Label>
                  <select 
                    className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                  >
                    {counties.map(c => (
                      <option key={c.id} value={c.county}>{c.county}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">PA Rating Area {ratingArea}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Household Size</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={householdSize} 
                      onChange={(e) => setHouseholdSize(Number(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>2026 Income ($)</Label>
                    <Input 
                      type="number" 
                      value={income} 
                      onChange={(e) => setIncome(Number(e.target.value))} 
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full rounded-full" disabled={calculating}>
                  {calculating ? "Processing Actuarial Models..." : "Calculate Net Premium"}
                </Button>
                {calcResult && (
                  <div className="mt-4 p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center text-xs text-muted-foreground uppercase font-bold tracking-widest">
                      <span>FPL Status</span>
                      <span>{Math.round(calcResult.fplPercentage)}% of FPL</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Monthly Subsidy</span>
                        <span className="text-lg font-bold text-emerald-600">${calcResult.estimatedCredit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t">
                        <span className="text-sm font-bold">Net Premium</span>
                        <span className="text-2xl font-black text-primary">${calcResult.netPremium.toFixed(2)}</span>
                      </div>
                    </div>
                    {calcResult.incomeCapReached && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 text-[10px] text-emerald-700 font-bold uppercase">
                        <Info className="h-3 w-3" /> Protected by 8.5% ARPA Cap
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="shadow-soft bg-slate-900 text-white border-none overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent pointer-events-none" />
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" /> GLP-1 Cost Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="text-4xl font-black tracking-tighter text-blue-400">+4.2%</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The estimated composite impact of weight-loss pharmaceuticals on 2026 PA premiums.
                </p>
                <Button variant="secondary" className="w-full rounded-full bg-white/10 text-white hover:bg-white/20 border-none" asChild>
                  <a href="#analysis">Read Full Actuarial Memo</a>
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* Right Column: Comparative Tools & Heatmap */}
          <div className="lg:col-span-8 space-y-10">
            {/* Carrier Comparator */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <ArrowLeftRight className="h-6 w-6 text-primary" />
                Plan Comparison Engine
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-soft">
                  <CardHeader className="pb-4">
                    <Label className="mb-2 block">Primary Plan Selection</Label>
                    <select 
                      className="w-full h-9 px-2 rounded-md border text-xs"
                      value={compPlanA}
                      onChange={(e) => setCompPlanA(e.target.value)}
                    >
                      {localRates.map(r => <option key={r.id} value={r.id}>{r.carrier} ({r.planType})</option>)}
                    </select>
                  </CardHeader>
                  {planA && (
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Premium</span>
                        <span className="font-bold">${planA.basePremium2026}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Deductible</span>
                        <span className="font-bold">${planA.avgDeductible}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GLP-1 Drugs</span>
                        <Badge variant={planA.glp1Covered ? "secondary" : "outline"} className="text-[9px]">
                          {planA.glp1Covered ? "COVERED" : "RESTRICTED"}
                        </Badge>
                      </div>
                    </CardContent>
                  )}
                </Card>
                <Card className="shadow-soft">
                  <CardHeader className="pb-4">
                    <Label className="mb-2 block">Comparison Selection</Label>
                    <select 
                      className="w-full h-9 px-2 rounded-md border text-xs"
                      value={compPlanB}
                      onChange={(e) => setCompPlanB(e.target.value)}
                    >
                      {localRates.map(r => <option key={r.id} value={r.id}>{r.carrier} ({r.planType})</option>)}
                    </select>
                  </CardHeader>
                  {planB && (
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Premium</span>
                        <span className="font-bold">${planB.basePremium2026}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Deductible</span>
                        <span className="font-bold">${planB.avgDeductible}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GLP-1 Drugs</span>
                        <Badge variant={planB.glp1Covered ? "secondary" : "outline"} className="text-[9px]">
                          {planB.glp1Covered ? "COVERED" : "RESTRICTED"}
                        </Badge>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </section>
            {/* Affordability Heatmap */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <Map className="h-6 w-6 text-primary" />
                Statewide Affordability Heatmap
              </h2>
              <Card className="shadow-soft p-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heatmaps}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                      <XAxis 
                        dataKey="ratingArea" 
                        label={{ value: 'PA Rating Area', position: 'insideBottom', offset: -5 }} 
                        fontSize={12}
                      />
                      <YAxis 
                        label={{ value: 'Avg Silver Premium ($)', angle: -90, position: 'insideLeft' }} 
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Avg Premium']}
                      />
                      <Bar dataKey="avgPremium" radius={[6, 6, 0, 0]}>
                        {heatmaps.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.ratingArea === ratingArea ? '#0f172a' : '#0ea5e9'} 
                            fillOpacity={0.8}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
                  {heatmaps.map(h => (
                    <div key={h.ratingArea} className={cn(
                      "p-2 rounded-lg border text-center transition-all",
                      h.ratingArea === ratingArea ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card"
                    )}>
                      <span className="text-[8px] font-bold uppercase block opacity-60">Area {h.ratingArea}</span>
                      <span className="text-sm font-black">${Math.round(h.avgPremium)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
            {/* PID Filings Search */}
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                PID Regulatory Search
              </h2>
              <Card className="shadow-soft">
                <CardHeader>
                  <div className="relative group max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search Carrier or Filing ID (e.g. Highmark)..." 
                      className="pl-10 h-11 bg-muted/50 rounded-full"
                      value={filingSearch}
                      onChange={(e) => setFilingSearch(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                  {filings.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground italic">No regulatory filings match your search.</div>
                  ) : filings.map(f => (
                    <div key={f.id} className="p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors flex justify-between items-center group">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{f.carrier}</span>
                          <Badge variant="outline" className="text-[9px] uppercase font-mono">{f.filingNumber}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-md">{f.description}</p>
                      </div>
                      <div className="text-right">
                         <Badge 
                           className={cn(
                             "text-[9px] uppercase",
                             f.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                             f.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                           )}
                         >
                           {f.status}
                         </Badge>
                         <p className="text-[10px] text-muted-foreground mt-1">{f.dateSubmitted}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
            {/* Wiki Link Section */}
            {actuarialArticle && (
              <section id="analysis" className="pt-8">
                <Card className="shadow-soft border-primary/20 ring-1 ring-primary/10 overflow-hidden">
                  <div className="bg-primary px-6 py-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-widest">Actuarial Explainer</span>
                    <Badge className="bg-white/20 text-white border-none text-[9px]">v2026.1</Badge>
                  </div>
                  <CardContent className="pt-8 space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-display font-bold">{actuarialArticle.title}</h3>
                        <div className="bg-muted/50 p-4 rounded-xl flex gap-3 border border-border">
                          <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                          <p className="text-sm italic text-muted-foreground leading-relaxed">
                            {actuarialArticle.actuarialSection?.analysis}
                          </p>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                          {actuarialArticle.content.split('\n').slice(0, 5).map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                        <Button variant="link" className="text-primary p-0 h-auto font-bold" asChild>
                          <a href="/wiki">Access full morbidity research & statutory citations →</a>
                        </Button>
                      </div>
                      <div className="w-full md:w-48 space-y-4">
                        <div className="p-4 rounded-2xl bg-muted/30 border text-center">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Impact Score</span>
                          <div className="text-3xl font-black text-primary">{actuarialArticle.actuarialSection?.impactScore}/10</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-blue-50 border-blue-100 border text-center">
                          <span className="text-[10px] font-bold text-blue-700 uppercase">GLP-1 Factor</span>
                          <div className="text-sm font-bold text-blue-900 mt-1">High Influence</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}