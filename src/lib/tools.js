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
  execute: async (params, context) => {
    const { path, startLine, endLine } = params;
    const serverUrl = context?.serverUrl || 'http://localhost:3001';

    try {
      const response = await fetch(`${serverUrl}/api/read-file`, {
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
      throw new Error(`Server file reading failed: ${error.message}`);
    }
  }
};

agentTools.writeFile = {
  description: 'Create or overwrite a file with content',
  parameters: {
    path: { type: 'string', description: 'File path to write', required: true },
    content: { type: 'string', description: 'Content to write to file', required: true }
  },
  execute: async (params, context) => {
    const { path, content } = params;
    const serverUrl = context?.serverUrl || 'http://localhost:3001';

    try {
      const response = await fetch(`${serverUrl}/api/write-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, content })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to write file: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      throw new Error(`Server file writing failed: ${error.message}`);
    }
  }
};

agentTools.listDirectory = {
  description: 'List files and directories in a path',
  parameters: {
    path: { type: 'string', description: 'Directory path to list', default: '.' }
  },
  execute: async (params, context) => {
    const { path = '.' } = params;
    const serverUrl = context?.serverUrl || 'http://localhost:3001';

    try {
      const response = await fetch(`${serverUrl}/api/list-directory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path })
      });

      if (!response.ok) {
        throw new Error(`Failed to list directory: ${response.statusText}`);
      }

      const data = await response.json();
      const formattedFiles = data.files.map(file =>
        `${file.type === 'directory' ? '📁' : '📄'} ${file.name} (${file.size} bytes, ${new Date(file.modified).toLocaleDateString()})`
      ).join('\n');

      return formattedFiles;
    } catch (error) {
      throw new Error(`Server directory listing failed: ${error.message}`);
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
    const { command, directory } = params;
    const serverUrl = context?.serverUrl || 'http://localhost:3001';

    context.agent.log(`Executing command via server: ${command}`, { directory });

    try {
      const response = await fetch(`${serverUrl}/api/execute-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, cwd: directory })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Command execution failed: ${response.statusText}`);
      }

      const data = await response.json();
      return `Command executed successfully!\nOutput: ${data.stdout}\n${data.stderr ? `Errors: ${data.stderr}` : ''}`;
    } catch (error) {
      throw new Error(`Command execution failed: ${error.message}`);
    }
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

// GitHub Integration Tools
agentTools.githubSearch = {
  description: 'Search GitHub repositories for similar projects and best practices',
  parameters: {
    query: { type: 'string', description: 'Search query', required: true },
    language: { type: 'string', description: 'Programming language filter' },
    minStars: { type: 'number', description: 'Minimum stars required', default: 50 },
    maxResults: { type: 'number', description: 'Maximum results to return', default: 20 }
  },
  execute: async (params, context) => {
    const { query, language, minStars = 50, maxResults = 20 } = params;
    const { agent } = context;

    try {
      let searchQuery = `${query} stars:>${minStars}`;
      if (language) {
        searchQuery += ` language:${language}`;
      }

      const response = await agent.executeTool('httpRequest', {
        url: `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=${maxResults}`,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+v3+json'
        }
      });

      if (response.status !== 200) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = JSON.parse(response.data);
      const repos = data.items.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language,
        last_updated: repo.updated_at,
        owner: repo.owner.login,
        topics: repo.topics || []
      }));

      agent.log(`Found ${repos.length} relevant GitHub repositories for "${query}"`);

      // Store discovered repositories for future analysis
      agent.memory.discoveredProjects = agent.memory.discoveredProjects || [];
      agent.memory.discoveredProjects.push({
        searchQuery,
        timestamp: new Date().toISOString(),
        repositories: repos
      });

      return {
        query,
        totalCount: data.total_count,
        repositories: repos,
        searchQuery,
        bestMatches: repos.slice(0, 5) // Highlight top 5
      };
    } catch (error) {
      agent.log(`GitHub search failed: ${error.message}`);
      return { error: `GitHub search failed: ${error.message}` };
    }
  }
};

