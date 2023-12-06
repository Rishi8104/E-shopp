import express from 'express'
import { AddProduct, FeatchAllOutofStock,  FeatchAllProduct,  FeatchAllisStock, GetProudctByCategory, GetSingleProduct, ProductCount, ProductFillter, ProductListBsedpage, RelatedPrdoucts, SerachProduct, UpdateProduct, deleteProduct } from '../controller/ProductController.js';
import { IsAdmin, requiredSignIn } from '../Middleware/authMiddleware.js';
import formidable from 'express-formidable';



const ProductRouter = express.Router();
// ProductRouter.post('/create-products', {requiredSignIn, IsAdmin, formidable ,AddProduct});
ProductRouter.post(
  "/create-product",
  requiredSignIn,
  IsAdmin,
  formidable(),
  AddProduct);
ProductRouter.put("/update-product/:pid", requiredSignIn, IsAdmin, formidable(),UpdateProduct)


//Company Route
ProductRouter.get('/get-product', FeatchAllProduct);
//Get A Single Product
ProductRouter.get('/get-product/:slug',GetSingleProduct);
//Product Filter 
ProductRouter.get("/product-filter",ProductFillter);

//product Count
ProductRouter.get("/product-count", ProductCount);
//product List
ProductRouter.get("/product-list/:page",ProductListBsedpage);
//product Sreach by keyword
ProductRouter.get("/Search/:keywords",SerachProduct);
//similar product serach
ProductRouter.get("/related-product/:pid/:cid",RelatedPrdoucts)
//category wise product serach
ProductRouter.get("/product-category/:slug",GetProudctByCategory)

//get product by Sotck is avilabel
ProductRouter.get('/products/isStock', FeatchAllisStock);

//get product by Sotck is  notavilabel
ProductRouter.get('/products/OutStock', FeatchAllOutofStock);

//delate product by ID 
ProductRouter.delete('/products/:id', deleteProduct);


export default ProductRouter;