/**
 * Agent Simulation Manager
 * 
 * This bridges the new agent system with the existing codebase
 * Provides a clean interface for running true multi-agent simulations
 */

import { BaseAgent } from './BaseAgent';
import { SecurityPractitionerAgent } from './SecurityPractitionerAgent';
import { ThreatActorAgent } from './ThreatActorAgent';
import { SharedEnvironment } from './SharedEnvironment';
import { Persona, SimulationOutput, EvaluationMetrics } from '../types';

export interface AgentSimulationConfig {
  enable_concurrent_execution: boolean;
  enable_emergent_behaviors: boolean;
  simulation_duration_ms: number;
  max_agent_cycles: number;
  environment_update_interval: number;
  message_passing_enabled: boolean;
  learning_enabled: boolean;
  threat_generation_enabled: boolean;
}

export interface AgentSimulationResult {
  success: boolean;
  simulation_outputs: SimulationOutput[];
  agent_interactions: AgentInteractionLog[];
  emergent_behaviors: any[];
  environment_events: any[];
  metrics: AgentSimulationMetrics;
  error?: string;
}

export interface AgentInteractionLog {
  id: string;
  timestamp: Date;
  initiator_id: string;
  target_id: string;
  interaction_type: string;
  content: any;
  outcome: string;
  influence_applied: number;
}

export interface AgentSimulationMetrics {
  total_agent_cycles: number;
  total_interactions: number;
  emergent_behaviors_detected: number;
  threats_generated: number;
  security_incidents: number;
  average_agent_activity: number;
  system_security_evolution: number[];
  goal_completion_rates: Record<string, number>;
}

/**
 * AgentSimulationManager
 * 
 * Orchestrates true multi-agent simulations with:
 * 1. Concurrent agent execution
 * 2. Dynamic environment
 * 3. Emergent behavior detection
 * 4. Real-time interaction
 */
export class AgentSimulationManager {
  private environment: SharedEnvironment;
  private agents: Map<string, BaseAgent> = new Map();
  private simulation_config: AgentSimulationConfig;
  private is_running: boolean = false;
  private start_time: Date | null = null;
  private interaction_logs: AgentInteractionLog[] = [];
  private metrics: AgentSimulationMetrics;

  constructor(
    private scenario: any,
    private llmClient: any,
    config?: Partial<AgentSimulationConfig>
  ) {
    this.simulation_config = {
      enable_concurrent_execution: true,
      enable_emergent_behaviors: true,
      simulation_duration_ms: 300000, // 5 minutes default
      max_agent_cycles: 100,
      environment_update_interval: 2000,
      message_passing_enabled: true,
      learning_enabled: true,
      threat_generation_enabled: true,
      ...config
    };

    this.environment = new SharedEnvironment(scenario, llmClient);
    this.initializeMetrics();
    this.setupEventListeners();
  }

  private initializeMetrics(): void {
    this.metrics = {
      total_agent_cycles: 0,
      total_interactions: 0,
      emergent_behaviors_detected: 0,
      threats_generated: 0,
      security_incidents: 0,
      average_agent_activity: 0,
      system_security_evolution: [],
      goal_completion_rates: {}
    };
  }

  private setupEventListeners(): void {
    // Environment events
    this.environment.on('threat_generated', (event) => {
      this.metrics.threats_generated++;
    });

    this.environment.on('emergent_behavior_detected', (event) => {
      this.metrics.emergent_behaviors_detected++;
    });

    this.environment.on('message_sent', (event) => {
      this.metrics.total_interactions++;
      this.logInteraction(event.message);
    });

    this.environment.on('security_measure_implemented', (event) => {
      this.metrics.security_incidents++;
    });
  }

  /**
   * Create agents from personas
   */
  public async createAgents(personas: Persona[]): Promise<void> {
    for (const persona of personas) {
      let agent: BaseAgent;

      // Create appropriate agent type based on persona
      switch (persona.type) {
        case 'SECURITY_PRACTITIONER':
          agent = new SecurityPractitionerAgent(persona, this.llmClient, this.environment);
          break;
        case 'THREAT_ACTOR':
          agent = new ThreatActorAgent(persona, this.llmClient, this.environment);
          break;
        case 'REGULAR_USER':
          // TODO: Implement RegularUserAgent
          agent = new SecurityPractitionerAgent(persona, this.llmClient, this.environment); // Temporary
          break;
        default:
          throw new Error(`Unknown persona type: ${persona.type}`);
      }

      // Set up agent event listeners
      this.setupAgentEventListeners(agent);

      // Register agent with environment and manager
      this.agents.set(agent.getId(), agent);
      this.environment.registerAgent(agent);
    }

    console.log(`Created ${this.agents.size} agents for simulation`);
  }

