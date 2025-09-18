// Professional AI Chat Interface
// Beautiful, responsive chat UI for autonomous agent interactions

import React, { useState, useRef, useEffect } from 'react';
import { globalAgent } from '../lib/autonomousAgent.js';
import { registerAllTools } from '../lib/tools.js';
import { providerRegistry } from '../lib/providers.js';
import { memoryPersistence } from '../lib/supabaseClient.js';
import './AutonomousChat.css';

const AutonomousChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentStatus, setAgentStatus] = useState('learning');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize agent with tools and providers
  useEffect(() => {
    const initAgent = () => {
      registerAllTools(globalAgent);

      // Set provider context
      globalAgent.providerRegistry = providerRegistry;

      // Load saved state if available
      const savedState = localStorage.getItem('autonomousAgentState');
      if (savedState) {
        try {
          globalAgent.loadState(JSON.parse(savedState));
          setMessages(globalAgent.conversation.slice(-20)); // Show last 20 messages
        } catch (error) {
          console.error('Failed to load agent state:', error);
        }
      }

      // Set status update handler
      globalAgent.onStatusChange = setAgentStatus;

      setSelectedProvider(providerRegistry.getAllProviders()[0] || null);
    };

    initAgent();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await globalAgent.chat(inputMessage.trim());

      const agentMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        provider: selectedProvider?.name
      };

      setMessages(prev => [...prev, agentMessage]);

      // Save state
      localStorage.setItem('autonomousAgentState', JSON.stringify(globalAgent.saveState()));

    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    globalAgent.conversation = [];
    setMessages([]);
    localStorage.removeItem('autonomousAgentState');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'learning': return '#f59e0b';
      case 'improving': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const TypingIndicator = () => (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">Agent is thinking...</span>
    </div>
  );

  const MessageBubble = ({ message, index }) => {
    const isUser = message.role === 'user';
    const isLog = message.content?.startsWith('LOG:');
    const isError = message.isError;

    if (isLog) {
      return (
        <div className="message log-message" key={index}>
          <div className="log-content">
            📝 {message.content.substring(4)}
          </div>
          <div className="message-time">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      );
    }

    return (
      <div className={`message ${isUser ? 'user-message' : 'agent-message'} ${isError ? 'error-message' : ''}`} key={index}>
        {!isUser && (
          <div className="agent-avatar">
            <div className="avatar-circle">
              <span>🤖</span>
            </div>
            <div className="provider-badge">
              {message.provider || 'AI'}
            </div>
          </div>
        )}
        <div className="message-content">
          <div className="message-text">
            {isError ? message.content : formatMessage(message.content)}
          </div>
          <div className="message-meta">
            <span className="message-time">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            {!isUser && message.provider && (
              <span className="message-provider">via {message.provider}</span>
            )}
          </div>
        </div>
        {isUser && (
          <div className="user-avatar">
            <div className="avatar-circle">
              <span>👤</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const formatMessage = (text) => {
    // Simple formatting for code blocks and links
    return text
      .replace(/```(\w+)?([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  const handleSuggestImprovement = async () => {
    setIsTyping(true);
    try {
      const suggestions = await globalAgent.suggestImprovements();

      const suggestionMessage = {
        role: 'assistant',
        content: `## 🤖 Self-Improvement Analysis\n\n${suggestions}`,
        timestamp: new Date().toISOString(),
        isSuggestion: true
      };

      setMessages(prev => [...prev, suggestionMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ Failed to analyze improvements: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDiscoverAPIs = async () => {
    setIsTyping(true);
    try {
      const apiResults = await globalAgent.executeTool('discoverAPIs', {
        category: 'weather',
        freeOnly: true,
        maxResults: 5
      });

      let responseText = '## 🔍 API Discovery Results\n\n';
      if (apiResults && apiResults.apis && apiResults.apis.length > 0) {
        responseText += `Found ${apiResults.count} free APIs:\n\n`;
        apiResults.apis.forEach(api => {
          responseText += `**${api.name}**\n`;
          responseText += `- ${api.description}\n`;
          responseText += `- Category: ${api.category}\n`;
          responseText += `- URL: ${api.url}\n`;
          responseText += `- Auth: ${api.auth || 'None'}\n\n`;
        });
        responseText += `💡 I can create MCP servers for these APIs automatically. Would you like me to do that?`;
      } else {
        responseText += 'No suitable free APIs found in the weather category. Try other categories like "finance", "social", or "data".';
      }

      const discoveryMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
        isDiscovery: true
      };

      setMessages(prev => [...prev, discoveryMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ API Discovery failed: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEvolutionCheck = async () => {
    setIsTyping(true);
    try {
      // Set some default objectives if none exist
      if (globalAgent.evolutionObjectives.length === 0) {
        await globalAgent.setEvolutionObjectives([
          'Improve response accuracy',
          'Learn user preferences',
          'Expand knowledge base',
          'Optimize performance'
        ]);
      }

      const progressReport = await globalAgent.evaluateEvolutionProgress();

      let responseText = '## 📈 Evolution Progress Report\n\n';

      responseText += `### Objectives Status:\n`;
      responseText += `- **Total:** ${progressReport.totalObjectives}\n`;
      responseText += `- **Active:** ${progressReport.activeObjectives}\n`;
      responseText += `- **Completed:** ${progressReport.completedObjectives}\n`;
      responseText += `- **Blocked:** ${progressReport.blockers.length}\n`;
      responseText += `- **Average Progress:** ${Math.round(progressReport.averageProgress)}%\n\n`;

      if (progressReport.recommendations && progressReport.recommendations.length > 0) {
        responseText += `### Recommendations:\n`;
        progressReport.recommendations.forEach(rec => {
          responseText += `- ${rec}\n`;
        });
        responseText += '\n';
      }

      if (globalAgent.evolutionObjectives.length > 0) {
        responseText += `### Current Objectives:\n`;
        globalAgent.evolutionObjectives.slice(0, 3).forEach(obj => {
          responseText += `- **${obj.description}** (${obj.progress}% - ${obj.status})\n`;
          if (obj.milestones.length > 0) {
            const nextMilestone = obj.milestones.find(m => !m.completed);
            if (nextMilestone) {
              responseText += `  └ Next: ${nextMilestone.description}\n`;
            }
          }
        });
      }

      const evolutionMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
        isEvolution: true
      };

      setMessages(prev => [...prev, evolutionMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `❌ Evolution check failed: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="autonomous-chat">
      {/* Header */}
      <div className="chat-header">
        <div className="header-info">
          <h2>🤖 Autonomous AI Assistant</h2>
          <div className="status-indicator">
            <div
              className="status-dot"
              style={{ backgroundColor: getStatusColor(agentStatus) }}
            ></div>
            <span>{agentStatus.charAt(0).toUpperCase() + agentStatus.slice(1)}</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="action-btn secondary"
            onClick={handleSuggestImprovement}
            disabled={isTyping}
            title="Analyze conversation and suggest improvements"
          >
            🧠 Analyze
          </button>
          <button
            className="action-btn info"
            onClick={handleDiscoverAPIs}
            disabled={isTyping}
            title="Discover new APIs for integration"
          >
            🔍 API Discovery
          </button>
          <button
            className="action-btn info"
            onClick={handleEvolutionCheck}
            disabled={isTyping}
            title="Review evolution objectives and progress"
          >
            📈 Evolution
          </button>
          <button
            className="action-btn danger"
            onClick={clearConversation}
            title="Clear conversation history"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Provider Info */}
      {selectedProvider && (
        <div className="provider-info">
          <div className="provider-badge">
            <span>⚡ {selectedProvider.name}</span>
            <span className="model-info">{selectedProvider.config.model}</span>
          </div>
          <div className="available-providers">
            {providerRegistry.getAllProviders().map(provider => (
              <span key={provider.name} className="provider-tag">
                {provider.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>👋 Welcome to your Autonomous AI Assistant!</h3>
            <p>I can help you with:</p>
            <ul>
              <li>💬 Natural conversations</li>
              <li>⚙️ Execute complex tasks autonomously</li>
              <li>📝 Code analysis and generation</li>
              <li>🧠 Self-improvement and learning</li>
              <li>🌐 Web requests and API interactions</li>
            </ul>
            <p><strong>Try asking me to:</strong> "Create a React component for a todo list" or "Analyze the current codebase"</p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} index={index} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="message-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... 💭"
            disabled={isTyping}
            rows={1}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            {isTyping ? '⏳' : '🚀'}
          </button>
        </div>

        <div className="input-footer">
          <span className="footer-text">
            Press Enter to send, Shift+Enter for new line
          </span>
          <span className="character-count">
            {inputMessage.length}/2000
          </span>
        </div>
      </div>
    </div>
  );
};

export default AutonomousChat;
