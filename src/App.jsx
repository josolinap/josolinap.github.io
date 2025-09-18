import { useState, useRef, useEffect } from "react";
import { analyzeText } from "./lib/ai";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your autonomous AI assistant. What would you like me to do?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Process the command
      const response = await processCommand(userMessage);
      addMessage('ai', response);
    } catch (error) {
      addMessage('ai', `Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const processCommand = async (command) => {
    const cmd = command.toLowerCase().trim();

    // Basic command processing
    if (cmd.includes('hello') || cmd.includes('hi')) {
      return 'Hello! How can I help you today?';
    }

    if (cmd.includes('analyze') || cmd.includes('sentiment')) {
      const textToAnalyze = command.replace(/analyze|sentiment/gi, '').trim();
      if (!textToAnalyze) {
        return 'Please provide text to analyze. Example: "analyze this is a great day"';
      }

      const result = await analyzeText(textToAnalyze);
      return `Analysis Results:
• Summary: ${result.summary}
• Keywords: ${result.keywords.join(', ')}
• Sentiment: ${result.sentiment}`;
    }

    if (cmd.includes('generate') || cmd.includes('code')) {
      const requirement = command.replace(/generate|code/gi, '').trim();
      if (!requirement) {
        return 'Please specify what code to generate. Example: "generate a React component"';
      }

      const prompt = `Generate clean, production-ready code for: ${requirement}. Include proper error handling and comments.`;
      const result = await analyzeText(prompt);

      return `Generated Code Concept:
${result.summary}

Key considerations: ${result.keywords.join(', ')}

Would you like me to create a specific implementation?`;
    }

    if (cmd.includes('help') || cmd.includes('commands')) {
      return `Available Commands:
• "analyze [text]" - Analyze sentiment and keywords
• "generate [requirement]" - Generate code or content
• "search [term]" - Search through data
• "create [item]" - Create notes, files, etc.
• "status" - Show system status
• "help" - Show this help message

You can also just describe what you want me to do in natural language!`;
    }

    if (cmd.includes('status')) {
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL;
      const hasGemini = !!import.meta.env.VITE_GEMINI_API_KEY;
      const hasWorker = !!import.meta.env.VITE_WORKER_URL;

      return `System Status:
• Supabase: ${hasSupabase ? '✅ Connected' : '❌ Not configured'}
• Gemini AI: ${hasGemini ? '✅ Available' : '❌ Not configured'}
• Cloudflare Worker: ${hasWorker ? '✅ Active' : '⚠️ Using direct API'}
• Commands: ✅ Functional
• Memory: ✅ Active`;
    }

    // Default: Use AI to understand and respond
    const aiPrompt = `The user said: "${command}"

Please understand what they're asking for and provide a helpful response. If they want you to perform an action, explain what you would do. Be conversational and helpful.`;

    const result = await analyzeText(aiPrompt);
    return result.summary;
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#0a0a0a',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#1a1a1a'
      }}>
        <h1 style={{ margin: 0, color: '#646cff' }}>🤖 AI Assistant</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: '#888', fontSize: '0.9rem' }}>
          Your autonomous AI companion - just tell me what to do!
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map(message => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: message.type === 'user' ? '#646cff' : '#2a2a2a',
              border: message.type === 'ai' ? '1px solid #444' : 'none'
            }}>
              <p style={{
                margin: 0,
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap'
              }}>
                {message.content}
              </p>
              <span style={{
                fontSize: '0.7rem',
                color: '#888',
                marginTop: '0.5rem',
                display: 'block'
              }}>
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: '#2a2a2a',
              border: '1px solid #444'
            }}>
              <div style={{
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#646cff',
                  animation: 'pulse 1.5s infinite'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#646cff',
                  animation: 'pulse 1.5s infinite 0.2s'
                }}></div>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: '#646cff',
                  animation: 'pulse 1.5s infinite 0.4s'
                }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{
        padding: '1rem',
        borderTop: '1px solid #333',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your command or request..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: isLoading ? '#444' : '#646cff',
              color: 'white',
              fontSize: '1rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
          }
          40% {
            opacity: 1;
          }
        }

        input:focus {
          border-color: #646cff;
          box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
        }

        button:hover:not(:disabled) {
          background-color: #535bf2;
        }
      `}</style>
    </div>
  );
}

export default App;
