import mongoose from "mongoose"

const syllabusItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
})

const syllabusModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  topics: [syllabusItemSchema],
})

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Course slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    duration: {
      type: String,
      required: [true, "Course duration is required"],
      trim: true,
    },
    schedule: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "Beginner to Intermediate",
        "Intermediate to Advanced",
        "Beginner to Advanced",
      ],
      required: [true, "Course level is required"],
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
    },
    discountPrice: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: [true, "Course image is required"],
    },
    brochureUrl: {
      type: String,
    },
    syllabus: [syllabusModuleSchema],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    instructor: {
      name: {
        type: String,
        required: [true, "Instructor name is required"],
        trim: true,
      },
      bio: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
      },
    },
    certification: {
      type: String,
      trim: true,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for formatted price
courseSchema.virtual("formattedPrice").get(function () {
  return `₹${this.price.toLocaleString("en-IN")}`
})

// Virtual for discount percentage
courseSchema.virtual("discountPercentage").get(function () {
  if (!this.discountPrice) return 0
  return Math.round(((this.price - this.discountPrice) / this.price) * 100)
})

// Create slug from title
courseSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next()

  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  next()
})

const Course = mongoose.model("Course", courseSchema)

export default Course

