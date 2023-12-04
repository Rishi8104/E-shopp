import JWT from 'jsonwebtoken';
import Usermodel from '../model/UserModel';
import { StatusCodes } from 'http-status-codes';



//procted(private ) Router Token Basded
export async function requiredSignIN(request, response,next) {
  try {
  const decode =  JWT.verify(request.headers.authorization,Process.env.JWT_VERIFY);
  request.User= decode;
  next();
  } catch (error) {
      console.log(error);

  }
};


export async function IsAdmin(request,response,next) {
  try {
  const User = await  Usermodel.findById(request.User._id);
  if (User.role !== Admin) {
     return response.status(StatusCodes.UNAUTHORIZED).json({success:false,
    message:"Unauthorized Accessed"});
  }
  else{
    next()
  }
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.UNAUTHORIZED).json({message:"error in Admin Middleware", error,success:false});
  }
}