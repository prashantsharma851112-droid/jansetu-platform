const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getHeatmapData,
  createWorker,
  updateWorker,
  getWorkers,
  getWorkerTasks,
  assignWorkerManually,
  escalateComplaint,
  exportComplaintsCSV,
  submitInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  replyInquiry,
  testEmailConfig,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route for landing page inquiry submission
router.post('/inquiry/public', submitInquiry);

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/analytics', getAnalytics);
router.get('/heatmap', getHeatmapData);
router.get('/workers', getWorkers);
router.get('/workers/:id/tasks', getWorkerTasks);
router.post('/workers', createWorker);
router.put('/workers/:id', updateWorker);
router.post('/assign', assignWorkerManually);
router.put('/escalate/:id', escalateComplaint);
router.get('/export/csv', exportComplaintsCSV);
router.post('/test-email', testEmailConfig);

// Inquiries Admin Routes
router.get('/inquiries', getInquiries);
router.patch('/inquiries/:id', updateInquiryStatus);
router.post('/inquiries/:id/reply', replyInquiry);
router.delete('/inquiries/:id', deleteInquiry);

module.exports = router;
