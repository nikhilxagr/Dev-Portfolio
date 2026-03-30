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
    excerpt: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 40,
      maxlength: 15000,
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

blogSchema.index({ slug: 1 }, { unique: true })
blogSchema.index({ tags: 1 })

const Blog = mongoose.model('Blog', blogSchema)

export default Blog
