"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("./models/models");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// dotenv.config();
const env = require("dotenv").config();
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
console.log("MONGO_URL: ", MONGO_URL);
mongoose_1.default.connect(MONGO_URL).then(() => {
    console.log("Connected To MongoDB!");
}).catch((error) => {
    console.log("Somethings Wrong: ", error);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const isAdmin = req.body.isAdmin;
    try {
        yield models_1.UserModel.create({
            username: username,
            email: email,
            password: password,
            isAdmin: isAdmin
        });
        res.json({
            message: "User Signed Up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already Exists"
        });
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = yield models_1.UserModel.findOne({
            username: username,
            password: password
        });
        if (!user) {
            return res.status(400).json({
                Message: "Invalid Username or Password"
            });
        }
        const token = jsonwebtoken_1.default.sign({
            username: user.username
        }, JWT_SECRET);
        res.status(200).json({
            Message: "Login Successful",
            token,
            username: user.username,
            isAdmin: user.isAdmin
        });
    }
    catch (e) {
        res.status(411).json({
            msg: "Something went wrong"
        });
    }
}));
app.get("/hotels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotels = yield models_1.HotelModel.find();
        res.status(200).json(hotels);
    }
    catch (error) {
        res.status(500).json({
            message: "Error fetching Hotels"
        });
    }
}));
app.post("/hotels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, hotelName, price, location } = req.body;
    const user = yield models_1.UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    if (!user.isAdmin) {
        user.isAdmin = true;
        yield user.save();
    }
    try {
        const hotel = yield models_1.HotelModel.create({ name: hotelName, price: price, location: location, owner: user._id });
        res.status(201).json({
            message: "Hotel added successfully", hotel
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Error Adding Hotel", error
        });
    }
}));
app.put("/hotels/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username, hotelName, price, location } = req.body;
    const user = yield models_1.UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    if (!user.isAdmin) {
        return res.status(403).json({
            message: "Access Denied: Admins Only"
        });
    }
    try {
        const updatedHotel = yield models_1.HotelModel.findByIdAndUpdate(id, { name: hotelName, price, location }, { new: true });
        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not Found" });
        }
        res.status(200).json({
            message: "Hotels Updated Successfully", updatedHotel
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error Updating Hotel", error
        });
    }
}));
app.delete("/hotels/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { username } = req.body;
    const user = yield models_1.UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    if (!user.isAdmin) {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    try {
        const deletedHotel = yield models_1.HotelModel.findByIdAndDelete(id);
        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel Not Found" });
        }
        res.status(200).json({ message: "Hotel Deleted Successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error Deleting Hotel", error });
    }
}));
app.post("/book-hotel", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, hotelId, checkIn, checkOut, guests } = req.body;
        // Add validation for guests
        if (!guests || isNaN(guests) || guests < 1) {
            return res.status(400).json({
                message: "Invalid number of guests"
            });
        }
        const user = yield models_1.UserModel.findOne({ username });
        const hotel = yield models_1.HotelModel.findById(hotelId);
        if (!user || !hotel) {
            return res.status(404).json({
                message: "User or Hotel not found"
            });
        }
        const booking = yield models_1.BookingModel.create({
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
    }
    catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({
            message: "Error Booking Hotel",
            error: error
        });
    }
}));
app.post("/admin-dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    const user = yield models_1.UserModel.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    if (!user.isAdmin) {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    try {
        const users = yield models_1.UserModel.find();
        const hotels = yield models_1.HotelModel.find();
        const bookings = yield models_1.BookingModel.find().populate("user hotel");
        res.status(200).json({ users, hotels, bookings });
    }
    catch (error) {
        res.status(500).json({ message: "Error Fetching Admin Data", error });
    }
}));
app.listen(3000, () => {
    console.log("Server Started at port 3000");
});
