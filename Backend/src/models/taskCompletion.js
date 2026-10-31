import mongoose from 'mongoose';

const taskCompletionSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'task',
      required: true,
    },

    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },

    completionDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

taskCompletionSchema.index({
  room: 1,
  completionDate: 1,
});

taskCompletionSchema.index({
  room: 1,
  completedBy: 1,
  completionDate: 1,
});

const taskCompletion = mongoose.model('taskCompletion', taskCompletionSchema);

export default taskCompletion;
