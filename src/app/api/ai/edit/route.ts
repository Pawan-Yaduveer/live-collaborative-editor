import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { text, action } = await req.json();
    
    // Check if API key exists
    const apiKey = process.env.GROQ_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      return Response.json(
        { error: 'GROQ_API_KEY not found in environment variables' },
        { status: 500 }
      );
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    let prompt = '';
    
    switch (action) {
      case 'shorten':
        prompt = `Please shorten the following text while keeping the main points: "${text}"`;
        break;
      case 'expand':
        prompt = `Please expand the following text with more details and examples: "${text}"`;
        break;
      case 'convert_to_table':
        prompt = `Convert the following text into a well-formatted table: "${text}"`;
        break;
      case 'improve_style':
        prompt = `Improve the writing style and flow of the following text: "${text}"`;
        break;
      case 'general_edit':
        prompt = `Please edit and improve the following text: "${text}"`;
        break;
      default:
        prompt = `Please improve the following text: "${text}"`;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    const suggestion = completion.choices[0]?.message?.content || text;

    return Response.json({ 
      suggestion,
      original: text,
      action 
    });
  } catch (error) {
    console.error('Error generating AI edit:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    
    return Response.json(
      { error: 'Failed to generate AI suggestion. Please check your API key.' },
      { status: 500 }
    );
  }
}
