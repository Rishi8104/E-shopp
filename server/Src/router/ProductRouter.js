import express from 'express'
import { AddProduct, FeatchAllOutofStock,  FeatchAllProduct,  FeatchAllisStock, deleteProduct } from '../controller/ProductController.js';


const ProductRouter = express.Router();

ProductRouter.post('/products', AddProduct);
ProductRouter.get('/products/all', FeatchAllProduct);
ProductRouter.get('/products/isStock', FeatchAllisStock);
ProductRouter.get('/products/OutStock', FeatchAllOutofStock);
ProductRouter.delete('/products/:id', deleteProduct);


export default ProductRouter;