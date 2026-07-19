import DSAProgress from '../models/DSAProgress.js';
import { memoryDb } from '../utils/memoryDb.js';

const TOTAL_PRESET = 15;

// @desc    Get all DSA progress tracking metrics
// @route   GET /api/dsa/progress
// @access  Private (Student)
export const getDSAProgress = async (req, res) => {
  const userId = req.user._id;

  try {
    let progressLogs;
    if (global.isMongoConnected) {
      progressLogs = await DSAProgress.find({ userId });
    } else {
      progressLogs = await memoryDb.findDsaProgressByUserId(userId);
    }

    const allSolved = progressLogs.reduce((acc, current) => {
      return acc.concat(current.solvedProblems);
    }, []);

    // Calculate streak
    const dates = allSolved.map(p => new Date(p.solvedAt).toISOString().split('T')[0]);
    const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
      let check = uniqueDates.includes(todayStr) ? new Date() : new Date(Date.now() - 86400000);
      streak = 1;
      while (true) {
        check.setDate(check.getDate() - 1);
        const checkStr = check.toISOString().split('T')[0];
        if (uniqueDates.includes(checkStr)) {
          streak++;
        } else {
          break;
        }
      }
    }

    res.json({
      success: true,
      progress: progressLogs,
      streak,
      totalSolved: allSolved.length
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a solved DSA problem log
// @route   POST /api/dsa/solve
// @access  Private (Student)
export const solveProblem = async (req, res) => {
  const { topic, problemName, difficulty } = req.body;

  if (!topic || !problemName) {
    return res.status(400).json({ success: false, message: 'Please provide topic and problemName' });
  }

  try {
    let record;

    if (global.isMongoConnected) {
      record = await DSAProgress.findOne({ userId: req.user._id, topic });
      if (!record) {
        record = new DSAProgress({
          userId: req.user._id,
          topic,
          solvedProblems: [],
          progress: 0
        });
      }

      const exists = record.solvedProblems.some(p => p.name.toLowerCase() === problemName.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'Problem already logged as solved' });
      }

      record.solvedProblems.push({
        name: problemName,
        difficulty: difficulty || 'Easy',
        solvedAt: new Date()
      });

      const count = record.solvedProblems.length;
      record.progress = Math.min(Math.round((count / TOTAL_PRESET) * 100), 100);
      await record.save();
    } else {
      record = await memoryDb.findDsaByUserIdAndTopic(req.user._id, topic);
      if (!record) {
        record = await memoryDb.createDsaProgress({
          userId: req.user._id,
          topic
        });
      }

      const exists = record.solvedProblems.some(p => p.name.toLowerCase() === problemName.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'Problem already logged as solved' });
      }

      const newProb = {
        _id: 'mem_dsa_prob_' + Math.random().toString(36).substr(2, 9),
        name: problemName,
        difficulty: difficulty || 'Easy',
        solvedAt: new Date()
      };

      record.solvedProblems.push(newProb);
      const count = record.solvedProblems.length;
      record.progress = Math.min(Math.round((count / TOTAL_PRESET) * 100), 100);
    }

    res.status(200).json({
      success: true,
      message: 'DSA progress logged successfully',
      progressRecord: record
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a solved DSA problem log
// @route   DELETE /api/dsa/solve
// @access  Private (Student)
export const deleteProblem = async (req, res) => {
  const { topic, problemId } = req.body;

  if (!topic || !problemId) {
    return res.status(400).json({ success: false, message: 'Please provide topic and problemId' });
  }

  try {
    let record;
    if (global.isMongoConnected) {
      record = await DSAProgress.findOne({ userId: req.user._id, topic });
      if (!record) {
        return res.status(404).json({ success: false, message: 'Progress record not found' });
      }

      record.solvedProblems = record.solvedProblems.filter(p => p._id.toString() !== problemId);
      const count = record.solvedProblems.length;
      record.progress = Math.min(Math.round((count / TOTAL_PRESET) * 100), 100);
      await record.save();
    } else {
      record = await memoryDb.findDsaByUserIdAndTopic(req.user._id, topic);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Progress record not found' });
      }

      record.solvedProblems = record.solvedProblems.filter(p => p._id !== problemId);
      const count = record.solvedProblems.length;
      record.progress = Math.min(Math.round((count / TOTAL_PRESET) * 100), 100);
    }

    res.status(200).json({
      success: true,
      message: 'Problem removed successfully',
      progressRecord: record
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
