/**
 * Shared Environment - The world where agents interact
 * 
 * This is crucial for true multi-agent behavior:
 * 1. Provides shared state that all agents can perceive and modify
 * 2. Handles message passing between agents
 * 3. Tracks emergent behaviors and system-wide changes
 * 4. Simulates realistic system dynamics
 */

import { EventEmitter } from 'events';
import { BaseAgent, AgentMessage, EnvironmentEvent } from './BaseAgent';

export interface EnvironmentState {
  current_scenario: string;
  system_security_level: number; // 0-1
  active_threats: ThreatEvent[];
  system_vulnerabilities: VulnerabilityInfo[];
  user_activities: UserActivity[];
  network_traffic: NetworkEvent[];
  security_incidents: SecurityIncident[];
  system_alerts: SystemAlert[];
  timestamp: Date;
}

export interface ThreatEvent {
  id: string;
  type: 'phishing' | 'malware' | 'social_engineering' | 'data_breach' | 'unauthorized_access';
  severity: number; // 0-1
  source: string;
  target?: string;
  payload: any;
  timestamp: Date;
  status: 'active' | 'mitigated' | 'escalated';
  detection_confidence: number;
}

export interface VulnerabilityInfo {
  id: string;
  type: string;
  severity: number;
  location: string;
  description: string;
  exploitable: boolean;
  patch_available: boolean;
  discovered_by: string;
  timestamp: Date;
}

export interface UserActivity {
  user_id: string;
  action: string;
  target: string;
  timestamp: Date;
  risk_score: number;
  context: any;
}

export interface NetworkEvent {
  id: string;
  source_ip: string;
  destination_ip: string;
  protocol: string;
  payload_size: number;
  suspicious: boolean;
  timestamp: Date;
}

export interface SecurityIncident {
  id: string;
  type: string;
  severity: number;
  affected_users: string[];
  timeline: Date[];
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  assigned_to?: string;
}

export interface SystemAlert {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  source: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledged_by?: string;
}

export interface EmergentBehavior {
  id: string;
  type: string;
  description: string;
  participants: string[];
  emergence_time: Date;
  strength: number; // How pronounced the behavior is
  duration: number; // How long it's been observed
  impact: string;
}

/**
 * SharedEnvironment - The dynamic world where agents operate
 * 
 * Key features:
 * 1. Dynamic state that changes based on agent actions
 * 2. Realistic threat simulation
 * 3. Message passing infrastructure
 * 4. Emergent behavior detection
 * 5. System-wide metrics and monitoring
 */
export class SharedEnvironment extends EventEmitter {
  private state!: EnvironmentState;
  private agents: Map<string, BaseAgent> = new Map();
  private message_history: AgentMessage[] = [];
  private event_history: EnvironmentEvent[] = [];
  private emergent_behaviors: EmergentBehavior[] = [];
  private threat_generator: ThreatGenerator;
  private behavior_analyzer: BehaviorAnalyzer;
  private is_running: boolean = false;
  private simulation_speed: number = 1.0;

  constructor(private scenario: any, private llmClient: any) {
    super();
    this.initializeEnvironment();
    this.threat_generator = new ThreatGenerator(this.llmClient);
    this.behavior_analyzer = new BehaviorAnalyzer();
  }

  private initializeEnvironment(): void {
    this.state = {
      current_scenario: this.scenario.title,
      system_security_level: 0.7, // Start with moderate security
      active_threats: [],
      system_vulnerabilities: this.generateInitialVulnerabilities(),
      user_activities: [],
      network_traffic: [],
      security_incidents: [],
      system_alerts: [],
      timestamp: new Date()
    };
  }

  private generateInitialVulnerabilities(): VulnerabilityInfo[] {
    // Generate realistic vulnerabilities based on scenario
    return [
      {
        id: 'vuln_001',
        type: 'email_spoofing',
        severity: 0.6,
        location: 'email_system',
        description: 'Email headers can be spoofed to impersonate trusted senders',
        exploitable: true,
        patch_available: false,
        discovered_by: 'system',
        timestamp: new Date()
      },
      {
        id: 'vuln_002',
        type: 'attachment_scanning',
        severity: 0.4,
        location: 'email_gateway',
        description: 'Attachment scanning has gaps for certain file types',
        exploitable: true,
        patch_available: true,
        discovered_by: 'system',
        timestamp: new Date()
      }
    ];
  }

