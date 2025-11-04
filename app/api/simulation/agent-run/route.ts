/**
 * Enhanced Agent-Based Simulation API
 * 
 * This endpoint uses the new true multi-agent system instead of the old sequential approach
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AgentSimulationManager, AgentSimulationConfig } from '../../../../lib/agents/AgentSimulationManager';
import { Persona } from '../../../../lib/types';

// Initialize AI client
async function initializeAIClient() {
  try {
    let aiClient;
    
    // Prefer xAI Grok if available
    if (process.env.XAI_API_KEY) {
      aiClient = new OpenAI({
        apiKey: process.env.XAI_API_KEY,
        baseURL: 'https://api.x.ai/v1',
      });
      console.log('Using Grok AI (xAI) for agent simulations');
      return aiClient;
    }
    
    // Fallback to OpenAI if available
    if (process.env.OPENAI_API_KEY) {
      aiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('Using OpenAI for agent simulations');
      return aiClient;
    }
    
    throw new Error('No AI API key found');
  } catch (error) {
    console.error('Failed to initialize AI client:', error);
    return null;
  }
}

interface AgentSimulationRequest {
  personas: Persona[];
  scenario: any;
  timeline_scope: string;
  speed: number;
  config?: {
    allow_free_form_actions?: boolean;
    action_exploration_mode?: boolean;
    threat_discovery_focus?: boolean;
    behavioral_diversity_weight?: number;
    // New agent-specific config
    simulation_duration_minutes?: number;
    enable_emergent_behaviors?: boolean;
    enable_learning?: boolean;
    max_agent_interactions?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AgentSimulationRequest = await request.json();
    const { personas, scenario, timeline_scope, speed, config } = body;

    console.log('🚀 Starting Enhanced Agent-Based Simulation');
    console.log(`📊 Personas: ${personas.length}, Scenario: ${scenario.title}`);

    // Initialize AI client
    const aiClient = await initializeAIClient();
    if (!aiClient) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set XAI_API_KEY or OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Validate inputs
    if (!scenario || !scenario.workflow_steps || scenario.workflow_steps.length === 0) {
      return NextResponse.json(
        { error: 'Scenario is required. Please create a scenario using the scenario builder.' },
        { status: 400 }
      );
    }

    if (!personas || personas.length === 0) {
      return NextResponse.json(
        { error: 'At least one persona is required for simulation.' },
        { status: 400 }
      );
    }

    // Configure agent simulation
    const agentConfig: AgentSimulationConfig = {
      enable_concurrent_execution: true,
      enable_emergent_behaviors: config?.enable_emergent_behaviors ?? true,
      simulation_duration_ms: (config?.simulation_duration_minutes ?? 5) * 60 * 1000,
      max_agent_cycles: config?.max_agent_interactions ?? 50,
      environment_update_interval: Math.max(1000, 3000 / speed), // Faster updates for higher speed
      message_passing_enabled: true,
      learning_enabled: config?.enable_learning ?? true,
      threat_generation_enabled: config?.threat_discovery_focus ?? true
    };

    console.log('⚙️ Agent Configuration:', {
      concurrent_execution: agentConfig.enable_concurrent_execution,
      emergent_behaviors: agentConfig.enable_emergent_behaviors,
      duration_minutes: agentConfig.simulation_duration_ms / 60000,
      max_cycles: agentConfig.max_agent_cycles
    });

    // Create and configure simulation manager
    const simulationManager = new AgentSimulationManager(scenario, aiClient, agentConfig);

    // Create agents from personas
    await simulationManager.createAgents(personas);
    console.log('🤖 Created agents for all personas');

    // Run the simulation
    console.log('▶️ Starting multi-agent simulation...');
    const startTime = Date.now();
    
    const simulationResult = await simulationManager.runSimulation();
    
    const executionTime = Date.now() - startTime;
    console.log(`✅ Simulation completed in ${executionTime}ms`);

    if (!simulationResult.success) {
      return NextResponse.json(
        { 
          error: 'Simulation failed', 
          details: simulationResult.error,
          partial_results: simulationResult 
        },
        { status: 500 }
      );
    }

    // Calculate evaluation metrics
    const evaluationMetrics = simulationManager.calculateEvaluationMetrics(personas);

    // Prepare response in format compatible with existing UI
    const response = {
      success: true,
      outputs: simulationResult.simulation_outputs,
      metrics: {
        total_personas: personas.length,
        total_steps: Math.max(...simulationResult.simulation_outputs.map(o => o.step), 0),
        average_confidence: simulationResult.simulation_outputs.reduce((sum, o) => sum + o.confidence, 0) / simulationResult.simulation_outputs.length,
        behavioral_diversity: evaluationMetrics.behavioral_diversity_index,
        vulnerability_discoveries: evaluationMetrics.vulnerability_discovery_rate,
        execution_time: `${executionTime}ms`,
        persona_fidelity_scores: evaluationMetrics.persona_fidelity_scores,
        // Enhanced metrics from agent system
        total_interactions: simulationResult.metrics.total_interactions,
        emergent_behaviors_detected: simulationResult.metrics.emergent_behaviors_detected,
        threats_generated: simulationResult.metrics.threats_generated,
        security_incidents: simulationResult.metrics.security_incidents,
        agent_activity_rate: simulationResult.metrics.average_agent_activity
      },
      scenario_used: scenario.title,
      // Additional agent-specific data
      agent_interactions: simulationResult.agent_interactions,
      emergent_behaviors: simulationResult.emergent_behaviors,
      environment_events: simulationResult.environment_events,
      evaluation_metrics: evaluationMetrics
    };

    console.log('📈 Simulation Results Summary:');
    console.log(`   • Total Outputs: ${response.outputs.length}`);
    console.log(`   • Agent Interactions: ${response.agent_interactions.length}`);
    console.log(`   • Emergent Behaviors: ${response.emergent_behaviors.length}`);
    console.log(`   • Behavioral Diversity: ${evaluationMetrics.behavioral_diversity_index.toFixed(3)}`);
    console.log(`   • Vulnerabilities Found: ${evaluationMetrics.vulnerability_discovery_rate}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Agent simulation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Simulation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'Agent Simulation API Ready',
    features: [
      'Concurrent agent execution',
      'Emergent behavior detection',
      'Dynamic environment simulation',
      'Real-time agent interactions',
      'Goal-driven decision making',
      'Learning and adaptation',
      'Threat generation and response'
    ],
    ai_providers: {
      xai_available: !!process.env.XAI_API_KEY,
      openai_available: !!process.env.OPENAI_API_KEY
    }
  });
}