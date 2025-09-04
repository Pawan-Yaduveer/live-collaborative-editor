import Groq from 'groq-sdk';

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

export interface AgentResponse {
  text: string;
  searchResults?: SearchResult[];
  shouldInsert?: boolean;
}

export class WebSearchAgent {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string): Promise<SearchResult[]> {
    try {
      // Using Serper API for web search
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: query,
          num: 5,
        }),
      });

      if (!response.ok) {
        throw new Error('Search API request failed');
      }

      const data = await response.json();
      
      return data.organic?.map((result: { title: string; link: string; snippet: string; displayedLink?: string }) => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        source: result.displayedLink || 'Unknown',
      })) || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async processQuery(query: string): Promise<AgentResponse> {
    try {
      // First, perform web search
      const searchResults = await this.search(query);
      
      // Create context from search results
      const searchContext = searchResults
        .map(result => `${result.title}: ${result.snippet}`)
        .join('\n\n');

      // Generate response using Groq
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });

      const completion = await groq.chat.completions.create({
        messages: [{
          role: "user",
          content: `Based on the following search results, provide a comprehensive answer to the user's query: "${query}"

Search Results:
${searchContext}

Please provide a well-structured response that:
1. Directly answers the user's question
2. Incorporates relevant information from the search results
3. Cites sources when appropriate
4. Is ready to be inserted into a document

If the response should be inserted into the document, end with [INSERT] tag.`
        }],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 1000,
      });

      const result = { text: completion.choices[0]?.message?.content || 'No response generated' };

      return {
        text: result.text,
        searchResults,
        shouldInsert: result.text.includes('[INSERT]'),
      };
    } catch (error) {
      console.error('Agent processing error:', error);
      return {
        text: 'Sorry, I encountered an error while processing your request.',
        searchResults: [],
        shouldInsert: false,
      };
    }
  }
}

export const createAgent = (apiKey: string) => new WebSearchAgent(apiKey);
