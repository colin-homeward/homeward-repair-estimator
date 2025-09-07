// Google Drive API integration for automatic content sync
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Initialize Google Drive API
function initializeDriveAPI() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

// Extract text from different file types
async function extractTextFromFile(drive, fileId, mimeType) {
  try {
    if (mimeType === 'text/plain') {
      const response = await drive.files.get({
        fileId: fileId,
        alt: 'media',
      });
      return response.data;
    }
    
    if (mimeType.includes('google-apps')) {
      // For Google Docs, Sheets, Slides - export as text
      const response = await drive.files.export({
        fileId: fileId,
        mimeType: 'text/plain',
      });
      return response.data;
    }
    
    if (mimeType === 'application/pdf') {
      // For PDFs - export as text
      const response = await drive.files.export({
        fileId: fileId,
        mimeType: 'text/plain',
      });
      return response.data;
    }
    
    // For other formats, try to export as text
    try {
      const response = await drive.files.export({
        fileId: fileId,
        mimeType: 'text/plain',
      });
      return response.data;
    } catch (error) {
      console.log(`Could not export ${mimeType} as text, skipping...`);
      return null;
    }
  } catch (error) {
    console.error(`Error extracting text from file ${fileId}:`, error);
    return null;
  }
}

// Categorize files based on name or content
function categorizeFile(fileName, content) {
  const name = fileName.toLowerCase();
  
  if (name.includes('policy') || name.includes('procedure') || name.includes('guideline')) {
    return 'policies';
  }
  if (name.includes('floor') || name.includes('plan') || name.includes('layout')) {
    return 'procedures';
  }
  if (name.includes('cost') || name.includes('price') || name.includes('estimate')) {
    return 'repairCosts';
  }
  if (name.includes('eligibility') || name.includes('qualification') || name.includes('requirement')) {
    return 'eligibility';
  }
  
  // Default to policies for general content
  return 'policies';
}

// Update knowledge base with new content
function updateKnowledgeBase(sectionName, content) {
  try {
    const knowledgeBasePath = path.join(process.cwd(), 'api', 'knowledge-base.js');
    let knowledgeBaseContent = fs.readFileSync(knowledgeBasePath, 'utf8');
    
    // Replace the content in the knowledge base
    const sectionRegex = new RegExp(`(${sectionName}:\\s*\`)([\\s\\S]*?)(\`)`, 'g');
    const replacement = `$1\n${content}\n$3`;
    
    const updatedContent = knowledgeBaseContent.replace(sectionRegex, replacement);
    
    // Write back to file
    fs.writeFileSync(knowledgeBasePath, updatedContent, 'utf8');
    
    console.log(`Updated ${sectionName} section with Google Drive content`);
    return true;
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    return false;
  }
}

// Main sync function
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
    const { folderId } = req.body;
    
    if (!folderId) {
      return res.status(400).json({ error: 'Google Drive folder ID is required' });
    }

    // Check if Google Drive credentials are configured
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return res.status(500).json({ 
        error: 'Google Drive API credentials not configured. Please add GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY to environment variables.' 
      });
    }

    const drive = initializeDriveAPI();
    
    // List files in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id,name,mimeType,modifiedTime)',
      orderBy: 'modifiedTime desc',
    });

    const files = response.data.files;
    console.log(`Found ${files.length} files in Google Drive folder`);

    let processedFiles = 0;
    let errors = [];

    // Process each file
    for (const file of files) {
      try {
        console.log(`Processing file: ${file.name} (${file.mimeType})`);
        
        const content = await extractTextFromFile(drive, file.id, file.mimeType);
        
        if (content && content.trim().length > 0) {
          const sectionName = categorizeFile(file.name, content);
          const success = updateKnowledgeBase(sectionName, content);
          
          if (success) {
            processedFiles++;
            console.log(`Successfully processed: ${file.name} → ${sectionName}`);
          } else {
            errors.push(`Failed to update knowledge base for: ${file.name}`);
          }
        } else {
          console.log(`Skipped file (no text content): ${file.name}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errors.push(`Error processing ${file.name}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Google Drive sync completed!`,
      processedFiles: processedFiles,
      totalFiles: files.length,
      errors: errors,
      folderId: folderId
    });

  } catch (error) {
    console.error('Google Drive sync error:', error);
    res.status(500).json({ 
      error: 'Failed to sync with Google Drive: ' + error.message 
    });
  }
}
