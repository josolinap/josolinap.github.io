// Agent Tools System
// Provides tools the autonomous agent can use to accomplish tasks

export const agentTools = {};

// File System Tools
agentTools.readFile = {
  description: 'Read the contents of a file',
  parameters: {
    path: { type: 'string', description: 'File path to read', required: true },
    startLine: { type: 'number', description: 'Starting line number (optional)' },
    endLine: { type: 'number', description: 'Ending line number (optional)' }
  },
  execute: async (params) => {
    const { path, startLine, endLine } = params;

    try {
      const response = await fetch('/api/read-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, startLine, endLine })
      });

      if (!response.ok) {
        throw new Error(`Failed to read file: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      // Fallback for browser environment - simulate file reading
      throw new Error(`File reading not available in browser: ${error.message}`);
    }
  }
};

agentTools.writeFile = {
  description: 'Create or overwrite a file with content',
  parameters: {
    path: { type: 'string', description: 'File path to write', required: true },
    content: { type: 'string', description: 'Content to write to file', required: true }
  },
  execute: async (params) => {
    const { path, content } = params;

    try {
      const response = await fetch('/api/write-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      });

      if (!response.ok) {
        throw new Error(`Failed to write file: ${response.statusText}`);
      }

      return `File written successfully: ${path}`;
    } catch (error) {
      // Fallback for browser environment
      throw new Error(`File writing not available in browser: ${error.message}`);
    }
  }
};

agentTools.listDirectory = {
  description: 'List files and directories in a path',
  parameters: {
    path: { type: 'string', description: 'Directory path to list', default: '.' }
  },
  execute: async (params) => {
    const { path = '.' } = params;

    try {
      const response = await fetch('/api/list-directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });

      if (!response.ok) {
        throw new Error(`Failed to list directory: ${response.statusText}`);
      }

      const data = await response.json();
      return data.files.join('\n');
    } catch (error) {
      // Browser fallback
      return 'Directory listing not available in browser environment';
    }
  }
};

// Code Analysis Tools
agentTools.analyzeCode = {
  description: 'Analyze code for improvements, bugs, or optimizations',
  parameters: {
    code: { type: 'string', description: 'Code to analyze', required: true },
    language: { type: 'string', description: 'Programming language' }
  },
  execute: async (params, context) => {
    const { code, language = 'javascript' } = params;
    const { agent } = context;

    // Get the best provider for code analysis
    const provider = await context.providerRegistry.getBestProvider('code analysis', { speed: 'fast' });

    const systemPrompt = `You are an expert code reviewer. Analyze the provided code for:
- Potential bugs or errors
- Code quality issues
- Performance optimizations
- Best practices violations
- Security vulnerabilities
- Suggested improvements

Provide specific, actionable feedback with line references where possible.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Language: ${language}\n\nCode to analyze:\n\n${code}\n\nPlease provide detailed analysis and suggestions.`
      }
    ];

    const analysis = await provider.generateContent(messages, {
      temperature: 0.3,
      maxTokens: 2048
    });

    return analysis;
  }
};

agentTools.generateCode = {
  description: 'Generate code based on specifications',
  parameters: {
    requirement: { type: 'string', description: 'Code requirement or feature to implement', required: true },
    language: { type: 'string', description: 'Programming language', default: 'javascript' },
    framework: { type: 'string', description: 'Framework or library context' }
  },
  execute: async (params, context) => {
    const { requirement, language = 'javascript', framework } = params;

    const provider = await context.providerRegistry.getBestProvider('code generation', { budget: 'low' });

    const systemPrompt = `You are an expert software developer. Write clean, maintainable, and well-documented code that follows industry best practices.

Key guidelines:
- Use proper error handling and validation
- Include meaningful comments and docstrings
- Follow language-specific conventions
- Consider Edge cases and boundary conditions
- Ensure code is secure and performant
- Provide usage examples where relevant`;

    const messages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Write ${language} code${framework ? ` using ${framework}` : ''} for: ${requirement}\n\nProvide complete, executable code with comments.`
      }
    ];

    const generatedCode = await provider.generateContent(messages, {
      temperature: 0.2, // Lower temperature for code generation
      maxTokens: 4096
    });

    return generatedCode;
  }
};

// Command Execution Tools
agentTools.runCommand = {
  description: 'Execute system commands (dangerous - use carefully)',
  parameters: {
    command: { type: 'string', description: 'Command to execute', required: true },
    directory: { type: 'string', description: 'Working directory' }
  },
  execute: async (params, context) => {
    // Note: In browser environment, commands can't actually be executed
    // This would need a backend service to handle command execution
    const { command, directory } = params;

    context.agent.log(`Simulating command execution: ${command}`, { directory });

    return `Command execution not available in browser environment. Command would be: ${command} in ${directory || 'current directory'}`;
  }
};

