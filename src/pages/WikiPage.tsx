import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Bookmark, Scale, History, Plus, Edit3, Trash2, ShieldCheck, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Link } from 'react-router-dom';
import { UserBookmark, WikiArticle, WikiArticleInput } from '@shared/types';
export function WikiPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<WikiArticle | null>(null);
  // Queries
  const { data: articlesData, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['wiki-articles'],
    queryFn: () => api<{ items: WikiArticle[] }>('/api/wiki-articles')
  });
  const articles = useMemo(() => articlesData?.items || [], [articlesData]);
  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: () => api<{ items: UserBookmark[] }>('/api/bookmarks')
  });
  const bookmarks = useMemo(() => bookmarksData?.items || [], [bookmarksData]);
  // Mutations
  const toggleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const isBookmarked = bookmarks.some(b => b.articleId === articleId);
      if (isBookmarked) {
        const target = bookmarks.find(b => b.articleId === articleId);
        return api(`/api/bookmarks/${target?.id || articleId}`, { method: 'DELETE' });
      } else {
        const article = articles.find(a => a.id === articleId);
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
  const saveArticleMutation = useMutation({
    mutationFn: async (input: WikiArticleInput) => {
      if (editingArticle) {
        return api(`/api/wiki-articles/${editingArticle.id}`, {
          method: 'PUT',
          body: JSON.stringify(input)
        });
      }
      return api('/api/wiki-articles', {
        method: 'POST',
        body: JSON.stringify(input)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wiki-articles'] });
      toast.success(editingArticle ? "Article updated" : "Article created");
      setIsEditorOpen(false);
      setEditingArticle(null);
    }
  });
  const deleteArticleMutation = useMutation({
    mutationFn: (id: string) => api(`/api/wiki-articles/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wiki-articles'] });
      toast.success("Article deleted");
      if (selectedId) setSelectedId(null);
    }
  });
  // Memoized values
  const filteredArticles = useMemo(() => {
    return articles.filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase())
    );
  }, [articles, search]);
  const activeArticle = useMemo(() => {
    if (articles.length === 0) return null;
    if (!selectedId) return articles[0];
    return articles.find(a => a.id === selectedId) || articles[0];
  }, [articles, selectedId]);
  const isBookmarked = (articleId: string) => bookmarks.some(b => b.articleId === articleId);
  const handleEdit = (article: WikiArticle) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };
  if (isLoadingArticles) return <AppLayout><div className="flex justify-center py-20">Loading Knowledge Base...</div></AppLayout>;
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
              <Scale className="h-4 w-4" /> Knowledge Base
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Patient Rights Library</h1>
          </div>
          <Dialog open={isEditorOpen} onOpenChange={(open) => {
            setIsEditorOpen(open);
            if (!open) setEditingArticle(null);
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-full shadow-lg gap-2">
                <Plus className="h-4 w-4" /> New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const input: WikiArticleInput = {
                  title: formData.get('title') as string,
                  category: formData.get('category') as any,
                  summary: formData.get('summary') as string,
                  content: formData.get('content') as string,
                  statuteReference: formData.get('statuteReference') as string,
                };
                saveArticleMutation.mutate(input);
              }} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingArticle?.title} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingArticle?.category || "Access"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Access">Access</SelectItem>
                      <SelectItem value="Privacy">Privacy</SelectItem>
                      <SelectItem value="Billing">Billing</SelectItem>
                      <SelectItem value="Consent">Consent</SelectItem>
                      <SelectItem value="Quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="summary">Brief Summary</Label>
                  <Input id="summary" name="summary" defaultValue={editingArticle?.summary} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="statuteReference">Statute Reference (Optional)</Label>
                  <Input id="statuteReference" name="statuteReference" defaultValue={editingArticle?.statuteReference} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Full Content (Markdown)</Label>
                  <Textarea id="content" name="content" className="min-h-[200px] font-mono text-sm" defaultValue={editingArticle?.content} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={saveArticleMutation.isPending}>
                    {saveArticleMutation.isPending ? "Saving..." : "Save Article"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
              {filteredArticles.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground italic border rounded-xl border-dashed">No articles found.</div>
              ) : filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setSelectedId(article.id)}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-xl border transition-all text-left",
                    (activeArticle?.id === article.id) ? "bg-primary text-primary-foreground shadow-lg" : "bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Badge variant={(activeArticle?.id === article.id) ? "secondary" : "outline"} className="text-[9px]">
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
            {activeArticle ? (
              <Card className="shadow-soft ring-1 ring-border">
                <CardHeader className="border-b bg-muted/20 pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="px-3 py-1 uppercase">{activeArticle.category}</Badge>
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium ml-2">
                        <ShieldCheck className="h-3 w-3" /> Managed by Expert
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEdit(activeArticle)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => {
                        if(confirm("Delete this article?")) deleteArticleMutation.mutate(activeArticle.id);
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild className="rounded-full text-xs gap-1.5 h-8">
                        <Link to={`/wiki/${activeArticle.id}/provenance`}><History className="h-3.5 w-3.5" /> Provenance</Link>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-8 w-8" onClick={() => toggleMutation.mutate(activeArticle.id)}>
                        <Bookmark className={cn("h-4 w-4", isBookmarked(activeArticle.id) && "fill-primary text-primary")} />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-display font-bold">{activeArticle.title}</CardTitle>
                  <CardDescription className="text-lg italic mt-2">{activeArticle.summary}</CardDescription>
                  {activeArticle.statuteReference && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-primary">
                      <Scale className="h-3 w-3" /> {activeArticle.statuteReference}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-10 px-8 pb-16">
                  <article className="prose dark:prose-invert max-w-none">
                    {activeArticle.content.split('\n').map((line, i) => {
                      if (!line.trim()) return <br key={i} />;
                      if (line.startsWith('###')) return <h3 key={i} className="text-xl font-bold mt-8 mb-4 text-foreground border-b pb-1">{line.replace('### ', '')}</h3>;
                      if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-2 text-muted-foreground leading-relaxed">{line.replace('- ', '')}</li>;
                      return <p key={i} className="mb-4 text-muted-foreground leading-relaxed text-balance">{line}</p>;
                    })}
                  </article>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border-2 border-dashed rounded-3xl">
                <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                <p>Select an article to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}