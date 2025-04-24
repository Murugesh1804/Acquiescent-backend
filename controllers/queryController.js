import Query from "../models/query.js";
import axios from "axios";
const storeQuery = async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();

    const {
      firstName,
      lastName,
      email,
      phone,
      subject,
      message,
      createdAt
    } = query;

    // Send notification email
    try {
      await axios.post(`https://api.acquiescent.in/api/email/send`, {
        title: `📩 New Query Submitted: ${subject}`,
        body: `
You have received a new query from the website:

👤 Name: ${firstName} ${lastName}
📧 Email: ${email}
📱 Phone: ${phone}
📌 Subject: ${subject}
📝 Message: ${message}
📅 Submitted At: ${new Date(createdAt).toLocaleString()}

        `
      });
    } catch (emailErr) {
      console.error("Failed to send query email:", emailErr.message);
    }

    res.status(201).json({ message: "Query submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Queries
const getQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { storeQuery, getQueries };
