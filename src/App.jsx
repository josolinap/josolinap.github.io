import AutonomousChat from './components/AutonomousChat';
import './App.css';

// Test function to verify the autonomous agent is working
import { globalAgent } from './lib/autonomousAgent.js';

if (process.env.NODE_ENV === 'development') {
  window.testAutonomousAgent = async () => {
    console.log('🧪 Testing Autonomous Agent...');

    // Test different conversation scenarios
    const testMessages = [
      "Hello, can you help me?",
      "Please create a simple React component",
      "What can you analyze for me?",
      "Tell me about evolution objectives"
    ];

    for (const message of testMessages) {
      console.log(`\n📤 User: ${message}`);
      try {
        const response = await globalAgent.chat(message);
        console.log(`🤖 AI: ${response}`);
      } catch (error) {
        console.error(`❌ Error: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✅ Autonomous Agent test complete!');
    console.log('🔧 Available tools:', globalAgent.tools.size);
    console.log('📊 Providers registered:', [...globalAgent.providerRegistry.providers.keys()]);
  };
}

function App() {
  return <AutonomousChat />;
}

export default App;
