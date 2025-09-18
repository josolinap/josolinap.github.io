import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { readFile, writeFile, mkdir, readdir, stat, access, constants } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { WebSocketServer } from 'ws';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File upload middleware
const upload = multer({ dest: 'uploads/' });

// GitHub API Configuration
const githubConfig = {
  token: process.env.GITHUB_TOKEN,
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'Autonomous-AI-Server/1.0.0'
  }
};

// Free LLM providers discovered from GitHub
let freeLLMProviders = [];
let mcpServers = [];

// Promisify exec for async/await support
const execAsync = promisify(exec);

// Security: Define allowed directories for file operations
const ALLOWED_DIRECTORIES = [
  resolve(__dirname, '..'), // Project root
  process.env.PROJECT_ROOT ? resolve(process.env.PROJECT_ROOT) : null
].filter(Boolean);

// Helper function to validate file paths
function isPathAllowed(filePath) {
  const absolutePath = resolve(filePath);
  return ALLOWED_DIRECTORIES.some(allowedDir => {
    return absolutePath.startsWith(allowedDir) &&
           absolutePath !== allowedDir && // Prevent accessing root directory directly
           !absolutePath.includes('..'); // Prevent directory traversal
  });
}

// File System Routes

// Read file endpoint
app.post('/api/read-file', async (req, res) => {
  try {
    const { path, startLine, endLine } = req.body;

    if (!path) {
      return res.status(400).json({ error: 'File path is required' });
    }

    if (!isPathAllowed(path)) {
      return res.status(403).json({ error: 'Access to this path is not allowed' });
    }

    if (!existsSync(path)) {
      return res.status(404).json({ error: 'File not found' });
    }

    let content = await readFile(path, 'utf-8');
    let lines = content.split('\n');

    // Apply line range if specified
    if (startLine !== undefined && endLine !== undefined) {
      const start = Math.max(0, startLine - 1); // Convert to 0-based index
      const end = Math.min(lines.length, endLine);
      lines = lines.slice(start, end);
      content = lines.join('\n');
    }

    res.json({
      success: true,
      content,
      lines: lines.length,
      path
    });

  } catch (error) {
    console.error('Read file error:', error);
    res.status(500).json({
      error: `File reading failed: ${error.message}`
    });
  }
});

// Write file endpoint
app.post('/api/write-file', async (req, res) => {
  try {
    const { path, content } = req.body;

    if (!path || content === undefined) {
      return res.status(400).json({ error: 'File path and content are required' });
    }

    if (!isPathAllowed(path)) {
      return res.status(403).json({ error: 'Access to this path is not allowed' });
    }

    // Ensure directory exists
    const dir = dirname(path);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }

    await writeFile(path, content, 'utf-8');

    res.json({
      success: true,
      message: `File written successfully: ${path}`,
      path
    });

  } catch (error) {
    console.error('Write file error:', error);
    res.status(500).json({
      error: `File writing failed: ${error.message}`
    });
  }
});

// List directory endpoint
app.post('/api/list-directory', async (req, res) => {
  try {
    const { path = '.' } = req.body;

    const fullPath = resolve(path);

    if (!isPathAllowed(fullPath)) {
      return res.status(403).json({ error: 'Access to this path is not allowed' });
    }

    if (!existsSync(fullPath)) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    const statInfo = await stat(fullPath);
    if (!statInfo.isDirectory()) {
      return res.status(400).json({ error: 'Path is not a directory' });
    }

    const files = await readdir(fullPath, { withFileTypes: true });

    const fileList = await Promise.all(files.map(async (file) => {
      try {
        const filePath = join(fullPath, file.name);
        const fileStat = await stat(filePath);
        return {
          name: file.name,
          type: file.isDirectory() ? 'directory' : 'file',
          size: fileStat.size,
          modified: fileStat.mtime.toISOString(),
          path: filePath
        };
      } catch (error) {
        return {
          name: file.name,
          type: file.isDirectory() ? 'directory' : 'file',
          error: error.message
        };
      }
    }));

    res.json({
      success: true,
      path: fullPath,
      files: fileList
    });

  } catch (error) {
    console.error('List directory error:', error);
    res.status(500).json({
      error: `Directory listing failed: ${error.message}`
    });
  }
});

