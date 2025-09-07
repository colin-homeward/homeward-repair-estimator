# Vercel Deployment Guide

## Option 1: Deploy via Vercel Web Interface (Easiest)

### Step 1: Prepare Your Code
1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Homeward Repair Estimator"
   git branch -M main
   git remote add origin https://github.com/yourusername/homeward-repair-estimator.git
   git push -u origin main
   ```

### Step 2: Deploy on Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project:**
   - Framework Preset: `Other`
   - Build Command: `npm install`
   - Output Directory: `.` (leave empty)
   - Install Command: `npm install`

### Step 3: Set Environment Variables
1. **Go to Project Settings → Environment Variables**
2. **Add the following:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`

### Step 4: Deploy
1. **Click "Deploy"**
2. **Wait for deployment to complete**
3. **Your app will be live at `https://your-project-name.vercel.app`**

## Option 2: Deploy via CLI (If Node.js is installed)

### Prerequisites
1. **Install Node.js:**
   ```bash
   # On macOS with Homebrew
   brew install node
   
   # Or download from https://nodejs.org/
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

### Deploy
1. **Run the deployment script:**
   ```bash
   ./deploy-vercel.sh
   ```

2. **Or deploy manually:**
   ```bash
   # Install dependencies
   npm install
   
   # Create .env file
   cp env.example .env
   # Edit .env and add your OpenAI API key
   
   # Deploy
   vercel --prod
   ```

## Option 3: Deploy via GitHub Actions (Automated)

### Step 1: Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Step 2: Set GitHub Secrets
In your GitHub repository settings, add:
- `VERCEL_TOKEN`: Your Vercel token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

## Getting Your OpenAI API Key

1. **Visit [OpenAI Platform](https://platform.openai.com/)**
2. **Sign up or log in**
3. **Go to API Keys section**
4. **Click "Create new secret key"**
5. **Copy the key (you won't see it again!)**
6. **Add credits to your account (minimum $5)**

## Testing Your Deployment

### Health Check
Visit: `https://your-app.vercel.app/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "Homeward Repair Estimator API"
}
```

### Test Chat Widget
1. **Open your deployed site**
2. **Click the chat button (🔧)**
3. **Try asking: "How much does it cost to fix a leaky faucet?"**

## Custom Domain (Optional)

1. **Go to your Vercel project dashboard**
2. **Click "Settings" → "Domains"**
3. **Add your custom domain**
4. **Follow the DNS configuration instructions**

## Environment Variables

Required:
- `OPENAI_API_KEY`: Your OpenAI API key

Optional:
- `NODE_ENV`: `production` (automatically set by Vercel)

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found"**
   - Check environment variables in Vercel dashboard
   - Make sure the variable name is exactly `OPENAI_API_KEY`

2. **"Function timeout"**
   - Vercel has a 10-second timeout for hobby plans
   - Consider upgrading to Pro plan for longer timeouts

3. **"Build failed"**
   - Check the build logs in Vercel dashboard
   - Make sure all dependencies are in package.json

4. **"CORS errors"**
   - Check if your API endpoint is accessible
   - Verify the domain in your chat widget configuration

### Debug Mode

1. **Go to Vercel dashboard**
2. **Click on your project**
3. **Go to "Functions" tab**
4. **Click on a function to see logs**

## Monitoring

### Vercel Analytics
1. **Go to your project dashboard**
2. **Click "Analytics" tab**
3. **View performance metrics and usage**

### Function Logs
1. **Go to "Functions" tab**
2. **Click on a function**
3. **View real-time logs**

## Scaling

### Vercel Plans
- **Hobby**: Free, 100GB bandwidth, 100GB-hours execution time
- **Pro**: $20/month, 1TB bandwidth, 1000GB-hours execution time
- **Enterprise**: Custom pricing

### Performance Optimization
1. **Use Vercel Edge Functions for better performance**
2. **Implement caching for frequently asked questions**
3. **Add rate limiting for production use**

## Security

1. **Never commit API keys to git**
2. **Use environment variables for all secrets**
3. **Consider adding rate limiting**
4. **Implement input validation**

## Support

If you encounter issues:
1. **Check Vercel documentation**
2. **View function logs**
3. **Test locally first**
4. **Check OpenAI API status**

## Next Steps

After successful deployment:
1. **Test all functionality**
2. **Set up monitoring**
3. **Configure custom domain (optional)**
4. **Add analytics tracking**
5. **Implement rate limiting for production**