  private setupAgentEventListeners(agent: BaseAgent): void {
    agent.on('action_taken', (event) => {
      this.metrics.total_agent_cycles++;
    });

    agent.on('goal_completed', (event) => {
      const agentId = event.agent_id;
      if (!this.metrics.goal_completion_rates[agentId]) {
        this.metrics.goal_completion_rates[agentId] = 0;
      }
      this.metrics.goal_completion_rates[agentId]++;
    });

    agent.on('agent_error', (event) => {
      console.error(`Agent ${event.agent_id} error:`, event.error);
    });
  }

  /**
   * Run the multi-agent simulation
   */
  public async runSimulation(): Promise<AgentSimulationResult> {
    try {
      console.log('Starting multi-agent simulation...');
      this.is_running = true;
      this.start_time = new Date();

      // Start the environment
      await this.environment.start();

      // Start monitoring and metrics collection
      const metricsCollector = this.startMetricsCollection();

      // Wait for simulation duration or max cycles
      await this.waitForSimulationCompletion();

      // Stop everything
      await this.environment.stop();
      clearInterval(metricsCollector);

      console.log('Multi-agent simulation completed');

      // Generate simulation outputs in the expected format
      const simulationOutputs = await this.generateSimulationOutputs();

      return {
        success: true,
        simulation_outputs: simulationOutputs,
        agent_interactions: this.interaction_logs,
        emergent_behaviors: this.environment.getEmergentBehaviors(),
        environment_events: this.environment.getEventHistory(),
        metrics: this.metrics
      };

    } catch (error) {
      console.error('Simulation failed:', error);
      return {
        success: false,
        simulation_outputs: [],
        agent_interactions: [],
        emergent_behaviors: [],
        environment_events: [],
        metrics: this.metrics,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      this.is_running = false;
    }
  }

  private startMetricsCollection(): NodeJS.Timeout {
    return setInterval(async () => {
      // Collect system security level over time
      const environmentState = await this.environment.getState();
      this.metrics.system_security_evolution.push(environmentState.system_security_level);

      // Calculate average agent activity
      const totalCycles = this.metrics.total_agent_cycles;
      const elapsedTime = Date.now() - (this.start_time?.getTime() || Date.now());
      this.metrics.average_agent_activity = totalCycles / (elapsedTime / 1000); // cycles per second

    }, this.simulation_config.environment_update_interval);
  }

  private async waitForSimulationCompletion(): Promise<void> {
    const startTime = Date.now();
    const maxDuration = this.simulation_config.simulation_duration_ms;
    const maxCycles = this.simulation_config.max_agent_cycles;

    while (this.is_running) {
      const elapsed = Date.now() - startTime;
      
      // Check termination conditions
      if (elapsed >= maxDuration) {
        console.log('Simulation completed: Maximum duration reached');
        break;
      }

      if (this.metrics.total_agent_cycles >= maxCycles) {
        console.log('Simulation completed: Maximum cycles reached');
        break;
      }

      // Check if all agents are idle (no more meaningful activity)
      const activeAgents = Array.from(this.agents.values()).filter(agent => 
        agent.getState() !== 'idle' && agent.getState() !== 'suspended'
      );

      if (activeAgents.length === 0) {
        console.log('Simulation completed: All agents idle');
        break;
      }

      // Wait a bit before checking again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private async generateSimulationOutputs(): Promise<SimulationOutput[]> {
    const outputs: SimulationOutput[] = [];
    let outputId = 1;

    // Generate outputs from agent interactions and decisions
    for (const interaction of this.interaction_logs) {
      const initiatorAgent = this.agents.get(interaction.initiator_id);
      const targetAgent = this.agents.get(interaction.target_id);

      if (initiatorAgent) {
        const output: SimulationOutput = {
          id: `output_${outputId++}`,
          persona_id: interaction.initiator_id,
          persona_name: initiatorAgent.getName(),
          step: Math.floor(outputId / this.agents.size) + 1,
          action: this.translateInteractionToAction(interaction),
          reasoning: this.generateReasoningFromInteraction(interaction),
          security_assessment: this.generateSecurityAssessment(interaction),
          confidence: 0.8, // Agent-based actions have high confidence
          timestamp: interaction.timestamp.toISOString(),
          vulnerabilities_found: this.extractVulnerabilitiesFromInteraction(interaction),
          persona_characteristics_displayed: this.extractCharacteristicsFromAgent(initiatorAgent),
          interactions_initiated: [interaction],
          influence_applied: interaction.influence_applied
        };

        outputs.push(output);
      }
    }

    // Add outputs for solo agent actions (non-interactive)
    for (const [agentId, agent] of this.agents.entries()) {
      const agentDecisions = this.getAgentDecisions(agent);
      
      for (const decision of agentDecisions) {
        const output: SimulationOutput = {
          id: `output_${outputId++}`,
          persona_id: agentId,
          persona_name: agent.getName(),
          step: Math.floor(outputId / this.agents.size) + 1,
          action: decision.chosen_option,
          reasoning: decision.reasoning,
          security_assessment: this.generateSecurityAssessmentFromDecision(decision),
          confidence: decision.confidence,
          timestamp: decision.timestamp.toISOString(),
          persona_characteristics_displayed: this.extractCharacteristicsFromAgent(agent)
        };

        outputs.push(output);
      }
    }

    return outputs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private translateInteractionToAction(interaction: AgentInteractionLog): string {
    const actionMap: Record<string, string> = {
      'threat': 'warn_about_threat',
      'inform': 'share_information',
      'request': 'request_assistance',
      'social_engineering': 'attempt_social_engineering',
      'phishing': 'send_phishing_message',
      'trust_building': 'build_trust_relationship'
    };

    return actionMap[interaction.interaction_type] || interaction.interaction_type;
  }

  private generateReasoningFromInteraction(interaction: AgentInteractionLog): string {
    const reasoningTemplates: Record<string, string> = {
      'threat': 'Detected a security threat and decided to warn other users to prevent potential harm',
      'inform': 'Sharing relevant security information to improve overall system awareness',
      'request': 'Requesting assistance or information to better handle the current security situation',
      'social_engineering': 'Attempting to manipulate the target through psychological techniques',
      'phishing': 'Sending deceptive message to harvest credentials or install malware',
      'trust_building': 'Building rapport and trust to enable future exploitation opportunities'
    };

    return reasoningTemplates[interaction.interaction_type] || 
           `Initiated ${interaction.interaction_type} interaction based on current goals and situation assessment`;
  }

  private generateSecurityAssessment(interaction: AgentInteractionLog): string {
    const riskLevels = ['Low', 'Medium', 'High', 'Critical'];
    const riskLevel = riskLevels[Math.min(3, Math.floor(interaction.influence_applied * 4))];
    
    if (interaction.interaction_type === 'threat' || interaction.interaction_type === 'inform') {
      return `${riskLevel} risk - Defensive action to improve security posture`;
    } else if (interaction.interaction_type.includes('engineering') || interaction.interaction_type.includes('phishing')) {
      return `${riskLevel} risk - Offensive action that could compromise security`;
    } else {
      return `${riskLevel} risk - Neutral interaction with potential security implications`;
    }
  }

  private generateSecurityAssessmentFromDecision(decision: any): string {
    const riskLevel = decision.confidence > 0.8 ? 'Low' : decision.confidence > 0.5 ? 'Medium' : 'High';
    return `${riskLevel} risk - ${decision.reasoning}`;
  }

  private extractVulnerabilitiesFromInteraction(interaction: AgentInteractionLog): string[] {
    const vulnerabilities: string[] = [];
    
    if (interaction.interaction_type === 'social_engineering') {
      vulnerabilities.push('Social engineering susceptibility');
    }
    
    if (interaction.interaction_type === 'phishing') {
      vulnerabilities.push('Phishing vulnerability', 'Credential harvesting risk');
    }
    
    if (interaction.outcome.includes('successful')) {
      vulnerabilities.push('Trust exploitation vulnerability');
    }
    
    return vulnerabilities;
  }

  private extractCharacteristicsFromAgent(agent: BaseAgent): any {
    const persona = agent.getPersona();
    return {
      technical_expertise: persona.skills.technical_expertise,
      privacy_concern: persona.skills.privacy_concern,
      risk_tolerance: persona.skills.risk_tolerance,
      security_awareness: persona.skills.security_awareness
    };
  }

  private getAgentDecisions(agent: BaseAgent): any[] {
    // This would need to be exposed by the BaseAgent class
    // For now, return empty array
    return [];
  }

  private logInteraction(message: any): void {
    const interaction: AgentInteractionLog = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(message.timestamp),
      initiator_id: message.from,
      target_id: Array.isArray(message.to) ? message.to[0] : message.to,
      interaction_type: message.type,
      content: message.content,
      outcome: 'pending', // Would be updated when response is received
      influence_applied: message.priority / 10 // Rough approximation
    };

    this.interaction_logs.push(interaction);

    // Keep only recent interactions
    if (this.interaction_logs.length > 1000) {
      this.interaction_logs = this.interaction_logs.slice(-500);
    }
  }

  /**
   * Calculate evaluation metrics compatible with existing system
   */
  public calculateEvaluationMetrics(personas: Persona[]): EvaluationMetrics {
    // Build action matrix from interactions
    const actionMatrix: Record<string, Record<string, number>> = {};
    
    for (const interaction of this.interaction_logs) {
      if (!actionMatrix[interaction.initiator_id]) {
        actionMatrix[interaction.initiator_id] = {};
      }
      
      const actionKey = interaction.interaction_type;
      actionMatrix[interaction.initiator_id][actionKey] = 
        (actionMatrix[interaction.initiator_id][actionKey] || 0) + 1;
    }

    // Calculate behavioral diversity (Shannon entropy)
    const behavioralDiversity = this.calculateShannonEntropy(actionMatrix);

    // Calculate persona fidelity scores
    const personaFidelityScores: Record<string, number> = {};
    for (const persona of personas) {
      // This would need actual assessment of displayed vs. predefined characteristics
      personaFidelityScores[persona.id] = 0.8; // Placeholder
    }

    // Extract vulnerabilities from interactions
    const vulnerabilities = this.interaction_logs
      .filter(i => i.interaction_type.includes('engineering') || i.interaction_type.includes('phishing'))
      .map((i, index) => ({
        type: i.interaction_type,
        severity: i.influence_applied > 0.7 ? 'high' : i.influence_applied > 0.4 ? 'medium' : 'low',
        persona_id: i.initiator_id,
        step: index + 1
      }));

    return {
      persona_fidelity_index: Object.values(personaFidelityScores).reduce((a, b) => a + b, 0) / personas.length,
      behavioral_diversity_index: behavioralDiversity,
      vulnerability_discovery_rate: vulnerabilities.length,
      persona_fidelity_scores: personaFidelityScores,
      action_entropy: behavioralDiversity,
      action_matrix: actionMatrix,
      vulnerability_detection_rate: {
        unique_vulnerabilities: new Set(vulnerabilities.map(v => v.type)).size,
        critical_count: vulnerabilities.filter(v => v.severity === 'critical').length,
        discovery_scores: personaFidelityScores, // Reuse for now
        vulnerabilities_detail: vulnerabilities
      }
    };
  }

  private calculateShannonEntropy(actionMatrix: Record<string, Record<string, number>>): number {
    const allPersonas = Object.keys(actionMatrix);
    if (allPersonas.length < 2) return 0;

    const allActions = new Set<string>();
    Object.values(actionMatrix).forEach(personaActions => {
      Object.keys(personaActions).forEach(action => allActions.add(action));
    });

    if (allActions.size === 0) return 0;

    let entropy = 0;
    const totalPersonas = allPersonas.length;

    for (const action of allActions) {
      const personasPerformingAction = allPersonas.filter(personaId => 
        (actionMatrix[personaId][action] || 0) > 0
      ).length;

      const proportion = personasPerformingAction / totalPersonas;
      if (proportion > 0) {
        entropy -= proportion * Math.log2(proportion);
      }
    }

    return entropy;
  }

  /**
   * Get real-time simulation status
   */
  public getSimulationStatus(): any {
    return {
      is_running: this.is_running,
      elapsed_time: this.start_time ? Date.now() - this.start_time.getTime() : 0,
      active_agents: Array.from(this.agents.values()).filter(a => a.getState() !== 'suspended').length,
      total_interactions: this.metrics.total_interactions,
      emergent_behaviors: this.metrics.emergent_behaviors_detected,
      system_metrics: this.environment.getSystemMetrics()
    };
  }

  /**
   * Stop the simulation gracefully
   */
  public async stopSimulation(): Promise<void> {
    this.is_running = false;
    await this.environment.stop();
  }
}