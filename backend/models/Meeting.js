const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a meeting title'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  originalTranscript: {
    type: String,
    required: [true, 'Please provide a transcript']
  },
  analysis: {
    summary: {
      type: String,
      default: ''
    },
    actionItems: [{
      description: String,
      assignedTo: String,
      priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
      }
    }],
    keyDecisions: [{
      type: String
    }],
    importantDates: [{
      type: String
    }]
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Meeting', meetingSchema);
