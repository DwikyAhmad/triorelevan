# TrioRelevan - Information Retrieval System

A modern, responsive frontend for a search engine built with Next.js, TypeScript, and shadcn/ui components. This application provides a Google-like search interface that displays search results with AI-generated summaries.

## Features

- 🔍 **Clean Search Interface**: Google-inspired search bar with real-time input
- 📊 **Search Results Display**: Shows top-k documents with relevance scores
- 🤖 **AI-Generated Summaries**: Displays contextual summaries based on search results
- ⚡ **Loading States**: Skeleton loaders for better user experience
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark Mode Support**: Automatic dark/light theme switching

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Fonts**: Plus Jakarta Sans

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd triorelevan
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # Search API endpoint
│   ├── globals.css               # Global styles and CSS variables
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   └── separator.tsx
│   └── search-interface.tsx      # Main search interface component
└── lib/
    └── utils.ts                  # Utility functions
```

## API Integration

The frontend is designed to work with a backend search engine. Currently, it uses mock data for demonstration purposes.

### Search API Endpoint

**POST** `/api/search`

**Request Body:**
```json
{
  "query": "search terms",
  "k": 10
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "1",
      "title": "Document Title",
      "url": "https://example.com/doc1",
      "snippet": "Document excerpt...",
      "score": 0.95,
      "timestamp": "2024-01-15"
    }
  ],
  "summary": "AI-generated summary of search results...",
  "totalResults": 5,
  "queryTime": 0.15
}
```

### Connecting to Your Backend

To connect to your actual search engine backend:

1. Open `src/app/api/search/route.ts`
2. Replace the mock data section with your backend API call:

```typescript
// Replace this section in route.ts
const response = await fetch('your-backend-url/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, k })
});

const data = await response.json();
return NextResponse.json(data);
```

## Customization

### Color Scheme

The application uses a professional blue and white color palette. Colors are defined in `src/app/globals.css` using CSS custom properties:

- **Background**: Clean white/dark blue backgrounds
- **Primary**: Professional blue (#3b82f6) for interactive elements
- **Secondary**: Light blue tones for subtle backgrounds
- **Accent**: Various blue shades for highlighting
- **Foreground**: Dark blue text for excellent readability

### Components

All UI components are built with shadcn/ui and can be customized:

- **Search Bar**: Modify `src/components/search-interface.tsx`
- **Result Cards**: Customize the result display layout
- **Loading States**: Adjust skeleton components
- **Summary Section**: Modify the AI summary presentation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Docker**

For Vercel deployment:
```bash
npm run build
vercel --prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
