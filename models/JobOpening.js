import mongoose from 'mongoose';

const jobOpeningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String, required: true }],
  slug: { type: String, required: true, unique: true },
}, {
  timestamps: true,
});

const JobOpening = mongoose.model('JobOpening', jobOpeningSchema);
export default JobOpening;
