import Blog from "../models/blog.model.js"

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { status, category, tag, limit = 10, page = 1 } = req.query
    const query = {}

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Filter by category if provided
    if (category) {
      query.categories = category
    }

    // Filter by tag if provided
    if (tag) {
      query.tags = tag
    }


    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)

    const blogs = await Blog.find(query)
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Blog.countDocuments(query)

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / Number.parseInt(limit)),
      currentPage: Number.parseInt(page),
      blogs,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name")

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    // For non-admin users, only show published blogs
    if ((!req.user || req.user.role !== "admin") && blog.status !== "published") {
      return res.status(404).json({ message: "Blog not found" })
    }

    // Increment view count
    blog.viewCount += 1
    await blog.save()

    res.status(200).json({
      success: true,
      blog,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// // Create new blog
// export const createBlog = async (req, res) => {
//   try {
//     // Set author to current user
//     req.body.author = req.user.id

//     const blog = await Blog.create(req.body)

//     res.status(201).json({
//       success: true,
//       blog,
//     })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

export const createBlog = async (req, res) => {
  try {
    // Set author to current user
    req.body.author = req.admin.id

    const blog = await Blog.create(req.body)

    res.status(201).json({
      success: true,
      blog,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("author", "name")

    res.status(200).json({
      success: true,
      blog: updatedBlog,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" })
    }

    await blog.deleteOne()

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get blog categories and tags
export const getBlogCategoriesAndTags = async (req, res) => {
  try {
    const categoriesAgg = await Blog.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const tagsAgg = await Blog.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const categories = categoriesAgg.map((cat) => ({ name: cat._id, count: cat.count }))
    const tags = tagsAgg.map((tag) => ({ name: tag._id, count: tag.count }))

    res.status(200).json({
      success: true,
      categories,
      tags,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


