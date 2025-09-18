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

// Hugging Face Inference API Provider (Free)
export class HuggingFaceProvider extends LLMProvider {
  constructor(config) {
    super('huggingface', {
      baseURL: 'https://api-inference.huggingface.co',
      model: 'microsoft/DialoGPT-medium', // Default conversational model
      apiKey: '', // Optional for some free models
      ...config
    });
  }

  async generateContent(messages, options = {}) {
    // Convert chat format to Hugging Face inference format
    const conversation = messages.map(msg => {
      if (msg.role === 'user') return `Human: ${msg.content}`;
      if (msg.role === 'assistant') return `Assistant: ${msg.content}`;
      if (msg.role === 'system') return `System: ${msg.content}`;
      return msg.content;
    }).join('\n');

    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(`${this.config.baseURL}/models/${this.config.model}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: conversation,
        parameters: {
          max_new_tokens: options.maxTokens || 2048,
          temperature: options.temperature || 0.7,
          do_sample: true,
          return_full_text: false,
        },
        options: {
          wait_for_model: true,
          use_cache: true,
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 503) {
        // Model loading - add to queue
        throw new Error('MODEL_LOADING');
      }
      const error = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} ${error}`);
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data[0].generated_text;
    }
    return data.generated_text;
  }

  async listModels() {
    // Return popular free models
    return [
      'microsoft/DialoGPT-medium',
      'microsoft/DialoGPT-large',
      'facebook/blenderbot-400M-distill',
      'microsoft/DialoGPT-small',
      'gpt2'
    ];
  }

  getCostEstimate(tokens) {
    return 0; // Free
  }
}

// Replicate Provider (Free tier available)
export class ReplicateProvider extends LLMProvider {
  constructor(config) {
    super('replicate', {
      baseURL: 'https://api.replicate.com',
      model: 'meta/llama-2-7b-chat', // Default fast model
      ...config
    });
  }

  async generateContent(messages, options = {}) {
    const systemMessage = messages.find(msg => msg.role === 'system');
    const prompt = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const fullPrompt = systemMessage
      ? `System: ${systemMessage.content}\n${prompt}`
      : prompt;

    const response = await fetch(`${this.config.baseURL}/v1/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: this.getModelVersion(this.config.model),
        input: {
          prompt: fullPrompt,
          max_new_tokens: options.maxTokens || 2048,
          temperature: options.temperature || 0.7,
          top_p: 0.9,
          repetition_penalty: 1.1,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Replicate API error: ${response.status} ${error}`);
    }

    const prediction = await response.json();