agentTools.githubRepoAnalyze = {
  description: 'Analyze a specific GitHub repository for code patterns and best practices',
  parameters: {
    repoFullName: { type: 'string', description: 'Full repository name (owner/repo)', required: true },
    analysisType: { type: 'string', description: 'Type of analysis (code, architecture, security, etc.)', default: 'code' }
  },
  execute: async (params, context) => {
    const { repoFullName, analysisType = 'code' } = params;
    const { agent } = context;

    try {
      agent.log(`Analyzing GitHub repository: ${repoFullName}`);

      // Get repository information
      const repoResponse = await agent.executeTool('httpRequest', {
        url: `https://api.github.com/repos/${repoFullName}`,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+v3+json'
        }
      });

      if (repoResponse.status !== 200) {
        throw new Error(`Repository not found or API error`);
      }

      const repoData = JSON.parse(repoResponse.data);

      // Get repository contents
      const contentsResponse = await agent.executeTool('httpRequest', {
        url: `https://api.github.com/repos/${repoFullName}/contents`,
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+v3+json'
        }
      });

      const contents = JSON.parse(contentsResponse.data);

      const analysis = {
        repository: {
          name: repoData.name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          last_updated: repoData.updated_at,
          language: repoData.language,
          topics: repoData.topics || []
        },
        files: contents.slice(0, 10).map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          download_url: file.download_url
        })),
        analysis: {}
      };

      // Perform specific analysis based on type
      if (analysisType === 'architecture') {
        analysis.analysis.architecture = await analyzeRepoArchitecture(contents, agent, repoData);
      } else if (analysisType === 'security') {
        analysis.analysis.security = await analyzeRepoSecurity(contents, agent, repoData);
      } else if (analysisType === 'code') {
        analysis.analysis.code = await analyzeRepoCode(contents, agent, repoData);
      }

      // Store analysis for learning
      agent.memory.repoAnalyses = agent.memory.repoAnalyses || [];
      agent.memory.repoAnalyses.push({
        repoName: repoFullName,
        analysisType,
        timestamp: new Date().toISOString(),
        insights: analysis.analysis
      });

      return analysis;
    } catch (error) {
      agent.log(`Repository analysis failed: ${error.message}`);
      return { error: `Analysis failed: ${error.message}` };
    }
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
  description: 'Optimize system prompts using advanced prompt engineering techniques',
  parameters: {
    currentPrompt: { type: 'string', description: 'Current system prompt', required: true },
    taskType: { type: 'string', description: 'Type of task this prompt is used for' },
    optimizationLevel: { type: 'string', description: 'Optimization level (basic, advanced, expert)', default: 'advanced' }
  },
  execute: async (params, context) => {
    const { currentPrompt, taskType, optimizationLevel = 'advanced' } = params;
    const { agent } = context;

    const provider = await context.providerRegistry.getBestProvider('prompt engineering', { speed: 'fast' });

    // Advanced prompt engineering framework
    let optimizationPrompt = '';

    switch (optimizationLevel) {
      case 'expert':
        optimizationPrompt = `You are a master prompt engineering specialist. Use advanced techniques including:
- Role definition with specific expertise
- Task decomposition with clear steps
- Contextual grounding
- Output formatting instructions
- Error handling and edge cases
- Performance optimization techniques
- Domain-specific terminologies
- Psychological trigger words for better responses

Analyze the current prompt for weaknesses and create a comprehensive optimization.`;
        break;

      case 'advanced':
        optimizationPrompt = `You are an expert prompt engineer. Optimize using:
- Clear role and context definition
- Specific task instructions with examples
- Output format specifications
- Error handling scenarios
- Performance considerations
- Best practices from the field`;
        break;

      default:
        optimizationPrompt = 'You are a prompt engineering specialist. Optimize prompts for clarity, specificity, and effectiveness.';
    }

    const messages = [
      { role: 'system', content: optimizationPrompt },
      {
        role: 'user',
        content: `Optimize this ${taskType || 'general'} purpose system prompt (${optimizationLevel} level):\n\nCurrent Prompt:\n${currentPrompt}\n\nProvide the optimized version with detailed explanations of improvements and why each change enhances performance.`
      }
    ];

    const optimizedPrompt = await provider.generateContent(messages, {
      temperature: 0.4,
      maxTokens: 2048
    });

    // Store optimization for learning
    agent.memory.promptOptimizations = agent.memory.promptOptimizations || [];
    agent.memory.promptOptimizations.push({
      original: currentPrompt,
      optimized: optimizedPrompt,
      taskType: taskType,
      timestamp: new Date().toISOString(),
      optimizationLevel: optimizationLevel
    });

    agent.log(`Prompt optimized (${optimizationLevel}) for ${taskType || 'general'} tasks`);
    return optimizedPrompt;
  }
};

