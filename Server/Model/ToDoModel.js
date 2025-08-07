import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  deadline: {
    type: Date,
    default: null,
  },
  repeatEnabled: {
    type: Boolean,
    default: false,
  },
  repeatType: {
  type: String,
  enum: ['never', 'daily', 'weekly', 'monthly', 'yearly'], //
  default: 'daily',
  },
  reminderTime: {
    type: String,
    default: null,
  },
  timePreference: {
    type: String,
    default: '21:00',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Middleware to ensure backward compatibility and sync status/completed
taskSchema.pre('save', function(next) {
  // Sync completed and status
  if (this.isModified('completed')) {
    this.status = this.completed ? 'closed' : 'open';
  }
  if (this.isModified('status')) {
    this.completed = this.status === 'closed';
  }
  next();
});

// Post-find middleware to handle any existing data that might be missing fields
taskSchema.post('find', function(docs) {
  docs.forEach(doc => {
    if (!doc.status) {
      doc.status = doc.completed ? 'closed' : 'open';
    }
    if (doc.repeatEnabled === undefined || doc.repeatEnabled === null) {
      doc.repeatEnabled = false;
    }
    if (!doc.timePreference) {
      doc.timePreference = '21:00';
    }
  });
});

taskSchema.post('findOne', function(doc) {
  if (doc) {
    if (!doc.status) {
      doc.status = doc.completed ? 'closed' : 'open';
    }
    if (doc.repeatEnabled === undefined || doc.repeatEnabled === null) {
      doc.repeatEnabled = false;
    }
    if (!doc.timePreference) {
      doc.timePreference = '21:00';
    }
  }
});

// Index for better performance on user queries
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, repeatEnabled: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
