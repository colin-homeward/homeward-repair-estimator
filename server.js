const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// OpenAI configuration
const OpenAI = require('openai');

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

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

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

    res.json({ response });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
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

    res.status(500).json({ 
      error: 'Sorry, I encountered an error processing your request. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Homeward Repair Estimator API'
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong! Please try again later.' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Homeward Repair Estimator server running on port ${PORT}`);
  console.log(`📱 Open http://localhost:${PORT} to view the app`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables');
    console.warn('   Please set your OpenAI API key in a .env file');
  }
});
