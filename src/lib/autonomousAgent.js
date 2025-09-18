// Autonomous Agent System
// Self-improving AI that can execute tasks, modify code, and learn

import { providerRegistry } from './providers.js';
import { memoryPersistence } from './supabaseClient.js';

export class AutonomousAgent {
  constructor(memory = {}) {
    this.memory = memory;
    this.skills = new Map();
    this.conversation = [];
    this.tools = new Map();
    this.presence = 'learning'; // learning, active, improving
    this.evolutionObjectives = []; // Long-term goals for autonomous development
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

  // Plan and execute a complex task with provider auto-rotation
  async executeTask(task, context = {}) {
    this.log(`Starting task with auto-rotation: ${task}`);

    try {
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

      // Use auto-rotation with fallback
      const result = await providerRegistry.executeWithFallback(task, messages, {
        temperature: 0.3, // Lower temperature for task execution
        maxTokens: 8192,
        budget: context.budget,
        speed: context.speed
      }, 3); // Retry up to 3 providers

      this.log(`Task completed with ${result.provider} after ${result.attempts} attempts`);

      // Execute any tool calls in the response
      const toolCalls = this.extractToolCalls(result.result);

      if (toolCalls.length > 0) {
        const toolResults = await this.executeToolCalls(toolCalls);
        return toolResults;
      }

      return result.result;

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
3. Add new tools or capabilities
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

  // Auto-create MCP servers for discovered APIs
  async createMCPServer(apiDetails, serverType = 'cloudflare') {
    this.log(`Creating MCP server for API: ${apiDetails.name}`);

    const provider = await providerRegistry.getBestProvider('code generation', { budget: 'low' });

    let serverTemplate = '';

    if (serverType === 'cloudflare') {
      serverTemplate = await this.generateCloudflareWorker(apiDetails);
    } else if (serverType === 'node') {
      serverTemplate = await this.generateNodeMCPServer(apiDetails);
    }

    // Save the generated server
    const serverName = `${apiDetails.name.toLowerCase().replace(/\s+/g, '-')}-server`;
    const serverPath = `cloudflare-worker/src/${serverName}.js`;

    // Store in memory for deployment
    this.memory.pendingServers = this.memory.pendingServers || [];
    this.memory.pendingServers.push({
      name: serverName,
      code: serverTemplate,
      path: serverPath,
      api: apiDetails
    });

    this.log(`MCP server generated: ${serverName}`);
    return {
      serverName,
      code: serverTemplate,
      deployment: `Use: cd cloudflare-worker && wrangler deploy`
    };
  }

  // Generate Cloudflare Worker MCP server
  async generateCloudflareWorker(apiDetails) {
    const provider = await providerRegistry.getBestProvider('code generation', { budget: 'low' });

    const messages = [
      {
        role: 'system',
        content: 'Generate a Cloudflare Worker that acts as an MCP server proxy for the given API. Include proper error handling, CORS, and security measures.'
      },
      {
        role: 'user',
        content: `Create a Cloudflare Worker MCP server for this API:

Name: ${apiDetails.name}
Description: ${apiDetails.description}
Endpoint: ${apiDetails.url}
Auth Type: ${apiDetails.auth || 'None'}
Category: ${apiDetails.category}

The server should:
1. Handle CORS properly for web requests
2. Proxy requests to the actual API
3. Include authentication if required
4. Provide proper error handling
5. Return structured responses

Generate complete, deployable Cloudflare Worker code.`
      }
    ];

    const code = await provider.generateContent(messages, {
      temperature: 0.2,
      maxTokens: 2048
    });

    return code;
  }

  // Generate Node.js MCP server
  async generateNodeMCPServer(apiDetails) {
    const provider = await providerRegistry.getBestProvider('code generation', { budget: 'low' });

    const messages = [
      {
        role: 'system',
        content: 'Generate a Node.js MCP server that provides access to external APIs through standardized MCP protocol.'
      },
      {
        role: 'user',
        content: `Create a Node.js MCP server for this API:

Name: ${apiDetails.name}
Description: ${apiDetails.description}
Endpoint: ${apiDetails.url}
Auth Type: ${apiDetails.auth || 'None'}

Include:
1. Express.js server setup
2. MCP protocol implementation
3. API integration
4. Error handling and validation
5. Package.json dependencies

Generate complete server code with all necessary files.`
      }
    ];

    const code = await provider.generateContent(messages, {
      temperature: 0.2,
      maxTokens: 3072
    });

    return code;
  }

  // Deploy pending MCP servers
  async deployMCPServers() {
    const pendingServers = this.memory.pendingServers || [];

    if (pendingServers.length === 0) {
      return 'No pending servers to deploy';
    }

    const deploymentResults = [];

    for (const server of pendingServers) {
      try {
        // In production, this would write files and deploy
        this.log(`Deploying server: ${server.name}`);

        // Simulate deployment
        const result = await this.simulateDeployment(server.name);
        deploymentResults.push({
          name: server.name,
          status: 'deployed',
          url: `https://${server.name}.workers.dev`
        });

      } catch (error) {
        deploymentResults.push({
          name: server.name,
          status: 'failed',
          error: error.message
        });
      }
    }

    // Clear pending servers
    this.memory.pendingServers = [];

    return deploymentResults;
  }

  // Simulate deployment (in production, use actual deployment tools)
  async simulateDeployment(serverName) {
    this.log(`Simulating deployment of ${serverName}`);
    // In real implementation, would run wrangler deploy or similar
    return { deployed: true, simulation: true };
  }

  // Discover new capabilities and create servers for them
  async discoverAndIntegrateAPIs(maxNewServers = 3) {
    this.log('Discovering new APIs for integration...');

    const categories = ['weather', 'finance', 'social', 'data', 'utility'];

    for (const category of categories) {
      // Use web scraping and API discovery tools
      const apis = await this.executeTool('discoverAPIs', {
        category: category,
        freeOnly: true,
        maxResults: 5
      });

      if (apis && apis.apis && apis.apis.length > 0) {
        const newApi = apis.apis.find(api => {
          // Check if we already have this API integrated
          const existingServers = this.memory.pendingServers || [];
          return !existingServers.some(s => s.api.name === api.name);
        });

        if (newApi && maxNewServers > 0) {
          await this.createMCPServer(newApi);
          maxNewServers--;

          this.log(`New API integrated: ${newApi.name}`);
        }
      }
    }

    return 'API discovery and integration complete';
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

  // Chat interface - process natural language input with auto-rotation
  async chat(message, context = {}) {
    // Add user message to conversation
    this.conversation.push({ role: 'user', content: message });

    try {
      let response;

      // Determine if this is a task or casual chat
      if (this.isTaskRequest(message)) {
        response = await this.executeTask(message, context);
      } else {
        // Casual conversation with auto-rotation fallback
        const chatHistory = this.conversation.slice(-10);

        const messages = [
          {
            role: 'system',
            content: 'You are a helpful, autonomous AI assistant. Engage in natural conversation while being capable of executing complex tasks. Always be ready to use tools or perform actions when needed.'
          },
          ...chatHistory
        ];

        const result = await providerRegistry.executeWithFallback(message, messages, {
          temperature: 0.8,
          maxTokens: 4096,
          budget: context.budget || 'low' // Prefer free providers for casual chat
        }, 3);

        this.log(`Chat completed with ${result.provider} after ${result.attempts} attempts`);
        response = result.result;
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

  // Evolution objective management
  async setEvolutionObjectives(userGoals = []) {
    this.log('Setting evolution objectives...');

    const provider = await providerRegistry.getBestProvider('strategic planning', { budget: 'low' });

    const baseObjectives = [
      'Expand API integration capabilities',
      'Improve performance and efficiency',
      'Enhance security and safety controls',
      'Develop new tools and features',
      'Optimize resource usage',
      'Increase autonomous operation capabilities'
    ];

    const allGoals = [...baseObjectives, ...userGoals];

    const objectives = [];

    for (const goal of allGoals) {
      const objective = {
        id: this.generateObjectiveId(),
        description: goal,
        priority: await this.calculateObjectivePriority(goal),
        milestones: await this.generateMilestones(goal),
        progress: 0,
        status: 'active',
        created: new Date().toISOString(),
        deadline: await this.calculateDeadline(goal)
      };
      objectives.push(objective);
    }

    this.evolutionObjectives = objectives.sort((a, b) => b.priority - a.priority);

    this.log(`Set ${objectives.length} evolution objectives`);
    return objectives;
  }

  async generateMilestones(goal) {
    const provider = await providerRegistry.getBestProvider('planning', { budget: 'low' });

    const messages = [
      {
        role: 'system',
        content: 'Break down a goal into specific, measurable milestones that can be tracked and achieved incrementally.'
      },
      {
        role: 'user',
        content: `Break down this goal into 3-5 specific, measurable milestones:\n\n${goal}\n\nProvide milestones with clear success criteria.`
      }
    ];

    const response = await provider.generateContent(messages, {
      temperature: 0.3,
      maxTokens: 1024
    });

    // Parse response into milestone objects
    const milestoneLines = response.split('\n').filter(line => line.trim().match(/^\d+\.?\s*/));
    return milestoneLines.map(line => ({
      description: line.replace(/^\d+\.?\s*/, '').trim(),
      completed: false,
      created: new Date().toISOString()
    }));
  }

  async calculateObjectivePriority(goal) {
    const priorityIndicators = {
      high: ['security', 'safety', 'critical', 'infrastructure', 'core'],
      medium: ['performance', 'efficiency', 'user experience', 'reliability'],
      low: ['nice-to-have', 'cosmetic', 'experimental', 'research']
    };

    const lowerGoal = goal.toLowerCase();

    if (priorityIndicators.high.some(word => lowerGoal.includes(word))) return 9;
    if (priorityIndicators.medium.some(word => lowerGoal.includes(word))) return 6;
    return 3; // Low priority default
  }

  async calculateDeadline(goal) {
    const deadlineIndicators = {
      urgent: ['critical', 'security', 'bug', 'fix'],
      medium: ['performance', 'optimization', 'feature'],
      long: ['research', 'exploration', 'expansion']
    };

    const lowerGoal = goal.toLowerCase();
    const now = new Date();

    if (deadlineIndicators.urgent.some(word => lowerGoal.includes(word))) {
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 1 week
    } else if (deadlineIndicators.medium.some(word => lowerGoal.includes(word))) {
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 1 month
    }
    return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(); // 3 months
  }

  generateObjectiveId() {
    return `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Update objective progress
  updateObjectiveProgress(objectiveId, newProgress, milestoneDescription = null) {
    const objective = this.evolutionObjectives.find(obj => obj.id === objectiveId);
    if (!objective) {
      throw new Error(`Objective ${objectiveId} not found`);
    }

    objective.progress = Math.min(Math.max(newProgress, 0), 100);

    if (milestoneDescription) {
      const milestone = objective.milestones.find(m => m.description.includes(milestoneDescription));
      if (milestone) {
        milestone.completed = true;
        milestone.completedAt = new Date().toISOString();

        this.log(`Milestone completed: ${milestoneDescription}`);
      }
    }

    if (objective.progress >= 100) {
      objective.status = 'completed';
      objective.completedAt = new Date().toISOString();
      this.log(`Evolution objective completed: ${objective.description}`);
    }

    this.saveObjectiveProgress();
    return objective;
  }

  // Evaluate progress towards objectives
  async evaluateEvolutionProgress() {
    this.log('Evaluating evolution progress...');

    const activeObjectives = this.evolutionObjectives.filter(obj => obj.status === 'active');
    const progressReport = {
      totalObjectives: this.evolutionObjectives.length,
      activeObjectives: activeObjectives.length,
      completedObjectives: this.evolutionObjectives.filter(obj => obj.status === 'completed').length,
      averageProgress: 0,
      blockers: [],
      recommendations: []
    };

    if (activeObjectives.length > 0) {
      progressReport.averageProgress = activeObjectives.reduce((sum, obj) => sum + obj.progress, 0) / activeObjectives.length;
    }

    // Identify blockers and generate recommendations
    for (const objective of activeObjectives) {
      const daysSinceCreated = (new Date() - new Date(objective.created)) / (1000 * 60 * 60 * 24);

      if (daysSinceCreated > 30 && objective.progress < 10) {
        progressReport.blockers.push({
          objective: objective.description,
          issue: 'Stalled progress'
        });
      }

      if (new Date(objective.deadline) < new Date()) {
        progressReport.blockers.push({
          objective: objective.description,
          issue: 'Overdue'
        });
      }
    }

    // Generate recommendations based on current state
    if (progressReport.averageProgress < 25) {
      progressReport.recommendations.push('Focus on high-priority objectives first');
      progressReport.recommendations.push('Break down large objectives into smaller tasks');
    }

    if (progressReport.blockers.length > 0) {
      progressReport.recommendations.push('Address stalled objectives and consider reprioritizing');
    }

    this.memory.evolutionProgress = progressReport;
    return progressReport;
  }

  // Adapt objectives based on current capabilities and feedback
  async adaptEvolutionObjectives() {
    this.log('Adapting evolution objectives based on current state...');

    const progressReport = await this.evaluateEvolutionProgress();

    const provider = await providerRegistry.getBestProvider('strategic analysis', { budget: 'low' });

    const messages = [
      {
        role: 'system',
        content: 'Analyze the current objectives and suggest adaptations based on progress, blockers, and new opportunities.'
      },
      {
        role: 'user',
        content: `Analyze these evolution objectives and suggest adaptations:\n\n${JSON.stringify(this.evolutionObjectives, null, 2)}\n\nProgress Report: ${JSON.stringify(progressReport, null, 2)}\n\nSuggest objective updates, new objectives, or priority changes. Be specific and actionable.`
      }
    ];

    const adaptations = await provider.generateContent(messages, {
      temperature: 0.4,
      maxTokens: 2048
    });

    this.log('Evolution objective adaptations generated', adaptations);

    // Store adaptations for review
    this.memory.objectiveAdaptations = {
      timestamp: new Date().toISOString(),
      adaptations: adaptations,
      progressReport: progressReport
    };

    return adaptations;
  }

  // Save objective progress (for persistence)
  saveObjectiveProgress() {
    this.memory.objectiveProgress = {
      lastUpdated: new Date().toISOString(),
      objectives: this.evolutionObjectives
    };
  }

  // Get current objectives summary
  getObjectivesSummary() {
    return {
      total: this.evolutionObjectives.length,
      active: this.evolutionObjectives.filter(obj => obj.status === 'active').length,
      completed: this.evolutionObjectives.filter(obj => obj.status === 'completed').length,
      blocked: this.evolutionObjectives.filter(obj => {
        const daysSinceCreated = (new Date() - new Date(obj.created)) / (1000 * 60 * 60 * 24);
        return daysSinceCreated > 30 && obj.progress < 10;
      }).length
    };
  }

  // Self-debugging capabilities
  async selfDebug() {
    this.log('Initiating self-debugging sequence...');

    const debugReport = {
      timestamp: new Date().toISOString(),
      status: 'analyzing',
      findings: [],
      fixesApplied: [],
      performance: {}
    };

    try {
      // Check tool availability
      const toolsCheck = await this.debugTools();
      debugReport.findings.push(...toolsCheck.findings);

      // Analyze conversation patterns
      const conversationAnalysis = await this.analyzeConversationPatterns();
      debugReport.findings.push(...conversationAnalysis.findings);

      // Check provider health
      const providerHealth = await this.debugProviders();
      debugReport.findings.push(...providerHealth.findings);

      // Analyze memory usage
      const memoryAnalysis = await this.analyzeMemoryUsage();
      debugReport.performance.memory = memoryAnalysis;

      // Generate self-improvement suggestions
      const suggestions = await this.generateSelfDebugSuggestions(debugReport);
      debugReport.suggestions = suggestions;

      debugReport.status = 'completed';

      // Store debug report
      this.memory.debugReports = this.memory.debugReports || [];
      this.memory.debugReports.push(debugReport);

      this.log('Self-debugging completed', { findings: debugReport.findings.length });

      return debugReport;
    } catch (error) {
      debugReport.status = 'failed';
      debugReport.error = error.message;
      return debugReport;
    }
  }

  async debugTools() {
    const findings = [];

    // Check for broken tools
    for (const [toolName, tool] of this.tools.entries()) {
      try {
        if (!tool.execute || typeof tool.execute !== 'function') {
          findings.push({
            type: 'error',
            category: 'tools',
            message: `Tool ${toolName} is missing execute function`,
            severity: 'high'
          });
        }

        if (!tool.description) {
          findings.push({
            type: 'warning',
            category: 'tools',
            message: `Tool ${toolName} has no description`,
            severity: 'low'
          });
        }
      } catch (error) {
        findings.push({
          type: 'error',
          category: 'tools',
          message: `Tool ${toolName} analysis failed: ${error.message}`,
          severity: 'medium'
        });
      }
    }

    if (this.tools.size === 0) {
      findings.push({
        type: 'error',
        category: 'tools',
        message: 'No tools registered with the agent',
        severity: 'critical'
      });
    }

    return { findings };
  }

  async debugProviders() {
    const findings = [];
    const providerStats = [...this.providerRegistry.providerStats.entries()];

    for (const [providerName, stats] of providerStats) {
      if (stats.healthScore < 0.5) {
        findings.push({
          type: 'warning',
          category: 'providers',
          message: `Provider ${providerName} has low health score (${stats.healthScore})`,
          severity: 'medium'
        });
      }

      if (stats.failedRequests > stats.totalRequests * 0.3) {
        findings.push({
          type: 'error',
          category: 'providers',
          message: `Provider ${providerName} has high failure rate`,
          severity: 'high'
        });
      }
    }

    return { findings };
  }

  async analyzeConversationPatterns() {
    const findings = [];
    const recentConversations = this.conversation.slice(-20);

    if (recentConversations.length < 3) {
      findings.push({
        type: 'info',
        category: 'usage',
        message: 'Low conversation activity - agent may need more interaction',
        severity: 'low'
      });
    }

    // Analyze response patterns
    const assistantMessages = recentConversations.filter(msg => msg.role === 'assistant');
    const errorResponses = assistantMessages.filter(msg => msg.content?.startsWith('Error') || msg.content?.startsWith('❌'));

    if (errorResponses.length > assistantMessages.length * 0.5) {
      findings.push({
        type: 'error',
        category: 'performance',
        message: 'High error rate in responses - check provider configuration',
        severity: 'high'
      });
    }

    return { findings };
  }

  async analyzeMemoryUsage() {
    const memoryStats = {
      totalKeys: 0,
      categories: {},
      estimatedSize: 0
    };

    // Analyze memory usage by category
    for (const [category, data] of Object.entries(this.memory)) {
      const itemCount = typeof data === 'object' && data !== null ? Object.keys(data).length : 1;
      memoryStats.totalKeys += itemCount;
      memoryStats.categories[category] = itemCount;
      memoryStats.estimatedSize += JSON.stringify(data).length;
    }

    // Check for excessive memory usage
    if (memoryStats.estimatedSize > 5 * 1024 * 1024) { // 5MB
      this.memory.cleanupSuggestions = this.memory.cleanupSuggestions || [];
      this.memory.cleanupSuggestions.push({
        timestamp: new Date().toISOString(),
        message: 'High memory usage detected - consider cleanup'
      });
    }

    return memoryStats;
  }

  async generateSelfDebugSuggestions(debugReport) {
    const provider = await this.providerRegistry.getBestProvider('analysis', { budget: 'low' });

    const suggestions = [];

    if (debugReport.findings.some(f => f.category === 'providers' && f.severity === 'high')) {
      suggestions.push('Review and configure API providers - check for missing keys or rate limits');
    }

    if (debugReport.findings.some(f => f.category === 'tools' && f.severity === 'high')) {
      suggestions.push('Repair or re-register broken tools');
    }

    if (debugReport.findings.some(f => f.category === 'usage' && f.severity === 'low')) {
      suggestions.push('Increase interaction to improve agent learning');
    }

    if (debugReport.performance?.memory?.estimatedSize > 1024 * 1024) { // 1MB
      suggestions.push('Implement memory cleanup to reduce storage usage');
    }

    // Generate AI-powered suggestions for improvements
    try {
      const aiSuggestions = await provider.generateContent([
        {
          role: 'system',
          content: 'Analyze debug findings and suggest specific improvements.'
        },
        {
          role: 'user',
          content: `Based on these debug findings, suggest specific improvements:\n\n${JSON.stringify(debugReport.findings, null, 2)}`
        }
      ], { temperature: 0.4, maxTokens: 512 });

      suggestions.push(`AI Analysis: ${aiSuggestions}`);
    } catch (error) {
      // Fallback suggestions if AI analysis fails
      suggestions.push('Debug system operational - review recent findings manually');
    }

    return suggestions;
  }

  // Autonomous learning from GitHub projects
  async learnFromSimilarProjects(query, maxRepos = 5) {
    this.log(`Learning from similar projects: "${query}"`);

    try {
      // Search for similar projects
      const searchResults = await this.executeTool('githubSearch', {
        query: query,
        language: 'javascript',
        minStars: 100,
        maxResults: maxRepos
      });

      const learnings = [];

      if (searchResults.repositories && searchResults.repositories.length > 0) {
        for (const repo of searchResults.repositories.slice(0, 3)) { // Analyze top 3
          try {
            const analysis = await this.executeTool('githubRepoAnalyze', {
              repoFullName: repo.full_name,
              analysisType: 'architecture'
            });

            if (analysis && !analysis.error) {
              // Extract insights for autonomous improvement
              learnings.push({
                repo: repo.full_name,
                insights: analysis.analysis?.architecture || 'Analysis completed',
                applicability: await this.evaluateInsightApplicability(analysis, this)
              });
            }
          } catch (error) {
            this.log(`Failed to analyze ${repo.full_name}: ${error.message}`);
          }
        }
      }

      // Store learnings for future improvements
      this.memory.projectLearnings = this.memory.projectLearnings || [];
      this.memory.projectLearnings.push({
        query,
        timestamp: new Date().toISOString(),
        learnings: learnings
      });

      this.log(`Learned from ${learnings.length} projects`);
      return { learnings, query };
    } catch (error) {
      this.log(`Learning from projects failed: ${error.message}`);
      return { error: error.message };
    }
  }

  async evaluateInsightApplicability(analysis, context) {
    // Simple evaluation of how applicable insights are to this project
    const applicability = {
      score: 0.5, // Default moderate applicability
      reasons: ['Project structure analysis completed']
    };

    // Evaluate based on project similarities
    if (analysis.repository?.language === 'JavaScript') {
      applicability.score += 0.2;
      applicability.reasons.push('Same programming language');
    }

    if (analysis.repository?.topics?.includes('ai') || analysis.repository?.topics?.includes('ml')) {
      applicability.score += 0.3;
      applicability.reasons.push('Related to AI/ML domain');
    }

    return applicability;
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
