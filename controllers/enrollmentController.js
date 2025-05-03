import Enrollment from "../models/enrollment.js";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const createEnrollment = async (req, res) => {
  try {
    const enrollmentId = uuidv4();
    const enrollmentData = { ...req.body, enrollmentId };
    const enrollment = new Enrollment(enrollmentData);

    await enrollment.save();

    const {
      firstName,
      lastName,
      email,
      phone,
      course,
      message,
      date
    } = enrollment;

    // Send email with required details
    try {
      await axios.post(`https://api.acquiescent.in/api/email/send`, {
        title: "New Course Enrollment",
        body: `
📥 A new course enrollment has been received!

🆔 Enrollment ID: ${enrollmentId}
👤 Name: ${firstName} ${lastName}
📧 Email: ${email}
📱 Phone: ${phone}
📚 Course: ${course}
📝 Message: ${message || "N/A"}
📅 Date: ${new Date(date).toLocaleString()}

        `
      });
    } catch (emailErr) {
      console.error("Failed to send enrollment email:", emailErr.message);
    }

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find();
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitRemark = async (req, res) => {
    try {
      const { enrollmentId, remark } = req.body;
  
      // Ensure the ID is valid before querying
      if (!enrollmentId) {
        return res.status(400).json({ message: "Enrollment ID is required" });
      }
  
      const enrollment = await Enrollment.findById(enrollmentId);
      if (!enrollment) {
        console.log("Enrollment not found");
        return res.status(404).json({ message: "Enrollment not found" });
      }
  
      enrollment.adminRemark = remark;
      await enrollment.save();
  
      res.status(200).json({ message: "Remark added successfully", enrollment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