agentTools.installPackage = {
  description: 'Install a package/dependency',
  parameters: {
    packageName: { type: 'string', description: 'Package name to install', required: true },
    packageManager: { type: 'string', description: 'Package manager (npm, yarn, pip, etc.)', default: 'npm' },
    dev: { type: 'boolean', description: 'Install as dev dependency', default: false }
  },
  execute: async (params, context) => {
    const { packageName, packageManager = 'npm', dev = false } = params;

    context.agent.log(`Simulating package installation: ${packageName}`, { packageManager, dev });

    return `Package installation not available in browser environment. Would install: ${packageName} using ${packageManager}${dev ? ' as dev dependency' : ''}`;
  }
};

// Web/API Tools
agentTools.httpRequest = {
  description: 'Make HTTP requests to external APIs',
  parameters: {
    url: { type: 'string', description: 'URL to request', required: true },
    method: { type: 'string', description: 'HTTP method', default: 'GET' },
    headers: { type: 'object', description: 'Request headers' },
    body: { type: 'string', description: 'Request body' }
  },
  execute: async (params, context) => {
    const { url, method = 'GET', headers = {}, body } = params;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : undefined
      });

      const responseData = await response.text();

      return {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }
};

// Learning and Memory Tools
agentTools.saveToMemory = {
  description: 'Store important information in long-term memory',
  parameters: {
    key: { type: 'string', description: 'Memory key', required: true },
    value: { type: 'string', description: 'Value to store', required: true },
    category: { type: 'string', description: 'Memory category (skills, preferences, facts)' }
  },
  execute: async (params, context) => {
    const { key, value, category = 'general' } = params;
    const { agent } = context;

    if (!agent.memory[category]) {
      agent.memory[category] = {};
    }

    agent.memory[category][key] = value;

    agent.log(`Stored in ${category} memory: ${key}`, value);
    return `Successfully stored "${key}" in ${category} memory`;
  }
};

agentTools.retrieveFromMemory = {
  description: 'Retrieve information from memory',
  parameters: {
    key: { type: 'string', description: 'Memory key to retrieve', required: true },
    category: { type: 'string', description: 'Memory category', default: 'general' }
  },
  execute: async (params, context) => {
    const { key, category = 'general' } = params;
    const { agent } = context;

    const categoryMemory = agent.memory[category] || {};
    const value = categoryMemory[key];

    if (value === undefined) {
      return `No memory found for key "${key}" in category "${category}"`;
    }

    return value;
  }
};

// Self-Improvement Tools
agentTools.analyzeConversation = {
  description: 'Analyze conversation history for improvements',
  parameters: {
    conversationId: { type: 'string', description: 'Conversation ID to analyze (optional)' }
  },
  execute: async (params, context) => {
    const { agent } = context;
    const conversationToAnalyze = agent.conversation.slice(-10); // Last 10 messages

    const provider = await context.providerRegistry.getBestProvider('analysis', { budget: 'low' });

    const messages = [
      {
        role: 'system',
        content: 'Analyze this conversation and suggest improvements for the AI assistant. Focus on helpfulness, accuracy, tool usage, and user satisfaction.'
      },
      {
        role: 'user',
        content: `Analyze this conversation:\n\n${JSON.stringify(conversationToAnalyze, null, 2)}\n\nProvide specific improvement suggestions.`
      }
    ];

    const analysis = await provider.generateContent(messages, {
      temperature: 0.5,
      maxTokens: 2048
    });

    return analysis;
  }
};

agentTools.optimizePrompt = {
  description: 'Optimize system prompts for better performance',
  parameters: {
    currentPrompt: { type: 'string', description: 'Current system prompt', required: true },
    taskType: { type: 'string', description: 'Type of task this prompt is used for' }
  },
  execute: async (params, context) => {
    const { currentPrompt, taskType } = params;

    const provider = await context.providerRegistry.getBestProvider('prompt engineering', { speed: 'fast' });

    const messages = [
      {
        role: 'system',
        content: 'You are an expert prompt engineer. Optimize prompts for clarity, specificity, and effectiveness.'
      },
      {
        role: 'user',
        content: `Optimize this system prompt for ${taskType || 'general'} tasks:\n\n${currentPrompt}\n\nProvide an improved version with explanations.`
      }
    ];

    const optimizedPrompt = await provider.generateContent(messages, {
      temperature: 0.4,
      maxTokens: 2048
    });

    return optimizedPrompt;
  }
};

// Database Tools (for the existing Supabase setup)
agentTools.saveToDatabase = {
  description: 'Save data to the application database',
  parameters: {
    table: { type: 'string', description: 'Database table name', required: true },
    data: { type: 'object', description: 'Data to save', required: true }
  },
  execute: async (params, context) => {
    const { table, data } = params;

    try {
      // This would integrate with the existing Supabase setup
      // For now, just simulate
      context.agent.log(`Simulating database save to ${table}`, data);
      return `Simulated database save to ${table}: ${JSON.stringify(data)}`;
    } catch (error) {
      throw new Error(`Database operation failed: ${error.message}`);
    }
  }
};

// Register all tools with the global registry
export function registerAllTools(agent) {
  Object.entries(agentTools).forEach(([name, tool]) => {
    agent.registerTool(name, tool);
  });
}

// Export tool names for reference
export const availableTools = Object.keys(agentTools);
