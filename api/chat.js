import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { neon } from '@neondatabase/serverless';
import { GoogleGenerativeAI } from "@google/generative-ai";

const s3Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: { 
        accessKeyId: process.env.R2_ACCESS_KEY_ID, 
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY 
    },
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL);
    const { seed, message, file } = req.body;

    if (file) {
        const buffer = Buffer.from(file.data, 'base64');
        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: `bunker/${file.name}`,
            Body: buffer,
            ContentType: file.type
        }));
        return res.status(200).json({ response: "Codex Injected." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const aiResponse = result.response.text();

    const [session] = await sql`SELECT * FROM sessions WHERE seed = ${seed}`;
    let history = session ? JSON.parse(session.history) : [];
    history.push({ role: 'user', content: message }, { role: 'assistant', content: aiResponse });

    await sql`INSERT INTO sessions (seed, history) VALUES (${seed}, ${JSON.stringify(history)}) 
              ON CONFLICT (seed) DO UPDATE SET history = EXCLUDED.history`;

    res.status(200).json({ response: aiResponse, seed });
}
