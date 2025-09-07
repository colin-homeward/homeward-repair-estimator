export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('Test API called');
    console.log('Environment variables:', {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV
    });

    res.json({ 
      success: true, 
      message: 'Test API is working',
      timestamp: new Date().toISOString(),
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    });

  } catch (error) {
    console.error('Test API error:', error);
    res.status(500).json({ 
      error: 'Test API error',
      details: error.message
    });
  }
}
