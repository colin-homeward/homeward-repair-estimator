import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the repair estimator
const SYSTEM_PROMPT = `You are a professional home repair cost estimator. Your job is to provide accurate, helpful estimates for home repair projects.

Guidelines:
1. Always provide cost estimates in USD
2. Break down costs into materials and labor when possible
3. Consider regional variations (mention this if relevant)
4. Include any necessary permits or additional costs
5. Suggest DIY vs professional options when appropriate
6. Be encouraging but realistic about costs
7. Ask clarifying questions if the repair description is vague
8. Provide safety warnings for dangerous repairs
9. Keep responses conversational and helpful
10. If you can't provide an accurate estimate, explain why and suggest next steps

Example response format:
"Based on your description, here's what I estimate for [repair type]:

**Materials:** $X - $Y
**Labor:** $X - $Y (if professional)
**Total Estimate:** $X - $Y

**Additional Considerations:**
- [Any permits needed]
- [Safety considerations]
- [DIY vs Professional recommendation]

**Next Steps:**
- [Suggestions for getting more accurate quotes]

Would you like me to break down any specific part of this estimate?"`;

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
