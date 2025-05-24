"use client";

import { useState } from "react";
import { Search, Clock, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface SearchResult {
  id: string;
  title: string;
  url: string;
  snippet: string;
  score: number;
  timestamp?: string;
}

interface SearchResponse {
  results: SearchResult[];
  summary: string;
  totalResults: number;
  queryTime: number;
}

export default function SearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to call the search API
  const performSearch = async (searchQuery: string, k: number = 10): Promise<SearchResponse> => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchQuery,
        k: k
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await performSearch(query);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">TrioRelevan</h1>
            <div className="text-sm text-muted-foreground">
              Advanced Information Retrieval System
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your search query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-2 text-base"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !query.trim()}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Separator />
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && results && (
          <div className="space-y-6">
            {/* Search Info */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>About {results.totalResults} results</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>({results.queryTime} seconds)</span>
              </div>
            </div>

            {/* Summary Card */}
            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
                <CardDescription>AI-generated summary based on search results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{results.summary}</p>
              </CardContent>
            </Card>

            <Separator />

            {/* Search Results */}
            <div className="space-y-4">
              {results.results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-primary hover:underline cursor-pointer">
                          <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            {result.title}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </CardTitle>
                        <CardDescription className="text-sm text-green-600 mt-1">
                          {result.url}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {formatScore(result.score)}% match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {result.snippet}
                    </p>
                    {result.timestamp && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{result.timestamp}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && hasSearched && !results && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground">No results found. Try a different search query.</p>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!hasSearched && !loading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Start Your Search</h2>
            <p className="text-muted-foreground">
              Enter keywords to find relevant documents from our collection
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>TrioRelevan - Information Retrieval System</p>
            <p className="mt-1">Built with Next.js, TypeScript, and shadcn/ui</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 