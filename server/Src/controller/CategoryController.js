import { StatusCodes } from "http-status-codes";
import Categorymodel from "../model/Category.js";


export async function AddCategory(request, response) {
  try {
     const saveCategory=  Categorymodel(request.body);
    const DbsaveCategory = await saveCategory.save();
    response.status(StatusCodes.OK).json(DbsaveCategory)
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message,error})
  }
}

export async function FeatchAllCategory(request,response) {
  try {
    const featchall =  await Categorymodel.find();
    response.status(StatusCodes.OK).json(featchall);
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
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
    response.status(StatusCodes.NO_CONTENT).json(Categorymodel.message);
  } catch (error) {
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
}