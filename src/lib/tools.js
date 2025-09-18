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