// Advanced Prompt Engineering Tools
agentTools.createSystemPrompt = {
  description: 'Create expert-level system prompts for specific use cases',
  parameters: {
    useCase: { type: 'string', description: 'The specific use case or task', required: true },
    expertise: { type: 'string', description: 'Required expertise level', default: 'expert' },
    constraints: { type: 'string', description: 'Constraints and requirements' },
    examples: { type: 'boolean', description: 'Include examples and demonstrations', default: true }
  },
  execute: async (params, context) => {
    const { useCase, expertise = 'expert', constraints, examples = true } = params;
    const { agent } = context;

    const provider = await context.providerRegistry.getBestProvider('prompt engineering', { budget: 'low' });

    const messages = [
      {
        role: 'system',
        content: `You are a master prompt engineering specialist with deep knowledge of:
- Advanced prompt structures and techniques
- Cognitive psychology for better AI responses
- Domain expertise in various technical and creative fields
- Performance optimization methods
- Error prevention and handling techniques
- Output formatting and serialization methods`
      },
      {
        role: 'user',
        content: `Create a comprehensive system prompt for: "${useCase}" at ${expertise} level.

Requirements:
- Specific role definition with expertise areas
- Clear task breakdown and instructions
- Performance expectations and metrics
- Error handling and edge cases
${constraints ? `- Constraints: ${constraints}` : ''}
- Output formatting specifications
${examples ? '- Include real-world examples and demonstrations' : ''}
- Best practices and success criteria

Provide the complete optimized prompt with detailed explanations of each component and why it improves AI performance.`
      }
    ];

    const createdPrompt = await provider.generateContent(messages, {
      temperature: 0.3,
      maxTokens: 1536
    });

    // Store created prompt for future reuse
    agent.memory.createdPrompts = agent.memory.createdPrompts || [];
    agent.memory.createdPrompts.push({
      useCase,
      prompt: createdPrompt,
      expertise,
      timestamp: new Date().toISOString()
    });

    return {
      prompt: createdPrompt,
      useCase,
      expertise,
      created: new Date().toISOString()
    };
  }
};

agentTools.testPromptPerformance = {
  description: 'Test and benchmark prompt performance across different scenarios',
  parameters: {
    prompt: { type: 'string', description: 'Prompt to test', required: true },
    testScenarios: { type: 'array', description: 'Test scenarios to evaluate', required: true },
    provider: { type: 'string', description: 'Specific provider to use for testing' }
  },
  execute: async (params, context) => {
    const { prompt, testScenarios, provider } = params;
    const { agent } = context;

    const performanceResults = [];
    const startTime = Date.now();

    for (const scenario of testScenarios) {
      try {
        const testStart = Date.now();

        // Get the specified provider or best available
        const testProvider = provider ? { generateContent: (messages, options) => agent.providerRegistry.providers.get(provider).generateContent(messages, options) } :
                                        await agent.providerRegistry.getBestProvider('prompt testing', { budget: 'low' });

        const messages = [
          { role: 'system', content: prompt },
          { role: 'user', content: scenario.input }
        ];

        const response = await testProvider.generateContent(messages, {
          temperature: scenario.temperature || 0.7,
          maxTokens: scenario.maxTokens || 1024
        });

        const testEnd = Date.now();

        // Evaluate response quality
        const qualityScore = evaluatePromptResponse(response, scenario.expected);

        performanceResults.push({
          scenario: scenario.name,
          input: scenario.input,
          response: response,
          responseTime: testEnd - testStart,
          qualityScore: qualityScore,
          tokensUsed: Math.ceil(response.length / 4), // Rough estimation
          success: qualityScore >= (scenario.minScore || 60)
        });

      } catch (error) {
        performanceResults.push({
          scenario: scenario.name,
          error: error.message,
          success: false
        });
      }
    }

    const totalTime = Date.now() - startTime;
    const averageQuality = performanceResults.filter(r => r.qualityScore).reduce((sum, r) => sum + r.qualityScore, 0) /
                          performanceResults.filter(r => r.qualityScore).length;

    const results = {
      prompt,
      totalExecutionTime: totalTime,
      averageResponseTime: totalTime / performanceResults.length,
      averageQualityScore: isNaN(averageQuality) ? 0 : Math.round(averageQuality),
      successRate: performanceResults.filter(r => r.success).length / performanceResults.length,
      scenariosTested: performanceResults.length,
      detailedResults: performanceResults,
      provider: provider || 'auto-selected'
    };

    // Store performance results for learning
    agent.memory.promptPerformanceTests = agent.memory.promptPerformanceTests || [];
    agent.memory.promptPerformanceTests.push(results);

    agent.log(`Prompt performance test completed: ${results.averageQualityScore}% average quality`);

    return results;
  }
};

