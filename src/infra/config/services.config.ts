import "dotenv/config";

export interface ServiceConfig {
  enabled: boolean;
  apiKey: string;
  name: string;
}

export const servicesConfig = {
  groq: {
    enabled: process.env.ENABLE_GROQ === "true" && !!process.env.GROQ_API_KEY,
    apiKey: process.env.GROQ_API_KEY || "",
    name: "Groq"
  },
  openai: {
    enabled: process.env.ENABLE_OPENAI === "true" && !!process.env.OPENAI_API_KEY,
    apiKey: process.env.OPENAI_API_KEY || "",
    name: "OpenAI"
  }
} as const;

export const getEnabledServices = () => {
  return Object.entries(servicesConfig).filter(([_, config]) => config.enabled);
};

export const hasAnyServiceEnabled = () => {
  return Object.values(servicesConfig).some(config => config.enabled);
};

export const logServicesStatus = () => {
  console.log("=== Status dos Serviços de IA ===");
  Object.entries(servicesConfig).forEach(([key, config]) => {
    const status = config.enabled ? "✅ Habilitado" : "❌ Desabilitado";
    const reason = config.enabled ? "" : 
      !process.env[`ENABLE_${key.toUpperCase()}`] ? " (ENABLE_ não definido)" :
      !process.env[`${key.toUpperCase()}_API_KEY`] ? " (API_KEY não definida)" : "";
    
    console.log(`${config.name}: ${status}${reason}`);
  });
  console.log("================================");
}; 