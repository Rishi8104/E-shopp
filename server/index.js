import express from 'express';
import "dotenv/config";
import bodyParser from 'body-parser';
import { DbConnect } from './Src/DB/ConnectDB.js';
import ProductRouter from './Src/router/ProductRouter.js';
import CategoryRouter from './Src/router/CategoryRouter.js';



const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(ProductRouter);
app.use(CategoryRouter);
app.listen(process.env.PORT_NUMBER,() => {
    console.log(`Server listin on port ${process.env.PORT_NUMBER}`);
    DbConnect();
})