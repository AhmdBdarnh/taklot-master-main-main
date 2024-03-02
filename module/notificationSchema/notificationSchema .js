const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technical',
    required: true,
  },
  content: String,
  delivered: {
    type: Boolean,
    default: false,
  },
  // Include other relevant fields for your notifications
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
