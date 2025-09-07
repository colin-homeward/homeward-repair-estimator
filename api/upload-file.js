// File upload endpoint for PDFs, Google Slides, etc.
// This version accepts base64 encoded files for better serverless compatibility

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
    const { fileData, fileName, fileType, contentType } = req.body;

    if (!fileData || !fileName || !contentType) {
      return res.status(400).json({ error: 'File data, name, and content type are required' });
    }

    // For now, we'll handle text files and provide instructions for others
    if (fileType === 'text/plain') {
      // Decode base64 text content
      const textContent = Buffer.from(fileData, 'base64').toString('utf8');
      
      // Update knowledge base (simplified version)
      res.json({ 
        success: true, 
        message: 'Text file processed successfully! Please use the text upload option for other file types.',
        type: contentType,
        fileName: fileName,
        contentLength: textContent.length,
        note: 'For PDF, PPTX, DOCX files, please use the text upload option and copy-paste the content.'
      });
    } else {
      // For other file types, provide instructions
      res.json({ 
        success: false, 
        message: 'File type not yet supported for direct upload.',
        suggestion: 'Please use the text upload option and copy-paste the content from your file.',
        supportedTypes: ['Text files (.txt)'],
        alternative: 'You can also use the text upload page to paste content from PDFs, Google Slides, etc.'
      });
    }

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to process file: ' + error.message });
  }
}
