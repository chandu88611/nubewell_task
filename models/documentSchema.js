import mongoose from 'mongoose';

 
const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, 
  }
);

 
documentSchema.index({ content: 'text' });

// Export the model
const Document = mongoose.model('Document', documentSchema);

export default Document;
