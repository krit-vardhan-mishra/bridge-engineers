import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  age: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

UserSchema.virtual('blogs', {
  ref: 'Blog',
  localField: '_id',
  foreignField: 'author',
  justOne: false
});

UserSchema.methods = {
  canPostBlog() {
    return this.age >= 13;
  },
  toJSON() {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
  }
};

UserSchema.statics = {
  async getUsersWithBlogs() {
    return this.find().populate('blogs').exec();
  },
  async getUsersWithoutBlogs() {
    return this.aggregate([
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: 'author',
          as: 'blogs'
        }
      },
      {
        $match: {
          blogs: { $size: 0 }
        }
      }
    ]);
  }
};

const User = mongoose.model('User', UserSchema);

export default User;