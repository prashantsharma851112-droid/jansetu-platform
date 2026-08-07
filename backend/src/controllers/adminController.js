const Complaint = require('../models/Complaint');
const Category = require('../models/Category');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Inquiry = require('../models/Inquiry');
const { sendInquiryReplyEmail } = require('../utils/emailService');

exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const inquiry = await Inquiry.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Inquiry received successfully', inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.status(200).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replyInquiry = async (req, res) => {
  try {
    const { replyMessage } = req.body;
    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    }
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        adminReply: replyMessage,
        repliedAt: new Date(),
        status: 'RESOLVED',
      },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    // Send email response to citizen email
    await sendInquiryReplyEmail({
      toEmail: inquiry.email,
      recipientName: inquiry.name,
      citizenMessage: inquiry.message,
      adminReply: replyMessage,
    });

    // Send in-app notification if citizen is registered user
    const citizenUser = await User.findOne({ email: inquiry.email.toLowerCase() });
    if (citizenUser) {
      await Notification.create({
        user: citizenUser._id,
        message: `Admin responded to your public inquiry: "${replyMessage.substring(0, 60)}..."`,
      });
      const io = req.app.get('io');
      if (io) {
        io.emit('notification', {
          userId: citizenUser._id.toString(),
          message: `Admin responded to your public inquiry: "${replyMessage.substring(0, 60)}..."`,
        });
      }
    }

    res.status(200).json({ success: true, message: 'Reply saved & sent successfully', inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.status(200).json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: 'RESOLVED' });
    const pendingComplaints = await Complaint.countDocuments({
      status: { $in: ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW'] },
    });
    const criticalComplaints = await Complaint.countDocuments({ priority: 'CRITICAL', status: { $ne: 'RESOLVED' } });
    const overdueCount = await Complaint.countDocuments({ overdueEscalated: true, status: { $ne: 'RESOLVED' } });

    const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $unwind: '$categoryDetails' },
      {
        $project: {
          name: '$categoryDetails.name',
          color: '$categoryDetails.colorCode',
          count: 1,
        },
      },
    ]);

    // Area breakdown
    const areaStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$area',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Calculate average resolution time in hours
    const resolvedDocs = await Complaint.find({ status: 'RESOLVED', resolvedAt: { $ne: null } });
    let avgResolutionHours = 0;
    if (resolvedDocs.length > 0) {
      const totalHours = resolvedDocs.reduce((acc, curr) => {
        const diffMs = new Date(curr.resolvedAt) - new Date(curr.createdAt);
        return acc + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = (totalHours / resolvedDocs.length).toFixed(1);
    }

    res.status(200).json({
      success: true,
      analytics: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        criticalComplaints,
        overdueCount,
        resolutionRate,
        avgResolutionHours,
        categoryStats,
        areaStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHeatmapData = async (req, res) => {
  try {
    const points = await Complaint.find()
      .select('latitude longitude status priority title complaintCode address area')
      .populate('category', 'name colorCode icon');

    res.status(200).json({
      success: true,
      points,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, icon, defaultDepartment, colorCode, description } = req.body;

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      icon: icon || 'AlertTriangle',
      defaultDepartment: defaultDepartment || 'General Works',
      colorCode: colorCode || '#3b82f6',
      description: description || '',
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createWorker = async (req, res) => {
  try {
    const { name, email, password, phone, department, area, avatar } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const worker = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      phone: phone || '',
      department: department || 'Municipal Maintenance',
      area: area || 'Central Zone',
      role: 'WORKER',
      avatar: avatar || `https://i.pravatar.cc/150?u=${email.toLowerCase()}`,
    });

    res.status(201).json({
      success: true,
      message: 'Field worker account created',
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        department: worker.department,
        area: worker.area,
        role: worker.role,
        avatar: worker.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const { name, phone, department, area, avatar, password } = req.body;

    const worker = await User.findOne({ _id: req.params.id, role: 'WORKER' });
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker account not found' });
    }

    if (name) worker.name = name;
    if (phone !== undefined) worker.phone = phone;
    if (department) worker.department = department;
    if (area) worker.area = area;
    if (avatar) worker.avatar = avatar;
    if (password) worker.passwordHash = password;

    await worker.save();

    res.status(200).json({
      success: true,
      message: 'Worker details updated successfully',
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        department: worker.department,
        area: worker.area,
        role: worker.role,
        avatar: worker.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkers = async (req, res) => {
  try {
    const workers = await User.find({ role: 'WORKER' }).select('-passwordHash').sort({ createdAt: -1 });

    const workersWithStats = await Promise.all(
      workers.map(async (w) => {
        const assigned = await Complaint.countDocuments({ assignedWorker: w._id });
        const resolved = await Complaint.countDocuments({ assignedWorker: w._id, status: 'RESOLVED' });
        return {
          ...w.toObject(),
          assignedCount: assigned,
          resolvedCount: resolved,
        };
      })
    );

    res.status(200).json({ success: true, workers: workersWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getWorkerTasks = async (req, res) => {
  try {
    const workerId = req.params.id;
    const worker = await User.findOne({ _id: workerId, role: 'WORKER' }).select('-passwordHash');
    if (!worker) {
      return res.status(404).json({ success: false, message: 'Worker not found' });
    }

    const complaints = await Complaint.find({ assignedWorker: workerId })
      .populate('category', 'name colorCode')
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      worker,
      complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.assignWorkerManually = async (req, res) => {
  try {
    const { complaintId, workerId } = req.body;
    const complaint = await Complaint.findById(complaintId);
    const worker = await User.findById(workerId);

    if (!complaint || !worker) {
      return res.status(404).json({ success: false, message: 'Complaint or Worker not found' });
    }

    complaint.assignedWorker = worker._id;
    if (complaint.status === 'SUBMITTED') {
      complaint.status = 'ASSIGNED';
    }

    complaint.timeline.push({
      stage: 'ASSIGNED',
      note: `Reassigned manually by Municipal Admin to ${worker.name} (${worker.department})`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    const populated = await Complaint.findById(complaint._id)
      .populate('category')
      .populate('user', 'name email avatar phone')
      .populate('assignedWorker', 'name phone department avatar');

    // Notify citizen & worker
    await Notification.create({
      user: complaint.user,
      message: `Your complaint ${complaint.complaintCode} was assigned to ${worker.name}.`,
      complaintId: complaint._id,
    });

    await Notification.create({
      user: worker._id,
      message: `You were assigned ticket ${complaint.complaintCode} by Admin.`,
      complaintId: complaint._id,
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('complaintUpdated', populated);
    }

    res.status(200).json({ success: true, complaint: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.escalateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.overdueEscalated = !complaint.overdueEscalated;
    complaint.priority = complaint.overdueEscalated ? 'CRITICAL' : complaint.priority;

    complaint.timeline.push({
      stage: complaint.status,
      note: complaint.overdueEscalated ? '⚠️ Ticket ESCALATED to High Priority by Admin' : 'Ticket escalation removed',
      updatedBy: req.user._id,
    });

    await complaint.save();

    res.status(200).json({
      success: true,
      escalated: complaint.overdueEscalated,
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.exportComplaintsCSV = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('category', 'name')
      .populate('user', 'name email')
      .populate('assignedWorker', 'name department');

    let csv = 'Complaint Code,Title,Category,Status,Priority,Area,Address,Citizen,Worker,Created At\n';
    complaints.forEach((c) => {
      const code = `"${c.complaintCode || ''}"`;
      const title = `"${(c.title || '').replace(/"/g, '""')}"`;
      const category = `"${c.category ? c.category.name : 'N/A'}"`;
      const status = `"${c.status || ''}"`;
      const priority = `"${c.priority || ''}"`;
      const area = `"${c.area || ''}"`;
      const address = `"${(c.address || '').replace(/"/g, '""')}"`;
      const citizen = `"${c.user ? c.user.name : 'Unknown'}"`;
      const worker = `"${c.assignedWorker ? c.assignedWorker.name : 'Unassigned'}"`;
      const date = `"${new Date(c.createdAt).toLocaleDateString()}"`;

      csv += `${code},${title},${category},${status},${priority},${area},${address},${citizen},${worker},${date}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=JanSetu_Complaints_Report.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
