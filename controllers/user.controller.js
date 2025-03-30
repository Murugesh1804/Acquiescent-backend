import User from "../models/user.model.js"
import Course from "../models/course.model.js"

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, limit = 10, page = 1 } = req.query
    const query = {}

    // Filter by role if provided
    if (role) {
      query.role = role
    }

    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await User.countDocuments(query)

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / Number.parseInt(limit)),
      currentPage: Number.parseInt(page),
      users,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("courseInterests", "title slug image")
      .populate("enrolledCourses.course", "title slug image")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update user
export const updateUser = async (req, res) => {
  try {
    // Don't allow role update unless admin
    if (req.body.role && req.user.role !== "admin") {
      delete req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select(
      "-password",
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Enroll user in course
export const enrollUserInCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if user is already enrolled
    const isEnrolled = user.enrolledCourses.some((enrollment) => enrollment.course.toString() === courseId)

    if (isEnrolled) {
      return res.status(400).json({ message: "User already enrolled in this course" })
    }

    // Add course to user's enrolled courses
    user.enrolledCourses.push({
      course: courseId,
      enrollmentDate: Date.now(),
      status: "active",
    })

    // Remove from course interests if present
    user.courseInterests = user.courseInterests.filter((interest) => interest.toString() !== courseId)

    await user.save()

    // Increment course enrollment count
    course.enrollmentCount += 1
    await course.save()

    res.status(200).json({
      success: true,
      message: "User enrolled successfully",
      enrollment: user.enrolledCourses[user.enrolledCourses.length - 1],
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const adminUsers = await User.countDocuments({ role: "admin" })
    const regularUsers = await User.countDocuments({ role: "user" })

    // Get users with course interests
    const usersWithInterests = await User.countDocuments({
      courseInterests: { $exists: true, $not: { $size: 0 } },
    })

    // Get users with enrollments
    const usersWithEnrollments = await User.countDocuments({
      enrolledCourses: { $exists: true, $not: { $size: 0 } },
    })

    // Get recent users
    const recentUsers = await User.find().select("name email createdAt").sort({ createdAt: -1 }).limit(5)

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        adminUsers,
        regularUsers,
        usersWithInterests,
        usersWithEnrollments,
        recentUsers,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

