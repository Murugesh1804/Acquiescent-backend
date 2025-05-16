import Brochure from '../models/brochure.js';

import axios from "axios"; // if not already imported

export const createBrochureDownload = async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const newDownload = await Brochure.create({
      name,
      email,
      phone,
      course,
      ip,
      userAgent
    });

    // Trigger email sending to /send/email route
    try {
      await axios.post(`https://api.acquiescent.in/api/email/send`, {
        title: "New Brochure Download",
        body: `
New user downloaded the brochure:

Course: ${course}
Name: ${name}
Email: ${email}
Phone: ${phone}
IP Address: ${ip}
User Agent: ${userAgent}
        `
      });
    } catch (emailErr) {
      console.error("Failed to send email notification:", emailErr.message);
    }

    res.status(201).json({ success: true, data: newDownload });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


export const getAllBrochureDownloads = async (req, res) => {
  try {
    const downloads = await Brochure.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: downloads });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

