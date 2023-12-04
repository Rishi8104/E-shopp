import mongoose from 'mongoose'


const OderSchema  = mongoose.Schema(
      {
        
          products:[
            {
              type:mongoose.ObjectId,
              ref:"Product"
            }
          ],
          payment:{
          
          },
          buyer:{
            type:mongoose.ObjectId,
            ref:"User",
          },
          status:{
              type:String,
              default:"Not Process",
              enum:["Not Process","ALL","Pending","Shipped","Deliverd","Cancelled"],
          },
      },
 { timestamps:true });

const OrderModel= mongoose.model("Order",OderSchema);
export default OrderModel;