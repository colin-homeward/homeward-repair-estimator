// Simple endpoint to add knowledge from files
// This is a basic implementation - you can enhance it later

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

    // For now, just return success
    // In a real implementation, you'd save this to a database
    console.log(`Received ${type} content:`, content.substring(0, 100) + '...');
    
    res.json({ 
      success: true, 
      message: 'Knowledge added successfully',
      type: type,
      contentLength: content.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload knowledge' });
  }
}
