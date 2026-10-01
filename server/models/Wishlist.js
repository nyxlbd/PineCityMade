import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  },
  { timestamps: true },
);

export default mongoose.model('Wishlist', wishlistSchema);
