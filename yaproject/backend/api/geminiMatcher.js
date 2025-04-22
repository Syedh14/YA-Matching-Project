import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function buildMatchingPrompt(mentee, mentors) {
  let prompt = `You are an AI whose sole task is to match one mentee with the best mentor.
  
  \nNew Mentee:\n`;

  if (mentee.id != null) prompt += `- ID: ${mentee.id}\n`;
  if (mentee.goals)                     prompt += `- Goals: ${mentee.goals}\n`;
  if (mentee.skills)                    prompt += `- Skills: ${mentee.skills}\n`;
  if (mentee.academic_status)           prompt += `- Academic Status: ${mentee.academic_status}\n`;
  if (mentee.date_joined)               prompt += `- Date Joined: ${mentee.date_joined}\n`;
  if (mentee.institution)               prompt += `- Institution: ${mentee.institution}\n`;

  prompt += `\nAvailable Mentors:\n`;

  mentors.forEach((m) => {
    prompt += `Mentor ${m.id}:\n`;
    if (m.id)                      {prompt += `- ID: ${m.id}\n`;}
    if (m.skills)                  {prompt += `- Skills: ${m.skills}\n`;}
    if (m.academic_background)     {prompt += `- Academic Background: ${m.academic_background}\n`;}
    if (m.active_status != null)   {prompt += `- Active: ${m.active_status}\n`;}
    if (m.date_joined)             {prompt += `- Date Joined: ${m.date_joined}\n`;}
    
    
    prompt += `\n`;
  });

    
  prompt += `
Select the single best mentor:

Prioritize skill–goal alignment

Then consider availability & academic background

Return ONLY the JSON object matching this schema, no extra text, do not include \`\`\`json before the response and \`\`\` after the response:

{
  "mentor_id": <int>,
  "mentee_id": <int>,
  "admin_id": 1,
  "ai_model": "gemini-2.0-flash",
  "success_rate": <int 0–100>,
  "match_approval_status": "Pending"
}
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

export async function runMatching(mentee, mentors) {
  try {
    console.log("⚙️ Generating prompt...");
    console.log(mentors);
    const prompt = buildMatchingPrompt(mentee, mentors);
    console.log("📤 Prompt:\n", prompt);

    const output = await generateCompletion(prompt);
    console.log("✅ Gemini response:\n", output);

    const cleanedOutput = output.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

    return cleanedOutput;
  } catch (err) {
    console.error("❌ Error in runMatching:", err.message);
    // Return a string, not an object, so JSON.parse doesn't crash
    return `Error: ${err.message}`;
  }
}
