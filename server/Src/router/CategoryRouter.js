import express from 'express'
import { AddCategory, FeatchAllCategory, FeatchAllCategoryOutofStock, FeatchAllCategoryisStock, UpdateCategory, deleteCategory } from '../controller/CategoryController.js';
import { IsAdmin, requiredSignIn } from '../Middleware/authMiddleware.js';


const CategoryRouter = express.Router();

CategoryRouter.post('/Category', requiredSignIn, IsAdmin, AddCategory);
CategoryRouter.put('/Update-Category', requiredSignIn, IsAdmin, UpdateCategory);
CategoryRouter.get('/Category/all', FeatchAllCategory);
CategoryRouter.get('/Category/isStock',requiredSignIn,IsAdmin, FeatchAllCategoryisStock);
CategoryRouter.get('/Category/OutStock',  requiredSignIn,IsAdmin,FeatchAllCategoryOutofStock);
CategoryRouter.delete('/Category/:id', requiredSignIn,IsAdmin, deleteCategory);


export default CategoryRouter;