import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, FileSearch, ArrowRight, CheckCircle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
export function HomePage() {
  return (
    <AppLayout container={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Scale className="h-3 w-3" />
              Empowering PA Patients
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-balance">
              Your Health Rights, <span className="text-primary italic">Decoded.</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              A comprehensive digital legal aid platform for Pennsylvania patients. Navigate the MCARE Act, Act 169, and more with confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="h-12 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                <Link to="/tool">
                  Analyze My Case <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-lg font-semibold rounded-full">
                <Link to="/wiki">Explore Rights Wiki</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-soft hover:translate-y-[-4px] transition-transform duration-300">
              <CardContent className="pt-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-bold">Rights Library</h3>
                <p className="text-muted-foreground text-sm">
                  Searchable wiki of PA specific medical laws, fees, and privacy protections presented clearly.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-soft hover:translate-y-[-4px] transition-transform duration-300">
              <CardContent className="pt-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <FileSearch className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-bold">Forensic Analyzer</h3>
                <p className="text-muted-foreground text-sm">
                  Input your case dates to automatically flag violations of statutory deadlines and patient rights.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-soft hover:translate-y-[-4px] transition-transform duration-300">
              <CardContent className="pt-8 flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-display font-bold">Legal Evidence</h3>
                <p className="text-muted-foreground text-sm">
                  Build a structured chronology of events to support your communications with providers or counsel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Quick Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-display font-bold">Did you know?</h2>
              <div className="space-y-4">
                {[
                  "PA hospitals must provide records within 30 days of request.",
                  "Surprise balance billing is illegal for emergency services in PA.",
                  "You have a right to a Good Faith Estimate before most procedures.",
                  "Serious events must be reported to patients within 7 days."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" variant="secondary" asChild className="mt-4">
                <Link to="/wiki">Learn more in the Wiki</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl bg-slate-900 overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Scale className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                      <p className="text-white/60 font-mono text-sm tracking-widest uppercase">Statutory Data Visualization</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}