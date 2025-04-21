// File: src/geminiMatcher.js

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY,
});

async function generateMatchingPrompt(mentees, mentors) {
  const menteeDetails = mentees
    .map((m) => `- Mentee ID: ${m.id}, Goal: ${m.goal}`)
    .join("\n");

  const mentorDetails = mentors
    .map((m) => `- Mentor ID: ${m.id}, Skills: ${m.skills.join(", ")}`)
    .join("\n");

  return `Given the following mentees and their goals:\n${menteeDetails}\n\nAnd the following mentors and their skills:\n${mentorDetails}\n\nSuggest potential mentor-mentee matches. For each match, include the Mentee ID, the Mentee Goal, the Mentor ID, and the relevant Mentor Skills that align with the goal. Explain briefly why you think they are a good match. Format the output clearly.`;
}

export async function runMatching(mentees, mentors) {
  console.log("⚙️ Starting Gemini matching with provided data...");

  try {
    const prompt = await generateMatchingPrompt(mentees, mentors);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    console.log("✅ Gemini matching result:\n", response.text);
    return response.text || "No matches returned.";
  } catch (error) {
    console.error("❌ Matching failed:", error);
    return `Error: Could not generate matches. ${error.message}`;
  }
}