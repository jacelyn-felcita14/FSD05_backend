import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/connection.js';
import authRouter from './Routers/authRouter.js';  // <-- THIS LINE ADDED
dotenv.config();

const port = process.env.PORT||8080;
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req,res)=>{
    console.log(res);
    res.status(200).json({msg: "server is running in port 8080"})
})

app.use("/api/v1/auth", authRouter);
app.listen(port, ()=>{
    connectDB();
    console.log("Server is running on port", port);
})
