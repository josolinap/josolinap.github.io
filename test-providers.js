// Quick test script for provider auto-rotation system
import { providerRegistry } from './src/lib/providers.js';

console.log('🧪 Testing Provider Auto-Rotation System');

console.log('\n📋 Registered Providers:');
providerRegistry.getAllProviders().forEach(provider => {
  const stats = providerRegistry.getProviderStats(provider.name);
  console.log(`  - ${provider.name}: health=${stats.healthScore.toFixed(2)}, cost=${provider.getCostEstimate({input: 1000, output: 1000}).toFixed(4)}`);
});

console.log('\n🎯 Testing Best Provider Selection:');
const testScenarios = [
  { task: 'Hello world', context: { budget: 'low' } },
  { task: 'Write code to implement a React component', context: { budget: 'high' } },
  { task: 'I need this done quickly', context: { speed: 'fast' } },
];

for (const { task, context } of testScenarios) {
  const provider = await providerRegistry.getBestProvider(task, context);
  console.log(`  Task: "${task}" -> ${provider.name} (${provider.config.model})`);
}

console.log('\n✅ Provider system initialized successfully!');
