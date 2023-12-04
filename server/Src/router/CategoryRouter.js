import express from 'express'
import { AddCategory, FeatchAllCategory, FeatchAllCategoryOutofStock, FeatchAllCategoryisStock, deleteCategory } from '../controller/CategoryController.js';


const CategoryRouter = express.Router();

CategoryRouter.post('/Category', AddCategory);
CategoryRouter.get('/Category/all', FeatchAllCategory);
CategoryRouter.get('/Category/isStock', FeatchAllCategoryisStock);
CategoryRouter.get('/Category/OutStock', FeatchAllCategoryOutofStock);
CategoryRouter.delete('/Category/:id', deleteCategory);


export default CategoryRouter;