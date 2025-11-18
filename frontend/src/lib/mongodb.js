import mongoose from "mongoose";

let isConnected = false;

export const connectdb = async () => {
    if (isConnected) return;

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "Authentication",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};
