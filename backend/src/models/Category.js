const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'AlertTriangle', // Lucide icon identifier
    },
    defaultDepartment: {
      type: String,
      required: [true, 'Default department is required'],
    },
    colorCode: {
      type: String,
      default: '#3b82f6', // Hex color code
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
