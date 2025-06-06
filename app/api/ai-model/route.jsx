import { QUESTIONS_PROMPT } from "@/services/Constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    try {
        const { jobPosition, jobDescription, duration, type } = await req.json();

        const FINAL_PROMPT = QUESTIONS_PROMPT
        .replace('{{jobTitle}}', jobPosition)
        .replace('{{jobDescription}}', jobDescription)
        .replace('{{duration}}', duration)
        .replace('{{type}}', type)

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPEN_ROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        }); 

        if (!completion?.choices || !completion.choices.length) {
            console.error("No choices returned from OpenAI:", completion);
            return NextResponse.json({ error: "No response from AI model" }, { status: 500 });
        }

        return NextResponse.json(completion?.choices[0]?.message);
    } catch (error) {
        console.log(error);
        return NextResponse.json(error.message);
    }
}