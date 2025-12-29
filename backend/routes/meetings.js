const express = require('express');
const router = express.Router();
const multer = require('multer');
const Meeting = require('../models/Meeting');
const { protect } = require('../middleware/auth');
const { analyzeMeeting } = require('../services/aiService');
const { parseFile } = require('../services/fileParser');

// Configure multer for file upload (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept .txt, .vtt, .docx, .doc, .pdf
    const allowedExtensions = ['.txt', '.vtt', '.docx', '.doc', '.pdf'];
    const extension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
    
    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload .txt, .vtt, .docx, .doc, or .pdf files'), false);
    }
  }
});

// @route   POST /api/meetings/upload
// @desc    Upload and analyze meeting transcript
// @access  Private
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    console.log(`Processing ${req.file.originalname}...`);

    // Parse file to text based on format
    let transcript;
    try {
      transcript = await parseFile(req.file.buffer, req.file.originalname);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(400).json({
        success: false,
        message: parseError.message
      });
    }

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'File is empty or contains no readable text'
      });
    }

    console.log(`Extracted ${transcript.length} characters from file`);

    // Analyze with Claude AI
    const aiResult = await analyzeMeeting(transcript);

    // Get title from request body or fallback to filename
    const title = req.body.title || req.file.originalname.replace(/\.(txt|vtt|docx|doc|pdf)$/i, '');

    // Get tags from request body or AI-generated tags
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        tags = [];
      }
    }
    // Merge with AI-generated tags (remove duplicates)
    if (aiResult.analysis.tags) {
      tags = [...new Set([...tags, ...aiResult.analysis.tags])];
    }

    // Create meeting document
    const meeting = await Meeting.create({
      userId: req.user._id,
      title: title,
      tags: tags,
      originalTranscript: transcript,
      analysis: {
        summary: aiResult.analysis.summary,
        actionItems: aiResult.analysis.actionItems,
        keyDecisions: aiResult.analysis.keyDecisions,
        importantDates: aiResult.analysis.importantDates
      },
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

    console.log('Meeting created successfully');

    res.status(201).json({
      success: true,
      meeting
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading meeting'
    });
  }
});

// @route   GET /api/meetings
// @desc    Get all meetings for authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const meetings = await Meeting.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: meetings.length,
      meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meetings'
    });
  }
});

// @route   GET /api/meetings/:id
// @desc    Get single meeting by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    res.json({
      success: true,
      meeting
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meeting'
    });
  }
});

// @route   DELETE /api/meetings/:id
// @desc    Delete meeting by ID
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found'
      });
    }

    await meeting.deleteOne();

    res.json({
      success: true,
      message: 'Meeting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting meeting'
    });
  }
});

// @route   GET /api/meetings/analytics/data
// @desc    Get analytics data
// @access  Private
router.get('/analytics/data', protect, async (req, res) => {
  try {
    const meetings = await Meeting.find({ userId: req.user._id });

    // Calculate statistics
    const totalMeetings = meetings.length;
    const totalActionItems = meetings.reduce(
      (sum, meeting) => sum + (meeting.analysis.actionItems?.length || 0),
      0
    );

    // Action items by priority
    const actionItemsByPriority = {
      High: 0,
      Medium: 0,
      Low: 0
    };

    meetings.forEach(meeting => {
      meeting.analysis.actionItems?.forEach(item => {
        if (actionItemsByPriority[item.priority] !== undefined) {
          actionItemsByPriority[item.priority]++;
        }
      });
    });

    // Top tags
    const tagCounts = {};
    meetings.forEach(meeting => {
      meeting.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      success: true,
      analytics: {
        totalMeetings,
        totalActionItems,
        actionItemsByPriority,
        topTags
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

module.exports = router;