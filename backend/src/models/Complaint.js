const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  stage: { type: String, enum: ['BEFORE', 'PROGRESS', 'AFTER'], default: 'BEFORE' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const timelineSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
    required: true
  },
  note: { type: String, default: '' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema(
  {
    complaintCode: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'SUBMITTED',
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      default: 'Central Ward',
    },
    pincode: {
      type: String,
      default: '110001',
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    images: [imageSchema],
    timeline: [timelineSchema],
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    upvoteCount: {
      type: Number,
      default: 0,
    },
    overdueEscalated: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

complaintSchema.index({ latitude: 1, longitude: 1 });
complaintSchema.index({ status: 1, category: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
