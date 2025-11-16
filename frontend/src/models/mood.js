import mongoose from "mongoose";

const MoodEntrySchema = new mongoose.Schema({
    moodScore: { type: Number, required: true },      // 1–10
    createdAt: { type: Date, default: Date.now }
});

const CrisisEntrySchema = new mongoose.Schema({
    crisisScore: { type: Number, required: true },     // 0–100
    createdAt: { type: Date, default: Date.now }
});

const MessageEntrySchema = new mongoose.Schema({
    userMessage: { type: String, required: true },
    aiReply: { type: String, required: true },
    moodScore: { type: Number },
    crisisScore: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const MoodSchema = new mongoose.Schema({
    email: { type: String, required: true },

    // moodHistory will contain ONLY scores over time
    moodHistory: {
        type: [MoodEntrySchema],
        default: []
    },

    // crisisHistory contains JUST crisis score events
    crisisHistory: {
        type: [CrisisEntrySchema],
        default: []
    },

    // messages is full chat history with scores attached
    messages: {
        type: [MessageEntrySchema],
        default: []
    }
});

// avoid model re-creation on hot reload
export default mongoose.models.Mood || mongoose.model("Mood", MoodSchema);
