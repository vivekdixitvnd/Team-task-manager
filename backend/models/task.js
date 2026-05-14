const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  dueDate: Date,
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('task', taskSchema);
