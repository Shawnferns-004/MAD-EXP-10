import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  type: String,
  description: String,
  location: String,
  imageUrl: String, 
  severity: String,
  priority: String,
  department: String,
  locationName: String,
  status: {
    type: String,
    default: "Pending"
  },
  // userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  userId: String
}, { timestamps: true });  // Enables createdAt and updatedAt

const Report = mongoose.model('Report', reportSchema);

export default Report;
