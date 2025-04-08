import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  department:[{
    type:String
  }],
  password: String,
  type:[{
    type:String
  }],
  fcmToken: String
});



const Admin = mongoose.model('Admin', adminSchema);

export default Admin;

