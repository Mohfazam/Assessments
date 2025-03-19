import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {UserModel, HotelModel, BookingModel} from "./models/models"

import cors from "cors";
import mongoose from "mongoose"
import dotenv from "dotenv";
// dotenv.config();

const env = require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL as string;
const JWT_SECRET = process.env.JWT_SECRET as string;
console.log("MONGO_URL: ", MONGO_URL);

mongoose.connect(MONGO_URL).then(() => {
    console.log("Connected To MongoDB!");
}).catch((error) => {
    console.log("Somethings Wrong: ", error);
})

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async(req: Request, res: Response) => {
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

app.post("/signin", async (req: any, res: any) => {
    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = await UserModel.findOne({
            username: username,
            password: password
        });

        if(!user){
                return res.status(400).json({
                    Message: "Invalid Username or Password"
                });
        }

        const token = jwt.sign({
            username: user.username
        }, JWT_SECRET);

        res.status(200).json({
            Message: "Login Successful",
            token,
            username:user.username,
            isAdmin: user.isAdmin
        });

    } catch(e){
        res.status(411).json({
            msg: "Something went wrong"
        })
    }
});


app.get("/hotels", async (req:any, res:any) => {
    try{
        const hotels = await HotelModel.find();
        res.status(200).json(hotels);
    } catch(error){
        res.status(500).json({
            message: "Error fetching Hotels"
        });
    }
});

app.post("/hotels", async (req: any, res: any) => {
    const {username, hotelName, price, location} = req.body;

    const user = await UserModel.findOne({username});

    if(!user) {
        return res.status(404).json({message: "User Not Found"});
    }

    if(!user.isAdmin){
        user.isAdmin = true;
        await user.save();
    }

    try{
        const hotel = await HotelModel.create({name: hotelName, price: price,location:location, owner: user._id})
        res.status(201).json({
            message: "Hotel added successfully", hotel
        })
    } catch(error){
        res.status(400).json({
            message: "Error Adding Hotel", error
        })
    }
    
});

app.put("/hotels/:id", async(req: any, res: any) => {
    const { id } = req.params;
    const { username, hotelName, price, location } = req.body;

    const user = await UserModel.findOne({username});

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    if(!user.isAdmin){
        return res.status(403).json({
            message: "Access Denied: Admins Only"
        });
    }

    try{
        const updatedHotel = await HotelModel.findByIdAndUpdate(
            id,
            {name: hotelName, price, location},
            {new: true}
        );
        if(!updatedHotel){
            return res.status(404).json({message: "Hotel not Found"});
        }

        res.status(200).json({
            message: "Hotels Updated Successfully", updatedHotel
        })

    } catch(error){
        res.status(500).json({
            message: "Error Updating Hotel", error
        });
    }
});

app.delete("/hotels/:id", async (req: any, res: any) => {
    const { id } = req.params;
    const { username } = req.body;  

    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    if (!user.isAdmin) {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    try {
        const deletedHotel = await HotelModel.findByIdAndDelete(id);

        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel Not Found" });
        }

        res.status(200).json({ message: "Hotel Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Deleting Hotel", error });
    }
});

app.post("/book-hotel", async (req: any, res: any) => {
    try {
        const { username, hotelId, checkIn, checkOut, guests } = req.body;

        // Add validation for guests
        if (!guests || isNaN(guests) || guests < 1) {
            return res.status(400).json({
                message: "Invalid number of guests"
            });
        }

        const user = await UserModel.findOne({ username });
        const hotel = await HotelModel.findById(hotelId);

        if (!user || !hotel) {
            return res.status(404).json({ 
                message: "User or Hotel not found" 
            });
        }

        const booking = await BookingModel.create({
            user: user._id,
            hotel: hotel._id,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: Number(guests) // Ensure numeric conversion
        });

        res.status(201).json({ 
            message: "Hotel Booked Successfully", 
            booking 
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({
            message: "Error Booking Hotel",
            error: error
        });
    }
});

app.post("/admin-dashboard", async (req: any, res: any) => {
    const { username } = req.body;
    const user = await UserModel.findOne({ username });

    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }

    if (!user.isAdmin) {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    try {
        const users = await UserModel.find();
        const hotels = await HotelModel.find();
        const bookings = await BookingModel.find().populate("user hotel");

        res.status(200).json({ users, hotels, bookings });
    } catch (error) {
        res.status(500).json({ message: "Error Fetching Admin Data", error });
    }
});




app.listen(3000, () => {
    console.log("Server Started at port 3000");
})