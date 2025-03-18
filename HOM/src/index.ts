import express from "express";
import jwt from "jsonwebtoken";
import {UserModel} from "./models/models"

import cors from "cors";
import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config();


const env = require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL as string;
console.log("MONGO_URL: ", MONGO_URL);

mongoose.connect(MONGO_URL).then(() => {
    console.log("Connected To MongoDB!");
}).catch((error) => {
    console.log("Somethings Wrong: ", error);
})

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async(req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;

    try{
        await UserModel.create({
            username: username,
            email: email,
            password: password,
            isAdmin: isAdmin
        })

        res.json({
            message: "User Signed Up"
        })
    } catch(e){
        res.status(411).json({
            message: "User already Exists"
        });
    }
});

app.listen(3000, () => {
    console.log("Server Started at port 3000");
})