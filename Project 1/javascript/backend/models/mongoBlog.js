import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

BlogSchema.methods = {
  updateTitle(newTitle) {
    if (newTitle && newTitle.trim() !== '') {
      this.title = newTitle;
      return this.save();
    }
    return false;
  },
  
  updateContent(newContent) {
    if (newContent && newContent.trim() !== '') {
      this.content = newContent;
      return this.save();
    }
    return false;
  },
  
  toJSON() {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
  }
};

const Blog = mongoose.model('Blog', BlogSchema);

export default Blog;