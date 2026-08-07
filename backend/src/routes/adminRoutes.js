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
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

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

module.exports = router;
