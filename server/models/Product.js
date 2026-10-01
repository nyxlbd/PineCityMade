import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
    price: Number,
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    variants: [productVariantSchema],
    weight: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Published', 'Rejected', 'Out of Stock', 'Archived'],
      default: 'Draft',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
