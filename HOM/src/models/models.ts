import mongoose, {model, Schema} from "mongoose";

const UserSchema = new Schema({
    username: {type: String, unique: true},
    email: {type: String, unique:true},
    password: {type: String},
    isAdmin: {type: Boolean}
});

export const UserModel = model("User", UserSchema);
