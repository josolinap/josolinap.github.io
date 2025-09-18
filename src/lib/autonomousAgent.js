// Autonomous Agent System
// Self-improving AI that can execute tasks, modify code, and learn

import { providerRegistry } from './providers.js';

export class AutonomousAgent {
  constructor(memory = {}) {
    this.memory = memory;
    this.skills = new Map();
    this.conversation = [];
    this.tools = new Map();
    this.presence = 'learning'; // learning, active, improving
  }

  // Register a tool the agent can use
  registerTool(name, toolDefinition) {
    this.tools.set(name, {
      name: name,
      description: toolDefinition.description || '',
      parameters: toolDefinition.parameters || {},
      execute: toolDefinition.execute,
    });
  }

  // Execute a tool with given parameters
  async executeTool(toolName, parameters = {}) {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new Error(`Tool '${toolName}' not found`);
    }

    return await tool.execute(parameters, {
      agent: this,
      memory: this.memory,
      conversation: this.conversation
    });
  }

  // Plan and execute a complex task
  async executeTask(task, context = {}) {
    this.log(`Starting task: ${task}`);

    try {
      // Get the best LLM provider for this task
      const provider = await providerRegistry.getBestProvider(task, {
        budget: context.budget,
        speed: context.speed
      });

      this.log(`Using provider: ${provider.name} (${provider.config.model})`);

      // Create system prompt for autonomous behavior
      const systemPrompt = `You are an autonomous AI agent capable of:
- Planning and executing multi-step tasks
- Using available tools to accomplish goals
- Self-improving by analyzing your performance
- Following user instructions precisely

Available tools: ${Array.from(this.tools.keys()).join(', ')}

When planning:
1. Break complex tasks into smaller steps
2. Choose appropriate tools for each step
3. Consider dependencies and prerequisites
4. Adapt plans based on feedback

Always respond with executable actions or final results. Be direct and efficient.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: task }
      ];

      // Add conversation history if relevant
      if (this.conversation.length > 0) {
        const recentHistory = this.conversation.slice(-5); // Last 5 exchanges
        messages.splice(1, 0, ...recentHistory);
      }

      const response = await provider.generateContent(messages, {
        temperature: 0.3, // Lower temperature for task execution
        maxTokens: 8192
      });

      this.log(`Agent response: ${response.substring(0, 200)}...`);

      // Execute any tool calls in the response
      const toolCalls = this.extractToolCalls(response);

      if (toolCalls.length > 0) {
        const results = await this.executeToolCalls(toolCalls);
        return results;
      }

      return response;

    } catch (error) {
      this.log(`Task execution error: ${error.message}`);
      throw error;
    }
  }

  // Extract tool calls from AI response
  extractToolCalls(response) {
    const toolCalls = [];

    // Look for patterns like: "execute tool_name with parameters"
    // This is a simple pattern - in production you'd use structured outputs

    const toolPattern = /execute\s+(\w+)\s+with\s+(.+?)(?:\s*$|and\s+|$)/gi;
    let match;

    while ((match = toolPattern.exec(response)) !== null) {
      const [_, toolName, paramString] = match;
      const parameters = this.parseParameters(paramString);

      toolCalls.push({
        tool: toolName,
        parameters: parameters
      });
    }

    return toolCalls;
  }

  // Parse parameter string into object
  parseParameters(paramString) {
    // Simple key-value parsing
    const params = {};

    // Handle quoted values
    const quotedPattern = /(\w+)\s*=\s*"([^"]+)"/g;
    let match;

    while ((match = quotedPattern.exec(paramString)) !== null) {
      params[match[1]] = match[2];
    }

    // Handle unquoted values
    const simplePattern = /(\w+)\s*=\s*([^,\s]+)/g;
    while ((match = simplePattern.exec(paramString)) !== null) {
      if (!params[match[1]]) {
        params[match[1]] = match[2];
      }
    }

    return params;
  }

  // Execute multiple tool calls
  async executeToolCalls(toolCalls) {
    const results = [];

    for (const call of toolCalls) {
      try {
        this.log(`Executing tool: ${call.tool} with params:`, call.parameters);
        const result = await this.executeTool(call.tool, call.parameters);
        results.push({
          tool: call.tool,
          success: true,
          result: result
        });
      } catch (error) {
        this.log(`Tool execution failed: ${call.tool} - ${error.message}`);
        results.push({
          tool: call.tool,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }

  // Self-improvement: analyze past performance and suggest improvements
  async analyzePerformance() {
    const provider = await providerRegistry.getBestProvider('analysis', { budget: 'low' });

    const systemPrompt = `You are an AI performance analyzer. Review the agent's conversation history and suggest improvements:
- Identify successful patterns and strategies
- Find areas for improvement
- Suggest new tools or capabilities
- Recommend changes to system prompts or behavior

Provide specific, actionable recommendations.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Analyze this agent's performance history:\n\n${JSON.stringify(this.conversation.slice(-10), null, 2)}\n\nWhat improvements would you suggest?`
      }
    ];

    const analysis = await provider.generateContent(messages, {
      temperature: 0.5,
      maxTokens: 2048
    });

    this.memory.performanceAnalysis = analysis;
    return analysis;
  }

  // Self-modification: allow agent to suggest code changes
  async suggestImprovements() {
    const provider = await providerRegistry.getBestProvider('code', { speed: 'fast' });

    const systemPrompt = `You are an expert software engineer. The agent you're analyzing needs improvements.

Based on the conversation history and current architecture, suggest specific code changes that would:

1. Enhance the agent's capabilities
2. Improve tool execution
3. Add new features
4. Fix bugs or inefficiencies

Provide specific file changes, new functions, or architectural improvements. Be concrete and implementable.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Suggest improvements for this autonomous agent:

Files structure: ${Object.keys(window.__vite__?.ssrFixStack || {}).slice(0, 10) || 'React app with multiple AI providers'}

Current conversation sample: ${JSON.stringify(this.conversation.slice(-3), null, 2)}

What specific improvements would you recommend?`
      }
    ];

    const suggestions = await provider.generateContent(messages, {
      temperature: 0.3,
      maxTokens: 4096
    });

    return suggestions;
  }

  // Log conversations and actions for learning
  log(message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message,
      data: data
    };

    // Add to conversation for context
    this.conversation.push({
      role: 'assistant',
      content: `LOG: ${message}${data ? ` (${JSON.stringify(data)})` : ''}`,
      timestamp: logEntry.timestamp
    });

    // Also log to console
    console.log('[Autonomous Agent]', message, data);

    // Store in memory for persistence
    if (!this.memory.logs) this.memory.logs = [];
    this.memory.logs.push(logEntry);

    // Keep only recent logs
    if (this.memory.logs.length > 100) {
      this.memory.logs = this.memory.logs.slice(-100);
    }
  }

  // Save agent's state
  saveState() {
    return {
      memory: this.memory,
      skills: Array.from(this.skills.entries()),
      conversation: this.conversation,
      presence: this.presence
    };
  }

  // Load agent's state
  loadState(state) {
    this.memory = state.memory || {};
    this.skills = new Map(state.skills || []);
    this.conversation = state.conversation || [];
    this.presence = state.presence || 'learning';
  }

  // Chat interface - process natural language input
  async chat(message, context = {}) {
    // Add user message to conversation
    this.conversation.push({ role: 'user', content: message });

    try {
      let response;

      // Determine if this is a task or casual chat
      if (this.isTaskRequest(message)) {
        response = await this.executeTask(message, context);
      } else {
        // Casual conversation with appropriate LLM
        const provider = await providerRegistry.getBestProvider(message, { budget: 'high' });
        const chatHistory = this.conversation.slice(-10);

        const messages = [
          {
            role: 'system',
            content: 'You are a helpful, autonomous AI assistant. Engage in natural conversation while being capable of executing complex tasks. Always be ready to use tools or perform actions when needed.'
          },
          ...chatHistory
        ];

        response = await provider.generateContent(messages, {
          temperature: 0.8,
          maxTokens: 4096
        });
      }

      // Add response to conversation
      this.conversation.push({ role: 'assistant', content: response });

      // Keep conversation history manageable
      if (this.conversation.length > 50) {
        this.conversation = [
          ...this.conversation.slice(0, 5), // Keep first 5 for context
          ...this.conversation.slice(-45) // Last 45
        ];
      }

      return response;

    } catch (error) {
      const errorMsg = `I encountered an error: ${error.message}`;
      this.conversation.push({ role: 'assistant', content: errorMsg });
      return errorMsg;
    }
  }

  // Determine if user message is a task request vs casual chat
  isTaskRequest(message) {
    const taskIndicators = [
      'implement', 'create', 'build', 'write', 'fix', 'improve',
      'analyze', 'plan', 'generate', 'code', 'deploy', 'setup',
      'configure', 'update', 'add', 'remove', 'modify', 'refactor'
    ];

    const lowerMsg = message.toLowerCase();
    return taskIndicators.some(indicator => lowerMsg.includes(indicator));
  }
}

// Initialize the global autonomous agent
export const globalAgent = new AutonomousAgent();
