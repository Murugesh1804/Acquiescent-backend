import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Query = mongoose.model("Query", querySchema);

export default Query;
