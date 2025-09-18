// Multi-LLM Provider System
// Supports multiple AI providers with standardized interface

export class LLMProvider {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.baseURL = config.baseURL || '';
    this.apiKey = config.apiKey || '';
    this.model = config.model || '';
  }

  async generateContent(messages, options = {}) {
    throw new Error('generateContent must be implemented by subclass');
  }

  async listModels() {
    throw new Error('listModels must be implemented by subclass');
  }

  getCostEstimate(tokens) {
    return 0; // Default no cost
  }
}

// OpenAI Provider
export class OpenAIProvider extends LLMProvider {
  constructor(config) {
    super('openai', {
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4',
      ...config
    });
  }

  async generateContent(messages, options = {}) {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async listModels() {
    const response = await fetch(`${this.config.baseURL}/models`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
    });
    const data = await response.json();
    return data.data.map(model => model.id);
  }

  getCostEstimate(tokens) {
    const costs = {
      'gpt-4': { input: 0.03, output: 0.06 },
      'gpt-3.5-turbo': { input: 0.002, output: 0.002 },
    };
    const modelCost = costs[this.config.model] || { input: 0.002, output: 0.002 };
    return (tokens.input * modelCost.input / 1000) + (tokens.output * modelCost.output / 1000);
  }
}

// Anthropic Claude Provider
export class AnthropicProvider extends LLMProvider {
  constructor(config) {
    super('anthropic', {
      baseURL: 'https://api.anthropic.com',
      model: 'claude-3-opus-20240229',
      ...config
    });
  }

  async generateContent(messages, options = {}) {
    const systemMessage = messages.find(msg => msg.role === 'system');
    const otherMessages = messages.filter(msg => msg.role !== 'system');

    const response = await fetch(`${this.config.baseURL}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model,
        system: systemMessage ? systemMessage.content : undefined,
        messages: otherMessages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  getCostEstimate(tokens) {
    const costs = {
      'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
      'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
      'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
    };
    const modelCost = costs[this.config.model] || { input: 0.00025, output: 0.00125 };
    return (tokens.input * modelCost.input / 1000) + (tokens.output * modelCost.output / 1000);
  }
}

// Google Gemini Provider
export class GeminiProvider extends LLMProvider {
  constructor(config) {
    super('gemini', {
      baseURL: 'https://generativelanguage.googleapis.com',
      model: 'gemini-1.5-flash',
      ...config
    });
  }

  async generateContent(messages, options = {}) {
    const response = await fetch(
      `${this.config.baseURL}/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') }] }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  getCostEstimate(tokens) {
    const costs = {
      'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
      'gemini-1.5-pro': { input: 0.0007, output: 0.0021 },
    };
    const modelCost = costs[this.config.model] || { input: 0.000075, output: 0.0003 };
    return (tokens.input * modelCost.input) + (tokens.output * modelCost.output);
  }
}

// Provider Registry
export class LLMProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(provider) {
    this.providers.set(provider.name, provider);
  }

  getProvider(name) {
    return this.providers.get(name);
  }

  getAllProviders() {
    return Array.from(this.providers.values());
  }

  async getBestProvider(task, options = {}) {
    // Simple routing logic - can be enhanced with cost, speed, quality preferences
    let bestProvider = null;
    let bestScore = 0;

    for (const provider of this.providers.values()) {
      let score = 0;

      // Prefer cheaper providers for simple tasks
      if (options.budget === 'low' && provider.getCostEstimate({input: 1000, output: 1000}) < 0.01) {
        score += 2;
      }

      // Prefer faster providers for quick responses
      if (options.speed === 'fast' && provider.name === 'gemini') {
        score += 1;
      }

      // Prefer more capable providers for complex tasks
      if (task.includes('code') && provider.name === 'openai') {
        score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestProvider = provider;
      }
    }

    return bestProvider || Array.from(this.providers.values())[0];
  }
}

// Initialize registry with environment providers
export const providerRegistry = new LLMProviderRegistry();

// Initialize providers if API keys are available
const initProviders = () => {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (openaiKey) {
    providerRegistry.register(new OpenAIProvider({
      apiKey: openaiKey,
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4'
    }));
  }

  if (anthropicKey) {
    providerRegistry.register(new AnthropicProvider({
      apiKey: anthropicKey,
      model: import.meta.env.VITE_ANTHROPIC_MODEL || 'claude-3-sonnet-20240229'
    }));
  }

  if (geminiKey) {
    providerRegistry.register(new GeminiProvider({
      apiKey: geminiKey,
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
    }));
  }
};

initProviders();
