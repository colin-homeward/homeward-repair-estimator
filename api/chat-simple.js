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

    // For now, return a mock response to test the flow
    const mockResponse = `Based on your description of "${message}", here's what I estimate:

**Materials:** $25 - $75
**Labor:** $100 - $200 (if professional)
**Total Estimate:** $125 - $275

**Additional Considerations:**
- May need replacement parts (O-rings, washers)
- Consider if it's a simple fix or needs professional attention

**Next Steps:**
- Try tightening connections first
- If that doesn't work, consider calling a plumber

Would you like me to break down any specific part of this estimate?`;

    res.json({ response: mockResponse });

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error processing your request. Please try again.',
      details: error.message
    });
  }
}
