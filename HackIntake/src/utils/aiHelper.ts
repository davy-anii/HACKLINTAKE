/**
 * AI Helper for HackIntake
 * Provides intelligent suggestions for problem statements
 */

export interface AISuggestion {
  type: 'description' | 'constraint' | 'urgency';
  suggestion: string;
  confidence: number;
}

/**
 * Analyzes problem description and provides suggestions
 */
export const analyzeProblemDescription = (description: string): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  const wordCount = description.trim().split(/\s+/).length;
  
  // Check description length
  if (wordCount < 20) {
    suggestions.push({
      type: 'description',
      suggestion: 'Consider adding more details about the expected solution and user benefits.',
      confidence: 0.9,
    });
  }
  
  // Check for technical terms
  const technicalTerms = ['API', 'database', 'backend', 'frontend', 'server', 'client'];
  const hasTechnicalTerms = technicalTerms.some(term => 
    description.toLowerCase().includes(term.toLowerCase())
  );
  
  if (!hasTechnicalTerms && wordCount > 10) {
    suggestions.push({
      type: 'description',
      suggestion: 'Include technical requirements or specific technologies to be used.',
      confidence: 0.7,
    });
  }
  
  return suggestions;
};

/**
 * Suggests missing constraints based on problem category
 */
export const suggestConstraints = (
  category: string,
  existingConstraints: string[]
): string[] => {
  const constraintTemplates: Record<string, string[]> = {
    'Web Development': [
      'Cross-browser compatibility (Chrome, Firefox, Safari)',
      'Responsive design for mobile and desktop',
      'Page load time should be under 3 seconds',
      'Accessibility compliance (WCAG 2.1)',
    ],
    'Mobile Development': [
      'Support for iOS 14+ and Android 10+',
      'Offline functionality for core features',
      'Battery optimization',
      'App size should be under 50MB',
    ],
    'AI/ML': [
      'Model accuracy should be above 85%',
      'Inference time under 200ms',
      'Dataset should be ethically sourced',
      'Bias mitigation strategies required',
    ],
    'Blockchain': [
      'Gas fee optimization',
      'Smart contract security audit required',
      'Scalability for 10,000+ transactions per day',
      'Compliance with local regulations',
    ],
    'IoT': [
      'Low power consumption',
      'Secure communication protocols',
      'Device compatibility (WiFi, Bluetooth, Zigbee)',
      'Over-the-air (OTA) update capability',
    ],
    'Cybersecurity': [
      'Encryption for data at rest and in transit',
      'Regular security audits',
      'Zero-trust architecture',
      'Compliance with ISO 27001',
    ],
  };
  
  const suggestions = constraintTemplates[category] || [];
  
  // Filter out constraints that are similar to existing ones
  return suggestions.filter(suggestion => {
    return !existingConstraints.some(existing => 
      existing.toLowerCase().includes(suggestion.toLowerCase().substring(0, 15))
    );
  });
};

/**
 * Calculates urgency score based on keywords and content
 */
export const calculateUrgencyScore = (
  title: string,
  description: string,
  tags: string[]
): number => {
  const urgentKeywords = [
    'urgent', 'critical', 'emergency', 'immediate', 'asap',
    'crisis', 'deadline', 'time-sensitive', 'priority'
  ];
  
  const importantKeywords = [
    'important', 'significant', 'essential', 'vital', 'crucial',
    'security', 'safety', 'health', 'privacy'
  ];
  
  let score = 0;
  const allText = `${title} ${description} ${tags.join(' ')}`.toLowerCase();
  
  // Check for urgent keywords
  urgentKeywords.forEach(keyword => {
    if (allText.includes(keyword)) {
      score += 20;
    }
  });
  
  // Check for important keywords
  importantKeywords.forEach(keyword => {
    if (allText.includes(keyword)) {
      score += 10;
    }
  });
  
  // Cap at 100
  return Math.min(score, 100);
};

/**
 * Generates AI quality score for a problem statement
 */
export const calculateQualityScore = (problem: {
  title: string;
  description: string;
  constraints: string[];
  requirements: string[];
  tags: string[];
}): number => {
  let score = 0;
  
  // Title quality (max 20 points)
  const titleWords = problem.title.split(' ').length;
  if (titleWords >= 3 && titleWords <= 10) score += 20;
  else if (titleWords >= 2 && titleWords <= 12) score += 15;
  else score += 10;
  
  // Description quality (max 30 points)
  const descWords = problem.description.split(' ').length;
  if (descWords >= 50) score += 30;
  else if (descWords >= 30) score += 25;
  else if (descWords >= 20) score += 20;
  else score += 10;
  
  // Constraints (max 20 points)
  if (problem.constraints.length >= 4) score += 20;
  else if (problem.constraints.length >= 3) score += 15;
  else if (problem.constraints.length >= 2) score += 10;
  else if (problem.constraints.length >= 1) score += 5;
  
  // Requirements (max 20 points)
  if (problem.requirements.length >= 4) score += 20;
  else if (problem.requirements.length >= 3) score += 15;
  else if (problem.requirements.length >= 2) score += 10;
  else if (problem.requirements.length >= 1) score += 5;
  
  // Tags (max 10 points)
  if (problem.tags.length >= 4) score += 10;
  else if (problem.tags.length >= 3) score += 8;
  else if (problem.tags.length >= 2) score += 5;
  else if (problem.tags.length >= 1) score += 3;
  
  return score;
};

/**
 * Provides improvement suggestions for a problem statement
 */
export const getImprovementSuggestions = (problem: {
  title: string;
  description: string;
  constraints: string[];
  requirements: string[];
  tags: string[];
  category: string;
}): string[] => {
  const suggestions: string[] = [];
  const score = calculateQualityScore(problem);
  
  if (score < 70) {
    if (problem.description.split(' ').length < 30) {
      suggestions.push('💡 Add more details to your description (aim for 30-50 words)');
    }
    
    if (problem.constraints.length < 3) {
      suggestions.push('🔒 Add more constraints to define project boundaries');
    }
    
    if (problem.requirements.length < 3) {
      suggestions.push('✅ Specify more detailed requirements for the solution');
    }
    
    if (problem.tags.length < 3) {
      suggestions.push('🏷️ Add relevant tags to improve discoverability');
    }
  }
  
  return suggestions;
};
