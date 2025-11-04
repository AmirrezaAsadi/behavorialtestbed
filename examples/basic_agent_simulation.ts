/**
 * Basic Agent Simulation Example
 * 
 * This example demonstrates how to use the new agent system
 * Run this to see true multi-agent behavior in action
 */

import { AgentSimulationManager } from '../lib/agents/AgentSimulationManager';
import { Persona } from '../lib/types';
import OpenAI from 'openai';

// Mock LLM client for testing (replace with real client)
const mockLLMClient = {
  chat: {
    completions: {
      create: async (params: any) => {
        // Simple mock responses for demonstration
        const prompt = params.messages[params.messages.length - 1].content;
        
        if (prompt.includes('threat')) {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  is_threat: true,
                  threat_type: 'phishing',
                  severity: 0.7,
                  confidence: 0.8,
                  reasoning: 'Suspicious email pattern detected',
                  countermeasures: ['verify_sender', 'report_incident'],
                  indicators: ['suspicious_domain', 'urgent_language']
                })
              }
            }]
          };
        }
        
        if (prompt.includes('action')) {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  type: 'warn_others',
                  target: null,
                  parameters: {},
                  reasoning: 'Detected threat requires warning other users',
                  expected_outcome: 'Improved security awareness',
                  risk_assessment: 0.2
                })
              }
            }]
          };
        }
        
        return {
          choices: [{
            message: {
              content: JSON.stringify({
                detected: false
              })
            }
          }]
        };
      }
    }
  }
};

// Create example personas
function createExamplePersonas(): Persona[] {
  return [
    {
      id: 'security_expert_001',
      name: 'Alice Security',
      type: 'SECURITY_PRACTITIONER',
      subtype: 'security_expert',
      skills: {
        technical_expertise: 5,
        privacy_concern: 4,
        risk_tolerance: 2,
        security_awareness: 5
      },
      motivation: 'Protect organization from security threats',
      background: 'Senior security analyst with 10 years experience'
    },
    {
      id: 'threat_actor_001',
      name: 'Bob Malicious',
      type: 'THREAT_ACTOR',
      subtype: 'social_engineer',
      skills: {
        technical_expertise: 3,
        privacy_concern: 1,
        risk_tolerance: 4,
        security_awareness: 4
      },
      motivation: 'Gain unauthorized access to sensitive information',
      background: 'Experienced social engineer targeting corporate environments'
    },
    {
      id: 'regular_user_001',
      name: 'Carol Normal',
      type: 'REGULAR_USER',
      subtype: 'office_worker',
      skills: {
        technical_expertise: 2,
        privacy_concern: 3,
        risk_tolerance: 3,
        security_awareness: 2
      },
      motivation: 'Complete daily work tasks efficiently',
      background: 'Marketing coordinator with basic technical skills'
    }
  ];
}

// Create example scenario
function createExampleScenario(): any {
  return {
    title: 'Email Security Simulation',
    description: 'Agents interact in an email-based security scenario',
    workflow_steps: [
      {
        id: 'step_1',
        title: 'Email Reception',
        description: 'Agents receive and process incoming emails',
        context: 'Multiple emails arrive including legitimate and suspicious messages'
      },
      {
        id: 'step_2',
        title: 'Threat Assessment',
        description: 'Agents assess potential security threats',
        context: 'Agents analyze emails for security risks and make decisions'
      },
      {
        id: 'step_3',
        title: 'Response Actions',
        description: 'Agents take appropriate response actions',
        context: 'Agents implement security measures and communicate with others'
      }
    ]
  };
}