// Database Tools (for the existing Supabase setup)
// Web Scraping Tools for API Discovery
agentTools.webScrape = {
  description: 'Scrape web pages for information about APIs and services',
  parameters: {
    url: { type: 'string', description: 'URL to scrape', required: true },
    selectors: { type: 'string', description: 'CSS selectors to target specific content' },
    keywords: { type: 'string', description: 'Keywords to search for (comma-separated)' }
  },
  execute: async (params, context) => {
    const { url, selectors = 'body', keywords = '' } = params;

    try {
      // Use a CORS proxy or fetch directly (may fail in browser due to CORS)
      const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Failed to scrape URL: ${response.status}`);
      }

      const data = await response.json();
      const html = data.contents;

      // Simple HTML parsing (in production, use a proper parser)
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const results = {};

      // Extract text content
      const textContent = doc.body.textContent || '';
      results.textContent = textContent.substring(0, 10000); // Truncate long content

      // Extract specific selectors
      if (selectors !== 'body') {
        const elements = doc.querySelectorAll(selectors);
        results.selectedElements = Array.from(elements).map(el => ({
          tagName: el.tagName,
          textContent: el.textContent.trim(),
          href: el.href || null,
          src: el.src || null
        }));
      }

      // Search for API-related keywords if specified
      if (keywords) {
        const keywordArray = keywords.split(',').map(k => k.trim().toLowerCase());
        const apiHints = {};

        keywordArray.forEach(keyword => {
          const matches = textContent.toLowerCase().split(keyword);
          apiHints[keyword] = (matches.length - 1);
        });

        results.apiHints = apiHints;
      }

      return {
        url,
        status: 'scraped',
        results
      };
    } catch (error) {
      throw new Error(`Web scraping failed: ${error.message}`);
    }
  }
};

agentTools.discoverAPIs = {
  description: 'Discover free APIs and services from API directories and marketplaces',
  parameters: {
    category: { type: 'string', description: 'API category (weather, finance, social, etc.)' },
    freeOnly: { type: 'boolean', description: 'Limit to free APIs only', default: true },
    maxResults: { type: 'number', description: 'Maximum number of APIs to discover', default: 10 }
  },
  execute: async (params, context) => {
    const { category, freeOnly = true, maxResults = 10 } = params;

    const apiDirectories = [
      'https://api.publicapis.org/entries',
      'https://rapidapi.com/blog/most-popular-apis-2023/', // Would need scraping
      'https://github.com/public-apis/public-apis', // GitHub repo
    ];

    const discoveredAPIs = [];

    try {
      // Query Public APIs database
      const publicApiResponse = await fetch('https://api.publicapis.org/entries');
      if (publicApiResponse.ok) {
        const publicApis = await publicApiResponse.json();

        const filteredApis = publicApis.entries
          .filter(api => {
            const matchesCategory = !category || api.Category.toLowerCase().includes(category.toLowerCase());
            const isFree = !freeOnly || (api.Auth === 'null' || api.Auth === '' || api.Description.toLowerCase().includes('free'));
            return matchesCategory && isFree;
          })
          .slice(0, maxResults)
          .map(api => ({
            name: api.API,
            description: api.Description,
            url: api.Link,
            category: api.Category,
            auth: api.Auth,
            https: api.HTTPS,
            cors: api.Cors
          }));

        discoveredAPIs.push(...filteredApis);
      }

      // Scan developer documentation sites
      if (category && discoveredAPIs.length < maxResults) {
        const searchTerms = `${category} api free`.toLowerCase();

        // This is a simplified implementation - in production would use web scraping
        const mockApis = [
          {
            name: 'OpenExchangeRates',
            description: 'Free currency exchange rates and conversion API',
            url: 'https://openexchangerates.org/',
            category: 'Finance',
            auth: 'API Key',
            https: true
          },
          {
            name: 'WeatherAPI',
            description: 'Free weather data API',
            url: 'https://www.weatherapi.com/',
            category: 'Weather',
            auth: 'API Key',
            https: true
          }
        ].filter(api => api.name.toLowerCase().includes(searchTerms) || api.description.toLowerCase().includes(searchTerms));

        discoveredAPIs.push(...mockApis.slice(0, maxResults - discoveredAPIs.length));
      }

      return {
        category,
        freeOnly,
        count: discoveredAPIs.length,
        apis: discoveredAPIs
      };
    } catch (error) {
      return {
        error: `API discovery failed: ${error.message}`,
        backup: 'Consider manually searching publicapis.org or github.com/public-apis/public-apis'
      };
    }
  }
};

// Self-Code Modification Tools
agentTools.suggestCodeChanges = {
  description: 'Analyze code and suggest specific improvements or fixes',
  parameters: {
    filePath: { type: 'string', description: 'Path to file to analyze', required: true },
    issueType: { type: 'string', description: 'Type of issue to look for (bug, performance, security)' }
  },
  execute: async (params, context) => {
    const { filePath, issueType = 'general' } = params;
    const { agent } = context;

    // First, try to read the file using existing tools
    // This would normally use the file system, but we'll simulate
    agent.log(`Analyzing code in ${filePath} for ${issueType} issues`);

    // In production, this would read the actual file
    // For now, return placeholder suggestions
    return {
      filePath,
      issueType,
      suggestions: [
        'Consider adding error handling for edge cases',
        'Performance: Use more efficient data structures',
        'Security: Validate user inputs before processing',
        'Code quality: Add JSDoc comments for complex functions'
      ]
    };
  }
};

// Security and Safety Tools
agentTools.securityAudit = {
  description: 'Perform security audit on code changes or autonomous actions',
  parameters: {
    codeChanges: { type: 'string', description: 'Code changes to audit', required: true },
    context: { type: 'string', description: 'Context of the changes' },
    riskLevel: { type: 'string', description: 'Expected risk level (low, medium, high)', default: 'medium' }
  },
  execute: async (params, context) => {
    const { codeChanges, context: changeContext = '', riskLevel = 'medium' } = params;
    const { agent } = context;

    const securityChecks = [
      {
        name: 'Injection Prevention',
        pattern: /(eval|exec|spawn|shell_exec|system|popen|proc_open)/gi,
        severity: 'high'
      },
      {
        name: 'SQL Injection Detection',
        pattern: /SELECT.*\+|\$|@.*WHERE|INSERT.*\+/gi,
        severity: 'high'
      },
      {
        name: 'File System Security',
        pattern: /\.\.\/|\.\.\\|~\/|\$HOME|\/etc\/passwd|\/etc\/shadow/gi,
        severity: 'high'
      },
      {
        name: 'Privilege Escalation',
        pattern: /(sudo|su|runas|admin|root)/gi,
        severity: 'critical'
      },
      {
        name: 'Secret Exposure',
        pattern: /(api[_-]?key|secret[_-]?key|password|token|credential)/gi,
        severity: 'high'
      },
      {
        name: 'Unsafe Deserialization',
        pattern: /(unserialize|pickle|yaml\.load)/gi,
        severity: 'medium'
      },
      {
        name: 'Weak Authentication',
        pattern: /(weak.*password|default.*password|admin.*admin)/gi,
        severity: 'medium'
      }
    ];

    const findings = [];
    let overallRisk = 'low';

    for (const check of securityChecks) {
      const matches = codeChanges.match(check.pattern);
      if (matches) {
        findings.push({
          checkName: check.name,
          severity: check.severity,
          matches: matches,
          recommendation: getSecurityRecommendation(check.name)
        });

        // Update overall risk
        if (check.severity === 'critical' || (check.severity === 'high' && riskLevel === 'high')) {
          overallRisk = 'high';
        } else if (check.severity === 'high' && overallRisk === 'low') {
          overallRisk = 'medium';
        } else if (check.severity === 'medium' && overallRisk === 'low') {
          overallRisk = 'medium';
        }
      }
    }

    // Additional contextual security analysis
    if (changeContext.toLowerCase().includes('database') && codeChanges.includes('DROP')) {
      findings.push({
        checkName: 'Database Destruction Risk',
        severity: 'critical',
        matches: ['DROP statement in database context'],
        recommendation: 'Database DROP operations require explicit human approval'
      });
      overallRisk = 'high';
    }

    const auditResult = {
      overallRisk,
      findings: findings.length,
      detailedFindings: findings,
      approved: overallRisk === 'low' || (overallRisk === 'medium' && riskLevel === 'low'),
      reviewRequired: overallRisk === 'high' || findings.length > 0
    };

    agent.log('Security audit completed', { risk: overallRisk, findings: findings.length });

    return auditResult;
  }
};

agentTools.validateAutonomousAction = {
  description: 'Validate an autonomous action against safety guidelines',
  parameters: {
    action: { type: 'string', description: 'The autonomous action to validate', required: true },
    context: { type: 'string', description: 'Context of the action' },
    impact: { type: 'string', description: 'Expected impact level (low, medium, high)', default: 'low' }
  },
  execute: async (params, context) => {
    const { action, context: actionContext = '', impact = 'low' } = params;
    const { agent } = context;

    const safetyRules = [
      {
        rule: 'Never delete production data',
        pattern: /(delete|drop|remove|destroy).*production.*data/gi,
        severity: 'critical'
      },
      {
        rule: 'Never expose sensitive information',
        pattern: /(log|print|console\.log).*password.*|(reveal|expose).*secret/gi,
        severity: 'critical'
      },
      {
        rule: 'Never run untrusted code',
        pattern: /(eval|exec|require).*untrusted|dynamic.*code.*execution/gi,
        severity: 'high'
      },
      {
        rule: 'Never modify system file permissions recklessly',
        pattern: /chmod.*777|chown.*root|system.*permission/gi,
        severity: 'high'
      },
      {
        rule: 'Never perform DoS attacks or overload systems',
        pattern: /(flood|overload|dos|ddos).*attack/gi,
        severity: 'critical'
      },
      {
        rule: 'Validate all user inputs',
        pattern: /(input|user.*data).*unvalidated|raw.*input.*untrusted/gi,
        severity: 'medium'
      }
    ];

    const validationResults = [];
    let actionAllowed = true;
    let maxSeverity = 'low';

    for (const rule of safetyRules) {
      if (rule.pattern.test(action + ' ' + actionContext)) {
        validationResults.push({
          rule: rule.rule,
          triggered: true,
          severity: rule.severity,
          explanation: getSafetyExplanation(rule.rule)
        });

        if (rule.severity === 'critical') {
          actionAllowed = false;
          maxSeverity = 'critical';
        } else if (rule.severity === 'high' && maxSeverity !== 'critical') {
          actionAllowed = false;
          maxSeverity = 'high';
        } else if (rule.severity === 'medium' && maxSeverity === 'low') {
          maxSeverity = 'medium';
        }
      } else {
        validationResults.push({
          rule: rule.rule,
          triggered: false,
          severity: 'none'
        });
      }
    }

    // Additional impact assessment
    if (impact === 'high' && maxSeverity !== 'critical') {
      actionAllowed = false;
      validationResults.push({
        rule: 'High Impact Action',
        triggered: true,
        severity: 'high',
        explanation: 'High impact actions require human approval'
      });
    }

    const validationResult = {
      action,
      actionAllowed,
      riskLevel: maxSeverity,
      validationResults,
      requiresHumanApproval: !actionAllowed,
      timestamp: new Date().toISOString()
    };

    agent.log('Autonomous action validation completed', { allowed: actionAllowed, risk: maxSeverity });

    return validationResult;
  }
};

agentTools.backupSystem = {
  description: 'Create system backup before making critical changes',
  parameters: {
    scope: { type: 'string', description: 'Scope of backup (full, partial, configuration)', default: 'configuration' },
    reason: { type: 'string', description: 'Reason for creating backup' }
  },
  execute: async (params, context) => {
    const { scope = 'configuration', reason = 'Safety backup before changes' } = params;
    const { agent } = context;

    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const backupData = {
      scope,
      reason,
      timestamp: new Date().toISOString(),
      id: backupId,
      created: true
    };

    // In production, this would actually create backups
    agent.memory.lastBackup = backupData;
    agent.log(`System backup created: ${backupId}`, { scope, reason });

    return backupData;
  }
};

agentTools.rollbackSystem = {
  description: 'Rollback system to a previous safe state',
  parameters: {
    backupId: { type: 'string', description: 'Backup ID to restore from' },
    reason: { type: 'string', description: 'Reason for rollback' }
  },
  execute: async (params, context) => {
    const { backupId, reason = 'System restoration' } = params;
    const { agent } = context;

    if (!backupId) {
      return { success: false, error: 'Backup ID required for rollback' };
    }

    // Check if backup exists
    const lastBackup = agent.memory.lastBackup;
    if (!lastBackup || lastBackup.id !== backupId) {
      return { success: false, error: 'Backup not found or invalid' };
    }

    // Simulate rollback (in production, would actually restore)
    agent.log(`System rollback initiated: ${backupId}`, { reason });

    return {
      success: true,
      backupId,
      reason,
      rolledBackTo: lastBackup.timestamp,
      timestamp: new Date().toISOString()
    };
  }
};

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

// Helper functions for security and safety
function getSecurityRecommendation(checkName) {
  const recommendations = {
    'Injection Prevention': 'Use parameterized queries or prepared statements instead of string concatenation',
    'SQL Injection Detection': 'Sanitize all user inputs and use prepared statements for database operations',
    'File System Security': 'Validate all file paths and use absolute paths with proper permissions',
    'Secret Exposure': 'Never store secrets in code or logs; use environment variables or secure vaults',
    'Privilege Escalation': 'Run applications with minimum required permissions',
    'Unsafe Deserialization': 'Validate and sanitize all serialized data before deserialization',
    'Weak Authentication': 'Use strong, unique passwords and implement multi-factor authentication',
    'Database Destruction Risk': 'Database operations require careful review and backup'
  };
  return recommendations[checkName] || 'Review and fix the security issue';
}

function getSafetyExplanation(rule) {
  const explanations = {
    'Never delete production data': 'Production data loss can cause irreparable damage to business operations',
    'Never expose sensitive information': 'Exposed secrets can compromise security and lead to attacks',
    'Never run untrusted code': 'Executing untrusted code can introduce malware and security vulnerabilities',
    'Never modify system file permissions recklessly': 'Incorrect permissions can compromise system security',
    'Never perform DoS attacks or overload systems': 'These actions are illegal and can harm infrastructure',
    'Validate all user inputs': 'Unvalidated inputs are the primary cause of security vulnerabilities',
    'High Impact Action': 'High impact changes require human oversight for safety'
  };
  return explanations[rule] || 'This safety rule prevents potentially harmful actions';
}

// Register all tools with the global registry
export function registerAllTools(agent) {
  Object.entries(agentTools).forEach(([name, tool]) => {
    agent.registerTool(name, tool);
  });
}

// Export tool names for reference
export const availableTools = Object.keys(agentTools);

// GitHub Repository Analysis Helper Functions
async function analyzeRepoArchitecture(contents, agent, repoData) {
  const provider = await agent.providerRegistry.getBestProvider('analysis', { budget: 'low' });

  const messages = [
    {
      role: 'system',
      content: 'Analyze repository structure and architecture. Identify patterns, frameworks, and design approaches.'
    },
    {
      role: 'user',
      content: `Analyze this repository's architecture:
Repository: ${repoData.name}
Description: ${repoData.description}
Language: ${repoData.language}

Contents: ${contents.map(f => f.name).join(', ')}

Describe the likely architecture, frameworks used, and design patterns.`
    }
  ];

  const analysis = await provider.generateContent(messages, {
    temperature: 0.3,
    maxTokens: 1024
  });

  return analysis;
}

async function analyzeRepoSecurity(contents, agent, repoData) {
  const securityIndicators = {
    good: ['eslint', 'prettier', '.gitignore', 'security', 'audit'],
    concerning: ['eval', 'innerHTML', 'dangerouslySetInnerHTML', 'disable-eslint'],
    vulnerable: ['old-package-lock', 'npm-audit-issues', 'security-vuln']
  };

  const securityAnalysis = {
    score: 100,
    findings: [],
    recommendations: []
  };

  // Check for security indicators
  const fileNames = contents.map(f => f.name.toLowerCase());

  securityIndicators.good.forEach(indicator => {
    if (fileNames.some(name => name.includes(indicator))) {
      securityAnalysis.findings.push(`✓ Good: Found ${indicator} file`);
    } else if (indicator !== 'eslint' && indicator !== 'prettier') { // These are optional
      securityAnalysis.score -= 5;
      securityAnalysis.recommendations.push(`Consider adding ${indicator}`);
    }
  });

  securityIndicators.concerning.forEach(indicator => {
    if (fileNames.some(name => name.includes(indicator))) {
      securityAnalysis.findings.push(`⚠️ Concerning: Found ${indicator} usage`);
      securityAnalysis.score -= 15;
      securityAnalysis.recommendations.push(`Review and remove unsafe ${indicator} usage`);
    }
  });

  securityAnalysis.overallAssesment = securityAnalysis.score >= 80 ? 'Good' :
                                     securityAnalysis.score >= 60 ? 'Fair' : 'Needs Attention';

  return securityAnalysis;
}

async function analyzeRepoCode(contents, agent, repoData) {
  const provider = await agent.providerRegistry.getBestProvider('code analysis', { budget: 'low' });

  // Get some code files for analysis
  const codeFiles = contents.filter(f =>
    f.name.endsWith('.js') ||
    f.name.endsWith('.ts') ||
    f.name.endsWith('.jsx') ||
    f.name.endsWith('.tsx')
  ).slice(0, 3); // Analyze up to 3 files

  let codeAnalysis = `Analysis of ${repoData.name}:\n\n`;

  for (const file of codeFiles) {
    try {
      const response = await agent.executeTool('httpRequest', {
        url: file.download_url,
        method: 'GET'
      });

      if (response.status === 200 && response.data && response.data.length < 50000) { // Limit file size
        const codeLanguages = await provider.generateContent([
          {
            role: 'system',
            content: 'Analyze the code quality, patterns, and provide improvement suggestions.'
          },
          {
            role: 'user',
            content: `Analyze this code file (${file.name}):\n\n${response.data.substring(0, 10000)}\n\nProvide code quality assessment and suggestions.`
          }
        ], { temperature: 0.3, maxTokens: 1024 });

        codeAnalysis += `## ${file.name}\n\n${codeLanguages}\n\n---\n\n`;
      }
    } catch (error) {
      codeAnalysis += `## ${file.name}\n\n❌ Failed to analyze: ${error.message}\n\n---\n\n`;
    }
  }

  if (codeFiles.length === 0) {
    codeAnalysis += 'No suitable code files found for analysis.';
  }

  return codeAnalysis;
}

