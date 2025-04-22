import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


function buildSchedulesPrompt(mentorAvail, menteeAvail) {
    let prompt = `
  You are an AI scheduler. Your task is to suggest 5 potential sessions between a mentor and a mentee based on their availability.
  
  ### Mentor Availability ###
  ${mentorAvail.join("\n")}
  
  ### Mentee Availability ###
  ${menteeAvail.join("\n")}
  
  Use the following logic:
  - Prefer dates/times where both are available.
  - If no exact overlap exists, suggest nearby times where both can reasonably adjust.
  - Distribute sessions across different days/times if possible.
  - Sessions should be practical and realistic.
  
  Return only **valid JSON** in this exact format:
  [
    {
      "session_date": "YYYY-MM-DDTHH:MM",
      "duration": [Duration between 45-100 minutes],
      "topics_covered": [Keep this an empty string],
      "session_type": "[Online or In-Person]",
      "location": [Keep this an empty string]
    },
    ...
  ]
  Do not include any explanations. Just return the JSON array. Make sure to suggest 5 potential sessions, no less. Make sure to suggest logical times
  `;
  
    return prompt;
}

async function generateCompletion(prompt) {

    const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
    });

    const responseText = result.text;

    if (!responseText) {
        throw new Error("No response from Gemini");
    }

    return responseText;
}
  


export async function runSchedules(mentorAvail, menteeAvail) {
    try {
      console.log("⚙️ Generating prompt...");
      const prompt = buildSchedulesPrompt(mentorAvail, menteeAvail);
      console.log("Prompt:\n", prompt);
  
      const output = await generateCompletion(prompt);
      console.log("Gemini response:\n", output);
  
      const cleanedOutput = output.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  
      return cleanedOutput;
    } catch (err) {
      console.error("Error in runMatching:", err.message);
      return `Error: ${err.message}`;
    }
  }