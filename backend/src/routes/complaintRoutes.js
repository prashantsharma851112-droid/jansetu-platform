const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  upvoteComplaint,
  addFeedback,
} = require('../controllers/complaintController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', optionalAuth, getComplaints);
router.get('/:id', getComplaintById);
router.post('/', authenticate, upload.array('images', 5), createComplaint);
router.post('/:id/upvote', authenticate, upvoteComplaint);
router.post('/:id/feedback', authenticate, addFeedback);

module.exports = router;
