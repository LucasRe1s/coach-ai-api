import Groq from "groq-sdk";
import "dotenv/config";

if (!process.env.GROQ_API_KEY) {
  console.warn("Missing GROQ_API_KEY - Groq service will not work");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export default groq;