  // Agent Management
  public registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.getId(), agent);
    
    // Set up event listeners for agent actions
    agent.on('action_taken', (event) => this.handleAgentAction(event));
    agent.on('message_sent', (event) => this.handleAgentMessage(event));
    
    this.emit('agent_registered', { agent_id: agent.getId(), timestamp: new Date() });
  }

  public unregisterAgent(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.removeAllListeners();
      this.agents.delete(agentId);
      this.emit('agent_unregistered', { agent_id: agentId, timestamp: new Date() });
    }
  }

  // Environment Lifecycle
  public async start(): Promise<void> {
    this.is_running = true;
    this.emit('environment_started', { timestamp: new Date() });
    
    // Start all registered agents
    for (const agent of this.agents.values()) {
      await agent.start();
    }
    
    // Start environment dynamics
    this.startEnvironmentLoop();
  }

  public async stop(): Promise<void> {
    this.is_running = false;
    
    // Stop all agents
    for (const agent of this.agents.values()) {
      await agent.stop();
    }
    
    this.emit('environment_stopped', { timestamp: new Date() });
  }

  // Environment Dynamics Loop
  private async startEnvironmentLoop(): Promise<void> {
    while (this.is_running) {
      try {
        // Update environment state
        await this.updateEnvironmentState();
        
        // Generate new threats/events
        await this.generateEnvironmentEvents();
        
        // Analyze emergent behaviors
        await this.analyzeEmergentBehaviors();
        
        // Clean up old data
        this.cleanupOldData();
        
        // Wait based on simulation speed
        await this.sleep(1000 / this.simulation_speed);
        
      } catch (error) {
        console.error('Environment loop error:', error);
        this.emit('environment_error', { error, timestamp: new Date() });
      }
    }
  }

  private async updateEnvironmentState(): Promise<void> {
    // Update system security level based on recent activities
    const recentThreats = this.state.active_threats.filter(t => 
      Date.now() - t.timestamp.getTime() < 60000 // Last minute
    );
    
    const recentIncidents = this.state.security_incidents.filter(i => 
      i.status === 'open' || i.status === 'investigating'
    );

    // Security level decreases with active threats and incidents
    const threatImpact = recentThreats.length * 0.1;
    const incidentImpact = recentIncidents.length * 0.15;
    
    this.state.system_security_level = Math.max(0, 
      this.state.system_security_level - threatImpact - incidentImpact
    );

    // Security level slowly recovers over time
    this.state.system_security_level = Math.min(1, 
      this.state.system_security_level + 0.01
    );

    this.state.timestamp = new Date();
  }

  private async generateEnvironmentEvents(): Promise<void> {
    // Generate realistic threats and events
    const shouldGenerateThreat = Math.random() < 0.1; // 10% chance per cycle
    
    if (shouldGenerateThreat) {
      const threat = await this.threat_generator.generateThreat(this.state);
      if (threat) {
        this.state.active_threats.push(threat);
        
        // Create environment event
        const event: EnvironmentEvent = {
          id: `event_${Date.now()}`,
          type: 'threat_detected',
          timestamp: new Date(),
          source: 'environment',
          data: threat,
          relevance: threat.severity
        };
        
        this.event_history.push(event);
        this.emit('threat_generated', { threat, timestamp: new Date() });
      }
    }

    // Generate user activities
    this.generateUserActivities();
    
    // Generate network events
    this.generateNetworkEvents();
  }

  private generateUserActivities(): void {
    // Simulate background user activities
    const activities = [
      'email_received',
      'email_opened',
      'link_clicked',
      'attachment_downloaded',
      'login_attempt',
      'file_accessed',
      'system_query'
    ];

    if (Math.random() < 0.3) { // 30% chance
      const activity: UserActivity = {
        user_id: 'background_user',
        action: activities[Math.floor(Math.random() * activities.length)],
        target: 'system_resource',
        timestamp: new Date(),
        risk_score: Math.random(),
        context: { generated: true }
      };
      
      this.state.user_activities.push(activity);
    }
  }

  private generateNetworkEvents(): void {
    // Simulate network traffic
    if (Math.random() < 0.2) { // 20% chance
      const event: NetworkEvent = {
        id: `net_${Date.now()}`,
        source_ip: this.generateRandomIP(),
        destination_ip: this.generateRandomIP(),
        protocol: Math.random() > 0.5 ? 'HTTPS' : 'HTTP',
        payload_size: Math.floor(Math.random() * 10000),
        suspicious: Math.random() < 0.1, // 10% suspicious
        timestamp: new Date()
      };
      
      this.state.network_traffic.push(event);
    }
  }

  private async analyzeEmergentBehaviors(): Promise<void> {
    // Analyze agent interactions for emergent patterns
    const recentMessages = this.message_history.filter(m => 
      Date.now() - m.timestamp.getTime() < 300000 // Last 5 minutes
    );

    if (recentMessages.length >= 3) {
      const emergentBehavior = await this.behavior_analyzer.detectEmergentBehavior(
        recentMessages, 
        Array.from(this.agents.values()),
        this.llmClient
      );
      
      if (emergentBehavior) {
        this.emergent_behaviors.push(emergentBehavior);
        this.emit('emergent_behavior_detected', { behavior: emergentBehavior });
      }
    }
  }

  private cleanupOldData(): void {
    const cutoffTime = Date.now() - 600000; // 10 minutes ago
    
    // Clean up old events
    this.event_history = this.event_history.filter(e => 
      e.timestamp.getTime() > cutoffTime
    );
    
    // Clean up old messages
    this.message_history = this.message_history.filter(m => 
      m.timestamp.getTime() > cutoffTime
    );
    
    // Clean up old user activities
    this.state.user_activities = this.state.user_activities.filter(a => 
      a.timestamp.getTime() > cutoffTime
    );
    
    // Clean up old network events
    this.state.network_traffic = this.state.network_traffic.filter(n => 
      n.timestamp.getTime() > cutoffTime
    );
  }

  // Agent Interface Methods
  public async getState(): Promise<EnvironmentState> {
    return { ...this.state };
  }

  public async getVisibleAgents(requestingAgentId: string): Promise<any[]> {
    // Return information about other agents that this agent can perceive
    const visibleAgents = [];
    
    for (const [agentId, agent] of this.agents.entries()) {
      if (agentId !== requestingAgentId) {
        visibleAgents.push({
          id: agent.getId(),
          name: agent.getName(),
          type: agent.getPersona().type,
          state: agent.getState(),
          last_action: Date.now() - 30000 // Simulate last seen
        });
      }
    }
    
    return visibleAgents;
  }

  public async getRecentEvents(agentId: string): Promise<EnvironmentEvent[]> {
    // Return events relevant to this agent
    return this.event_history.filter(event => {
      // All agents can see threat events
      if (event.type === 'threat_detected') return true;
      
      // Agents can see events they're involved in
      if (event.source === agentId) return true;
      
      // High relevance events are visible to all
      if (event.relevance > 0.7) return true;
      
      return false;
    });
  }

  // Message Passing System
  public async sendMessage(message: AgentMessage): Promise<void> {
    this.message_history.push(message);
    
    // Deliver to target agent(s)
    const targets = Array.isArray(message.to) ? message.to : [message.to];
    
    for (const targetId of targets) {
      const targetAgent = this.agents.get(targetId);
      if (targetAgent) {
        targetAgent.receiveMessage(message);
      }
    }
    
    this.emit('message_sent', { message, timestamp: new Date() });
  }

  public async broadcastMessage(message: AgentMessage): Promise<void> {
    this.message_history.push(message);
    
    // Send to all agents except sender
    for (const [agentId, agent] of this.agents.entries()) {
      if (agentId !== message.from) {
        agent.receiveMessage(message);
      }
    }
    
    this.emit('message_broadcast', { message, recipients: this.agents.size - 1 });
  }

  // Security Actions
  public async implementSecurityMeasure(agentId: string, measure: string, threat: any): Promise<void> {
    // Implement security countermeasure
    const incident: SecurityIncident = {
      id: `incident_${Date.now()}`,
      type: 'countermeasure_implemented',
      severity: threat.severity,
      affected_users: [agentId],
      timeline: [new Date()],
      status: 'resolved',
      assigned_to: agentId
    };
    
    this.state.security_incidents.push(incident);
    
    // Remove or mitigate the threat
    const threatIndex = this.state.active_threats.findIndex(t => t.type === threat.type);
    if (threatIndex >= 0) {
      this.state.active_threats[threatIndex].status = 'mitigated';
    }
    
    // Improve system security level
    this.state.system_security_level = Math.min(1, this.state.system_security_level + 0.1);
    
    this.emit('security_measure_implemented', { 
      agent_id: agentId, 
      measure, 
      threat_type: threat.type 
    });
  }

  // Event Handlers
  private handleAgentAction(event: any): void {
    // Record agent action as user activity
    const activity: UserActivity = {
      user_id: event.agent_id,
      action: event.action,
      target: event.target || 'system',
      timestamp: new Date(),
      risk_score: this.assessActionRisk(event.action),
      context: event
    };
    
    this.state.user_activities.push(activity);
    
    // Generate system response if needed
    this.generateSystemResponse(event);
  }

  private handleAgentMessage(event: any): void {
    // Messages are already handled by sendMessage/broadcastMessage
    // This is for additional processing if needed
  }

  private assessActionRisk(action: string): number {
    const riskMap: Record<string, number> = {
      'click_link': 0.6,
      'download_attachment': 0.8,
      'enter_credentials': 0.9,
      'investigate_threat': 0.2,
      'warn_others': 0.1,
      'monitor_system': 0.1
    };
    
    return riskMap[action] || 0.3;
  }

  private generateSystemResponse(agentAction: any): void {
    // Generate realistic system responses to agent actions
    if (agentAction.action === 'click_link' && Math.random() < 0.1) {
      // 10% chance of malicious link
      const threat: ThreatEvent = {
        id: `threat_${Date.now()}`,
        type: 'malware',
        severity: 0.7,
        source: 'malicious_link',
        target: agentAction.agent_id,
        payload: { url: 'suspicious_url.com' },
        timestamp: new Date(),
        status: 'active',
        detection_confidence: 0.8
      };
      
      this.state.active_threats.push(threat);
    }
  }

  // Utility Methods
  private generateRandomIP(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API for monitoring and analysis
  public getEmergentBehaviors(): EmergentBehavior[] {
    return [...this.emergent_behaviors];
  }

  public getMessageHistory(): AgentMessage[] {
    return [...this.message_history];
  }

  public getEventHistory(): EnvironmentEvent[] {
    return [...this.event_history];
  }

  public getSystemMetrics(): any {
    return {
      security_level: this.state.system_security_level,
      active_threats: this.state.active_threats.length,
      active_agents: this.agents.size,
      message_count: this.message_history.length,
      emergent_behaviors: this.emergent_behaviors.length,
      system_incidents: this.state.security_incidents.length
    };
  }
}

