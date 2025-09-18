import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { analyzeText } from '../lib/ai';

function AIAgent({ onTaskComplete }) {
  const [isActive, setIsActive] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const [agentLogs, setAgentLogs] = useState([]);
  const [mcpConnections, setMcpConnections] = useState({});
  const [customPrompts, setCustomPrompts] = useState({});
  const terminalRef = useRef(null);

  // Autonomous task types
  const taskTypes = {
    CODE_GENERATION: 'code_generation',
    FILE_OPERATIONS: 'file_operations',
    API_INTEGRATION: 'api_integration',
    TESTING: 'testing',
    DEPLOYMENT: 'deployment',
    ANALYSIS: 'analysis'
  };

  // MCP Server connections
  const mcpServers = {
    github: { url: 'https://api.github.com', connected: false },
    supabase: { url: 'https://supabase.com/api', connected: true },
    gemini: { url: 'https://generativelanguage.googleapis.com', connected: true },
    // Add more MCP servers as needed
  };

  useEffect(() => {
    loadAgentConfiguration();
    initializeMCPConnections();
  }, []);

  const loadAgentConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_config')
        .select('*')
        .single();

      if (data && !error) {
        setCustomPrompts(data.prompts || {});
        setMcpConnections(data.mcp_connections || {});
      } else {
        // Create default configuration
        const defaultConfig = {
          prompts: {
            codeGeneration: "Generate high-quality, production-ready code with proper error handling and best practices.",
            analysis: "Analyze the code and provide detailed feedback with improvement suggestions."
          },
          mcp_connections: {
            supabase: { connected: true, url: 'https://supabase.com/api' },
            gemini: { connected: true, url: 'https://generativelanguage.googleapis.com' },
            github: { connected: false, url: 'https://api.github.com' }
          },
          settings: {
            autonomy_level: 'supervised', // 'supervised' or 'autonomous'
            max_concurrent_tasks: 3,
            enable_learning: true
          }
        };

        await supabase.from('agent_config').insert([{
          prompts: defaultConfig.prompts,
          mcp_connections: defaultConfig.mcp_connections,
          settings: defaultConfig.settings
        }]);

        setCustomPrompts(defaultConfig.prompts);
        setMcpConnections(defaultConfig.mcp_connections);
      }
    } catch (err) {
      console.log('Error loading agent config:', err);
    }
  };

  const initializeMCPConnections = () => {
    // Initialize MCP server connections
    const connections = {};
    Object.keys(mcpServers).forEach(server => {
      connections[server] = {
        ...mcpServers[server],
        status: 'checking'
      };
    });
    setMcpConnections(connections);
  };

  const log = (message, type = 'info') => {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message, type };
    setAgentLogs(prev => [...prev, logEntry]);
    console.log(`[AI Agent] ${message}`);
  };

  const executeTask = async (task) => {
    setCurrentTask(task);
    setIsActive(true);

    try {
      log(`Starting task: ${task.type} - ${task.description}`);

      switch (task.type) {
        case taskTypes.CODE_GENERATION:
          await handleCodeGeneration(task);
          break;
        case taskTypes.FILE_OPERATIONS:
          await handleFileOperations(task);
          break;
        case taskTypes.API_INTEGRATION:
          await handleAPIIntegration(task);
          break;
        case taskTypes.TESTING:
          await handleTesting(task);
          break;
        case taskTypes.DEPLOYMENT:
          await handleDeployment(task);
          break;
        case taskTypes.ANALYSIS:
          await handleAnalysis(task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      log(`Task completed successfully: ${task.type}`);
      setTaskHistory(prev => [...prev, { ...task, status: 'completed', completedAt: new Date() }]);

    } catch (error) {
      log(`Task failed: ${error.message}`, 'error');
      setTaskHistory(prev => [...prev, { ...task, status: 'failed', error: error.message, completedAt: new Date() }]);
    } finally {
      setCurrentTask(null);
      setIsActive(false);
      if (onTaskComplete) onTaskComplete(task);
    }
  };

  const handleCodeGeneration = async (task) => {
    const prompt = customPrompts.codeGeneration || `
      Generate high-quality, production-ready code for the following requirement.
      Include proper error handling, comments, and best practices.
      Requirement: ${task.description}
    `;

    const analysis = await analyzeText(prompt);
    log(`Generated code analysis: ${analysis.summary}`);

    // Simulate code generation
    const generatedCode = `// Generated by AI Agent
// ${task.description}

export function ${task.functionName || 'generatedFunction'}(${task.parameters || ''}) {
  try {
    // Implementation based on: ${analysis.keywords.join(', ')}
    ${task.implementation || '// TODO: Implement functionality'}

    return {
      success: true,
      message: '${analysis.summary}'
    };
  } catch (error) {
    console.error('Error in generated function:', error);
    return {
      success: false,
      error: error.message
    };
  }
}`;

    // Save generated code to virtual file system
    await saveVirtualFile(`generated/${task.functionName || 'code'}.js`, generatedCode);
    log(`Code generated and saved: ${task.functionName || 'code'}.js`);
  };

  const handleFileOperations = async (task) => {
    log(`Performing file operation: ${task.operation} on ${task.filePath}`);

    switch (task.operation) {
      case 'create':
        await saveVirtualFile(task.filePath, task.content || '');
        break;
      case 'read':
        const content = await readVirtualFile(task.filePath);
        log(`File content: ${content.substring(0, 100)}...`);
        break;
      case 'update':
        await updateVirtualFile(task.filePath, task.content);
        break;
      case 'delete':
        await deleteVirtualFile(task.filePath);
        break;
      default:
        throw new Error(`Unknown file operation: ${task.operation}`);
    }
  };

  const handleAPIIntegration = async (task) => {
    log(`Integrating with API: ${task.apiName}`);

    // Check MCP connection
    if (!mcpConnections[task.apiName]?.connected) {
      throw new Error(`MCP server ${task.apiName} not connected`);
    }

    // Simulate API integration
    const integrationCode = `// API Integration: ${task.apiName}
// Generated by AI Agent

export class ${task.apiName}Integration {
  constructor() {
    this.baseUrl = '${mcpServers[task.apiName]?.url}';
    this.apiKey = process.env.${task.apiName.toUpperCase()}_API_KEY;
  }

  async ${task.methodName || 'makeRequest'}(endpoint, data = {}) {
    try {
      const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${this.apiKey}\`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(\`API request failed: \${response.status}\`);
      }

      return await response.json();
    } catch (error) {
      console.error('API integration error:', error);
      throw error;
    }
  }
}`;

    await saveVirtualFile(`integrations/${task.apiName}.js`, integrationCode);
    log(`API integration created for ${task.apiName}`);
  };

  const handleTesting = async (task) => {
    log(`Running tests for: ${task.target}`);

    // Simulate test execution
    const testResults = {
      passed: Math.floor(Math.random() * 10) + 5,
      failed: Math.floor(Math.random() * 3),
      total: Math.floor(Math.random() * 10) + 8
    };

    if (testResults.failed > 0) {
      throw new Error(`${testResults.failed} tests failed out of ${testResults.total}`);
    }

    log(`Tests passed: ${testResults.passed}/${testResults.total}`);
  };

  const handleDeployment = async (task) => {
    log(`Starting deployment to: ${task.target}`);

    // Simulate deployment process
    const steps = ['Building application', 'Running tests', 'Optimizing assets', 'Deploying to server'];

    for (const step of steps) {
      log(`Deployment step: ${step}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    }

    log(`Deployment completed successfully to ${task.target}`);
  };

  const handleAnalysis = async (task) => {
    log(`Analyzing: ${task.target}`);

    const analysis = await analyzeText(`Analyze the following ${task.targetType || 'code'}: ${task.content || task.description}`);

    const report = {
      summary: analysis.summary,
      keywords: analysis.keywords,
      sentiment: analysis.sentiment,
      recommendations: [
        'Consider adding error handling',
        'Optimize performance',
        'Add comprehensive tests',
        'Document the functionality'
      ]
    };

    await saveVirtualFile(`analysis/${task.target}-report.json`, JSON.stringify(report, null, 2));
    log(`Analysis complete. Report saved.`);
  };

  // Virtual file system operations (simulated)
  const saveVirtualFile = async (path, content) => {
    // In a real implementation, this would save to a cloud storage
    // For now, we'll store in localStorage as a simulation
    const files = JSON.parse(localStorage.getItem('virtualFiles') || '{}');
    files[path] = {
      content,
      createdAt: new Date().toISOString(),
      size: content.length
    };
    localStorage.setItem('virtualFiles', JSON.stringify(files));
    log(`File saved: ${path} (${content.length} bytes)`);
  };

  const readVirtualFile = async (path) => {
    const files = JSON.parse(localStorage.getItem('virtualFiles') || '{}');
    if (!files[path]) {
      throw new Error(`File not found: ${path}`);
    }
    return files[path].content;
  };

  const updateVirtualFile = async (path, content) => {
    const files = JSON.parse(localStorage.getItem('virtualFiles') || '{}');
    if (!files[path]) {
      throw new Error(`File not found: ${path}`);
    }
    files[path].content = content;
    files[path].updatedAt = new Date().toISOString();
    localStorage.setItem('virtualFiles', JSON.stringify(files));
    log(`File updated: ${path}`);
  };

  const deleteVirtualFile = async (path) => {
    const files = JSON.parse(localStorage.getItem('virtualFiles') || '{}');
    if (!files[path]) {
      throw new Error(`File not found: ${path}`);
    }
    delete files[path];
    localStorage.setItem('virtualFiles', JSON.stringify(files));
    log(`File deleted: ${path}`);
  };

  const executeCommand = async (command) => {
    log(`Executing command: ${command}`);

    // Simulate command execution (in a real implementation, this would call an API)
    const simulatedOutput = `Command executed: ${command}\nOutput: [Simulated command output]\nStatus: Success`;

    if (terminalRef.current) {
      terminalRef.current.value += `\n$ ${command}\n${simulatedOutput}\n`;
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }

    return simulatedOutput;
  };

  const createAutonomousTask = (description, type, params = {}) => {
    const task = {
      id: Date.now().toString(),
      type,
      description,
      ...params,
      createdAt: new Date(),
      status: 'queued'
    };

    executeTask(task);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '400px',
      height: '600px',
      backgroundColor: '#1a1a1a',
      border: '2px solid #646cff',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        padding: '10px',
        borderBottom: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, color: '#646cff' }}>🤖 AI Agent</h3>
        <div>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: isActive ? '#4CAF50' : '#666',
            display: 'inline-block',
            marginRight: '5px'
          }}></span>
          {isActive ? 'Active' : 'Idle'}
        </div>
      </div>

      <div style={{ flex: 1, padding: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Terminal */}
        <div style={{ flex: 1, marginBottom: '10px' }}>
          <textarea
            ref={terminalRef}
            style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#000',
              color: '#0f0',
              fontFamily: 'monospace',
              fontSize: '12px',
              border: '1px solid #333',
              borderRadius: '4px',
              padding: '5px',
              resize: 'none'
            }}
            placeholder="AI Agent Terminal..."
            readOnly
          />
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button
              onClick={() => createAutonomousTask('Generate a React component for user authentication', taskTypes.CODE_GENERATION, { functionName: 'AuthComponent' })}
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              Generate Code
            </button>
            <button
              onClick={() => createAutonomousTask('Analyze current codebase for improvements', taskTypes.ANALYSIS, { target: 'codebase', targetType: 'code' })}
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              Analyze Code
            </button>
            <button
              onClick={() => createAutonomousTask('Integrate with GitHub API', taskTypes.API_INTEGRATION, { apiName: 'github', methodName: 'getRepos' })}
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              API Integration
            </button>
            <button
              onClick={() => createAutonomousTask('Deploy application to production', taskTypes.DEPLOYMENT, { target: 'production' })}
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              Deploy
            </button>
          </div>
        </div>

        {/* MCP Status */}
        <div style={{ marginBottom: '10px' }}>
          <h4 style={{ margin: '5px 0', fontSize: '14px' }}>MCP Connections:</h4>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {Object.keys(mcpConnections).map(server => (
              <span key={server} style={{
                padding: '2px 6px',
                fontSize: '11px',
                borderRadius: '3px',
                backgroundColor: mcpConnections[server].connected ? '#4CAF50' : '#f44336',
                color: 'white'
              }}>
                {server}
              </span>
            ))}
          </div>
        </div>

        {/* Current Task */}
        {currentTask && (
          <div style={{
            padding: '10px',
            backgroundColor: '#333',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              Current Task: {currentTask.type}
            </div>
            <div style={{ fontSize: '14px' }}>{currentTask.description}</div>
          </div>
        )}

        {/* Logs */}
        <div style={{ flex: 1, overflow: 'auto', fontSize: '12px', fontFamily: 'monospace' }}>
          {agentLogs.slice(-10).map((log, index) => (
            <div key={index} style={{
              color: log.type === 'error' ? '#f44336' : log.type === 'warning' ? '#ff9800' : '#0f0',
              marginBottom: '2px'
            }}>
              [{log.timestamp.split('T')[1].split('.')[0]}] {log.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AIAgent;
