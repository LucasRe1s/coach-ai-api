import OpenAI from "openai";
import { servicesConfig } from "../config/services.config";

const config = servicesConfig.openai;

if (!config.enabled) {
  console.warn(`OpenAI está desabilitado. Para habilitar, defina ENABLE_OPENAI=true e OPENAI_API_KEY`);
}

export const openAI = new OpenAI({
  apiKey: config.apiKey,
});

export default openAI;