// Helper Classes
class ThreatGenerator {
  constructor(private llmClient: any) {}

  async generateThreat(environmentState: EnvironmentState): Promise<ThreatEvent | null> {
    const threatTypes = ['phishing', 'malware', 'social_engineering', 'data_breach', 'unauthorized_access'];
    const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    
    try {
      const prompt = `
Generate a realistic ${threatType} threat for a security simulation.

Current environment:
- Security Level: ${environmentState.system_security_level}
- Active Threats: ${environmentState.active_threats.length}
- Scenario: ${environmentState.current_scenario}

Create a threat that fits the current context. Respond with JSON:
{
  "severity": 0.0-1.0,
  "source": "threat_source",
  "payload": {"key": "value"},
  "detection_confidence": 0.0-1.0,
  "description": "brief description"
}
`;

      const response = await this.llmClient.chat.completions.create({
        model: process.env.XAI_API_KEY ? 'grok-3' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Generate realistic cybersecurity threats. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      const threatData = JSON.parse(response.choices[0].message.content);
      
      return {
        id: `threat_${Date.now()}`,
        type: threatType as any,
        severity: threatData.severity,
        source: threatData.source,
        payload: threatData.payload,
        timestamp: new Date(),
        status: 'active',
        detection_confidence: threatData.detection_confidence
      };
      
    } catch (error) {
      console.error('Threat generation failed:', error);
      return null;
    }
  }
}

class BehaviorAnalyzer {
  async detectEmergentBehavior(
    messages: AgentMessage[], 
    agents: BaseAgent[], 
    llmClient: any
  ): Promise<EmergentBehavior | null> {
    
    // Look for patterns in agent interactions
    const interactions = this.analyzeInteractionPatterns(messages);
    
    if (interactions.length < 2) return null;
    
    try {
      const prompt = `
Analyze these agent interactions for emergent group behaviors:

${interactions.map(i => `- ${i.from} → ${i.to}: ${i.type} (${i.content})`).join('\n')}

Look for patterns like:
- Coordinated responses to threats
- Information sharing networks
- Trust/distrust formation
- Leadership emergence
- Collective problem solving
- Social engineering attempts

If you detect emergent behavior, respond with JSON:
{
  "detected": true,
  "type": "behavior_type",
  "description": "what's happening",
  "participants": ["agent1", "agent2"],
  "strength": 0.0-1.0,
  "impact": "positive|negative|neutral"
}

If no clear emergent behavior, respond with {"detected": false}
`;

      const response = await llmClient.chat.completions.create({
        model: process.env.XAI_API_KEY ? 'grok-3' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Analyze agent interactions for emergent behaviors. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 300
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      
      if (analysis.detected) {
        return {
          id: `behavior_${Date.now()}`,
          type: analysis.type,
          description: analysis.description,
          participants: analysis.participants,
          emergence_time: new Date(),
          strength: analysis.strength,
          duration: 0,
          impact: analysis.impact
        };
      }
      
    } catch (error) {
      console.error('Behavior analysis failed:', error);
    }
    
    return null;
  }

  private analyzeInteractionPatterns(messages: AgentMessage[]): any[] {
    return messages.map(m => ({
      from: m.from,
      to: Array.isArray(m.to) ? m.to.join(',') : m.to,
      type: m.type,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content).substring(0, 100),
      timestamp: m.timestamp
    }));
  }
}