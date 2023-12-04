import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    image: { data: Buffer,contentType: String,},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category:{
        type:mongoose.ObjectId,
        ref:"Category",
        required:true,
    },
    description: { type: String, required: true },
    isStock: { type: Boolean, required: true },
    Shipping:{
      type:Boolean,
    }
  },
    // slug:{type:String, required:true},
  { timestamps: true }
);

const Productmodel = mongoose.model("Product", productSchema);
export default Productmodel;
