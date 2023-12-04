import express from 'express';
import "dotenv/config";
import bodyParser from 'body-parser';
import { DbConnect } from './Src/DB/ConnectDB.js';
import ProductRouter from './Src/router/ProductRouter.js';
import CategoryRouter from './Src/router/CategoryRouter.js';
import AuthRouter from './Src/router/userRouter.js';



const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(ProductRouter);
app.use(CategoryRouter);
app.use(AuthRouter);
app.listen(process.env.PORT_NUMBER,() => {
    console.log(`Server listin on port ${process.env.PORT_NUMBER}`);
    DbConnect();
})