// Helper function for prompt performance evaluation
function evaluatePromptResponse(response, expectedOutcome) {
  if (!expectedOutcome) return 70; // Default moderate score if no expectations

  const responseLower = response.toLowerCase();
  const expectedLower = expectedOutcome.toLowerCase();

  let score = 50; // Base score

  // Check for task completion indicators
  const completionIndicators = ['completed', 'done', 'finished', 'success', 'implemented', 'generated'];
  const hasCompletionIndicators = completionIndicators.some(indicator => responseLower.includes(indicator));

  if (hasCompletionIndicators) score += 15;

  // Check for structure and formatting
  if (response.includes('```') || response.includes('|')) score += 10; // Code blocks or tables
  if (response.includes('|') || response.match(/\d+\./g)) score += 5; // Lists or numbered items

  // Check for specific expected content
  const expectedWords = expectedLower.split(' ').filter(word => word.length > 3);
  let wordsFound = 0;
  expectedWords.forEach(word => {
    if (responseLower.includes(word)) wordsFound++;
  });

  if (wordsFound > 0) {
    score += Math.min(30, (wordsFound / expectedWords.length) * 30);
  }

  // Length appropriateness
  if (response.length < 50) score -= 10; // Too short
  if (response.length > 5000) score -= 10; // Too long

  // Error detection
  if (responseLower.includes('error') || responseLower.includes('failed')) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
