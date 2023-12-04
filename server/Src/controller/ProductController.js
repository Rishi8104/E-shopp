import { StatusCodes } from "http-status-codes";
import Productmodel from "../model/Product.js";


export async function AddProduct(request, response) {
  try {
     const saveproduct=  Productmodel(request.body);
    const DbsaveProduct = await saveproduct.save();
    response.status(StatusCodes.OK).json(DbsaveProduct)
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message,error})
  }
}

export async function FeatchAllProduct(request,response) {
  try {
    const featchall =  await Productmodel.find();
    response.status(StatusCodes.OK).json(featchall);
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export async function FeatchAllisStock(request, response) {
  try {
    const CategoryFatch = await Productmodel.find({ isStock: true });
    response.status(StatusCodes.OK).json(CategoryFatch);
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error.message.error);
  }
}

export async function FeatchAllOutofStock(request, response) {
  try {
    const CategoryFatch = await Productmodel.find({ isStock: false });
    response.status(StatusCodes.OK).json(CategoryFatch);
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(error.message.error);
  }
}



export async function deleteProduct(request, response) {
  try {
    await Productmodel.findOneAndDelete({ _id: request.params.id._id });
    response.status(StatusCodes.NO_CONTENT).json({message:"Product is deleted"});
  } catch (error) {
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
  }
}