
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import OrderModel from "../model/Ordermodel.js";
import { comparePassword,hashedPassword} from "../Helper/authHelper.js";
import Usermodel from "../model/UserModel.js";
  
export async function Ragister(request, response) {
  try {
    const { name, email, password, address, city, state, pincode, answer, Gst } = request.body;

    // Validation
    if (!name || !email || !password || !address || !city || !state || !pincode || !answer || !Gst) {
      return response.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return response.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    // New User Registration
    const hashPassword = await hashedPassword(password);
    const newUser = await new Usermodel({
      name, email, password:hashPassword, state, address, city, pincode, answer, Gst
    }).save();

    response.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.error(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "User could not be created",
      error: error.message, // Use error.message to get a more meaningful error message
    });
  }
}


export async function Login(request, response) {
  try {
    const { email, password } = request.body;

    // Check if email and password are provided
    if (!email || !password) {
      return response.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user exists
    const user = await Usermodel.findOne({ email });

    if (!user) {
      return response.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Email is not found",
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);

    if (!match) {
      return response.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Password does not match",
      });
    }

    // Token Generation
    const Token = jwt.sign({
      _id: user._id,
    }, process.env.JWT_VERIFY, {
      expiresIn: "7d",
    });

    response.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name, // Correct variable name
        email: user.email, // Correct variable name
        phone: user.phone, // Adjust these based on your actual schema
        address: user.address, // Correct variable name
        role: user.role, // Correct variable name
      },
      Token,
    });

  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Login failed",
      error: error.message, // Use error.message to get a more meaningful error message
    });
  }
}

  


export async function Forgetpassword(request, response) {
  try {
    const { email, answer, newPassword } = request.body;
    if (!email) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "New Password is required" });
    }
    //check
    const user = await Usermodel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
   await Usermodel.findByIdAndUpdate(user._id,{password:hashed});
   response.status(StatusCodes.OK).json({success:true,message: "Password Updated successfully"});
  }catch (error) {
      console.log(error);
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"Something is worng",error:error});
  }
}


/// test -controller
 
export function testCotroller(request,response) {
  try {
    response.send("Protected Routes")
  } catch (error) {
    console.log(error);
    response.json({error})
  }
}

// update Profile

export async function updateProfile(request,response) {
  try {
    const {name,email,password,address, phone }=request.body;
  const  user =  await  Usermodel.findById(request.user._id);

  //checked passeword
  if (password && password.length < 6) {
    return response.json({error:"password is too short"});
  }

 const hashPassword = password ? await hashPassword(password): undefined;

 const UpdateUser = await Usermodel.findByIdAndUpdate(
  request.user._id,{
    name: name || user.name,
    password:hashPassword || user.password,
    email:email || user.email,
    address:address || user.address,
    phone:phone || user.phone
  },{new : true}
 );
 response.status(StatusCodes.OK).json({success:true, message:"Profile update successful",UpdateUser:UpdateUser});
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.BAD_REQUEST).json({success:false, message:"Profile update failed",error:error});
  }
}


//  Get Order
export async function GetOrder(request,response) {
  try {
  const order = await   OrderModel.find({
      buyer:request.user_id,
    }).populate("products","-Image").populate("buyer","name");
    response.json(order)
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"error in Get Order",error});

  }
};


// Get All Order

export async function GetAllOrder(request,response) {
  try {
  const order = OrderModel.find({}).populate("products","-Image").populate("buyer","name").sort({createdAt:"-1"});
  response.json(order);
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false,message:"Erro to Get Order",error:error});
  }
}


//Get  Order  Status

export async function OrderStatus(request,response) {
 try {
  const{orderId} = request.params.orderId;
  const {status} = request.body;

  const orders = OrderModel.findByIdAndUpdate( orderId,
      {status},
      {new:true}
  );
  response.json(orders);
 } catch (error) {
  console.log(error);
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success:false,message:"Error in updating Order", error:error
  });
 } 
};


export default function clientLogout(request, response) {
    console.log("Hello  you are Logout");
    response.clearCookie("access_token", { path: "/" });
    response.status(StatusCodes.OK).json("User Logout");
  }
  