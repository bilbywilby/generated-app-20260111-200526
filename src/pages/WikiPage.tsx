import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WIKI_ARTICLES } from '@/lib/mock-wiki-data';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight, BookOpen, Bookmark, Share2, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
export function WikiPage() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(WIKI_ARTICLES[0].id);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
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
  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
    toast.success(bookmarks.includes(id) ? "Bookmark removed" : "Article bookmarked");
  };
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Scale className="h-4 w-4" />
            Legal Knowledge Base
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Patient Rights Library</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A comprehensive guide to Pennsylvania medical statutes, billing protections, and privacy regulations.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Search and Navigation Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search legal topics..."
                className="pl-10 h-11 bg-muted/50 focus:bg-background transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase text-muted-foreground px-2 pt-2">Available Articles</h3>
              {filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setSelectedId(article.id)}
                  className={cn(
                    "group flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-200",
                    selectedId === article.id 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]" 
                      : "bg-card hover:bg-muted/50 border-border"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Badge variant={selectedId === article.id ? "secondary" : "outline"} className="text-[9px] uppercase font-bold tracking-tighter">
                      {article.category}
                    </Badge>
                    {bookmarks.includes(article.id) && <Bookmark className="h-3 w-3 fill-current" />}
                  </div>
                  <span className="font-bold text-sm leading-tight mb-1 group-hover:underline underline-offset-4">{article.title}</span>
                  <p className={cn(
                    "text-[11px] line-clamp-2 leading-relaxed",
                    selectedId === article.id ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {article.summary}
                  </p>
                </button>
              ))}
              {filteredArticles.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed rounded-2xl bg-muted/20">
                  <p className="text-sm text-muted-foreground">No matches for "{search}"</p>
                </div>
              )}
            </div>
          </div>
          {/* Article Viewer Area */}
          <div className="lg:col-span-8">
            <Card className="min-h-[600px] shadow-soft border-none ring-1 ring-border">
              <CardHeader className="border-b bg-muted/20 pb-8">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background px-3 py-1 rounded-full border">
                      <BookOpen className="h-3 w-3" />
                      <span>{activeArticle.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => toggleBookmark(activeArticle.id)}>
                        <Bookmark className={cn("h-4 w-4", bookmarks.includes(activeArticle.id) && "fill-primary text-primary")} />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-3xl font-display font-bold">{activeArticle.title}</CardTitle>
                    <CardDescription className="text-lg text-foreground/80 leading-relaxed font-medium italic">
                      {activeArticle.summary}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-[10px] font-bold text-primary uppercase">Statute</span>
                      <span className="font-mono text-xs font-semibold">{activeArticle.statuteReference}</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Verified: {activeArticle.lastUpdated}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-10 px-8 pb-16">
                <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-loose prose-h3:text-xl prose-h3:text-foreground prose-strong:text-foreground">
                  {activeArticle.content.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    if (line.startsWith('###')) return <h3 key={i}>{line.replace('### ', '')}</h3>;
                    // Fixed using regex for broader environment support
                    let processedLine = line;
                    if (line.includes('**')) {
                       processedLine = line.replace(/\*\*/g, "");
                       return <p key={i} className="font-bold text-foreground mb-4">{processedLine}</p>;
                    }
                    return <p key={i} className="mb-6">{line}</p>;
                  })}
                </article>
              </CardContent>
            </Card>
            <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
              <Scale className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Need Help with this Statute?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use our <Button variant="link" className="p-0 h-auto text-xs font-bold underline">Forensic Timeline Tool</Button> to see if your provider met the deadlines listed in this article.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}