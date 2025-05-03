import mongoose from 'mongoose';

const jobOpeningSchema = new mongoose.Schema({
  title: { type: String, required: true },           // Job Title
  experience: { type: String, required: true },      // Experience
  location: { type: String, required: true },        // Location
  description: { type: String, required: true },     // Job Description
  workModel: { type: String, required: true },       // Work Model
  client: { type: String },                          // Client (optional)
  position: { type: String, required: true },        // Position
  package: { type: String, required: true },         // Package
  requirements: [{ type: String, required: true }],  // Requirements (array of strings)
  slug: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});

const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);
export default JobOpening;
