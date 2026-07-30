// app/api/ai-recommendation/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// 👇 NEW SDK: `@google/generative-ai` was deprecated Nov 30, 2025 and no
// longer serves "gemini-1.5-flash" — that's the same root cause as the
// Python backend 404. `@google/genai` is the unified replacement.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Current, actively-served model. If this 404s again later, list available
// models for your key and swap the string below.
const GEMINI_MODEL = 'gemini-2.5-flash';

export async function POST(req: Request) {
  try {
    const { blockName, ph, nitrogen, moisture, slope, rainfall } = await req.json();

    // Prompt engineered specifically for Sri Lankan Tea Cultivation
    const prompt = `
    You are an expert Agronomist specializing in Sri Lankan Tea Estates (Camellia sinensis).
    Analyze the following Daily Telemetry Data for a specific land block and provide a precise Prescription for tomorrow's fertilizer/treatment.

    Block Details:
    - Block Name: ${blockName}
    - Current Soil pH: ${ph} pH (Ideal range: 4.5 - 5.5)
    - Soil Nitrogen Level: ${nitrogen} ppm (Ideal range: 110 - 150 ppm)
    - Soil Moisture: ${moisture}%
    - Terrain Slope: ${slope}°
    - Recent Monthly Rainfall: ${rainfall} mm

    Provide a JSON response ONLY with the following key structure:
    {
      "treatmentName": "Specific Fertilizer or Treatment Name (e.g. Uramax / Dolomite / Zinc Sulphate)",
      "dosage": "Amount in kg per acre or per block",
      "urgency": "High | Medium | Low",
      "reasoning": "A short 1-2 sentence explanation of why this is needed based on the pH/Nitrogen levels.",
      "applicationTime": "Morning (6 AM - 9 AM) | Late Afternoon"
    }
    `;

    // 👇 New SDK call shape: ai.models.generateContent({ model, contents })
    // instead of genAI.getGenerativeModel({model}).generateContent(prompt).
    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const responseText = result.text ?? '';

    // Clean JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const data = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return NextResponse.json({ success: true, recommendation: data });
  } catch (error) {
    console.error('Gemini AI Recommendation Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate AI Recommendation' },
      { status: 500 }
    );
  }
}