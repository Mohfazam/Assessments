import { Hotel } from "lucide-react";
import mongoose, {model, Schema} from "mongoose";

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique:true, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false}
});

export const UserModel = model("User", UserSchema);

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    price: { type: Number, required: true }, 
    amenities: { 
        type: [String], 
        enum: ["WiFi", "Swimming Pool", "Gym", "Breakfast"], 
        default: ["WiFi", "Breakfast"] 
    }
});

export const HotelModel = mongoose.model("Hotel", hotelSchema);


const bookingSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    Hotel: {type: mongoose.Schema.Types.ObjectId, ref:"Hotel", required: true},
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
});

export const BookingModel = mongoose.model("Booking", bookingSchema);