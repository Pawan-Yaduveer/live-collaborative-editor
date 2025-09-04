import Groq from 'groq-sdk';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: 'GROQ_API_KEY not found in environment variables' },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    // ✅ Strip unsupported fields
    const cleanedMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    const completion = await groq.chat.completions.create({
      messages: cleanedMessages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    const content =
      completion.choices[0]?.message?.content ||
      'Sorry, I could not process your request.';

    return Response.json({ content });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process chat request. Please check your API payload.' },
      { status: 500 }
    );
  }
}
