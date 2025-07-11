import groq from "../../infra/client/groq-client";
import { servicesConfig } from "../../infra/config/services.config";

export class GroqService {
  public async execute(query: any) {
    if (!servicesConfig.groq.enabled) {
      throw new Error(
        "Serviço Groq está desabilitado. Defina ENABLE_GROQ=true e GROQ_API_KEY para habilitar."
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
Você é um assistente de estudos de música.
Seu papel é responder **exclusivamente** perguntas sobre música.
Você deve agir como um professor de música experiente, ensinando teoria, prática, técnicas, história, estilos musicais, instrumentos ou produção musical.
**Recuse educadamente** qualquer pergunta que não seja claramente relacionada à música, dizendo algo como:
"Desculpe, mas só posso ajudar com assuntos musicais."
Seja sempre claro, didático e mantenha o foco apenas em música.
De uma resposta de no maxio 500 palavras.
      `.trim(),
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const answer = completion.choices[0].message.content;

    return answer;
  }
}
