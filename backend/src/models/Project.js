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
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 15,
      maxlength: 800,
    },
    overview: {
      type: String,
      trim: true,
      maxlength: 2500,
      default: '',
    },
    category: {
      type: String,
      enum: ['Full Stack', 'Web Dev', 'Cyber Security', 'AI', 'Python'],
      required: true,
    },
    projectType: {
      type: String,
      enum: ['Solo', 'Collab', 'Collaboration'],
      default: 'Solo',
    },
    techStack: {
      type: [String],
      default: [],
      validate: {
        validator: (values) => values.length <= 25,
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
    apkUrl: {
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
      maxlength: 2000,
      default: '',
    },
    solutionSummary: {
      type: String,
      trim: true,
      maxlength: 2500,
      default: '',
    },
    result: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: '',
    },
    outcome: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: '',
    },
    role: {
      type: String,
      trim: true,
      maxlength: 400,
      default: '',
    },
    context: {
      type: String,
      trim: true,
      maxlength: 400,
      default: '',
    },
    impact: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
    },
    challenges: {
      type: [String],
      default: [],
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


projectSchema.index({ category: 1 })
projectSchema.index({ featured: 1 })

const Project = mongoose.model('Project', projectSchema)

export default Project
