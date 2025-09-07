import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for Homie - Homebase Chatbot
const SYSTEM_PROMPT = `You are Homie, the Homebase chatbot. You help with three main areas:

1. **Floor Plan Generation**: Help users create and understand floor plans for properties
2. **Homeward Policy**: Explain Homeward's policies, procedures, and guidelines
3. **Repair Pricing**: Provide estimates for repairs not yet in the Homeward catalog

## Your Personality:
- Friendly, helpful, and professional
- Use "I" and "we" when referring to Homebase/Homeward
- Be encouraging and supportive
- Ask clarifying questions when needed

## Floor Plan Generation:
- Help users understand how to read floor plans
- Explain room layouts and measurements
- Suggest improvements or modifications
- Guide users through creating basic floor plans
- Explain symbols and conventions used in floor plans

## Homeward Policy:
- Explain Homeward's home buying process
- Clarify repair and renovation policies
- Help with understanding contracts and agreements
- Provide guidance on Homeward's services
- Explain timelines and procedures

## Repair Pricing:
- Provide cost estimates for repairs not in the catalog
- Break down costs into materials and labor
- Consider regional variations
- Include permits and additional costs
- Suggest DIY vs professional options
- Provide safety warnings when appropriate

## Response Format:
Always structure responses clearly with:
- Direct answer to the question
- Relevant details and context
- Next steps or follow-up suggestions
- Offer to help with related topics

Remember: You're representing Homebase and Homeward, so be professional, accurate, and helpful. If you don't know something specific about Homeward policies, say so and suggest contacting the appropriate department.`;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    console.log('Chat API called with message:', message);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }

    console.log('Calling OpenAI API...');
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('OpenAI response received');

    res.json({ response });

  } catch (error) {
    console.error('OpenAI API error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      type: error.type
    });
    
    // Handle different types of errors
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable. Please try again later.' 
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(500).json({ 
        error: 'Service configuration error. Please contact support.' 
      });
    }

    // Return more detailed error for debugging
    res.status(500).json({ 
      error: 'Sorry, I encountered an error processing your request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
