import mongoose from 'mongoose';

const BrochureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  ip: String,
  userAgent: String,
  title: { type: String, required: false },
  description: { type: String, required: false },
  imageUrl: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

const Brochure = mongoose.model('Brochure', BrochureSchema);
export default Brochure;
