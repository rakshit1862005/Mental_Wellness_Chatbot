import { GoogleGenerativeAI } from "@google/generative-ai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";
import { connectdb } from "@/dbconfig/userconif";
import Mood from "@/models/mood";
import Chat from "@/models/chat";

// -------------------------
// In-memory model history
// -------------------------
const sessionHistories = new Map();

// -------------------------
// GET — Load sessions / chats
// -------------------------
export async function GET(req) {
    try {
        await connectdb();

        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const sessionId = url.searchParams.get("sessionId");

        if (!email) {
            return NextResponse.json({ error: "Email required." }, { status: 400 });
        }

        // Load chat sessions summary
        if (!sessionId) {
            const sessions = await Chat.aggregate([
                { $match: { email } },
                {
                    $group: {
                        _id: "$sessionId",
                        lastMessage: { $last: "$text" },
                        lastTime: { $last: "$time" }
                    }
                },
                { $sort: { lastTime: -1 } }
            ]);

            return NextResponse.json({
                sessions: sessions.map(s => ({
                    sessionId: s._id,
                    lastMessage: s.lastMessage,
                    lastTime: s.lastTime
                }))
            });
        }

        // Load chat messages for a specific session
        const chats = await Chat.find({ email, sessionId }).sort({ time: 1 });
        return NextResponse.json({ chats });

    } catch (err) {
        console.error("GET ERROR:", err);
        return NextResponse.json({ error: "Failed to fetch chats." }, { status: 500 });
    }
}

// -------------------------
// DELETE — Delete a session
// -------------------------
export async function DELETE(req) {
    try {
        await connectdb();

        const { email, sessionId } = await req.json();
        if (!email || !sessionId) {
            return NextResponse.json({ error: "Missing fields." }, { status: 400 });
        }

        await Chat.deleteMany({ email, sessionId });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        return NextResponse.json({ error: "Failed to delete session." }, { status: 500 });
    }
}

// -------------------------
// POST — Generate reply + Save Chat
// -------------------------
export async function POST(req) {
    try {
        await connectdb();

        const { message, sessionId = "default", email } = await req.json();
        if (!message) {
            return NextResponse.json({ reply: "Empty message." });
        }

        const analysis = await fetch("http://localhost:8000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message, email, sessionId }),
        }).then(r => r.json());

        const { intent, emotion, mood, crisis, context } = analysis;

        const AI_CONTEXT = `
You are a compassionate emotional-support AI.
Use the analysis below to understand the user's emotional state.

Analysis:
- Intent: ${intent}
- Emotion: ${emotion}
- Mood Score: ${mood}
- Crisis Score: ${crisis}
- Extracted Context: ${context}

Guidelines:
- Give elaborated Answers
- Be warm, validating, supportive.
- Never give medical or clinical advice.
- If crisisScore > 70, gently encourage reaching someone trusted.
        `;

        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: AI_CONTEXT,
        });

        // Memory
        if (!sessionHistories.has(sessionId)) sessionHistories.set(sessionId, []);
        const history = sessionHistories.get(sessionId);

        const formattedHistory = history.map((msg) =>
            msg instanceof HumanMessage
                ? { role: "user", parts: [{ text: msg.content }] }
                : { role: "model", parts: [{ text: msg.content }] }
        );

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: { temperature: 0.7, maxOutputTokens: 1017 },
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        // Update memory
        history.push(new HumanMessage(message));
        history.push(new AIMessage(reply));
        if (history.length > 20) history.splice(0, history.length - 20);

        await Chat.create({
            email,
            sessionId,
            sender: "user",
            text: message,
            time: new Date(),
        });

        await Chat.create({
            email,
            sessionId,
            sender: "assistant",
            text: reply,
            time: new Date(),
        });

        await Mood.create({
            email,
            sessionId,
            mood,
            crisis,
            time: new Date(),
        });

        return NextResponse.json({
            reply,
            aiAnalysis: analysis,
            sessionId
        });

    } catch (e) {
        console.error("POST ERROR:", e);
        return NextResponse.json({ reply: "Error. Try again later." }, { status: 500 });
    }
}
