import { Router } from "express";
import { ConversationController } from "./conversation.controller";
const conversationController = new ConversationController();
export const conversationRoute = Router();

// Rotas essenciais
conversationRoute.post("/conversations", conversationController.createMessage);
conversationRoute.get("/conversations/user", conversationController.listConversationsByUser);
conversationRoute.get("/conversations", conversationController.listAllConversations);
conversationRoute.get("/conversations/:id/messages", conversationController.getMessages);