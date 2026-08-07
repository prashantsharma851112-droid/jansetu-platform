const express = require('express');
const router = express.Router();
const { getWorkerTasks, getUnassignedPool, acceptTask, updateTaskStage } = require('../controllers/workerController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate);
router.use(authorize('WORKER', 'ADMIN'));

router.get('/my-tasks', getWorkerTasks);
router.get('/pool', getUnassignedPool);
router.post('/accept/:id', acceptTask);
router.put('/update-stage/:id', upload.array('images', 5), updateTaskStage);

module.exports = router;
