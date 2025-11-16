import mongoose from "mongoose";

let isConnected = false;

export async function connectdb() {
    if (isConnected) {
        console.log("MongoDB already connected");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        isConnected = true;
        console.log("MongoDB Connected");
        return conn;

    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("DB connection failed");
    }
}
