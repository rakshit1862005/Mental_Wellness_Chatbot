import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    email: { type: String, required: true },
    sessionId: { type: String, required: true },

    sender: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },

    time: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
