const { GoogleGenerativeAI } = require("@google/generative-ai");
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Apenas POST permitido' });
  }
  const { prompt } = req.body;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([
      "És o Deep Agent RG-6174. Responde com pureza, sem loops ou funis comerciais.",
      prompt
    ]);
    const response = await result.response;
    res.status(200).json({ message: response.text() });
  } catch (error) {
    res.status(500).json({ message: "Erro na convergência tecnológica." });
  }
};
