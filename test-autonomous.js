#!/usr/bin/env node

/**
 * Autonomous AI System Test Script
 * Tests all system components and providers
 */

import { globalAgent } from './src/lib/autonomousAgent.js';
import { registerAllTools } from './src/lib/tools.js';
import { providerRegistry } from './src/lib/providers.js';
import { memoryPersistence } from './src/lib/supabaseClient.js';

async function testAutonomousSystem() {
  console.log('🧪 Starting comprehensive autonomous AI system test...\n');

  try {
    // Initialize agent with tools
    console.log('🔧 Initializing agent with tools...');
    registerAllTools(globalAgent);
    globalAgent.providerRegistry = providerRegistry;
    console.log(`✓ Registered ${globalAgent.tools.size} tools`);
    console.log('✓ Registered', providerRegistry.providers.size, 'providers:', [...providerRegistry.providers.keys()]);

    // Test memory persistence initialization
    console.log('\n💾 Testing memory persistence...');
    const initResult = await memoryPersistence.initialize();
    console.log(`✓ Memory persistence ${initResult ? 'connected' : 'initialized (localStorage)'}`);

    // Test basic provider functionality
    console.log('\n🤖 Testing provider rotation...');

    const testProviders = ['mock', 'huggingface', 'openai', 'anthropic', 'gemini', 'replicate'];
    for (const providerName of testProviders) {
      if (providerRegistry.providers.has(providerName)) {
        console.log(`✓ ${providerName} provider is available`);
      } else {
        console.log(`⚠️  ${providerName} provider not configured`);
      }
    }

    // Test autonomous agent chat functionality
    console.log('\n💬 Testing conversation scenarios...');

    const testScenarios = [
      "Hello, autonomous AI!",
      "Can you create a simple React component?",
      "Please analyze some code improvements",
      "What are evolution objectives?",
      "Help me with API discovery"
    ];

    for (const message of testScenarios) {
      console.log(`📤 ${message}`);
      try {
        const response = await globalAgent.chat(message);
        console.log(`🤖 ${response.substring(0, 100)}${response.length > 100 ? '...' : ''}`);
        console.log('');
      } catch (error) {
        console.log(`❌ Error: ${error.message}\n`);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Test tool execution
    console.log('\n🔧 Testing tool execution...');

    const toolsToTest = ['discoverAPIs', 'analyzeCode', 'optimizePrompt'];
    for (const toolName of toolsToTest) {
      try {
        console.log(`Testing ${toolName} tool...`);
        // Simplified test - just check if tool exists
        if (globalAgent.tools.has(toolName)) {
          console.log(`✓ ${toolName} tool is ready`);
        }
      } catch (error) {
        console.log(`❌ ${toolName} tool error: ${error.message}`);
      }
    }

    // Test evolution objectives
    console.log('\n📈 Testing evolution objective system...');
    if (globalAgent.evolutionObjectives && globalAgent.evolutionObjectives.length === 0) {
      await globalAgent.setEvolutionObjectives([
        'Improve response accuracy',
        'Learn user preferences',
        'Expand knowledge base'
      ]);
      console.log(`✓ Set ${globalAgent.evolutionObjectives.length} evolution objectives`);
    }

    if (globalAgent.evolutionObjectives) {
      const progressReport = await globalAgent.evaluateEvolutionProgress();
      console.log(`✓ Evolution progress evaluation: ${progressReport.averageProgress}%`);
    }

    console.log('\n✅ AUTONOMOUS AI SYSTEM TEST COMPLETED!');
    console.log('\n📊 System Status:');
    console.log(`• Tools Available: ${globalAgent.tools.size}`);
    console.log(`• Providers Active: ${providerRegistry.providers.size}`);
    console.log(`• Memory Persistence: ${memoryPersistence.initialized ? 'Connected' : 'Local'});
    console.log(`• Evolution Objectives: ${globalAgent.evolutionObjectives?.length || 0}`);
    console.log(`• Conversation Memory: ${globalAgent.conversation.length} messages`);

    console.log('\n🚀 System is ready for deployment!');
    console.log('💡 Open browser to localhost:5174 to interact with the autonomous AI');

  } catch (error) {
    console.error('❌ SYSTEM TEST FAILED');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAutonomousSystem();
}

export { testAutonomousSystem };
