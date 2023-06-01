const mongoose = require('mongoose');

const divisionSchema = new mongoose.Schema({
  division_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  employees: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Employee',
    required: true
  },
  start_date: {
    type: Date,
    required: true
  },
  head_division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  budget: {
    type: Number,
    required: true
  }
});

const Division = mongoose.model('Division', divisionSchema);

module.exports = Division;
