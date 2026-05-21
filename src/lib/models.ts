export const models = [
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash", provider: "Google" },
  { id: "meta-llama/llama-4-maverick", name: "Llama 4 Maverick", provider: "Meta" },
  { id: "deepseek/deepseek-v3.2", name: "DeepSeek V3.2", provider: "DeepSeek" },
  { id: "mistralai/mistral-small-3.2-24b-instruct", name: "Mistral Small 3.2", provider: "Mistral" },
  { id: "qwen/qwen3-32b", name: "Qwen3 32B", provider: "Qwen" },
] as const;

export type ModelId = (typeof models)[number]["id"];

export const modelCosts: Record<string, number> = {
  "openai/gpt-4o-mini": 0.15,
  "google/gemini-2.0-flash-001": 0.1,
  "meta-llama/llama-4-maverick": 0.2,
  "deepseek/deepseek-v3.2": 0.2,
  "mistralai/mistral-small-3.2-24b-instruct": 0.1,
  "qwen/qwen3-32b": 0.15,
};
