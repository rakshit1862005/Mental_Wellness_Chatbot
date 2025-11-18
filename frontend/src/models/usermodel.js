import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    contact: {
        type: String,
        required: false, // emergencyContact is optional, so make this optional
        default: null
    }
}, {
    timestamps: true,
    collection: "users"
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
