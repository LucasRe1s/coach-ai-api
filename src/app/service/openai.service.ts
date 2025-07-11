import openAI from "../../infra/client/openAi-client";
import { servicesConfig } from "../../infra/config/services.config";

export class OpenAIService {

  constructor() {
  }

  public async execute(message: string): Promise<string> {
    if (!servicesConfig.openai.enabled) {
      throw new Error("Serviço OpenAI está desabilitado. Defina ENABLE_OPENAI=true e OPENAI_API_KEY para habilitar.");
    }

    try {
      const response = await openAI.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um assistente de estudos de música, responda como um professor de música experiente."
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      return response.choices[0].message.content || "Desculpe, não consegui processar sua pergunta.";
    } catch (error) {
      console.error("Erro ao executar OpenAI:", error);
      throw new Error("Erro ao processar pergunta com OpenAI");
    }
  }
} 