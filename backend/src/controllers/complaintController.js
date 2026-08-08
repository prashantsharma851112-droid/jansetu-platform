const Complaint = require('../models/Complaint');
const Category = require('../models/Category');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const User = require('../models/User');

const generateComplaintCode = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  const number = (count + 1).toString().padStart(6, '0');
  return `JS-${year}-${number}`;
};

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, categoryId, priority, latitude, longitude, address, area, pincode } = req.body;

    if (!title || !description || !categoryId || !latitude || !longitude || !address) {
      return res.status(400).json({ success: false, message: 'Missing required complaint fields' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Selected category does not exist' });
    }

    const complaintCode = await generateComplaintCode();

    // Image URLs uploaded via multer
    const imageList = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const fileUrl = `/uploads/${file.filename}`;
        imageList.push({
          url: fileUrl,
          stage: 'BEFORE',
          uploadedBy: req.user._id,
        });
      });
    } else if (req.body.imageUrls && Array.isArray(req.body.imageUrls)) {
      req.body.imageUrls.forEach((url) => {
        imageList.push({
          url,
          stage: 'BEFORE',
          uploadedBy: req.user._id,
        });
      });
    }

    const complaint = await Complaint.create({
      complaintCode,
      title,
      description,
      category: categoryId,
      user: req.user._id,
      priority: priority || 'MEDIUM',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      area: area || 'Central Zone',
      pincode: pincode || '110001',
      status: 'SUBMITTED',
      images: imageList,
      timeline: [
        {
          stage: 'SUBMITTED',
          note: 'Complaint registered by citizen and dispatched to department.',
          updatedBy: req.user._id,
        },
      ],
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('category')
      .populate('user', 'name email avatar phone');

    // Notify user
    await Notification.create({
      user: req.user._id,
      message: `Your complaint ${complaintCode} has been successfully submitted!`,
      complaintId: complaint._id,
      type: 'SUBMITTED',
    });

    // Broadcast socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('complaintCreated', populated);
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { status, category, area, priority, search, page = 1, limit = 20, isMine, isNearby } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (area) filter.area = area;
    if (priority) filter.priority = priority;

    if (isMine === 'true' && req.user) {
      filter.user = req.user._id;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintCode: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Complaint.countDocuments(filter);

    const complaints = await Complaint.find(filter)
      .populate('category')
      .populate('user', 'name avatar email phone')
      .populate('assignedWorker', 'name email phone department area avatar role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('category')
      .populate('user', 'name avatar email phone address')
      .populate('assignedWorker', 'name phone department avatar')
      .populate('timeline.updatedBy', 'name role avatar')
      .populate('images.uploadedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const feedback = await Feedback.findOne({ complaint: complaint._id }).populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      complaint,
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = complaint.upvotes.includes(userId);

    if (hasUpvoted) {
      complaint.upvotes = complaint.upvotes.filter((id) => id.toString() !== userId.toString());
      complaint.upvoteCount = Math.max(0, complaint.upvoteCount - 1);
    } else {
      complaint.upvotes.push(userId);
      complaint.upvoteCount += 1;
    }

    await complaint.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('complaintUpvoted', { complaintId: complaint._id, upvoteCount: complaint.upvoteCount });
    }

    res.status(200).json({
      success: true,
      upvoted: !hasUpvoted,
      upvoteCount: complaint.upvoteCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only the complaint owner can provide feedback' });
    }

    if (complaint.status !== 'RESOLVED') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted for resolved complaints' });
    }

    const existing = await Feedback.findOne({ complaint: complaintId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.status(200).json({ success: true, message: 'Feedback updated', feedback: existing });
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      user: req.user._id,
      rating,
      comment: comment || '',
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
