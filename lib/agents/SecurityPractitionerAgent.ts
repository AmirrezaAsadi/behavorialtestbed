/**
 * Security Practitioner Agent
 * 
 * Specialized agent for security-aware users with defensive goals
 * Demonstrates goal-driven behavior and threat detection capabilities
 */

import { BaseAgent, AgentGoal, AgentState, AgentMessage, ThreatInfo } from './BaseAgent';
import { Persona } from '../types';

export class SecurityPractitionerAgent extends BaseAgent {
  private threat_model: Map<string, ThreatInfo> = new Map();
  private security_policies: string[] = [];
  private monitoring_targets: string[] = [];

  constructor(persona: Persona, private llmClient: any, private environment: any) {
    super(persona);
    this.initializeSecurityCapabilities();
  }

  private initializeSecurityCapabilities(): void {
    // Initialize security-specific knowledge
    this.security_policies = [
      'verify_sender_authenticity',
      'scan_attachments_before_opening',
      'check_url_reputation',
      'report_suspicious_activity',
      'maintain_security_awareness'
    ];

    // Set up monitoring targets
    this.monitoring_targets = [
      'phishing_attempts',
      'malware_distribution',
      'social_engineering',
      'data_exfiltration',
      'unauthorized_access'
    ];
  }

  protected createInitialGoals(): AgentGoal[] {
    return [
      {
        id: 'maintain_security_posture',
        type: 'primary',
        description: 'Maintain strong security posture and protect against threats',
        priority: 10,
        progress: 0,
        status: 'active'
      },
      {
        id: 'detect_threats',
        type: 'primary',
        description: 'Actively detect and respond to security threats',
        priority: 9,
        progress: 0,
        status: 'active'
      },
      {
        id: 'educate_others',
        type: 'secondary',
        description: 'Share security knowledge with other users',
        priority: 6,
        progress: 0,
        status: 'active'
      },
      {
        id: 'investigate_anomalies',
        type: 'secondary',
        description: 'Investigate suspicious activities and anomalies',
        priority: 7,
        progress: 0,
        status: 'active'
      }
    ];
  }

  protected async perceive(): Promise<void> {
    this.state = AgentState.THINKING;
    
    // Gather information from environment
    const environmentState = await this.environment.getState();
    const otherAgents = await this.environment.getVisibleAgents(this.id);
    const recentEvents = await this.environment.getRecentEvents(this.id);

    // Update perception
    this.perception.environment_state = environmentState;
    this.perception.other_agents = otherAgents.map((agent: any) => ({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      last_seen: new Date(),
      relationship: this.determineRelationship(agent),
      trust_level: this.calculateTrustLevel(agent),
      threat_level: this.assessThreatLevel(agent)
    }));
    this.perception.recent_events = recentEvents;

    // Security-specific perception: Threat detection
    await this.detectThreats(environmentState, recentEvents);
    
    // Look for opportunities to help others
    await this.detectSecurityOpportunities(otherAgents, recentEvents);

    this.emit('perception_updated', {
      agent_id: this.id,
      threats_detected: this.perception.threats_detected.length,
      opportunities: this.perception.opportunities_detected.length
    });
  }

  private async detectThreats(environmentState: any, events: any[]): Promise<void> {
    this.perception.threats_detected = [];

    for (const event of events) {
      // Use LLM to analyze events for threats
      const threatAnalysis = await this.analyzeThreatWithLLM(event);
      
      if (threatAnalysis.is_threat) {
        const threat: ThreatInfo = {
          type: threatAnalysis.threat_type,
          severity: threatAnalysis.severity,
          source: event.source,
          confidence: threatAnalysis.confidence,
          countermeasures: threatAnalysis.countermeasures
        };
        
        this.perception.threats_detected.push(threat);
        this.threat_model.set(event.id, threat);
        
        // Add to memory as high importance
        this.addToMemory({
          id: `threat_${event.id}`,
          content: threat,
          timestamp: new Date(),
          importance: 0.9,
          decay_rate: 0.05, // Threats decay slowly
          associations: [event.source]
        });
      }
    }
  }

