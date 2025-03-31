import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const EnrollmentSchema = new mongoose.Schema({
  enrollmentId: { type: String, default: uuidv4, unique: true },
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  course: String,
  message: String,
  date: { type: Date, default: Date.now },
  adminRemark: { type: String, default: "" },
});

const Enrollment = mongoose.model("Enrollment", EnrollmentSchema);
export default Enrollment;