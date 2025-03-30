import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getResponse(prompt) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `${prompt}\n\Please provide a concise summary in just 1 sentence`,
        },
      ],
      max_tokens: 100,
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default getResponse;

