// Endpoint to add knowledge from files
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, type } = req.body;
    
    if (!content || !type) {
      return res.status(400).json({ error: 'Content and type are required' });
    }

    // Read the current knowledge base
    const knowledgeBasePath = path.join(process.cwd(), 'api', 'knowledge-base.js');
    let knowledgeBaseContent = fs.readFileSync(knowledgeBasePath, 'utf8');
    
    // Update the specific section
    const sectionMap = {
      'policies': 'policies',
      'procedures': 'procedures', 
      'repairCosts': 'repairCosts',
      'eligibility': 'eligibility',
      'general': 'policies' // Default to policies for general content
    };
    
    const sectionName = sectionMap[type] || 'policies';
    
    // Replace the content in the knowledge base
    const sectionRegex = new RegExp(`(${sectionName}:\\s*\`)([\\s\\S]*?)(\`)`, 'g');
    const replacement = `$1\n${content}\n$3`;
    
    const updatedContent = knowledgeBaseContent.replace(sectionRegex, replacement);
    
    // Write back to file
    fs.writeFileSync(knowledgeBasePath, updatedContent, 'utf8');
    
    console.log(`Updated ${sectionName} section with ${content.length} characters`);
    
    res.json({ 
      success: true, 
      message: 'Knowledge added successfully to Homie!',
      type: type,
      section: sectionName,
      contentLength: content.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload knowledge: ' + error.message });
  }
}
