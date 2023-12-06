import { StatusCodes } from "http-status-codes";
import Categorymodel from "../model/Category.js";
import slugify from "slugify";


// create a category controller
export async function AddCategory(request, response) {
  try {
     const {Categoryname,Quntity,image,isStock} = request.body;
     if (!Categoryname) {
      return response.status(StatusCodes.UNAUTHORIZED).json({message:"Category name is Required"});
     }
    const exisitngCategory =  await Categorymodel.findOne({Categoryname});
    if (exisitngCategory) {
      return response.status(StatusCodes.OK).json({success:true, message:"Category is Already Exists",exisitngCategory});
    }
    const Categories = await new Categorymodel({
        Categoryname,Quntity,image,isStock,
        slug:slugify(Categoryname)
    }).save();
    response.status(StatusCodes.CREATED).json({success:true, message:"Category is Created", Categories});
   
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"Error creating category",error})
  }
}

// update Category 
export async function UpdateCategory(request,response) {
  try {
    const {Categoryname}= request.body;
    const {id} =request.params;

  const updatebyId =  await Categorymodel.findByIdAndUpdate(id,
    {Categoryname,slug:slugify(Categoryname)},
    {new:true});
  
    response.status(StatusCodes.OK).json({success:true,message:"Category updated successfully",updatebyId});
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"Category updated Faild",error});
  }
}


// Get All Category 
export async function FeatchAllCategory(request,response) {
  try {
    const featchall =  await Categorymodel.find();
    response.status(StatusCodes.OK).json({success:true,message:"All Categories List Success",featchall});
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"All Categories List Failure,",error})
  }
}



export async function FeatchAllCategoryisStock(request, response) {
  try {
    const CategoryFatch = await Categorymodel.find({ isStock: true });
    response.status(StatusCodes.OK).json(CategoryFatch);
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error.message.error);
  }
}

export async function FeatchAllCategoryOutofStock(request, response) {
  try {
    const CategoryFatch = await Categorymodel.find({ isStock: false });
    response.status(StatusCodes.OK).json(CategoryFatch);
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error.message.error);
  }
}



export async function deleteCategory(request, response) {
  try {
    await Categorymodel.findOneAndDelete({ _id: request.params.id._id });
    response.status(StatusCodes.NO_CONTENT).json({success:true,message:"Category deleted successfully",});
  } catch (error) {
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success: false,message:"error deleting category",error});
  }
}