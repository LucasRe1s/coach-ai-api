import { z } from 'zod';

export const ConversationSchema = z.object({
  message: z.string().min(1, "Mensagem é obrigatória"),
});

export const CreateConversationSchema = z.object({
  message: z.string().min(1, "Mensagem é obrigatória"),
  provider: z.enum(['groq', 'openai']).optional().default('groq'),
});

export const ConversationIdSchema = z.object({
    id: z.string().min(1, "ID é obrigatório")
});

export type ConversationProps = z.infer<typeof ConversationSchema>; 