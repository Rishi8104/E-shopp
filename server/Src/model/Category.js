import mongoose from "mongoose";

const CategorySchema = mongoose.Schema(
  {
    image: {data: Buffer,contentType: String },
    Categoryname: { type: String, required: true },
    Quntity: { type: Number, required: true },
    isStock: { type: Boolean, required: true },
  },{timestamps: true});

const Categorymodel = mongoose.model("Category", CategorySchema);
export default Categorymodel;
