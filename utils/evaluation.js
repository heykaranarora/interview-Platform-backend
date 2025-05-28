import natural from "natural";
const tokenizer = new natural.WordTokenizer();
const levenshtein = natural.LevenshteinDistance;

export const evaluateAnswer = (userAnswer, correctAnswer, keywords) => {
  if (!userAnswer || !correctAnswer) return 0;

  // Normalize and tokenize answers
  const normalizeText = (text) => tokenizer.tokenize(text.toLowerCase().replace(/[^\w\s]/g, ""));
  
  const userTokens = normalizeText(userAnswer);
  const correctTokens = normalizeText(correctAnswer);

  // Compute similarity score using Levenshtein Distance (ensure non-negative value)
  const maxLen = Math.max(userTokens.length, correctTokens.length);
  const textSimilarity = maxLen > 0 ? (1 - levenshtein(userTokens.join(" "), correctTokens.join(" ")) / maxLen) : 0;

  // Keyword-based scoring
  let keywordScore = 0;
  const totalKeywords = keywords.length;
  let matchedKeywords = 0;

  keywords.forEach((keyword) => {
    if (userTokens.includes(keyword.toLowerCase())) {
      matchedKeywords += 1;
    }
  });

  if (totalKeywords > 0) {
    keywordScore = (matchedKeywords / totalKeywords) * 10; // Scale keyword match score to 10
  }

  // Final weighted score (50% similarity, 50% keyword match)
  const finalScore = Math.max(0, Math.round((textSimilarity * 10 * 0.5) + (keywordScore * 0.5))); // Ensure no negative scores

  return finalScore; // Score out of 10
};
