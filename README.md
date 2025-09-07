# Homeward Repair Estimator

An AI-powered chat widget that provides instant repair cost estimates for home maintenance projects.

## Features

- 🤖 AI-powered repair cost estimation using OpenAI GPT-4
- 💬 Interactive chat interface
- 📱 Mobile-responsive design
- 🔧 Embeddable widget for any website
- ⚡ Real-time cost estimates
- 🎯 Accurate pricing based on current market data

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Visit `http://localhost:3000` to see the demo.

## Development

For development with auto-restart:
```bash
npm run dev
```

## Embedding the Widget

To embed the chat widget on your own website:

1. **Include the widget script:**
   ```html
   <script src="https://your-domain.com/chat-widget.js" 
           data-api-endpoint="https://your-domain.com/api/chat"
           data-company-name="Your Company Name"
           data-welcome-message="Your welcome message"></script>
   ```

2. **Configure the widget:**
   - `data-api-endpoint`: URL to your chat API endpoint
   - `data-company-name`: Your company name (appears in chat header)
   - `data-welcome-message`: Custom welcome message

## API Endpoints

### POST /api/chat
Send a message to the repair estimator.

**Request:**
```json
{
  "message": "I need to fix a leaky faucet in my kitchen"
}
```

**Response:**
```json
{
  "response": "Based on your description, here's what I estimate for fixing a leaky faucet:\n\n**Materials:** $15 - $50\n**Labor:** $75 - $150 (if professional)\n**Total Estimate:** $90 - $200\n\n**Additional Considerations:**\n- May need replacement parts (O-rings, washers)\n- Consider if it's a simple fix or needs professional attention\n\n**Next Steps:**\n- Try tightening connections first\n- If that doesn't work, consider calling a plumber\n\nWould you like me to break down any specific part of this estimate?"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Homeward Repair Estimator API"
}
```

## Deployment

### Option 1: Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Option 2: Heroku
1. Create a Heroku app
2. Set environment variables: `heroku config:set OPENAI_API_KEY=your_key`
3. Deploy: `git push heroku main`

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard

### Option 4: DigitalOcean App Platform
1. Connect your repository
2. Set environment variables
3. Deploy

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Customization

### Widget Styling
The widget uses CSS custom properties that can be overridden:

```css
:root {
  --homeward-primary-color: #667eea;
  --homeward-secondary-color: #764ba2;
  --homeward-border-radius: 16px;
  --homeward-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### AI Behavior
Modify the `SYSTEM_PROMPT` in `server.js` to change how the AI responds to repair requests.

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, please open an issue on GitHub or contact support.
