import Course from "../models/course.model.js"
import User from "../models/user.model.js"

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const { status, featured, limit = 10, page = 1 } = req.query
    const query = {}

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Filter by featured if provided
    if (featured) {
      query.featured = featured === "true"
    }

    // For non-admin users, only show published courses
    if (!req.user || req.user.role !== "admin") {
      query.status = "published"
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const courses = await Course.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit))

    const total = await Course.countDocuments(query)

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      totalPages: Math.ceil(total / Number.parseInt(limit)),
      currentPage: Number.parseInt(page),
      courses,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single course by slug
export const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // For non-admin users, only show published courses
    if ((!req.user || req.user.role !== "admin") && course.status !== "published") {
      return res.status(404).json({ message: "Course not found" })
    }

    res.status(200).json({
      success: true,
      course,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new course
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body)

    res.status(201).json({
      success: true,
      course,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.status(200).json({
      success: true,
      course,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Remove course from user interests and enrollments
    await User.updateMany({ courseInterests: req.params.id }, { $pull: { courseInterests: req.params.id } })

    await User.updateMany(
      { "enrolledCourses.course": req.params.id },
      { $pull: { enrolledCourses: { course: req.params.id } } },
    )

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get course statistics
export const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments()
    const publishedCourses = await Course.countDocuments({ status: "published" })
    const draftCourses = await Course.countDocuments({ status: "draft" })
    const featuredCourses = await Course.countDocuments({ featured: true })

    // Get total enrollment count
    const enrollmentStats = await Course.aggregate([
      { $group: { _id: null, totalEnrollments: { $sum: "$enrollmentCount" } } },
    ])

    const totalEnrollments = enrollmentStats.length > 0 ? enrollmentStats[0].totalEnrollments : 0

    // Get top courses by enrollment
    const topCourses = await Course.find().sort({ enrollmentCount: -1 }).limit(5).select("title slug enrollmentCount")

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        publishedCourses,
        draftCourses,
        featuredCourses,
        totalEnrollments,
        topCourses,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

