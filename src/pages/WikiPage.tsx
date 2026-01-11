import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WIKI_ARTICLES } from '@/lib/mock-wiki-data';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
export function WikiPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(WIKI_ARTICLES[0].id);
  const filteredArticles = useMemo(() => {
    return WIKI_ARTICLES.filter(a => 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.summary.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
  const activeArticle = useMemo(() => 
    WIKI_ARTICLES.find(a => a.id === selectedId) || WIKI_ARTICLES[0],
    [selectedId]
  );
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-display font-bold tracking-tight">Patient Rights Library</h1>
          <p className="text-muted-foreground">Search and explore Pennsylvania medical statutes and regulations.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search legal topics..." 
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              {filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setSelectedId(article.id)}
                  className={cn(
                    "flex flex-col items-start text-left p-3 rounded-lg border transition-all hover:bg-accent",
                    selectedId === article.id ? "bg-accent border-primary/50 ring-1 ring-primary/20" : "bg-card"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Badge variant="secondary" className="text-[10px] uppercase">{article.category}</Badge>
                    <ChevronRight className={cn("h-4 w-4 transition-transform", selectedId === article.id && "rotate-90")} />
                  </div>
                  <span className="font-semibold text-sm">{article.title}</span>
                </button>
              ))}
              {filteredArticles.length === 0 && (
                <div className="text-center py-10 border rounded-lg border-dashed">
                  <p className="text-sm text-muted-foreground">No matching articles found.</p>
                </div>
              )}
            </div>
          </div>
          {/* Content Area */}
          <div className="lg:col-span-8">
            <Card className="min-h-[500px]">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Rights Wiki</span>
                    <span>/</span>
                    <span>{activeArticle.category}</span>
                  </div>
                  <CardTitle className="text-2xl font-display">{activeArticle.title}</CardTitle>
                  <CardDescription className="text-base text-foreground/80">{activeArticle.summary}</CardDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">{activeArticle.statuteReference}</Badge>
                    <span className="text-[10px] text-muted-foreground uppercase">Last Verified: {activeArticle.lastUpdated}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold">
                  {activeArticle.content.split('\n').map((line, i) => {
                    if (line.startsWith('###')) return <h3 key={i} className="text-lg mt-6 mb-2">{line.replace('### ', '')}</h3>;
                    if (line.startsWith('**')) return <p key={i} className="mb-4"><strong>{line.replaceAll('**', '')}</strong></p>;
                    return <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{line}</p>;
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}