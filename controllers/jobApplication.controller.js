import JobApplication from "../models/jobApplication.model.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const submitApplication = async (req, res) => {
  try {
    const { name, email, phone, experience, jobTitle } = req.body
    const resumeFile = req.file

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" })
    }

    // Generate file URL using the server's URL
    const resumeUrl = `${req.protocol}://${req.get("host")}/uploads/${resumeFile.filename}`

    const application = await JobApplication.create({
      name,
      email,
      phone,
      experience,
      jobTitle,
      resume: resumeUrl,
    })

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
      error: error.message,
    })
  }
}

export const getApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query = status ? { status } : {}

    const applications = await JobApplication.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await JobApplication.countDocuments(query)

    res.status(200).json({
      success: true,
      data: applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
      error: error.message,
    })
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const application = await JobApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update application status",
      error: error.message,
    })
  }
}