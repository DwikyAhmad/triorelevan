"use client";

import { useState } from "react";
import { Search, Clock, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Document {
  rank: number;
  id: string;
  score: number;
  title: string;
  url: string;
  snippet: string;
  timestamp?: string;
  highlights: {
    main_text: string;
    title: string;
  };
}

interface SearchResult {
  total_found: number;
  returned_count: number;
  k_requested: number;
  documents: Document[];
}

interface Query {
  original: string;
  expanded_terms: string[];
  final_search_query: string;
}

interface RagAnswer {
  answer: string;
  confidence: string;
}

interface SearchResponse {
  query: Query;
  search_results: SearchResult;
  rag_answer: RagAnswer;
}

export default function SearchInterface() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Function to call the search API
  const performSearch = async (searchQuery: string, k: number = 10): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams({
      q: searchQuery,
      k: k.toString()
    });
    
    const response = await fetch(`/api/search?${searchParams.toString()}`, {
      method: 'GET',
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

  // Helper function to safely render HTML content
  const renderHighlightedText = (text: string) => {
    return { __html: text };
  };

  // Improved function to format text with bullet points and numbered lists
  const formatTextWithLists = (text: string) => {
    if (!text) return '';

    // Split text into lines for better processing
    const lines = text.split('\n');
    const result: string[] = [];
    let inList = false;
    let currentParagraph = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if line starts with a number followed by a period
      const numberedListMatch = line.match(/^(\d+)\.\s+(.+)/);
      
      // Check if line starts with bullet points
      const bulletListMatch = line.match(/^[•\-\*]\s+(.+)/);
      
      if (numberedListMatch) {
        // If we were building a paragraph, close it
        if (currentParagraph) {
          result.push(`<p class="mb-4">${currentParagraph.trim()}</p>`);
          currentParagraph = '';
        }
        
        // Start a list if not already in one
        if (!inList) {
          result.push('<ul class="list-decimal list-inside space-y-3 my-4 pl-4">');
          inList = true;
        }
        
        // Add list item (without the number since <ol> handles it)
        result.push(`<li class="text-sm leading-relaxed">${numberedListMatch[2]}</li>`);
        
      } else if (bulletListMatch) {
        // If we were building a paragraph, close it
        if (currentParagraph) {
          result.push(`<p class="mb-4">${currentParagraph.trim()}</p>`);
          currentParagraph = '';
        }
        
        // Close numbered list if we were in one, start unordered list
        if (inList) {
          result.push('</ul>');
        }
        if (!inList || result[result.length - 1] === '</ol>') {
          result.push('<ul class="list-disc list-inside space-y-3 my-4 pl-4">');
        }
        inList = true;
        
        result.push(`<li class="text-sm leading-relaxed">${bulletListMatch[1]}</li>`);
        
      } else if (line === '') {
        // Empty line - if we're in a list, close it
        if (inList) {
          const lastTag = result[result.length - 1];
          if (!lastTag.includes('</ul>') && !lastTag.includes('</ol>')) {
            result.push('</ul>'); // Close the most recent list
          }
          inList = false;
        }
        
        // If we have a paragraph, close it
        if (currentParagraph) {
          result.push(`<p class="mb-4">${currentParagraph.trim()}</p>`);
          currentParagraph = '';
        }
        
      } else {
        // Regular text line
        if (inList) {
          // Close the list
          result.push('</ul>');
          inList = false;
        }
        
        // Add to current paragraph
        if (currentParagraph) {
          currentParagraph += ' ' + line;
        } else {
          currentParagraph = line;
        }
      }
    }
    
    // Handle any remaining content
    if (inList) {
      result.push('</ul>');
    }
    if (currentParagraph) {
      result.push(`<p class="mb-4">${currentParagraph.trim()}</p>`);
    }

    return result.join('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">TrioRelevan</h1>
            <div className="text-sm text-muted-foreground">
              Your Medical Research Assistant
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
              <span>About {results.search_results.total_found} results</span>
            </div>

            {/* Query Info */}
            <Card className="bg-blue-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Query Processing</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 text-xs">
                  <p><span className="font-medium">Original:</span> {results.query.original}</p>
                  <p><span className="font-medium">Expanded terms:</span> {results.query.expanded_terms.join(', ')}</p>
                  <p><span className="font-medium">Final query:</span> {results.query.final_search_query}</p>
                </div>
              </CardContent>
            </Card>

            {/* RAG Answer */}
            <Card className="bg-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">AI Answer</CardTitle>
                <CardDescription>
                  AI-generated answer based on search results 
                  <Badge variant="outline" className="ml-2">
                    {results.rag_answer.confidence} confidence
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none formatted-text"
                  dangerouslySetInnerHTML={{ __html: formatTextWithLists(results.rag_answer.answer) }}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Search Results */}
            <div className="space-y-4">
              {results.search_results.documents.map((document) => (
                <Card key={document.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-primary hover:underline cursor-pointer">
                          <a href={document.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                            <span dangerouslySetInnerHTML={renderHighlightedText(document.title)} />
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </CardTitle>
                        <CardDescription className="text-sm text-green-600 mt-1">
                          {document.url}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-1 ml-2">
                        <Badge variant="secondary">
                          {document.score.toFixed(2)} Score
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Rank #{document.rank}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="text-sm text-muted-foreground leading-relaxed mb-2 search-highlights formatted-text"
                      dangerouslySetInnerHTML={{ __html: formatTextWithLists(document.snippet) }}
                    />
                    <div className="text-xs text-muted-foreground space-y-1 search-highlights">
                      {document.highlights.title && (
                        <div>
                          <span className="font-medium">Title highlights: </span>
                          <span dangerouslySetInnerHTML={renderHighlightedText(document.highlights.title)} />
                        </div>
                      )}
                      {document.highlights.main_text && (
                        <div>
                          <span className="font-medium">Text highlights: </span>
                          <span dangerouslySetInnerHTML={renderHighlightedText(document.highlights.main_text)} />
                        </div>
                      )}
                    </div>
                    {document.timestamp && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        <span>{document.timestamp}</span>
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
            <p className="mt-1">Built by Dwiky, Hilmy, and Catur</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 