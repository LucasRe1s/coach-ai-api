import { Schema, model } from 'mongoose';

// Conversation
const ConversationSchema = new Schema({
  title: { type: String },
  first_message: { type: String, required: true },
  last_message: { type: String },
  message_count: { type: Number, required: true, default: 0 },
  duration: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  user_id: { type: String, required: true },
  messages: [{
    content: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    timestamp: { type: Date, default: Date.now }
  }]
});

export const ConversationEntity = model('Conversation', ConversationSchema);


