import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { CountyMapping, HealthRate, SubsidyCalculation, WikiArticle } from '@shared/types';
import { Search, Calculator, Map, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
export function InsuranceNavigatorPage() {
  const [income, setIncome] = useState<number>(45000);
  const [selectedCounty, setSelectedCounty] = useState<string>('Allegheny');
  const [calculating, setCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<SubsidyCalculation | null>(null);
  // Queries
  const { data: countiesData } = useQuery({
    queryKey: ['insurance-counties'],
    queryFn: () => api<{ items: CountyMapping[] }>('/api/insurance-counties')
  });
  const { data: ratesData } = useQuery({
    queryKey: ['insurance-rates'],
    queryFn: () => api<{ items: HealthRate[] }>('/api/insurance-rates')
  });
  const { data: wikiData } = useQuery({
    queryKey: ['wiki-articles'],
    queryFn: () => api<{ items: WikiArticle[] }>('/api/wiki-articles')
  });
  const counties = countiesData?.items ?? [];
  const rates = ratesData?.items ?? [];
  const actuarialArticle = wikiData?.items.find(a => a.id === 'insurance-actuarial-2026');
  const ratingArea = useMemo(() => {
    return counties.find(c => c.county === selectedCounty)?.ratingArea ?? 1;
  }, [selectedCounty, counties]);
  const localRates = useMemo(() => {
    return rates.filter(r => r.ratingArea === ratingArea);
  }, [ratingArea, rates]);
  const handleCalculate = async () => {
    setCalculating(true);
    try {
      // Find benchmark (usually 2nd lowest silver)
      const silverRates = localRates.filter(r => r.planType === 'Silver').sort((a, b) => a.basePremium2026 - b.basePremium2026);
      const benchmark = silverRates.length > 1 ? silverRates[1].basePremium2026 : silverRates[0]?.basePremium2026 ?? 500;
      const result = await api<SubsidyCalculation>('/api/insurance-calculator', {
        method: 'POST',
        body: JSON.stringify({ income, ratingArea, benchmarkPremium: benchmark })
      });
      setCalcResult(result);
    } finally {
      setCalculating(false);
    }
  };
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <TrendingUp className="h-4 w-4" /> 2026 Strategy
          </div>
          <h1 className="text-4xl font-display font-bold">Insurance Navigator</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Analyze Pennsylvania's 2026 health insurance landscape. Estimate subsidies, compare regional rating areas, and understand actuarial cost drivers.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Calculator */}
          <Card className="lg:col-span-1 shadow-soft h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Premium Estimator
              </CardTitle>
              <CardDescription>Based on 2026 PA Rate Filings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>County of Residence</Label>
                <select 
                  className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                >
                  {counties.map(c => (
                    <option key={c.id} value={c.county}>{c.county}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Rating Area {ratingArea}</p>
              </div>
              <div className="space-y-2">
                <Label>Estimated 2026 Household Income</Label>
                <Input 
                  type="number" 
                  value={income} 
                  onChange={(e) => setIncome(Number(e.target.value))} 
                />
                <p className="text-[10px] text-muted-foreground">Approx. {Math.round((income/15060)*100)}% of FPL</p>
              </div>
              <Button onClick={handleCalculate} className="w-full rounded-full" disabled={calculating}>
                {calculating ? "Processing..." : "Calculate Estimate"}
              </Button>
              {calcResult && (
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Monthly Subsidy</span>
                    <span className="text-lg font-bold text-emerald-600">${calcResult.estimatedCredit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Estimated Net Premium</span>
                    <span className="text-xl font-black text-primary">${calcResult.netPremium.toFixed(2)}</span>
                  </div>
                  {calcResult.incomeCapReached && (
                    <Badge variant="secondary" className="w-full justify-center py-1 text-[10px] bg-primary/10 text-primary uppercase">
                      Protected by 8.5% Income Cap
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Center/Right Column: Market Data & Insights */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-soft">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <Map className="h-4 w-4" /> Regional Market Density
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={localRates}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="carrier" fontSize={10} hide />
                          <YAxis fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="basePremium2026" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                   <p className="text-[10px] text-center text-muted-foreground mt-2">Carriers active in Area {ratingArea}</p>
                </CardContent>
              </Card>
              <Card className="shadow-soft bg-blue-600 text-white border-none">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> GLP-1 Impact Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black">+4.2%</div>
                  <p className="text-xs text-blue-100 mt-1">Average contribution of GLP-1 drug spend to 2026 PA premiums.</p>
                  <div className="mt-4 pt-4 border-t border-blue-500/30">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-none">High Influence Rating</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            {actuarialArticle && (
              <Card className="shadow-soft border-primary/20 ring-1 ring-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Actuarial Analysis: 2026 Drivers</CardTitle>
                    <Badge variant="outline" className="bg-primary/5">Verified Actuarial Data</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-xl flex gap-3">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <p className="text-sm italic text-muted-foreground">{actuarialArticle.actuarialSection?.analysis}</p>
                  </div>
                  <article className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {actuarialArticle.content.split('\n').slice(0, 8).join('\n')}
                  </article>
                  <Button variant="ghost" className="text-primary p-0 h-auto hover:bg-transparent hover:underline" asChild>
                    <a href={`/wiki`}>Read full analysis in Library →</a>
                  </Button>
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(area => (
                <div key={area} className={cn(
                  "p-3 rounded-lg border text-center transition-all",
                  area === ratingArea ? "bg-primary text-primary-foreground border-primary shadow-md scale-105" : "bg-card hover:bg-muted"
                )}>
                  <span className="text-[10px] font-bold uppercase block opacity-70">Area</span>
                  <span className="text-xl font-black">{area}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center text-muted-foreground italic uppercase tracking-widest">Pennsylvania Rating Area Map Reference</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}