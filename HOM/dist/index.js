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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
app.listen(3000, () => {
    console.log("Server Started at port 3000");
});
