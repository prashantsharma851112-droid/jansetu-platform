const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

exports.getWorkerTasks = async (req, res) => {
  try {
    const tasks = await Complaint.find({ assignedWorker: req.user._id })
      .populate('category')
      .populate('user', 'name phone email avatar address')
      .sort({ updatedAt: -1 });

    const totalResolved = tasks.filter((t) => t.status === 'RESOLVED').length;
    const totalPending = tasks.filter((t) => t.status !== 'RESOLVED' && t.status !== 'REJECTED').length;

    res.status(200).json({
      success: true,
      stats: {
        totalAssigned: tasks.length,
        totalResolved,
        totalPending,
      },
      tasks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUnassignedPool = async (req, res) => {
  try {
    const { category, area } = req.query;
    const filter = {
      assignedWorker: null,
      status: 'SUBMITTED',
    };

    if (category) filter.category = category;
    if (area) filter.area = area;

    const unassigned = await Complaint.find(filter)
      .populate('category')
      .populate('user', 'name phone avatar address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: unassigned.length,
      unassigned,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptTask = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.assignedWorker) {
      return res.status(400).json({ success: false, message: 'Complaint is already assigned to a worker' });
    }

    complaint.assignedWorker = req.user._id;
    complaint.status = 'ASSIGNED';
    complaint.timeline.push({
      stage: 'ASSIGNED',
      note: `Claimed by field worker ${req.user.name} (${req.user.department || 'Department Staff'})`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate('category')
      .populate('user', 'name email avatar phone')
      .populate('assignedWorker', 'name phone department avatar');

    // Notify citizen
    await Notification.create({
      user: complaint.user,
      message: `Your complaint ${complaint.complaintCode} has been assigned to worker ${req.user.name}.`,
      complaintId: complaint._id,
      type: 'ASSIGNED',
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('complaintUpdated', populated);
    }

    res.status(200).json({
      success: true,
      message: 'Task successfully assigned to you',
      complaint: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTaskStage = async (req, res) => {
  try {
    const { stage, note } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.assignedWorker && complaint.assignedWorker.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'You are not assigned to this complaint' });
    }

    const validStages = ['IN_PROGRESS', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'];
    if (!validStages.includes(stage)) {
      return res.status(400).json({ success: false, message: 'Invalid target stage' });
    }

    // New uploaded files from Multer
    const newImages = [];
    if (req.files && req.files.length > 0) {
      const imageStage = stage === 'RESOLVED' ? 'AFTER' : 'PROGRESS';
      req.files.forEach((file) => {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        newImages.push({
          url: fileUrl,
          stage: imageStage,
          uploadedBy: req.user._id,
        });
      });
    } else if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
      const imageStage = stage === 'RESOLVED' ? 'AFTER' : 'PROGRESS';
      req.body.imageUrls.forEach((url) => {
        newImages.push({
          url,
          stage: imageStage,
          uploadedBy: req.user._id,
        });
      });
    }

    // Require AFTER photo if resolving
    if (stage === 'RESOLVED') {
      const hasAfterPhoto = complaint.images.some((img) => img.stage === 'AFTER') || newImages.some((img) => img.stage === 'AFTER');
      if (!hasAfterPhoto) {
        return res.status(400).json({
          success: false,
          message: 'Proof of work (After Photo) is mandatory before marking a complaint as Resolved.',
        });
      }
      complaint.resolvedAt = new Date();
    }

    complaint.status = stage;
    if (newImages.length > 0) {
      complaint.images.push(...newImages);
    }

    complaint.timeline.push({
      stage,
      note: note || `Stage updated to ${stage} by ${req.user.name}`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate('category')
      .populate('user', 'name email avatar phone')
      .populate('assignedWorker', 'name phone department avatar')
      .populate('timeline.updatedBy', 'name role avatar');

    // Notify citizen
    await Notification.create({
      user: complaint.user,
      message: `Your complaint ${complaint.complaintCode} status changed to: ${stage}`,
      complaintId: complaint._id,
      type: stage,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('complaintUpdated', populated);
    }

    res.status(200).json({
      success: true,
      message: `Task updated to ${stage}`,
      complaint: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
