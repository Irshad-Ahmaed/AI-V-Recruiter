import { FEEDBACK_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    try {
        const { conversation } = await req.json();
        const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", JSON.stringify(conversation));
        console.log(typeof conversation);
        console.log(conversation);
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPEN_ROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-exp:free",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        });

        return NextResponse.json(completion?.choices[0]?.message);
    } catch (error) {
        console.log(error);
        return NextResponse.json(error.message);
    }
}