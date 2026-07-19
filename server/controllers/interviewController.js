import Interview from '../models/Interview.js';
import User from '../models/User.js';
import { generateInterviewQuestions, evaluateAnswer } from '../services/aiService.js';
import { memoryDb } from '../utils/memoryDb.js';

// @desc    Start mock interview session and generate questions
// @route   POST /api/interviews/start
// @access  Private (Student)
export const startMockInterview = async (req, res) => {
  const { role, experienceLevel, difficulty } = req.body;

  if (!role || !experienceLevel || !difficulty) {
    return res.status(400).json({ success: false, message: 'Please provide role, experienceLevel, and difficulty' });
  }

  try {
    let skillsList = [];
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id);
      skillsList = user ? user.skills : [];
    } else {
      const user = await memoryDb.findUserById(req.user._id);
      skillsList = user ? user.skills : [];
    }

    const skillsContext = skillsList.length > 0 ? `Candidate skills: ${skillsList.join(', ')}.` : '';

    // Generate questions from AI service
    const questions = await generateInterviewQuestions(role, experienceLevel, difficulty, skillsContext);

    let interview;
    const interviewData = {
      userId: req.user._id,
      role,
      experienceLevel,
      difficulty,
      questions,
      answers: Array(questions.length).fill(''),
      feedback: [],
      score: 0,
      overallFeedback: ''
    };

    if (global.isMongoConnected) {
      interview = await Interview.create(interviewData);
    } else {
      interview = await memoryDb.createInterview(interviewData);
    }

    res.status(201).json({
      success: true,
      interviewId: interview._id,
      questions: interview.questions
    });

  } catch (error) {
    console.error('Start interview error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit answer for a single question index
// @route   POST /api/interviews/:id/submit
// @access  Private (Student)
export const submitAnswer = async (req, res) => {
  const interviewId = req.params.id;
  const { questionIndex, answer } = req.body;

  if (questionIndex === undefined || answer === undefined) {
    return res.status(400).json({ success: false, message: 'Please provide questionIndex and answer' });
  }

  try {
    let interview;
    if (global.isMongoConnected) {
      interview = await Interview.findById(interviewId);
    } else {
      interview = await memoryDb.findInterviewById(interviewId);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Mock interview session not found' });
    }

    if (interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to submit answers for this session' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question index is out of bounds' });
    }

    // Call AI to evaluate answer
    const evaluation = await evaluateAnswer(question, answer, interview.role);

    interview.answers[questionIndex] = answer;

    const feedbackItem = {
      question,
      answer,
      score: evaluation.score || 5,
      comments: evaluation.comments || 'Response analyzed.'
    };

    // Update existing feedback index if already submitted, or append
    const existingIndex = interview.feedback.findIndex(f => f.question === question);
    if (existingIndex > -1) {
      interview.feedback[existingIndex] = feedbackItem;
    } else {
      interview.feedback.push(feedbackItem);
    }

    // Check completion
    const totalCount = interview.questions.length;
    const answeredCount = interview.answers.filter(ans => ans.trim() !== '').length;
    const isCompleted = answeredCount === totalCount;

    if (isCompleted) {
      const sum = interview.feedback.reduce((acc, current) => acc + current.score, 0);
      interview.score = Math.round((sum / totalCount) * 10) / 10;

      if (interview.score >= 8) {
        interview.overallFeedback = 'Outstanding answers! You demonstrated thorough conceptual understanding and articulated technical terminology properly. You are highly ready for placements!';
      } else if (interview.score >= 6) {
        interview.overallFeedback = 'Satisfactory interview. You covered basic questions but missed explaining secondary issues like caching, scalability, or performance optimization. Try to include concrete code snippets in the future.';
      } else {
        interview.overallFeedback = 'Needs significant improvement. Revise core OOPs, database properties, and data structures. Practice speaking aloud and try again.';
      }
    }

    if (global.isMongoConnected) {
      await interview.save();
    } else {
      await memoryDb.updateInterviewById(interviewId, {
        answers: interview.answers,
        feedback: interview.feedback,
        score: interview.score,
        overallFeedback: interview.overallFeedback
      });
    }

    res.status(200).json({
      success: true,
      completed: isCompleted,
      evaluation,
      overallScore: interview.score,
      overallFeedback: interview.overallFeedback
    });

  } catch (error) {
    console.error('Submit answer error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get past interview history for student
// @route   GET /api/interviews/history
// @access  Private (Student)
export const getInterviewHistory = async (req, res) => {
  try {
    let history;
    if (global.isMongoConnected) {
      history = await Interview.find({ userId: req.user._id }).sort({ date: -1 });
    } else {
      history = await memoryDb.findInterviewsByUserId(req.user._id);
    }

    res.status(200).json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific interview details by ID
// @route   GET /api/interviews/:id
// @access  Private
export const getInterviewById = async (req, res) => {
  try {
    let interview;
    if (global.isMongoConnected) {
      interview = await Interview.findById(req.params.id);
    } else {
      interview = await memoryDb.findInterviewById(req.params.id);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Mock interview session not found' });
    }

    // Role-based auth check
    if (req.user.role === 'student' && interview.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this interview session' });
    }

    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
