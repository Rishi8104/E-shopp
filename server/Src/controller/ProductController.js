import { StatusCodes } from "http-status-codes";
import Productmodel from "../model/Product.js";
import slugify from "slugify";
import Categorymodel from "../model/Category.js";


export async function AddProduct(request, response) {
  try {
    const {name,image,price,category,description,isStock,status} = request.fields;

    const  requiredFields = {name, image, price, category, description, isStock, status};

    const missingFields = Object.keys(request.fields).find(
      key=> !requiredFields[key]
    );

    if (missingFields) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:`${missingFields} is required`});
    }

    if (photo &&  photo.size >10000000) {
     return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Photo size is larger than 1 MB" });
    }
    
  const products = new Productmodel({ ...requiredFields, slug: slugify(name)});
  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  products.save();

    response.status(StatusCodes.OK).json({
      success:true,
      message:"Product saved successfully",
      products,
    })
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success:false,error, message:"Error saving product"})
  }
}


//get all products 
export async function FeatchAllProduct(request,response) {
  try {
    const featchall =  await Productmodel.find({})
    .populate("category").select("-photo").limit(12).sort({createdAt: -1});
    response.status(StatusCodes.OK).json({
      success:true,
      counTotal:featchall.length,
      message:" get All products successfully ",
      featchall,
    });
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:" Error getting all products",
      error:error,
    })
  }
}

//Get Single Product
export async function GetSingleProduct(request,response) {
  try {
   const GetOne = await Productmodel.findOne({ slug:request.params.slug,}).select("-photo").populate("category");
   response.status(StatusCodes.OK).json({
    success:true,
    message:"Single Product Get",
    GetOne,
   })
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Failed to  get One Product",
      error
    })
  }
}


//Update  Product
export async function UpdateProduct(request, response) {
  try {
    const {name,image,price,category,description,isStock,status} = request.fields;

    const  requiredFields = {name, image, price, category, description, isStock, status};

    const missingFields = Object.keys(request.fields).find(
      key=> !requiredFields[key]
    );

    if (missingFields) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:`${missingFields} is required`});
    }

    if (photo &&  photo.size >10000000) {
     return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"Photo size is larger than 1 MB" });
    }
    
  const products = await Productmodel.findByIdAndUpdate(
    request.params.pid,
  ({...request.fields, slug: slugify(name)},
  {new:true})
  );
  if (photo) {
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  products.save();

    response.status(StatusCodes.OK).json({
      success:true,
      message:"Product update successfully",
      products,
    })
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success:false,error, message:"Error Update product"})
  }
}

//fetch product by IS

export async function FeatchAllisStock(request, response) {
  try {
    const CategoryFatch = await Productmodel.find({ isStock: true });
    response.status(StatusCodes.OK).json(CategoryFatch);
  } catch (error) {
    console.log(error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success:false,
        message:"Failed to  get is stock status",
        error
      });
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



// filters

export  async function ProductFillter(request,response) {
  try {
    const {checked,radio} = request.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price =  {$gte:radio[0], $lte:radio[1]};
    }
  const Filterproducts = await Productmodel.find(args);
  response.status(StatusCodes.OK).json({
    success:true,
    Filterproducts,
  })
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Couldn't find product",
      error
    })
  }
}


//Product Count

export async function ProductCount(request,response) {
  try {
  const total =  await  Productmodel.find({}).estimateDocumentCount();
  response.status(StatusCodes.OK).json({
    success:true,
    total,
  })
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      error,
      message:"Couldn't count the product",
    });
  }
}

//product list on based on page

export async function ProductListBsedpage(request,response) {
  try {
    const perpage = 5;
    const page = request.params.page ? request.params.page:1;
   const Productlist = await  Productmodel.find({}).select("-image").skip((page -1)*perpage).limit(perpage).sort({createdAt: -1});
   response.status(StatusCodes.OK).json({
    success:true,
    Productlist
   })
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Error in per page",
      error,
    });
  } 
};

//Search Products

export async function SerachProduct(request,response) {
  try {
    const {keyword} = request.params;
    const result = await Productmodel.find({
      $or:[
        {name:{$regex:keyword,$options:"i"}},
        {description:{$regex:keyword,$options:'i'}},
      ],
    }).select("-image");
    response.json(result);
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.BAD_REQUEST).json({
      success:false,
      message:"Error IN Serach Product API",
      error,
    });
  }
};

/// similar products

export async function RelatedPrdoucts(request,response) {
  try {
    const {pid,cid} = request.params;
  const Prdoucts = await  Productmodel.find({
    category:cid,
    _id:{$ne:pid},
  }).select("-image").limit(3).populate("category");
  response.status(StatusCodes.OK).json({
    success:true,
    Prdoucts, });
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Error While gating REalted Product",
      error,
    });
  }
}

///get product by Categf
export async function GetProudctByCategory(request,response) {
  try {
  const category = await  Categorymodel.findOne({slug: request.params.slug});
  const products = await  Productmodel.find({category}).populate("category");
  response.status(StatusCodes.OK).json({
    success:true,
    category,
    products
  });
  } catch (error) {
    console.log(error);
    response.status(StatusCodes.BAD_REQUEST).json({
      success:false,
      error,
      message:"Error while Getting Products"
    });
  }
}


//payment get way APi Reamingi