// Command Execution Endpoint
app.post('/api/execute-command', async (req, res) => {
  try {
    const { command, cwd = process.cwd(), timeout = 30000 } = req.body;

    if (!command) {
      return res.status(400).json({ error: 'Command is required' });
    }

    // Security: Block dangerous commands
    const dangerousCommands = [
      /rm\s+-rf\s+\//,
      /del\s+.*\/s\s+.*\/q/,
      /format\s+c:/,
      /shutdown/,
      /halt/,
      /poweroff/,
      /reboot/,
      /init\s+0/,
      /mkfs/,
      />.*\/dev\//,  // Redirecting to device files
      /dd\s+if=.*of=.*\/dev\//,
      /sudo\s+su/,
      /su\s+root/,
      /passwd/,
      /chmod\s+777/,
      /chown\s+root/,
      /usermod/
    ];

    const lowerCommand = command.toLowerCase();
    for (const pattern of dangerousCommands) {
      if (pattern.test(lowerCommand)) {
        return res.status(403).json({
          error: 'Command blocked for security reasons',
          blocked: true
        });
      }
    }

    // Set execution timeout
    const execOptions = {
      cwd: isPathAllowed(cwd) ? cwd : process.cwd(),
      timeout,
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    };

    console.log(`Executing command: ${command} in ${execOptions.cwd}`);

    const { stdout, stderr } = await execAsync(command, execOptions);

    res.json({
      success: true,
      command,
      stdout: stdout || '',
      stderr: stderr || '',
      cwd: execOptions.cwd
    });

  } catch (error) {
    console.error('Command execution error:', error);

    if (error.code === 'ETIMEDOUT') {
      res.status(408).json({
        error: 'Command execution timed out',
        timeout: true,
        command: req.body.command
      });
    } else {
      res.status(500).json({
        error: `Command execution failed: ${error.message}`,
        code: error.code,
        stderr: error.stderr
      });
    }
  }
});

