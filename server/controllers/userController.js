import User from '../models/User.js';
import Interview from '../models/Interview.js';
import DSAProgress from '../models/DSAProgress.js';
import Resume from '../models/Resume.js';
import Job from '../models/Job.js';
import { memoryDb } from '../utils/memoryDb.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    let user;
    if (global.isMongoConnected) {
      user = await User.findById(req.user._id).select('-password');
    } else {
      user = await memoryDb.findUserById(req.user._id);
      if (user) {
        const { password, ...clean } = user;
        user = clean;
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { name, email, skills, education, resumeURL, password, socialLinks } = req.body;

  try {
    let updatedUser;

    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.name = name || user.name;
      user.email = email || user.email;
      if (skills) user.skills = skills;
      if (education) user.education = education;
      if (resumeURL !== undefined) user.resumeURL = resumeURL;
      if (password) user.password = password;
      if (socialLinks) {
        user.socialLinks = { ...user.socialLinks, ...socialLinks };
      }

      updatedUser = await user.save();
    } else {
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (skills) updates.skills = skills;
      if (education) updates.education = education;
      if (resumeURL !== undefined) updates.resumeURL = resumeURL;
      if (password) updates.password = password;
      if (socialLinks) {
        const currentUser = await memoryDb.findUserById(req.user._id);
        updates.socialLinks = { ...(currentUser?.socialLinks || {}), ...socialLinks };
      }

      updatedUser = await memoryDb.updateUserById(req.user._id, updates);
    }

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        skills: updatedUser.skills,
        education: updatedUser.education,
        resumeURL: updatedUser.resumeURL,
        socialLinks: updatedUser.socialLinks
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard metrics for students
// @route   GET /api/users/dashboard
// @access  Private (Student)
export const getStudentDashboardStats = async (req, res) => {
  const userId = req.user._id;

  try {
    let user, interviews, dsaProgress, resume;

    if (global.isMongoConnected) {
      user = await User.findById(userId);
      interviews = await Interview.find({ userId }).sort({ date: -1 });
      dsaProgress = await DSAProgress.find({ userId });
      resume = await Resume.findOne({ userId });
    } else {
      user = await memoryDb.findUserById(userId);
      interviews = await memoryDb.findInterviewsByUserId(userId);
      dsaProgress = await memoryDb.findDsaProgressByUserId(userId);
      resume = await memoryDb.findResumeByUserId(userId);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Calculate completion
    let profileCompletion = 25;
    if (user.skills && user.skills.length > 0) profileCompletion += 25;
    if (user.education && user.education.length > 0) profileCompletion += 25;
    if (user.resumeURL && user.resumeURL.trim() !== '') profileCompletion += 25;

    const interviewCount = interviews.length;
    const avgScore = interviewCount > 0 
      ? Math.round((interviews.reduce((acc, curr) => acc + curr.score, 0) / interviewCount) * 10) / 10 
      : 0;

    const totalProblemsSolved = dsaProgress.reduce((acc, curr) => acc + curr.solvedProblems.length, 0);
    
    const dsaBreakdown = dsaProgress.map(topic => ({
      topic: topic.topic,
      solved: topic.solvedProblems.length,
      progress: topic.progress
    }));

    // Streak calculation
    const allSolvedDates = dsaProgress.reduce((acc, current) => {
      return acc.concat(current.solvedProblems.map(p => new Date(p.solvedAt).toISOString().split('T')[0]));
    }, []);

    const uniqueDates = [...new Set(allSolvedDates)].sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (uniqueDates.includes(todayStr) || uniqueDates.includes(yesterdayStr)) {
      let checkDate = uniqueDates.includes(todayStr) ? new Date() : new Date(Date.now() - 86400000);
      streak = 1;
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const checkStr = checkDate.toISOString().split('T')[0];
        if (uniqueDates.includes(checkStr)) {
          streak++;
        } else {
          break;
        }
      }
    }

    const recommendedTopics = [];
    if (!user.skills.includes('React') && !user.skills.includes('REACT') && !user.skills.includes('React.js')) {
      recommendedTopics.push({ topic: 'React.js Components', category: 'Frontend' });
    }
    if (!user.skills.includes('MongoDB') && !user.skills.includes('MONGODB')) {
      recommendedTopics.push({ topic: 'NoSQL Indexing', category: 'Database' });
    }
    if (totalProblemsSolved < 5) {
      recommendedTopics.push({ topic: 'Arrays & Strings', category: 'DSA Basics' });
    } else {
      recommendedTopics.push({ topic: 'Dynamic Programming', category: 'DSA Advanced' });
    }

    const recentActivity = [];
    interviews.slice(0, 3).forEach(i => {
      recentActivity.push({
        type: 'interview',
        title: `Completed Mock Interview for ${i.role}`,
        desc: `Scored ${i.score}/10 in ${i.difficulty} difficulty`,
        date: i.date
      });
    });

    dsaProgress.forEach(topic => {
      topic.solvedProblems.slice(-2).forEach(p => {
        recentActivity.push({
          type: 'dsa',
          title: `Solved "${p.name}"`,
          desc: `Tagged under ${topic.topic} (${p.difficulty})`,
          date: p.solvedAt
        });
      });
    });

    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      success: true,
      stats: {
        profileCompletion,
        interviewCount,
        avgScore,
        totalProblemsSolved,
        dsaStreak: streak,
        dsaBreakdown,
        atsScore: resume ? resume.ATSScore : 0,
        recommendedTopics,
        recentActivity: recentActivity.slice(0, 5)
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ====================================================
// ADMIN CONTROLLERS
// ====================================================

// @desc    Get all users list (Admin only)
// @route   GET /api/users/admin/users
// @access  Private (Admin)
export const adminGetUsers = async (req, res) => {
  try {
    let users;
    if (global.isMongoConnected) {
      users = await User.find({}).select('-password').sort({ createdAt: -1 });
    } else {
      users = await memoryDb.getUsersList();
      users = users.map(u => {
        const { password, ...clean } = u;
        return clean;
      });
    }
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a user profile and related logs (Admin only)
// @route   DELETE /api/users/admin/users/:id
// @access  Private (Admin)
export const adminDeleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    if (global.isMongoConnected) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete admin users' });
      }

      await User.findByIdAndDelete(userId);
      await Interview.deleteMany({ userId });
      await Resume.deleteMany({ userId });
      await DSAProgress.deleteMany({ userId });
      await Job.updateMany({ applicants: userId }, { $pull: { applicants: userId } });
    } else {
      const user = await memoryDb.findUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot delete admin users' });
      }
      await memoryDb.deleteUserById(userId);
    }

    res.status(200).json({ success: true, message: 'User and all related records deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Platform Analytics (Admin only)
// @route   GET /api/users/admin/analytics
// @access  Private (Admin)
export const adminGetAnalytics = async (req, res) => {
  try {
    let stats = {
      totalUsers: 0,
      totalStudents: 0,
      totalRecruiters: 0,
      totalJobs: 0,
      totalInterviews: 0,
      avgScore: 0,
      avgATS: 0
    };

    if (global.isMongoConnected) {
      stats.totalUsers = await User.countDocuments();
      stats.totalStudents = await User.countDocuments({ role: 'student' });
      stats.totalRecruiters = await User.countDocuments({ role: 'recruiter' });
      stats.totalJobs = await Job.countDocuments();
      stats.totalInterviews = await Interview.countDocuments();

      const scoreAgg = await Interview.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]);
      stats.avgScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore * 10) / 10 : 0;

      const resumeAgg = await Resume.aggregate([
        { $group: { _id: null, avgATS: { $avg: '$ATSScore' } } }
      ]);
      stats.avgATS = resumeAgg.length > 0 ? Math.round(resumeAgg[0].avgATS * 10) / 10 : 0;
    } else {
      const u = memoryDb.db.users;
      stats.totalUsers = u.length;
      stats.totalStudents = u.filter(usr => usr.role === 'student').length;
      stats.totalRecruiters = u.filter(usr => usr.role === 'recruiter').length;
      stats.totalJobs = memoryDb.db.jobs.length;

      const ints = memoryDb.db.interviews;
      stats.totalInterviews = ints.length;
      const totalScore = ints.reduce((sum, item) => sum + item.score, 0);
      stats.avgScore = ints.length > 0 ? Math.round((totalScore / ints.length) * 10) / 10 : 0;

      const resList = memoryDb.db.resumes;
      const totalATS = resList.reduce((sum, item) => sum + item.ATSScore, 0);
      stats.avgATS = resList.length > 0 ? Math.round((totalATS / resList.length) * 10) / 10 : 0;
    }

    res.status(200).json({ success: true, analytics: stats });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add User Note
// @route   POST /api/users/notes
// @access  Private
export const addUserNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Please provide note title and content' });
  }

  try {
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      user.notes.push({ title, content });
      await user.save();
      res.status(201).json({ success: true, notes: user.notes });
    } else {
      const user = await memoryDb.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      const newNote = { _id: 'mem_note_' + Math.random().toString(36).substr(2, 9), title, content, createdAt: new Date() };
      user.notes = user.notes || [];
      user.notes.push(newNote);
      await memoryDb.updateUserById(req.user._id, { notes: user.notes });
      res.status(201).json({ success: true, notes: user.notes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete User Note
// @route   DELETE /api/users/notes/:id
// @access  Private
export const deleteUserNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      user.notes = user.notes.filter(note => note._id.toString() !== noteId);
      await user.save();
      res.json({ success: true, notes: user.notes });
    } else {
      const user = await memoryDb.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      user.notes = (user.notes || []).filter(note => note._id !== noteId);
      await memoryDb.updateUserById(req.user._id, { notes: user.notes });
      res.json({ success: true, notes: user.notes });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add User Bookmark
// @route   POST /api/users/bookmarks
// @access  Private
export const addUserBookmark = async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ success: false, message: 'Please provide itemId to bookmark' });
  }

  try {
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      if (!user.bookmarks.includes(itemId)) {
        user.bookmarks.push(itemId);
        await user.save();
      }
      res.status(201).json({ success: true, bookmarks: user.bookmarks });
    } else {
      const user = await memoryDb.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      user.bookmarks = user.bookmarks || [];
      if (!user.bookmarks.includes(itemId)) {
        user.bookmarks.push(itemId);
        await memoryDb.updateUserById(req.user._id, { bookmarks: user.bookmarks });
      }
      res.status(201).json({ success: true, bookmarks: user.bookmarks });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove User Bookmark
// @route   DELETE /api/users/bookmarks/:id
// @access  Private
export const removeUserBookmark = async (req, res) => {
  const itemId = req.params.id;

  try {
    if (global.isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      user.bookmarks = user.bookmarks.filter(id => id !== itemId);
      await user.save();
      res.json({ success: true, bookmarks: user.bookmarks });
    } else {
      const user = await memoryDb.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      
      user.bookmarks = (user.bookmarks || []).filter(id => id !== itemId);
      await memoryDb.updateUserById(req.user._id, { bookmarks: user.bookmarks });
      res.json({ success: true, bookmarks: user.bookmarks });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top student ranking leaderboard
// @route   GET /api/users/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    let leaderboard = [];

    if (global.isMongoConnected) {
      const students = await User.find({ role: 'student' });
      for (const student of students) {
        const dsaProgress = await DSAProgress.find({ userId: student._id });
        const solvedCount = dsaProgress.reduce((acc, curr) => acc + curr.solvedProblems.length, 0);
        
        const interviews = await Interview.find({ userId: student._id });
        const avgScore = interviews.length > 0
          ? Math.round((interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length) * 10) / 10
          : 0;

        leaderboard.push({
          name: student.name,
          skillsCount: student.skills.length,
          solvedCount,
          avgScore,
          totalPoints: solvedCount * 10 + avgScore * 5
        });
      }
    } else {
      const students = memoryDb.db.users.filter(u => u.role === 'student');
      for (const student of students) {
        const dsaProgress = await memoryDb.findDsaProgressByUserId(student._id);
        const solvedCount = dsaProgress.reduce((acc, curr) => acc + curr.solvedProblems.length, 0);
        
        const interviews = await memoryDb.findInterviewsByUserId(student._id);
        const avgScore = interviews.length > 0
          ? Math.round((interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length) * 10) / 10
          : 0;

        leaderboard.push({
          name: student.name,
          skillsCount: student.skills.length,
          solvedCount,
          avgScore,
          totalPoints: solvedCount * 10 + avgScore * 5
        });
      }
    }

    // Sort by points descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
