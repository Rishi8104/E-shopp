import express from 'express';
import { Forgetpassword, GetAllOrder, GetOrder, Login, OrderStatus, Ragister, testCotroller, updateProfile } from '../controller/UserController.js';
import { IsAdmin, requiredSignIn } from '../Middleware/authMiddleware.js';
import { StatusCodes } from 'http-status-codes';


const AuthRouter = express.Router();

AuthRouter.post(
  '/Signup', Ragister
)
AuthRouter.post(
  '/SignIn', Login
)
AuthRouter.post(
  '/forget-password', Forgetpassword
)
AuthRouter.get(
  '/test', requiredSignIn, IsAdmin, testCotroller
);

//protected  User Router
AuthRouter.get("/user-auth",requiredSignIn,(req,res)=>{
  res.status(StatusCodes.OK).json({Ok:true});
})

//protected Admin Router
AuthRouter.get("/admin-auth",requiredSignIn, IsAdmin,(req,res)=>{  
  res.status(StatusCodes.OK).json({Ok:true}); 
}
)
//update profile Router
AuthRouter.put("/profile",requiredSignIn, updateProfile);

//orders routes

AuthRouter.get("/orders",requiredSignIn,GetOrder);

//get All Order routes
AuthRouter.get("/all-orders",requiredSignIn,IsAdmin,GetAllOrder);

//orders status routes
AuthRouter.put("/orders-status/:orderId",requiredSignIn,
IsAdmin,OrderStatus)



export default AuthRouter;
