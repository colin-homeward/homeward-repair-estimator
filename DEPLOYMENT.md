# Deployment Guide

## Prerequisites

### Install Node.js
1. **Using Homebrew (recommended for macOS):**
   ```bash
   brew install node
   ```

2. **Or download from nodejs.org:**
   - Visit https://nodejs.org/
   - Download the LTS version
   - Run the installer

3. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:3000`

## Deployment Options

### Option 1: Railway (Recommended)

Railway is perfect for Node.js apps and provides automatic deployments.

1. **Sign up at railway.app**
2. **Connect your GitHub repository**
3. **Set environment variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
4. **Deploy automatically on push**

**Pros:**
- Automatic deployments
- Built-in environment variable management
- Free tier available
- Easy to use

### Option 2: Vercel

Great for frontend + API routes.

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**

**Pros:**
- Excellent for static sites + API
- Great performance
- Easy custom domains

### Option 3: Heroku

Classic platform for Node.js apps.

1. **Install Heroku CLI**
2. **Login and create app:**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 4: DigitalOcean App Platform

1. **Connect your GitHub repository**
2. **Set environment variables**
3. **Deploy**

### Option 5: Render

1. **Connect your GitHub repository**
2. **Set environment variables**
3. **Deploy**

## Environment Variables

Required:
- `OPENAI_API_KEY`: Your OpenAI API key

Optional:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Getting an OpenAI API Key

1. **Visit OpenAI Platform:**
   - Go to https://platform.openai.com/
   - Sign up or log in

2. **Create API Key:**
   - Go to API Keys section
   - Click "Create new secret key"
   - Copy the key (you won't see it again!)

3. **Add Credits:**
   - Go to Billing section
   - Add payment method
   - Add credits (minimum $5)

## Testing the Deployment

1. **Health Check:**
   Visit `https://your-domain.com/api/health`

2. **Test Chat:**
   - Open your deployed site
   - Click the chat button
   - Try asking: "How much does it cost to fix a leaky faucet?"

## Custom Domain (Optional)

### Railway
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain

### Vercel
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain

## Monitoring

### Railway
- Built-in metrics and logs
- Automatic restarts on failure

### Vercel
- Function logs in dashboard
- Performance metrics

### Heroku
- `heroku logs --tail` for logs
- Built-in monitoring

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found"**
   - Check environment variables are set correctly
   - Restart the server after setting variables

2. **"Service temporarily unavailable"**
   - Check OpenAI API quota
   - Verify API key is valid

3. **Widget not loading**
   - Check browser console for errors
   - Verify API endpoint URL is correct

4. **CORS errors**
   - Check if API endpoint is accessible
   - Verify CORS settings in server.js

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages.

## Security Considerations

1. **Never commit API keys to git**
2. **Use environment variables for all secrets**
3. **Consider rate limiting for production**
4. **Add input validation for production**

## Scaling

For high traffic:
1. **Add rate limiting**
2. **Implement caching**
3. **Use a CDN for static assets**
4. **Consider database for conversation history**

## Support

If you encounter issues:
1. Check the logs
2. Verify environment variables
3. Test locally first
4. Check OpenAI API status
