// File: src/geminiMatcher.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY,
});

/**
 * 1️⃣ Exactly like your sample generate_completion:
 *    - Verifies client
 *    - Wraps the raw prompt in instructions to output only JSON
 *    - Calls Gemini
 *    - Returns response.text
 */
async function generateCompletion(prompt, role = "mentor matcher") {
  if (!ai) {
    throw new Error("Google AI client not initialized");
  }
  const now = new Date()
    .toISOString()        // "2025-04-21T14:30:00.000Z"
    .slice(0, 19)         // "2025-04-21T14:30:00"
    .replace("T", " ");   // "2025-04-21 14:30:00"


  const formattedPrompt = `
You are an AI whose sole task is to match one mentee with the best mentor.
Output **only** a JSON object matching our Matches table schema (no extra text).

${prompt}

**JSON schema** (fill in each value exactly):

{
  "mentor_id": <int>,
  "mentee_id": <int>,
  "admin_id": 1,    
  "ai_model": "gemini-2.0-flash",
  "match_date": "${now}",
  "success_rate": <int 0–100>,
  "match_approval_status": "Pending"
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: formattedPrompt,
  });
  return response.text;
}

/**
 * 2️⃣ Incrementally build the prompt exactly like your Flask route does:
 *    if field exists → append that line to the prompt.
 */
function buildMatchingPrompt(mentee, mentors) {
  let p = `New Mentee:\n`;

  if (mentee.mentee_id != null)       p += `- ID: ${mentee.mentee_id}\n`;
  if (mentee.goals)                   p += `- Goals: ${mentee.goals}\n`;
  if (mentee.skills)                  p += `- Skills: ${mentee.skills}\n`;
  if (mentee.academic_status)         p += `- Academic Status: ${mentee.academic_status}\n`;
  if (mentee.date_joined)             p += `- Date Joined: ${mentee.date_joined}\n`;
  if (mentee.institution)             p += `- Institution: ${mentee.institution}\n`;
  // note: mentor_id on a brand‑new signup will be null, so we skip it

  p += `\nAvailable Mentors:\n`;
  mentors.forEach((m) => {
    if (!m.active_status) return; // e.g. skip inactive mentors

    p += `Mentor ${m.mentor_id}:\n`;
    if (m.goals)                   p += `- Goals: ${m.goals}\n`;
    if (m.skills)                  p += `- Skills: ${m.skills}\n`;
    if (m.academic_background)     p += `- Academic Background: ${m.academic_background}\n`;
    if (m.active_status != null)   p += `- Active: ${m.active_status}\n`;
    if (m.date_joined)             p += `- Date Joined: ${m.date_joined}\n`;
    if (m.mentee_assigned_count != null)
                                   p += `- Current Mentees: ${m.mentee_assigned_count}\n`;
    p += `\n`;
  });

  // final instruction
  p += `Select the single best mentor:
- Prioritize skill–goals match
- Then availability & academic background.`;

  return p;
}

/**
 * 3️⃣ runMatching ties it together:
 *    build prompt → send to Gemini → return raw JSON text
 */
export async function runMatching(mentee, mentors) {
  console.log("⚙️ Starting Gemini matching...");
  const prompt = buildMatchingPrompt(mentee, mentors);
  const aiOutput = await generateCompletion(prompt, "mentor matcher");
  console.log("✅ Gemini output:\n", aiOutput);
  return aiOutput;
}
