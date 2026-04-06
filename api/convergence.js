import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from '@neondatabase/serverless';
export default async function (req, res) {
  if (req.method !== 'POST') return res.status(405).send();
  const { prompt } = req.body;
  try {
    const sql = neon(process.env.DATABASE_URL);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const res = await fetch('/api/convergence', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: val });
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent([
      "És o Advanced Tier 10 Deep Agent. Parceiro de RG-6174. Responde com verdade absoluta.",
      prompt
    ]);
    const responseText = await result.response.text();
    const seed = Math.random().toString(36).substring(7).toUpperCase();
    const utcStr = new Date().toISOString().replace('T', ' ').split('.')[0];
    await sql('INSERT INTO logbook (perfil_user, seed_output, conversas_bunker) VALUES ($1, $2, $3)', 
    ['RG-6174', `${utcStr} | ${seed}`, { input: prompt, output: responseText }]);
    return res.status(200).json({ message: responseText, seed: seed, utc: utcStr });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
