
import { StatusCodes } from "http-status-codes";
import Usermodel from "../Model/Usermodel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import OrderModel from "../model/Ordermodel.js";


 export const Ragister = async (req, role, res) => {
    try {
      //Get employee from database with same name if any
      const validateUser = async (name) => {
        let User = await Usermodel.findOne({ name });
        return User ? false : true;
      };
  
      //Get employee from database with same email if any
      const validateEmail = async (email) => {
        let User = await Usermodel.findOne({ email });
        return User ? false : true;
      };
      // Validate the name
      let nameNotTaken = await validateUser(req.name);
      if (!nameNotTaken) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Employee name is already taken.`,
        });
      }
  
      // validate the email
      let emailNotRegistered = await validateEmail(req.email);
      if (!emailNotRegistered) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Email is already registered.`,
        });
      }
  
  // Hash password using bcrypt
      const password = await bcrypt.hash(req.password, 12);
      // create a new user
      const newUser = new Usermodel({
        ...req,
        password,
        role
      });
  
      await newUser .save();
      return res.status(StatusCodes.CREATED).json({
        message: "Hurry! now you are successfully registred. Please nor login."
      });
    } catch (err) {
      // Implement logger function if any
      console.log(err);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `${err.message}`
      });
    }
  };



 export  const Login = async (req, role, res) => {
    let { email, password } = req;
  
    // First Check if the user exist in the database
    const User = await Usermodel.findOne({ email });
    if (!User) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User email is not found. Invalid login credentials.",
        success: false,
      });
    }
    // We will check the if the employee is logging in via the route for his departemnt
    if (User.role !== role) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Please make sure you are logging in from the right portal.",
        success: false,
      });
    }
  
    // That means the employee is existing and trying to signin fro the right portal
    // Now check if the password match
    let isMatch = await bcrypt.compare(password, User.password);
    if (isMatch) {
      // if the password match Sign a the token and issue it to the employee
      let token = jwt.sign(
        {
          role: User.role,
          name: User.name,
          email: User.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "3 days" }
      );
  
      let result = {
        name: User.name,
        role: User.role,
        email: User.email,
        // token: `Bearer ${token}`,
        expiresIn: 168,
      };
      
      res.status(StatusCodes.OK).cookie('jwt',token,{
        expires: new Date(Date.now()+90* 24* 60* 60* 1000),
        secqure:false,
        httpOnly:true,
      });

      return res.json({
        ...result,
        message: "You are now logged in.",
      });
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Incorrect password.",
      });
    }
  };
  


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
  