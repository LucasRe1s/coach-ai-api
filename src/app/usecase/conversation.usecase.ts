import { ConversationService } from "../service/conversation.service";
import { GroqService } from "../service/groq.service";
import { OpenAIService } from "../service/openai.service";
import { servicesConfig, hasAnyServiceEnabled } from "../../infra/config/services.config";

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
    const conversation = await this.service.createMessage(message, userId);
    
    let answer: string;
    
    try {
      // Se provider foi especificado, tenta usar ele primeiro
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
          console.log("OpenAI falhou, tentando Groq...");
          answer = (await this.groqService.execute(message)) ?? "Desculpe, não consegui processar sua pergunta.";
        }
      }
    } catch (error) {
      console.error("Erro ao processar com IA:", error);
      answer = "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente mais tarde.";
    }
    
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