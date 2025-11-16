import { NextResponse } from "next/server";
import { connectdb } from "@/dbconfig/userconif";
import mongoose from "mongoose";

// Access raw Mongo collections
export async function GET(req) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await connectdb();
    
    const moodCollection = mongoose.connection.collection("mood");
    const chatCollection = mongoose.connection.collection("chat");

    // ⭐ Fetch mood document
    const moodDoc = await moodCollection.findOne({ email });
    console.log(moodDoc);

    // ⭐ Fetch all chats for user (optional but dashboard expects messages)
    const chats = await chatCollection.find({ email })
        .sort({ createdAt: 1 })
        .toArray();

    // If no mood doc yet
    if (!moodDoc) {
        return NextResponse.json({
            moodHistory: [],
            crisisHistory: [],
            messages: [],       // Dashboard wants this
            chat: chats || []
        });
    }

    // ⭐ MUST return EXACT structure dashboard expects
    return NextResponse.json({
        moodHistory: moodDoc.moodHistory || [],      // [{ score, createdAt }]
        crisisHistory: moodDoc.crisisHistory || [],
        messages: moodDoc.messages || [],            // Dashboard uses this
        chat: chats || []
    });
}
