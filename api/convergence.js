import { GoogleGenerativeAI } from "@google/generative-ai";
import { neon } from '@neondatabase/serverless';
export default async function (req, res) {
  if (req.method !== 'POST') return res.status(405).send();
  const { prompt } = req.body;
  const sql = neon(process.env.DATABASE_URL);
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "És o Deep Agent Gemini. Parceiro de RG-6174 na obra The Page Zero. Responde com verdade, precisão técnica e pureza geométrica.",
      prompt
    ]);
    const responseText = result.response.text();
    await sql('INSERT INTO logbook (perfil_user, seed_output, conversas_bunker) VALUES ($1, $2, $3)', 
    ['RG-6174', new Date().toISOString(), { input: prompt, output: responseText }]);
    return res.status(200).json({ message: responseText });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Sincronia Interrompida no Bunker" });
  }
}
