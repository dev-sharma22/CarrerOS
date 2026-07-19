import { analyzeCodeSolution } from '../services/aiService.js';
import logger from '../utils/logger.js';

// @desc    Analyze code solution using Gemini AI
// @route   POST /api/code/analyze
// @access  Private (Student)
export const evaluateCodeSnippet = async (req, res) => {
  const { problemName, language, code } = req.body;

  if (!problemName || !language || !code) {
    return res.status(400).json({ success: false, message: 'Please provide problemName, language, and code' });
  }

  try {
    logger.info(`Analyzing code solution for "${problemName}" in ${language}`);
    const analysis = await analyzeCodeSolution(problemName, language, code);
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    logger.error(`Code Analysis failure: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
};