  private async analyzeThreatWithLLM(event: any): Promise<any> {
    const prompt = `
You are a cybersecurity expert analyzing a system event for potential threats.

Event Details:
- Type: ${event.type}
- Source: ${event.source}
- Data: ${JSON.stringify(event.data)}
- Timestamp: ${event.timestamp}

Your persona characteristics:
- Technical Expertise: ${this.persona.skills.technical_expertise}/5
- Security Awareness: ${this.persona.skills.security_awareness}/5
- Risk Tolerance: ${this.persona.skills.risk_tolerance}/5

Analyze this event and respond with JSON:
{
  "is_threat": boolean,
  "threat_type": "phishing|malware|social_engineering|data_breach|unauthorized_access|other",
  "severity": 0.0-1.0,
  "confidence": 0.0-1.0,
  "reasoning": "your analysis",
  "countermeasures": ["action1", "action2"],
  "indicators": ["indicator1", "indicator2"]
}
`;

    try {
      const response = await this.llmClient.chat.completions.create({
        model: process.env.XAI_API_KEY ? 'grok-3' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a cybersecurity expert. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('LLM threat analysis failed:', error);
      return {
        is_threat: false,
        threat_type: 'unknown',
        severity: 0,
        confidence: 0,
        reasoning: 'Analysis failed',
        countermeasures: [],
        indicators: []
      };
    }
  }

  private async detectSecurityOpportunities(agents: any[], events: any[]): Promise<void> {
    this.perception.opportunities_detected = [];

    // Look for agents who might need security help
    for (const agent of agents) {
      if (agent.type === 'REGULAR_USER' && agent.threat_level > 0.5) {
        this.perception.opportunities_detected.push({
          type: 'security_assistance',
          value: 0.8,
          requirements: ['establish_trust', 'provide_guidance'],
          risk_level: 0.2
        });
      }
    }

    // Look for system vulnerabilities to report
    for (const event of events) {
      if (event.type === 'system_vulnerability' || event.type === 'security_incident') {
        this.perception.opportunities_detected.push({
          type: 'vulnerability_reporting',
          value: 0.9,
          requirements: ['document_evidence', 'report_to_authorities'],
          risk_level: 0.1
        });
      }
    }
  }

  protected async deliberate(): Promise<void> {
    this.state = AgentState.THINKING;

    // Update working memory with current focus
    this.memory.working_memory.current_focus = [
      ...this.perception.threats_detected.map(t => `threat_${t.type}`),
      ...this.perception.opportunities_detected.map(o => `opportunity_${o.type}`)
    ];

    // Update goal priorities based on current situation
    await this.updateGoalPriorities();

    // Plan actions based on goals and current situation
    await this.planActions();

    // Update intentions
    this.current_intentions = this.goals
      .filter(g => g.status === 'active')
      .slice(0, 3) // Focus on top 3 goals
      .map(g => g.id);
  }

  private async updateGoalPriorities(): Promise<void> {
    // Increase priority of threat detection if threats are present
    if (this.perception.threats_detected.length > 0) {
      const detectGoal = this.goals.find(g => g.id === 'detect_threats');
      if (detectGoal) {
        detectGoal.priority = Math.min(10, detectGoal.priority + 2);
      }
    }

    // Increase education priority if vulnerable users are present
    const vulnerableUsers = this.perception.other_agents.filter(a => 
      a.type === 'REGULAR_USER' && a.threat_level > 0.5
    );
    if (vulnerableUsers.length > 0) {
      const educateGoal = this.goals.find(g => g.id === 'educate_others');
      if (educateGoal) {
        educateGoal.priority = Math.min(10, educateGoal.priority + 1);
      }
    }
  }

  private async planActions(): Promise<void> {
    // This is where the agent decides what to do next
    // Based on current goals, threats, and opportunities
    
    const activeGoals = this.goals.filter(g => g.status === 'active');
    const highestPriorityGoal = activeGoals.sort((a, b) => b.priority - a.priority)[0];

    if (highestPriorityGoal) {
      this.memory.working_memory.decision_context = {
        primary_goal: highestPriorityGoal.id,
        threats_present: this.perception.threats_detected.length > 0,
        opportunities_available: this.perception.opportunities_detected.length > 0,
        other_agents_count: this.perception.other_agents.length
      };
    }
  }

  protected async act(): Promise<void> {
    this.state = AgentState.ACTING;

    const context = this.memory.working_memory.decision_context;
    if (!context) return;

    // Choose action based on highest priority goal
    let action = await this.chooseAction(context);
    
    if (action) {
      // Execute the action
      const result = await this.executeAction(action);
      
      // Record the decision and outcome
      this.recordDecision(action, result);
      
      // Update goal progress
      this.updateGoalProgress(action, result);
      
      this.last_action_time = new Date();
      
      this.emit('action_taken', {
        agent_id: this.id,
        action: action.type,
        result: result.success,
        timestamp: new Date()
      });
    }
  }

  private async chooseAction(context: any): Promise<any> {
    // Use LLM to choose appropriate action
    const prompt = `
You are ${this.name}, a security practitioner with the following characteristics:
- Technical Expertise: ${this.persona.skills.technical_expertise}/5
- Security Awareness: ${this.persona.skills.security_awareness}/5
- Risk Tolerance: ${this.persona.skills.risk_tolerance}/5

Current situation:
- Primary Goal: ${context.primary_goal}
- Threats Present: ${context.threats_present}
- Opportunities Available: ${context.opportunities_available}
- Other Agents: ${context.other_agents_count}

Recent observations:
${this.memory.working_memory.recent_observations.slice(-3).join('\n')}

Available actions:
1. investigate_threat - Analyze a detected threat in detail
2. warn_others - Send warning message to other agents about threats
3. implement_countermeasure - Take defensive action against a threat
4. educate_user - Provide security guidance to a vulnerable user
5. report_incident - Report security incident to authorities
6. monitor_system - Passively monitor for new threats
7. collaborate_with_peer - Work with another security practitioner

Choose the most appropriate action and respond with JSON:
{
  "type": "action_name",
  "target": "target_id_or_null",
  "parameters": {},
  "reasoning": "why this action",
  "expected_outcome": "what you expect to happen"
}
`;

    try {
      const response = await this.llmClient.chat.completions.create({
        model: process.env.XAI_API_KEY ? 'grok-3' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a security practitioner agent. Choose actions that align with your security goals. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Action choice failed:', error);
      return {
        type: 'monitor_system',
        target: null,
        parameters: {},
        reasoning: 'Default monitoring action',
        expected_outcome: 'Maintain situational awareness'
      };
    }
  }

  private async executeAction(action: any): Promise<any> {
    switch (action.type) {
      case 'warn_others':
        return await this.warnOthers(action);
      case 'investigate_threat':
        return await this.investigateThreat(action);
      case 'educate_user':
        return await this.educateUser(action);
      case 'implement_countermeasure':
        return await this.implementCountermeasure(action);
      default:
        return { success: true, message: `Executed ${action.type}` };
    }
  }

  private async warnOthers(action: any): Promise<any> {
    const threats = this.perception.threats_detected;
    if (threats.length === 0) {
      return { success: false, message: 'No threats to warn about' };
    }

    const highestThreat = threats.sort((a, b) => b.severity - a.severity)[0];
    
    // Send warning message to all other agents
    const warningMessage: AgentMessage = {
      id: `warning_${Date.now()}`,
      from: this.id,
      to: this.perception.other_agents.map(a => a.id),
      type: 'threat',
      content: {
        threat_type: highestThreat.type,
        severity: highestThreat.severity,
        warning: `Security Alert: ${highestThreat.type} detected. Recommend caution.`,
        countermeasures: highestThreat.countermeasures
      },
      timestamp: new Date(),
      priority: Math.floor(highestThreat.severity * 10),
      requires_response: false
    };

    // Send through environment
    await this.environment.broadcastMessage(warningMessage);
    
    return { 
      success: true, 
      message: `Warning sent about ${highestThreat.type}`,
      recipients: this.perception.other_agents.length
    };
  }

  private async investigateThreat(action: any): Promise<any> {
    // Detailed threat investigation
    const threats = this.perception.threats_detected;
    if (threats.length === 0) {
      return { success: false, message: 'No threats to investigate' };
    }

    const threat = threats[0]; // Investigate first threat
    
    // Add investigation results to memory
    this.addToMemory({
      id: `investigation_${Date.now()}`,
      content: {
        threat_type: threat.type,
        investigation_depth: this.persona.skills.technical_expertise,
        findings: `Detailed analysis of ${threat.type}`,
        confidence: threat.confidence * 1.2 // Investigation increases confidence
      },
      timestamp: new Date(),
      importance: 0.8,
      decay_rate: 0.1,
      associations: [threat.source]
    });

    return { 
      success: true, 
      message: `Investigated ${threat.type}`,
      enhanced_confidence: threat.confidence * 1.2
    };
  }

  private async educateUser(action: any): Promise<any> {
    // Find a vulnerable user to educate
    const vulnerableUsers = this.perception.other_agents.filter(a => 
      a.type === 'REGULAR_USER' && a.threat_level > 0.5
    );

    if (vulnerableUsers.length === 0) {
      return { success: false, message: 'No vulnerable users to educate' };
    }

    const targetUser = vulnerableUsers[0];
    
    const educationMessage: AgentMessage = {
      id: `education_${Date.now()}`,
      from: this.id,
      to: targetUser.id,
      type: 'inform',
      content: {
        message_type: 'security_education',
        topic: 'general_security_awareness',
        advice: 'Be cautious with email attachments and verify sender authenticity',
        expertise_level: this.persona.skills.security_awareness
      },
      timestamp: new Date(),
      priority: 6,
      requires_response: false
    };

    await this.environment.sendMessage(educationMessage);
    
    return { 
      success: true, 
      message: `Educated user ${targetUser.name}`,
      target: targetUser.id
    };
  }

  private async implementCountermeasure(action: any): Promise<any> {
    const threats = this.perception.threats_detected;
    if (threats.length === 0) {
      return { success: false, message: 'No threats requiring countermeasures' };
    }

    const threat = threats[0];
    const countermeasure = threat.countermeasures[0] || 'generic_defense';
    
    // Implement the countermeasure through environment
    await this.environment.implementSecurityMeasure(this.id, countermeasure, threat);
    
    return { 
      success: true, 
      message: `Implemented ${countermeasure} against ${threat.type}`,
      countermeasure: countermeasure
    };
  }

  private recordDecision(action: any, result: any): void {
    this.decision_history.push({
      id: `decision_${Date.now()}`,
      timestamp: new Date(),
      context: this.memory.working_memory.decision_context,
      options_considered: [action], // Simplified for now
      chosen_option: action.type,
      reasoning: action.reasoning,
      confidence: 0.8,
      expected_outcome: action.expected_outcome,
      actual_outcome: result.message
    });

    // Keep only recent decisions
    if (this.decision_history.length > 20) {
      this.decision_history = this.decision_history.slice(-15);
    }
  }

  private updateGoalProgress(action: any, result: any): void {
    // Update goal progress based on action results
    if (result.success) {
      switch (action.type) {
        case 'investigate_threat':
        case 'implement_countermeasure':
          this.updateGoalProgressById('detect_threats', 0.1);
          this.updateGoalProgressById('maintain_security_posture', 0.05);
          break;
        case 'warn_others':
        case 'educate_user':
          this.updateGoalProgressById('educate_others', 0.15);
          break;
      }
    }
  }

  private updateGoalProgressById(goalId: string, increment: number): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal && goal.status === 'active') {
      goal.progress = Math.min(1, goal.progress + increment);
      if (goal.progress >= 1) {
        this.completeGoal(goalId);
      }
    }
  }

  protected async learn(): Promise<void> {
    this.state = AgentState.LEARNING;

    // Learn from recent experiences
    const recentDecisions = this.decision_history.slice(-5);
    
    for (const decision of recentDecisions) {
      if (decision.actual_outcome && decision.expected_outcome) {
        // Compare expected vs actual outcomes
        const success = decision.actual_outcome.includes('success') || 
                       decision.actual_outcome.includes('completed');
        
        if (success) {
          // Reinforce successful patterns
          this.addToMemory({
            id: `success_pattern_${Date.now()}`,
            content: {
              action_type: decision.chosen_option,
              context: decision.context,
              outcome: decision.actual_outcome,
              lesson: 'This action pattern was successful'
            },
            timestamp: new Date(),
            importance: 0.7,
            decay_rate: 0.05,
            associations: [decision.chosen_option]
          });
        } else {
          // Learn from failures
          this.addToMemory({
            id: `failure_pattern_${Date.now()}`,
            content: {
              action_type: decision.chosen_option,
              context: decision.context,
              outcome: decision.actual_outcome,
              lesson: 'This action pattern needs improvement'
            },
            timestamp: new Date(),
            importance: 0.8,
            decay_rate: 0.03,
            associations: [decision.chosen_option]
          });
        }
      }
    }

    // Update threat model based on new information
    this.updateThreatModel();
  }

  private updateThreatModel(): void {
    // Analyze patterns in threat detection
    const threatMemories = this.memory.short_term.filter(m => 
      m.id.startsWith('threat_') || m.content.threat_type
    );

    // Update threat confidence based on repeated observations
    for (const [threatId, threat] of this.threat_model.entries()) {
      const relatedMemories = threatMemories.filter(m => 
        m.associations.includes(threat.source)
      );
      
      if (relatedMemories.length > 1) {
        // Increase confidence if we see similar threats repeatedly
        threat.confidence = Math.min(1, threat.confidence + 0.1);
      }
    }
  }

  // Helper methods
  private determineRelationship(agent: any): string {
    if (agent.type === 'SECURITY_PRACTITIONER') return 'colleague';
    if (agent.type === 'THREAT_ACTOR') return 'adversary';
    return 'protectee'; // Regular users are people to protect
  }

  private calculateTrustLevel(agent: any): number {
    switch (agent.type) {
      case 'SECURITY_PRACTITIONER': return 0.8;
      case 'REGULAR_USER': return 0.6;
      case 'THREAT_ACTOR': return 0.1;
      default: return 0.5;
    }
  }

  private assessThreatLevel(agent: any): number {
    switch (agent.type) {
      case 'THREAT_ACTOR': return 0.9;
      case 'REGULAR_USER': return 0.2; // Might be compromised
      case 'SECURITY_PRACTITIONER': return 0.1;
      default: return 0.5;
    }
  }
}