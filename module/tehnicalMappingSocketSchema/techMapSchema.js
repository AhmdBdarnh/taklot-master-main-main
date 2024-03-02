const mongoose = require('mongoose');

const technicianSocketMappingSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technical',
    required: true,
    unique: true, // Ensure each technician has only one mapping
    index: true, // Add an index on technicianId to improve query performance
  },
  socketId: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Timestamps can help you track when the mapping was last updated

// Optionally, explicitly define the index (useful if you need more complex indexing)
// technicianSocketMappingSchema.index({ technicianId: 1 });

// Create the model
const TechnicianSocketMapping = mongoose.model('TechnicianSocketMapping', technicianSocketMappingSchema);

module.exports = TechnicianSocketMapping;
