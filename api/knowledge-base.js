// Homeward Knowledge Base
// Add your Google Slides and Google Docs content here

export const HOMEWARD_KNOWLEDGE = {
  // Add your Google Slides content here
  policies: `
    // Copy and paste your Google Slides content here
    // Example:
    // "Homeward's repair process typically takes 2-4 weeks..."
  `,
  
  // Add your Google Docs content here
  procedures: `
    // Copy and paste your Google Docs content here
    // Example:
    // "Floor plan requirements include room dimensions..."
  `,
  
  // Add specific repair cost data
  repairCosts: `
    // Add your repair cost data here
    // Example:
    // "Kitchen renovation costs by region..."
  `,
  
  // Add eligibility criteria
  eligibility: `
    // Add eligibility requirements here
    // Example:
    // "Homeward eligibility requirements include..."
  `
};

// Function to get relevant knowledge based on user query
export function getRelevantKnowledge(query) {
  const lowerQuery = query.toLowerCase();
  let relevantKnowledge = '';
  
  if (lowerQuery.includes('policy') || lowerQuery.includes('buybox') || lowerQuery.includes('eligibility')) {
    relevantKnowledge += HOMEWARD_KNOWLEDGE.policies + '\n' + HOMEWARD_KNOWLEDGE.eligibility;
  }
  
  if (lowerQuery.includes('floor plan') || lowerQuery.includes('floorplan')) {
    relevantKnowledge += HOMEWARD_KNOWLEDGE.procedures;
  }
  
  if (lowerQuery.includes('repair') || lowerQuery.includes('cost') || lowerQuery.includes('estimate')) {
    relevantKnowledge += HOMEWARD_KNOWLEDGE.repairCosts;
  }
  
  return relevantKnowledge;
}
