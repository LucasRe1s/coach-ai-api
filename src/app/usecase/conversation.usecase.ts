import { ConversationService } from "../service/conversation.service";
import { GroqService } from "../service/groq.service";
import { OpenAIService } from "../service/openai.service";

export class ConversationUseCase {
  private service: ConversationService;
  private groqService: GroqService;
  private openaiService: OpenAIService;

  constructor() {
    this.service = new ConversationService();
    this.groqService = new GroqService();
    this.openaiService = new OpenAIService();
  }

  public async createMessage(message: string, userId: string, provider?: 'groq' | 'openai') {
    let answer: string;

    try {
      // 1. Tenta obter a resposta da IA primeiro
      if (provider) {
        if (provider === 'openai') {
          answer = await this.openaiService.execute(message);
        } else if (provider === 'groq') {
          answer = (await this.groqService.execute(message)) ?? "Desculpe, não consegui processar sua pergunta.";
        } else {
          throw new Error(`Serviço ${provider} não suportado`);
        }
      } else {
        // Fallback automático: tenta OpenAI primeiro, depois Groq
        try {
          answer = await this.openaiService.execute(message);
        } catch (error) {
          answer = (await this.groqService.execute(message)) ?? "Desculpe, não consegui processar sua pergunta.";
        }
      }
    } catch (error) {
      // Se der erro em qualquer IA, lança um erro amigável (não salva nada)
      throw new Error("Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente mais tarde.");
    }

    // 2. Só cria/salva a conversa se a IA respondeu com sucesso
    const conversation = await this.service.createMessage(message, userId);
    const updatedConversation = await this.service.addMessageToConversation(conversation._id, answer, 'assistant');
    return updatedConversation;
  }

  public async listConversations(userId?: string) {
    return await this.service.listConversations(userId);
  }

  public async getMessages(id: string) {
    return await this.service.getMessages(id);
  }
} 