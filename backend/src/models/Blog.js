import mongoose from 'mongoose'

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      maxlength: 80,
      default: 'Engineering',
    },
    readTime: {
      type: String,
      trim: true,
      maxlength: 40,
      default: '5 min read',
    },
    source: {
      type: String,
      trim: true,
      maxlength: 80,
      default: 'Portfolio',
    },
    url: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 25000,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (values) => values.length <= 15,
        message: 'Too many tags provided',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

blogSchema.pre('validate', function blogSlugHook(next) {
  if (!this.slug && this.title) {
    this.slug = toSlug(this.title)
  }
  next()
})


blogSchema.index({ tags: 1 })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
