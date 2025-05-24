# TrioRelevan - Information Retrieval System

TrioRelevan is an advanced medical research assistant that provides intelligent search capabilities with AI-generated answers. Built with Next.js and TypeScript, it offers a modern, responsive interface for searching through medical documents and research papers.

## 🚀 Features

- **Intelligent Search**: Advanced search functionality with query expansion and processing
- **AI-Powered Answers**: RAG (Retrieval Augmented Generation) system provides contextual answers
- **Document Ranking**: Sophisticated scoring and ranking system for search results
- **Text Highlighting**: Visual emphasis on search terms in results
- **Responsive Design**: Modern, mobile-friendly interface built with shadcn/ui
- **Real-time Processing**: Fast search with loading states and error handling
- **Medical Focus**: Specialized for medical and health-related research

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, React
- **UI Framework**: shadcn/ui, Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Django
- **Search Engine**: Elastic Search
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A backend search engine API (running on port 8000 for local development)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/triorelevan.git
cd triorelevan
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Search API Configuration
SEARCH_API_BASE_URL=http://127.0.0.1:8000

# For production, set this to your deployed backend URL:
# SEARCH_API_BASE_URL=https://your-backend-api.vercel.app
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SEARCH_API_BASE_URL` | Backend search API URL | `http://127.0.0.1:8000` | No |

### Backend API Requirements

Your backend API should provide a `/search` endpoint that accepts:

- `q` (string): Search query
- `k` (number): Number of results to return

And returns a response in this format:

```json
{
  "query": {
    "original": "diabetes",
    "expanded_terms": ["diabetes", "diabetic", "blood sugar"],
    "final_search_query": "diabetes diabetic blood sugar"
  },
  "search_results": {
    "total_found": 150,
    "returned_count": 10,
    "k_requested": 10,
    "documents": [
      {
        "rank": 1,
        "id": "doc_123",
        "score": 0.95,
        "title": "Understanding Type 2 Diabetes",
        "url": "https://example.com/article",
        "snippet": "Diabetes is a condition...",
        "highlights": {
          "title": "Understanding Type 2 <em>Diabetes</em>",
          "main_text": "<em>Diabetes</em> is a condition..."
        }
      }
    ]
  },
  "rag_answer": {
    "answer": "Diabetes is primarily caused by...",
    "confidence": "high"
  }
}
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `SEARCH_API_BASE_URL` with your production backend URL
4. Deploy

### Deploy Backend

Make sure your backend search API is deployed and accessible. Update the `SEARCH_API_BASE_URL` environment variable accordingly.

## 🎯 Usage

1. **Search**: Enter medical terms or questions in the search box
2. **View Results**: Browse through ranked documents with relevance scores
3. **AI Answers**: Read AI-generated answers based on search results
4. **Query Processing**: See how your query was expanded and processed
5. **Explore Documents**: Click on document titles to view full articles

## 📁 Project Structure

```
triorelevan/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── search/
│   │   │       └── route.ts          # Search API endpoint
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   └── page.tsx                 # Home page
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   └── search-interface.tsx     # Main search component
│   └── lib/
│       └── utils.ts                 # Utility functions
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── next.config.js                   # Next.js configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── package.json                     # Dependencies and scripts
```

## 🎨 Features in Detail

### Search Interface
- Clean, Google-like search experience
- Real-time search suggestions
- Loading states and error handling
- Responsive design for all devices

### AI Answers
- Context-aware responses using RAG
- Confidence scoring
- Formatted text with bullet points
- Source attribution

### Document Results
- Relevance scoring and ranking
- Text highlighting for search terms
- Document metadata display
- External link handling

### Query Processing
- Query expansion and optimization
- Search term analysis
- Processing transparency

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure your backend API is running
   - Check the `SEARCH_API_BASE_URL` environment variable
   - Verify the backend endpoint returns the expected format

2. **Environment Variables Not Working**
   - Make sure `.env.local` is in the root directory
   - Restart the development server after changing environment variables
   - For Vercel deployment, redeploy after adding environment variables

3. **Search Not Working**
   - Check browser console for errors
   - Verify backend API is accessible
   - Ensure proper CORS configuration on backend

## 👥 Team

Built by **Dwiky**, **Hilmy**, and **Catur** as part of an Information Retrieval System project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**TrioRelevan** - Your Medical Research Assistant 🔬
