import Query from "../models/query.js";

// Store Query
const storeQuery = async (req, res) => {
  try {
    const query = new Query(req.body);
    console.log(query);
    await query.save();
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
