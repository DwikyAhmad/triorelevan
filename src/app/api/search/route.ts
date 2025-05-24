import { NextRequest, NextResponse } from 'next/server';

interface Document {
  rank: number;
  id: string;
  score: number;
  title: string;
  url: string;
  snippet: string;
  timestamp?: string;
  highlights: Highlights;
}

interface Highlights { 
  main_text: string;
  title: string;
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const kParam = searchParams.get('k');
    const k = kParam ? parseInt(kParam, 10) : 5;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    const baseUrl = process.env.SEARCH_API_BASE_URL || 'http://127.0.0.1:8000';
    const results = await fetch(`${baseUrl}/search?q=${query}&k=${k}`);

    const searchResponse: SearchResponse = await results.json();
      
    return NextResponse.json(searchResponse);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}