// GitHub API Endpoints for Free LLM Discovery
app.get('/api/github/free-llms', async (req, res) => {
  try {
    const query = 'free LLM API OR openai-alternative OR free-chatgpt OR huggingface-models';
    const searchURL = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`;

    const headers = { ...githubConfig.headers };
    if (githubConfig.token) {
      headers['Authorization'] = `Bearer ${githubConfig.token}`;
    }

    const response = await axios.get(searchURL, { headers });

    const llmRepos = response.data.items
      .filter(repo => {
        const desc = repo.description?.toLowerCase() || '';
        return desc.includes('llm') || desc.includes('gpt') || desc.includes('chatbot') ||
               desc.includes('ai model') || desc.includes('language model');
      })
      .map(repo => ({
        name: repo.name,
        fullName: repo.full_name,
        url: repo.html_url,
        description: repo.description,
        stars: repo.stargazers_count,
        language: repo.language,
        tags: repo.topics || [],
        api_endpoints: extractAPILinks(repo.description)
      }));

    // Cache results
    freeLLMProviders = llmRepos.slice(0, 10);

    res.json({
      success: true,
      providers: llmRepos,
      total: response.data.total_count
    });

  } catch (error) {
    console.error('GitHub LLM discovery error:', error);
    res.status(500).json({
      error: 'Failed to discover free LLMs',
      fallback: freeLLMProviders
    });
  }
});

// MCP Server Management
app.get('/api/mcp/servers', (req, res) => {
  res.json({
    success: true,
    servers: mcpServers,
    count: mcpServers.length
  });
});

app.post('/api/mcp/servers', async (req, res) => {
  try {
    const { name, description, config } = req.body;

    const newServer = {
      id: `mcp_${Date.now()}`,
      name,
      description,
      config,
      registered: new Date().toISOString(),
      status: 'registered'
    };

    mcpServers.push(newServer);

    res.json({
      success: true,
      server: newServer,
      message: 'MCP server registered successfully'
    });

  } catch (error) {
    console.error('MCP server registration error:', error);
    res.status(500).json({
      error: 'Failed to register MCP server'
    });
  }
});

// Persistent Storage using GitHub Gist
app.post('/api/storage/save', async (req, res) => {
  try {
    const { key, data, description = 'Autonomous AI data' } = req.body;

    // Use GitHub Gist for storage
    const gistData = {
      description,
      public: false,
      files: {
        [key + '.json']: {
          content: JSON.stringify(data, null, 2)
        }
      }
    };

    const headers = {
      ...githubConfig.headers,
      'Authorization': `Bearer ${githubConfig.token}`
    };

    if (!githubConfig.token) {
      return res.status(400).json({
        error: 'GitHub token required for storage. Set GITHUB_TOKEN environment variable.'
      });
    }

    const response = await axios.post(`${githubConfig.baseURL}/gists`, gistData, { headers });

    res.json({
      success: true,
      gist: response.data,
      message: 'Data stored in GitHub Gist'
    });

  } catch (error) {
    console.error('GitHub storage error:', error);
    res.status(500).json({
      error: 'Failed to store data on GitHub',
      details: error.response?.data || error.message
    });
  }
});

// Retrieve from GitHub Gist storage
app.get('/api/storage/retrieve/:gistId/:filename', async (req, res) => {
  try {
    const { gistId, filename } = req.params;

    const headers = { ...githubConfig.headers };
    if (githubConfig.token) {
      headers['Authorization'] = `Bearer ${githubConfig.token}`;
    }

    const response = await axios.get(`${githubConfig.baseURL}/gists/${gistId}`, { headers });

    const file = response.data.files[filename];
    if (!file) {
      return res.status(404).json({ error: 'File not found in gist' });
    }

    const data = JSON.parse(file.content);

    res.json({
      success: true,
      data,
      gist: response.data
    });

  } catch (error) {
    console.error('GitHub retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve data from GitHub'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    capabilities: {
      fileOperations: true,
      commandExecution: true,
      githubIntegration: true,
      mcpServers: mcpServers.length,
      freeLLMProviders: freeLLMProviders.length,
      githubStorage: !!githubConfig.token,
      security: true
    }
  });
});

// Status endpoint for autonomous agent
app.get('/api/status', (req, res) => {
  res.json({
    autonomous: true,
    capabilities: [
      'file_system_operations',
      'command_execution',
      'github_integration',
      'free_llm_discovery',
      'mcp_server_orchestration',
      'git_persistence',
      'continuous_enhancement',
      'real_autonomy' // Key differentiator from demo version
    ],
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      githubToken: !!githubConfig.token
    },
    services: {
      mcpServers: mcpServers.length,
      freeLLMProviders: freeLLMProviders.length,
      githubStorageEnabled: !!githubConfig.token
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Start server
app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Autonomous AI Server running on http://localhost:${PORT}`);
  console.log(`📁 File operations: ENABLED`);
  console.log(`💻 Command execution: ENABLED`);
  console.log(`🐙 GitHub Integration: ${githubConfig.token ? 'ENABLED' : 'NO TOKEN'}`);
  console.log(`🎯 MCP Servers: ${mcpServers.length} REGISTERED`);
  console.log(`🔒 Security: ACTIVE`);
  console.log(`📊 Free LLM Discovery: READY`);
  console.log(`💾 GitHub Storage: ${githubConfig.token ? 'ENABLED' : 'DISABLED'}`);
  console.log(`🎯 Status: http://localhost:${PORT}/api/status`);
});

// Helper function to extract API links from GitHub repository descriptions
function extractAPILinks(description) {
  if (!description) return [];

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = description.match(urlRegex) || [];

  // Filter for API-related URLs
  return urls.filter(url => {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('api') ||
           lowerUrl.includes('docs') ||
           lowerUrl.includes('swagger') ||
           lowerUrl.includes('readme');
  });
}

export default app;
