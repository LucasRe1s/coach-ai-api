import { request, Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../middleware/async-handler.middleware";
import { ValidationError } from "../../errors";
import { ConversationUseCase } from "../../app/usecase/conversation.usecase";
import { CreateConversationSchema } from "./conversation.schema";

export class ConversationController {
  private usecase: ConversationUseCase;

  constructor() {
    this.usecase = new ConversationUseCase();
  }

  public createMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers.id as string;

    if (!userId) {
      throw new ValidationError("Usuário não autenticado");
    }

    const { message, provider } = CreateConversationSchema.parse(req.body);

    const data = await this.usecase.createMessage(message, userId, provider);
    console.log(data.messages[1].content);

    res.status(201).json(data);
  });

  public listConversationsByUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers.id as string;

    if (!userId) {
      throw new ValidationError("Usuário não autenticado");
    }

    const conversations = await this.usecase.listConversations(userId);
    
    // Formatar resposta conforme solicitado
    const formattedConversations = conversations.map(conv => ({
      id: conv._id,
      title: conv.title || conv.first_message.substring(0, 50) + '...',
      first_message: conv.first_message,
      last_message: conv.last_message || conv.first_message,
      message_count: conv.message_count,
      duration: conv.duration || 0,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      user_id: conv.user_id
    }));

    res.status(200).json(formattedConversations);
  });

  public listAllConversations = asyncHandler(async (req: Request, res: Response) => {
    const conversations = await this.usecase.listConversations();
    res.status(200).json(conversations);
  });

  public getMessages = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const messages = await this.usecase.getMessages(id);
      res.json(messages);
    } catch (error) {
      res.status(404).json({ error: 'Conversa não encontrada' });
    }
  });
}