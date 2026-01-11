import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WIKI_ARTICLES } from '@/lib/mock-wiki-data';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Bookmark, Share2, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Link } from 'react-router-dom';
import { UserBookmark } from '@shared/types';
export function WikiPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(WIKI_ARTICLES[0].id);
  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api<{ items: UserBookmark[] }>('/api/bookmarks')
  });
  const bookmarks = bookmarksData?.items || [];
  const isBookmarked = (articleId: string) => bookmarks.some(b => b.articleId === articleId);
  const toggleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      if (isBookmarked(articleId)) {
        return api(`/api/bookmarks/${articleId}`, { method: 'DELETE' });
      } else {
        const article = WIKI_ARTICLES.find(a => a.id === articleId);
        return api('/api/bookmarks', { 
          method: 'POST', 
          body: JSON.stringify({ 
            articleId, 
            articleTitle: article?.title, 
            category: article?.category 
          }) 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      toast.success("Bookmarks updated");
    }
  });
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
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Scale className="h-4 w-4" /> Knowledge Base
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Patient Rights Library</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search legal topics..."
                className="pl-10 h-11 bg-muted/50"
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
                    "flex flex-col items-start p-4 rounded-xl border transition-all",
                    selectedId === article.id ? "bg-primary text-primary-foreground shadow-lg" : "bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Badge variant={selectedId === article.id ? "secondary" : "outline"} className="text-[9px]">
                      {article.category}
                    </Badge>
                    {isBookmarked(article.id) && <Bookmark className="h-3 w-3 fill-current" />}
                  </div>
                  <span className="font-bold text-sm leading-tight">{article.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8">
            <Card className="shadow-soft ring-1 ring-border">
              <CardHeader className="border-b bg-muted/20 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="px-3 py-1 uppercase">{activeArticle.category}</Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="rounded-full text-xs gap-1.5">
                      <Link to={`/wiki/${activeArticle.id}/provenance`}><History className="h-3.5 w-3.5" /> Provenance</Link>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full" onClick={() => toggleMutation.mutate(activeArticle.id)}>
                      <Bookmark className={cn("h-4 w-4", isBookmarked(activeArticle.id) && "fill-primary text-primary")} />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <CardTitle className="text-3xl font-display font-bold">{activeArticle.title}</CardTitle>
                <CardDescription className="text-lg italic">{activeArticle.summary}</CardDescription>
              </CardHeader>
              <CardContent className="pt-10 px-8 pb-16">
                <article className="prose dark:prose-invert">
                  {activeArticle.content.split('\n').map((line, i) => {
                    if (!line.trim()) return null;
                    if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold mt-6 mb-2">{line.replace('### ', '')}</h3>;
                    return <p key={i} className="mb-4 text-muted-foreground leading-relaxed">{line}</p>;
                  })}
                </article>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}