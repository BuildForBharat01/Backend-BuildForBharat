import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";


import { ConnectDB } from "./utils/mongoDB.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();
const app = Express();

ConnectDB();

app.use(cors());
app.use(cookieParser());
app.use(Express.json());

app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log('Connected to Backend')
})