import mongoose from 'mongoose';

const  UserSchema = mongoose.Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String, required:true},
    pincode:{type:Number,required:true},
    answer:{type:String,required:true},
    GST:{type:Number,required:true},
    role:{ type:String,
      enum:["Company","Admin"],
      default:"Company",
    }
},{timestamps:true})

const Usermodel = mongoose.model('User', UserSchema);
export default Usermodel;