import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js";
dotenv.config({});
const app=express();

const PORT =process.env.PORT || 3000;

app.get("/",(req,res)=>{
    res.send("sab thik se kam kr rha hai");
})


//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const corsOption={
    origin:"http://localhost:5173",
    Credential:true
}
app.use(cors(corsOption));

app.use((req, res, next) => {
  console.log("HIT:", req.method, req.url);
  next();
});


app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoutes);


app.listen(PORT,()=>{
    connectDB();
    console.log(`server is listening on port ${PORT}`);
})