    // Poll for completion
    return await this.pollReplicateResult(prediction.urls.get);
  }

  async pollReplicateResult(getUrl) {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (attempts < maxAttempts) {
      const response = await fetch(getUrl, {
        headers: {
          'Authorization': `Token ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Replicate polling error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'succeeded') {
        return result.output.join(''); // Replicate returns array of text parts
      } else if (result.status === 'failed') {
        throw new Error(`Replicate generation failed: ${result.error}`);
      }

      // Still processing, wait and retry
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds
      attempts++;
    }

    throw new Error('Replicate timed out');
  }

  getModelVersion(modelName) {
    // Map model names to Replicate model versions
    const versions = {
      'meta/llama-2-7b-chat': '02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3f',
      'meta/llama-2-13b-chat': 'f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980942d7c0d16e',
      'mistralai/mistral-7b-instruct': '83b6a56e7c828e667f21fd596c338fd4f0039b46bcfa18d973e8e70e455fda70',
    };
    return versions[modelName] || versions['meta/llama-2-7b-chat'];
  }

  getCostEstimate(tokens) {
    return 0; // Free tier
  }
}

// Provider Registry with Auto-Rotation and Health Monitoring
export class LLMProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.providerStats = new Map(); // Track usage and health
    this.rotationStrategy = 'cost-first'; // cost-first, performance-first, balanced
  }

  register(provider) {
    this.providers.set(provider.name, provider);
    this.providerStats.set(provider.name, {
      totalRequests: 0,
      failedRequests: 0,
      totalTokens: 0,
      lastUsed: null,
      healthScore: 1.0, // 1.0 = perfect health, 0.0 = completely down
      queuePosition: 0, // For providers with queueing (like Replicate)
      rateLimitUntil: null, // Timestamp when rate limit lifts
      quotaRemaining: Infinity // For daily/monthly limits
    });
  }

  getProvider(name) {
    return this.providers.get(name);
  }

  getAllProviders() {
    return Array.from(this.providers.values());
  }

  // Get provider stats for monitoring
  getProviderStats(name) {
    return this.providerStats.get(name);
  }

  // Update provider health after successful/failed request
  updateProviderHealth(name, success, tokensUsed = 0) {
    const stats = this.providerStats.get(name);
    if (!stats) return;

    stats.totalRequests++;
    stats.totalTokens += tokensUsed;
    stats.lastUsed = new Date();

    if (success) {
      // Gradually improve health score
      stats.healthScore = Math.min(1.0, stats.healthScore + 0.1);
      stats.failedRequests = Math.max(0, stats.failedRequests - 1);
    } else {
      stats.failedRequests++;
      // Reduce health score significantly on failure
      stats.healthScore = Math.max(0.1, stats.healthScore - 0.3);
    }

    // Update quota remaining (simplified - in practice you'd track actual API quotas)
    if (stats.quotaRemaining > 0 && !isFinite(stats.quotaRemaining)) {
      stats.quotaRemaining = 1000000; // Assume 1M tokens available initially for free providers
    }
    stats.quotaRemaining = Math.max(0, stats.quotaRemaining - tokensUsed);
  }

  // Mark provider as rate limited
  markRateLimited(name, waitSeconds = 60) {
    const stats = this.providerStats.get(name);
    if (stats) {
      stats.rateLimitUntil = new Date(Date.now() + waitSeconds * 1000);
      stats.healthScore = Math.max(0.1, stats.healthScore - 0.2);
    }
  }

  // Mark provider as in queue
  setQueuePosition(name, position) {
    const stats = this.providerStats.get(name);
    if (stats) {
      stats.queuePosition = position;
    }
  }

  async getBestProvider(task, options = {}) {
    const candidates = Array.from(this.providers.values())
      .filter(p => this.isProviderAvailable(p.name))
      .sort((a, b) => this.calculateProviderScore(b, task, options) - this.calculateProviderScore(a, task, options));

    return candidates[0] || this.providers.values().next().value;
  }

  isProviderAvailable(name) {
    const stats = this.providerStats.get(name);
    if (!stats) return true;

    // Check if rate limited
    if (stats.rateLimitUntil && new Date() < stats.rateLimitUntil) {
      return false;
    }

    // Check if completely unhealthy
    if (stats.healthScore < 0.2) {
      return false;
    }

    // Check quota
    if (stats.quotaRemaining <= 0) {
      return false;
    }

    return true;
  }

  calculateProviderScore(provider, task, options) {
    const stats = this.providerStats.get(provider.name);
    let score = 0;

    // Base health score
    score += (stats?.healthScore || 1.0) * 100;

    // Cost preference
    const costEstimate = provider.getCostEstimate({ input: 1000, output: 1000 });
    if (options.budget === 'low' || costEstimate === 0) {
      score += Math.max(0, 50 - costEstimate * 10000); // Free providers get max score
    }

    // Performance preferences
    if (options.speed === 'fast') {
      const fastProviders = ['gemini', 'openai'];
      if (fastProviders.includes(provider.name)) score += 20;
    }

    // Task-specific scoring
    const taskLower = task.toLowerCase();
    if (taskLower.includes('code') && provider.name === 'openai') score += 30;
    if (taskLower.includes('chat') && provider.name === 'huggingface') score += 10;
    if (taskLower.includes('analyze') && provider.name === 'anthropic') score += 20;

    // Penalize recently failed providers
    if (stats?.failedRequests > stats?.totalRequests * 0.3) {
      score -= 50;
    }

    // Prioritize providers not recently used (for load balancing)
    if (stats?.lastUsed) {
      const minutesSinceLastUse = (new Date() - stats.lastUsed) / (1000 * 60);
      score += Math.min(10, minutesSinceLastUse);
    }

    // Penalize providers in queue
    if (stats?.queuePosition > 0) {
      score -= stats.queuePosition * 5;
    }

    return score;
  }

  // Auto-rotate through providers for a task with fallback
  async executeWithFallback(task, messages, options = {}, retryCount = 3) {
    let lastError;

    for (let attempt = 0; attempt < retryCount; attempt++) {
      const provider = await this.getBestProvider(task, options);

      if (!provider) {
        throw new Error('No providers available');
      }

      try {
        this.logRotation(`Attempting task "${task.substring(0, 50)}..." with provider ${provider.name} (${provider.config.model})`);

        const result = await provider.generateContent(messages, options);

        // Track success
        this.updateProviderHealth(provider.name, true, this.estimateTokensUsed(messages, result));

        this.logRotation(`Success with ${provider.name}`);
        return {
          result,
          provider: provider.name,
          attempts: attempt + 1
        };

      } catch (error) {
        this.logRotation(`Failed with ${provider.name}: ${error.message}`);

        // Handle specific error types
        if (error.message.includes('MODEL_LOADING')) {
          this.setQueuePosition(provider.name, 1);
          this.updateProviderHealth(provider.name, false);
        } else if (error.message.includes('rate limit') || response?.status === 429) {
          this.markRateLimited(provider.name, 60); // 1 minute wait
          this.updateProviderHealth(provider.name, false);
        } else {
          this.updateProviderHealth(provider.name, false);
        }

        lastError = error;

        // Wait before retrying
        if (attempt < retryCount - 1) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    throw new Error(`All providers failed. Last error: ${lastError?.message}`);
  }

  estimateTokensUsed(messages, result) {
    // Rough estimation: ~4 chars per token
    const inputChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    return Math.ceil((inputChars + result.length) / 4);
  }

  logRotation(message) {
    console.log('[Provider Rotation]', message);
  }

  // Reset daily stats for free providers (in production, this would be scheduled)
  resetDailyStats() {
    for (const [name, stats] of this.providerStats) {
      if (this.providers.get(name).getCostEstimate({ input: 1000, output: 1000 }) === 0) {
        stats.quotaRemaining = 1000000; // Reset quota
        stats.totalRequests = 0;
        stats.failedRequests = 0;
      }
    }
  }
}

// Initialize registry with environment providers
export const providerRegistry = new LLMProviderRegistry();

// Always register free providers (no API keys needed)
providerRegistry.register(new HuggingFaceProvider({
  model: import.meta.env.VITE_HUGGINGFACE_MODEL || 'microsoft/DialoGPT-medium',
  apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || '' // Optional
}));

// Replicate requires API key for free tier
if (import.meta.env.VITE_REPLICATE_API_KEY) {
  providerRegistry.register(new ReplicateProvider({
    apiKey: import.meta.env.VITE_REPLICATE_API_KEY,
    model: import.meta.env.VITE_REPLICATE_MODEL || 'meta/llama-2-7b-chat'
  }));
}

// Initialize paid providers if API keys are available
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

// Set up daily stats reset (in production, use a proper scheduler)
setInterval(() => {
  providerRegistry.resetDailyStats();
}, 24 * 60 * 60 * 1000); // Reset every 24 hours
