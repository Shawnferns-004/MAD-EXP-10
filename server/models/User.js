import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  verified: { type: Boolean, default: false },
  verificationToken: String,
  warnings: {type: Number,default: 0},
  isBlocked: {type: Boolean, default: false},
  otp: { type: String },
  otpExpires: { type: Date },
}); // Enables createdAt and updatedAt

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

