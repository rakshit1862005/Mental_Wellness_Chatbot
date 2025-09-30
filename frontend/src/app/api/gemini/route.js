// app/api/gemini/route.js
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
    const { message } = await req.json();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: message,
        });
        return NextResponse.json({ reply: response.text });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ reply: "Error connecting to Gemini." }, { status: 500 });
    }
}
