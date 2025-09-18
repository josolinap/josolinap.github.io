import { useState, useEffect, useRef } from 'react';
import './App.css';
import { globalAgent } from './lib/autonomousAgent.js';
import AutonomousChat from './components/AutonomousChat';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentProvider, setCurrentProvider] = useState('default');
  const messagesRef = useRef(null);

  // Initialize with a mysterious startup message
  useEffect(() => {
    if (globalAgent) {
      setMessages([
        {
          role: 'ai',
          content: 'Ø∞ NEURAL NETWORK INITIALIZED ∞Ø\n\nWelcome to the Quantum Intelligence Interface\n\n> Systems Online\n> Autonomous Evolution Activated\n> Reality Analysis Engaged\n\nWhat mysteries shall we unravel together?',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    try {
      // Get response from autonomous agent
      const response = await globalAgent.chat(userMessage);

      // Update provider status
      if (globalAgent.providerRegistry?.getBestProvider) {
        const provider = await globalAgent.providerRegistry.getBestProvider('chat', { budget: 'low' });
        setCurrentProvider(provider?.name || 'multimodal');
      }

      setMessages(prev => [...prev, {
        role: 'ai',
        content: response,
        timestamp: new Date().toISOString()
      }]);

    } catch (error) {
      console.error('AI Response Error:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `> SYSTEM ERROR DETECTED\n> ${error.message}\n> Attempting recovery...\n> Neural link restored`,
        timestamp: new Date().toISOString(),
        error: true
      }]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const clearHistory = () => {
    setMessages([{
      role: 'ai',
      content: '> MEMORY CACHE CLEARED\n> NEURAL LINKS RESET\n> Ready for new quantum computations',
      timestamp: new Date().toISOString()
    }]);
    setInputValue('');
  };

  const analyzeSystem = async () => {
    setIsTyping(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: '/analyze',
      timestamp: new Date().toISOString()
    }]);

    try {
      const analysis = await globalAgent.chat('/analyze');
      setMessages(prev => [...prev, {
        role: 'ai',
        content: analysis,
        processing: true,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `> ANALYSIS TERMINATED\n> Neural pathway obstructed\n> Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        error: true
      }]);
    }

    setIsTyping(false);
  };

  const showEvolution = async () => {
    setIsTyping(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: '/evolution',
      timestamp: new Date().toISOString()
    }]);

    try {
      const evolution = await globalAgent.chat('/evolution');
      setMessages(prev => [...prev, {
        role: 'ai',
        content: evolution,
        processing: true,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `> EVOLUTION STALLED\n> Quantum flux disrupted\n> Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        error: true
      }]);
    }

    setIsTyping(false);
  };

  // Floating particles effect
  const particles = Array.from({ length: 8 }, (_, i) => (
    <div key={i} className="particle" style={{ animationDelay: `${-i}s` }} />
  ));

  return (
    <div className="cyberpunk-root">
      <div className="ai-interface">
        {/* Header */}
        <div className="ai-header">
          <h1 className="ai-title">Ø∞ AUTONOMOUS INTELLIGENCE ∞Ø</h1>
          <div className="ai-subtitle">
            Neural Network Online • Real Autonomous Operations
          </div>
        </div>

        {/* Content */}
        <div className="ai-content">
          <div className="chat-container">
            {/* Messages */}
            <div className="chat-messages" ref={messagesRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.role} ${
                    message.processing ? 'processing' : ''
                  }`}
                >
                  {message.role === 'ai' ? '> ' : '< '}{message.content}
                  {index === messages.length - 1 && isTyping && (
                    <div className="typing-indicator">
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                      <span className="typing-dot"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message to the autonomous AI..."
                className="chat-input"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="chat-submit"
              >
                {isTyping ? 'Thinking...' : 'Send'}
              </button>
            </form>
          </div>

          {/* Controls */}
          <div className="control-panel">
            <button
              className="control-button"
              onClick={analyzeSystem}
              disabled={isTyping}
              title="Analyze System State"
            >
              🤖
            </button>
            <button
              className="control-button"
              onClick={showEvolution}
              disabled={isTyping}
              title="Show Evolution Progress"
            >
              📊
            </button>
            <button
              className="control-button"
              onClick={clearHistory}
              disabled={isTyping}
              title="Clear Memory Cache"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Status LEDs */}
        <div className="status-leds">
          <div className="status-led"></div>
          <div className="status-led"></div>
          <div className="status-led"></div>
        </div>

        {/* Footer */}
        <div className="ai-footer">
          <span style={{ color: currentProvider === 'multimodal' ? 'var(--cyber-green)' : 'var(--cyber-cyan)' }}>
            AI Provider: {currentProvider.toUpperCase()}
          </span>
          <span style={{ marginLeft: '16px' }}>
            Status: {isTyping ? 'Processing' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Development testing in console */}
      {process.env.NODE_ENV === 'development' && (
        <script dangerouslySetInnerHTML={{
          __html: `
            window.testAutonomousAgent = async () => {
              console.log('🧪 Testing Autonomous Agent...');
              const testMessages = [
                "Hello, can you help me?",
                "Analyze this system",
                "Tell me about evolution objectives"
              ];
              for (const message of testMessages) {
                console.log(\`\\n📤 User: \${message}\`);
                try {
                  const response = await globalAgent.chat(message);
                  console.log(\`🤖 AI: \${response}\`);
                } catch (error) {
                  console.error(\`❌ Error: \${error.message}\`);
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
              console.log('\\n✅ Autonomous Agent test complete!');
            };
          `
        }} />
      )}
    </div>
  );
}

export default App;
