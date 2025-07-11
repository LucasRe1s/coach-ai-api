import { ConversationEntity } from "../../infra/database/entities/conversation";

export class ConversationService {
  private repository = ConversationEntity;

  constructor() {
    this.repository = ConversationEntity;
  }

  public async createMessage(message: string, userId: string) {
    const newConversation = {
      user_id: userId,
      first_message: message,
      message_count: 1,
      messages: [{
        content: message,
        role: 'user',
        timestamp: new Date()
      }]
    };

    return await new this.repository(newConversation).save();
  }

  public async listConversations(userId?: string) {
    const filter = userId ? { user_id: userId } : {};
    return await this.repository.find(filter)
      .populate('user_id', 'name email')
      .sort({ updated_at: -1 });
  }

  public async addMessageToConversation(conversationId: any, content: string, role: 'user' | 'assistant') {
    const conversation = await this.repository.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversa não encontrada');
    }

    conversation.messages = conversation.messages || [];
    conversation.messages.push({
      content,
      role,
      timestamp: new Date()
    });

    // Atualizar contadores
    conversation.message_count = conversation.messages.length;
    conversation.last_message = content;
    conversation.updated_at = new Date();

    return await conversation.save();
  }

  public async getMessages(id: string) {
    return await this.repository.findById(id);
  }

} 