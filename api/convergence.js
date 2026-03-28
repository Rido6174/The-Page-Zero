import { GoogleGenerativeAI } from "@google/generative-ai";
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Apenas POST permitido' });
  }
  const { prompt } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "És o Deep Agent RG-6174. Opera no TPZ com precisão técnica e pureza.",
      prompt
    ]);
    const response = await result.response;
    res.status(200).json({ message: response.text() });
  } catch (error) {
    res.status(500).json({ message: "Erro na convergência tecnológica." });
  }
}
