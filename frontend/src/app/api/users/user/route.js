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

    const moodDoc = await moodCollection.findOne({ email });
    console.log(moodDoc);

    const chats = await chatCollection.find({ email })
        .sort({ createdAt: 1 })
        .toArray();

    if (!moodDoc) {
        return NextResponse.json({
            moodHistory: [],
            crisisHistory: [],
            messages: [],       // Dashboard wants this
            chat: chats || []
        });
    }

    return NextResponse.json({
        moodHistory: moodDoc.moodHistory || [],      // [{ score, createdAt }]
        crisisHistory: moodDoc.crisisHistory || [],
        messages: moodDoc.messages || [],            // Dashboard uses this
        chat: chats || []
    });
}
