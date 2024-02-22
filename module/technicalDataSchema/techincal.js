const mongoose = require('mongoose');

const technicalSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: Number,
      required: true
    },
    yearsOfExperience: {
      type: Number,
      required: true
    },
    qualifications: {
      type: String,
      required: true
    },
    ratingAverage: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    
  });
  

const Technical = mongoose.model('Technical', technicalSchema);

module.exports = Technical;