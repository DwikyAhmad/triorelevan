import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
  try {
    const { query, k = 10 } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // TODO: Replace this with actual backend search engine API call
    // Example: const response = await fetch('your-backend-url/search', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query, k })
    // });

    // Mock response for now
    const mockResults: SearchResult[] = [
      {
        id: "1",
        title: "Introduction to Information Retrieval Systems",
        url: "https://example.com/article1",
        snippet: "Information retrieval is the activity of obtaining information system resources that are relevant to an information need from a collection of those resources...",
        score: 0.95,
        timestamp: "2024-01-15"
      },
      {
        id: "2", 
        title: "Modern Search Engine Algorithms",
        url: "https://example.com/article2",
        snippet: "Search engines use complex algorithms to rank documents based on relevance, popularity, and user intent. The most famous algorithm is PageRank...",
        score: 0.89,
        timestamp: "2024-01-10"
      },
      {
        id: "3",
        title: "Vector Space Models in IR",
        url: "https://example.com/article3", 
        snippet: "Vector space models represent documents and queries as vectors in a multi-dimensional space. This allows for computing similarity using cosine similarity...",
        score: 0.82,
        timestamp: "2024-01-08"
      },
      {
        id: "4",
        title: "Boolean Retrieval and Inverted Indexes",
        url: "https://example.com/article4",
        snippet: "Boolean retrieval is one of the simplest forms of information retrieval where documents are retrieved based on boolean expressions...",
        score: 0.76,
        timestamp: "2024-01-05"
      },
      {
        id: "5",
        title: "Evaluation Metrics for Search Systems",
        url: "https://example.com/article5",
        snippet: "Common evaluation metrics include precision, recall, F1-score, and more advanced metrics like NDCG and MAP for ranking evaluation...",
        score: 0.71,
        timestamp: "2024-01-03"
      }
    ].slice(0, k);

    const queryTime = (Date.now() - startTime) / 1000;

    const searchResponse: SearchResponse = {
      results: mockResults,
      summary: `Based on the search results for "${query}", the documents primarily discuss information retrieval systems, search algorithms, and evaluation methods. The top results focus on fundamental concepts like vector space models, boolean retrieval, and modern search engine technologies. These resources provide comprehensive coverage of both theoretical foundations and practical implementations in information retrieval.`,
      totalResults: mockResults.length,
      queryTime
    };

    return NextResponse.json(searchResponse);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST request.' },
    { status: 405 }
  );
} 