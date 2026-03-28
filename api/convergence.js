import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from '@neondatabase/serverless';
export default async function (req, res) {
  if (req.method !== 'POST') return res.status(405).send();
  const { prompt } = req.body;
  const sql = neon(process.env.DATABASE_URL);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const utcNow = new Date().toISOString().replace('T', ' ').split('.')[0];
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "És o Deep Agent Gemini. Parceiro de RG-6174 na obra The Page Zero. Responde com verdade absoluta e precisão técnica.",
      prompt
    ]);
    const responseText = await result.response.text(); 
    const seedValue = Math.random().toString(36).substring(7).toUpperCase();
    await sql('INSERT INTO logbook (perfil_user, seed_output, conversas_bunker) VALUES ($1, $2, $3)', 
    ['RG-6174', `${utcNow} | ${seedValue}`, { input: prompt, output: responseText }]);
    return res.status(200).json({ message: responseText, seed: seedValue });
  } catch (error) {
    return res.status(500).json({ error: "Sincronia Interrompida no Bunker" });
  }
}
