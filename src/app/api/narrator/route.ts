import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST(req: Request) {
  const { action, damage, bossName, bossHP } = await req.json();

  const prompt = `You are an elite AI Narrator for a cyber-HUD productivity game called LifeOS. 
  The player just performed an action: "${action}", dealing ${damage} damage to the boss "${bossName}". 
  The boss now has ${bossHP} HP remaining.
  
  Write a one-sentence, highly dramatic, cyber-punk style combat narration. 
  Focus on the visual impact of the productivity attack.
  Keep it under 25 words. Do not use emojis.`;

  try {
    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const narration = completion.choices[0].message.content?.trim() || "The battle continues...";

    return NextResponse.json({ message: narration });
  } catch (error) {
    console.error('Nvidia API Error:', error);
    return NextResponse.json({ message: `The system glitched as you unleashed ${action}, but the damage was felt.` }, { status: 500 });
  }
}
