import mongoose from "mongoose";
const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  whatsapp: {
    type: String,
    required: [true, "WhatsApp number is required"],
    unique: true,
  },
  destination: {
    type: String,
    required: [true, 'Destination is required']
  },
  numberOfDays: {
    type: Number,
    required: [true, 'Number of days is required'],
    min: [1, 'Minimum 1 day'],
    max: [30, 'Maximum 30 days']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required']
  },
  interest: {
    type: [String],
    default: []
  },
  generatedItinerary: {
    type: String
 },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: [ "processing","completed","failed"],
    default: 'processing'
  }
});
export const leadsModel = mongoose.model("leads",LeadSchema)