// Main simulation function
async function runBasicAgentSimulation() {
  console.log('🚀 Starting Basic Agent Simulation Example');
  console.log('==========================================');

  try {
    // Create personas and scenario
    const personas = createExamplePersonas();
    const scenario = createExampleScenario();

    console.log(`📊 Created ${personas.length} personas:`);
    personas.forEach(p => {
      console.log(`   • ${p.name} (${p.type}): ${p.motivation}`);
    });

    // Configure simulation
    const config = {
      enable_concurrent_execution: true,
      enable_emergent_behaviors: true,
      simulation_duration_ms: 30000, // 30 seconds for demo
      max_agent_cycles: 20,
      environment_update_interval: 2000,
      message_passing_enabled: true,
      learning_enabled: true,
      threat_generation_enabled: true
    };

    console.log('\n⚙️ Simulation Configuration:');
    console.log(`   • Duration: ${config.simulation_duration_ms / 1000} seconds`);
    console.log(`   • Max Cycles: ${config.max_agent_cycles}`);
    console.log(`   • Concurrent Execution: ${config.enable_concurrent_execution}`);
    console.log(`   • Emergent Behaviors: ${config.enable_emergent_behaviors}`);

    // Create simulation manager
    const simulationManager = new AgentSimulationManager(scenario, mockLLMClient, config);

    // Create agents
    console.log('\n🤖 Creating agents...');
    await simulationManager.createAgents(personas);

    // Run simulation
    console.log('\n▶️ Starting simulation...');
    const startTime = Date.now();
    
    const result = await simulationManager.runSimulation();
    
    const executionTime = Date.now() - startTime;

    // Display results
    console.log('\n✅ Simulation completed!');
    console.log('========================');
    console.log(`⏱️ Execution Time: ${executionTime}ms`);
    console.log(`📊 Success: ${result.success}`);

    if (result.success) {
      console.log('\n📈 Results Summary:');
      console.log(`   • Total Outputs: ${result.simulation_outputs.length}`);
      console.log(`   • Agent Interactions: ${result.agent_interactions.length}`);
      console.log(`   • Emergent Behaviors: ${result.emergent_behaviors.length}`);
      console.log(`   • Environment Events: ${result.environment_events.length}`);

      console.log('\n🎯 Metrics:');
      console.log(`   • Total Agent Cycles: ${result.metrics.total_agent_cycles}`);
      console.log(`   • Total Interactions: ${result.metrics.total_interactions}`);
      console.log(`   • Threats Generated: ${result.metrics.threats_generated}`);
      console.log(`   • Security Incidents: ${result.metrics.security_incidents}`);
      console.log(`   • Average Activity: ${result.metrics.average_agent_activity.toFixed(2)} cycles/sec`);

      // Show some example interactions
      if (result.agent_interactions.length > 0) {
        console.log('\n💬 Sample Agent Interactions:');
        result.agent_interactions.slice(0, 3).forEach((interaction, i) => {
          console.log(`   ${i + 1}. ${interaction.initiator_id} → ${interaction.target_id}`);
          console.log(`      Type: ${interaction.interaction_type}`);
          console.log(`      Outcome: ${interaction.outcome}`);
          console.log(`      Influence: ${interaction.influence_applied.toFixed(2)}`);
        });
      }

      // Show emergent behaviors
      if (result.emergent_behaviors.length > 0) {
        console.log('\n🌟 Emergent Behaviors Detected:');
        result.emergent_behaviors.forEach((behavior, i) => {
          console.log(`   ${i + 1}. ${behavior.type}: ${behavior.description}`);
          console.log(`      Participants: ${behavior.participants.join(', ')}`);
          console.log(`      Strength: ${behavior.strength.toFixed(2)}`);
        });
      }

      // Show some example outputs
      if (result.simulation_outputs.length > 0) {
        console.log('\n📝 Sample Agent Actions:');
        result.simulation_outputs.slice(0, 3).forEach((output, i) => {
          console.log(`   ${i + 1}. ${output.persona_name}: ${output.action}`);
          console.log(`      Reasoning: ${output.reasoning}`);
          console.log(`      Confidence: ${output.confidence.toFixed(2)}`);
        });
      }

    } else {
      console.log(`❌ Simulation failed: ${result.error}`);
    }

  } catch (error) {
    console.error('❌ Simulation error:', error);
  }

  console.log('\n🎉 Example completed!');
  console.log('To run with real LLM, replace mockLLMClient with actual OpenAI/Grok client');
}

// Run the example
if (require.main === module) {
  runBasicAgentSimulation();
}

export { runBasicAgentSimulation, createExamplePersonas, createExampleScenario };