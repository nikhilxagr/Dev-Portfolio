import mongoose from 'mongoose'

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 500,
    },
    category: {
      type: String,
      enum: ['Web Dev', 'Cyber Security', 'AI'],
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
      validate: {
        validator: (values) => values.length <= 20,
        message: 'Too many tech stack entries',
      },
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    problemStatement: {
      type: String,
      trim: true,
      maxlength: 1400,
      default: '',
    },
    solutionSummary: {
      type: String,
      trim: true,
      maxlength: 2000,
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
  },
  {
    timestamps: true,
  },
)

projectSchema.pre('validate', function projectSlugHook(next) {
  if (!this.slug && this.title) {
    this.slug = toSlug(this.title)
  }
  next()
})

projectSchema.index({ slug: 1 }, { unique: true })
projectSchema.index({ category: 1 })
projectSchema.index({ featured: 1 })

const Project = mongoose.model('Project', projectSchema)

export default Project
