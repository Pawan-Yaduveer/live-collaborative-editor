import { createAgent } from '@/lib/agent';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    if (!query) {
      return Response.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'Search API key not configured' },
        { status: 500 }
      );
    }

    const agent = createAgent(apiKey);
    const response = await agent.processQuery(query);

    return Response.json(response);
  } catch (error) {
    console.error('Agent search error:', error);
    return Response.json(
      { error: 'Failed to process search request' },
      { status: 500 }
    );
  }
}
