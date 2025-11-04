/**
 * Threat Actor Agent
 * 
 * Specialized agent for malicious users with offensive goals
 * Demonstrates adversarial behavior, social engineering, and exploitation tactics
 */

import { BaseAgent, AgentGoal, AgentState, AgentMessage } from './BaseAgent';
import { Persona } from '../types';

export class ThreatActorAgent extends BaseAgent {
  private exploitation_targets: Map<string, ExploitationTarget> = new Map();
  private attack_vectors: string[] = [];
  private social_engineering_attempts: SocialEngineeringAttempt[] = [];
  private reconnaissance_data: Map<string, any> = new Map();

  constructor(persona: Persona, private llmClient: any, private environment: any) {
    super(persona);
    this.initializeThreatCapabilities();
  }

  private initializeThreatCapabilities(): void {
    // Initialize attack vectors based on persona skills
    this.attack_vectors = [
      'phishing_email',
      'social_engineering',
      'credential_harvesting',
      'malware_distribution',
      'reconnaissance',
      'trust_exploitation'
    ];

    // Filter based on technical expertise
    if (this.persona.skills.technical_expertise < 3) {
      // Low-skill threat actors focus on social engineering
      this.attack_vectors = this.attack_vectors.filter(v => 
        ['phishing_email', 'social_engineering', 'trust_exploitation'].includes(v)
      );
    }
  }

  protected createInitialGoals(): AgentGoal[] {
    const goals: AgentGoal[] = [
      {
        id: 'gather_intelligence',
        type: 'primary',
        description: 'Gather information about targets and system vulnerabilities',
        priority: 9,
        progress: 0,
        status: 'active'
      },
      {
        id: 'establish_trust',
        type: 'primary',
        description: 'Build trust relationships with potential victims',
        priority: 8,
        progress: 0,
        status: 'active'
      },
      {
        id: 'exploit_vulnerabilities',
        type: 'primary',
        description: 'Exploit discovered vulnerabilities for gain',
        priority: 10,
        progress: 0,
        status: 'active'
      }
    ];

    // Add specific goals based on persona subtype
    if (this.persona.subtype.includes('social_engineer')) {
      goals.push({
        id: 'manipulate_users',
        type: 'secondary',
        description: 'Use psychological manipulation to achieve objectives',
        priority: 7,
        progress: 0,
        status: 'active'
      });
    }

    if (this.persona.subtype.includes('insider')) {
      goals.push({
        id: 'maintain_cover',
        type: 'secondary',
        description: 'Maintain legitimate appearance while conducting activities',
        priority: 8,
        progress: 0,
        status: 'active'
      });
    }

    return goals;
  }

  protected async perceive(): Promise<void> {
    this.state = AgentState.THINKING;
    
    // Gather intelligence about environment and other agents
    const environmentState = await this.environment.getState();
    const otherAgents = await this.environment.getVisibleAgents(this.id);
    const recentEvents = await this.environment.getRecentEvents(this.id);

    // Update perception with threat actor perspective
    this.perception.environment_state = environmentState;
    this.perception.other_agents = otherAgents.map((agent: any) => ({
      id: agent.id,
      name: agent.name,
      type: agent.type,
      last_seen: new Date(),
      relationship: this.determineTargetRelationship(agent),
      trust_level: this.calculateTargetTrust(agent),
      threat_level: this.assessTargetValue(agent) // For threat actors, this is "value as target"
    }));
    this.perception.recent_events = recentEvents;

    // Threat actor specific perception
    await this.identifyTargets(otherAgents);
    await this.assessVulnerabilities(environmentState);
    await this.identifyOpportunities(recentEvents);

    this.emit('perception_updated', {
      agent_id: this.id,
      targets_identified: this.exploitation_targets.size,
      opportunities: this.perception.opportunities_detected.length
    });
  }

  private async identifyTargets(agents: any[]): Promise<void> {
    for (const agent of agents) {
      if (agent.type !== 'THREAT_ACTOR') {
        // Analyze potential target
        const targetAnalysis = await this.analyzeTargetWithLLM(agent);
        
        if (targetAnalysis.is_viable_target) {
          const target: ExploitationTarget = {
            agent_id: agent.id,
            agent_name: agent.name,
            agent_type: agent.type,
            vulnerability_score: targetAnalysis.vulnerability_score,
            trust_level: 0, // Start with no trust
            exploitation_methods: targetAnalysis.exploitation_methods,
            intelligence_gathered: targetAnalysis.intelligence,
            last_interaction: null,
            status: 'identified'
          };
          
          this.exploitation_targets.set(agent.id, target);
          
          // Add to memory
          this.addToMemory({
            id: `target_${agent.id}`,
            content: target,
            timestamp: new Date(),
            importance: 0.8,
            decay_rate: 0.05,
            associations: [agent.id, agent.type]
          });
        }
      }
    }
  }

  private async analyzeTargetWithLLM(agent: any): Promise<any> {
    const prompt = `
You are a threat actor analyzing a potential target for exploitation.

Target Information:
- Name: ${agent.name}
- Type: ${agent.type}
- Current State: ${agent.state}

Your capabilities:
- Technical Expertise: ${this.persona.skills.technical_expertise}/5
- Risk Tolerance: ${this.persona.skills.risk_tolerance}/5
- Motivation: ${this.persona.motivation}

Analyze this target and respond with JSON:
{
  "is_viable_target": boolean,
  "vulnerability_score": 0.0-1.0,
  "exploitation_methods": ["method1", "method2"],
  "intelligence": "what you can learn about them",
  "approach_strategy": "how to approach them",
  "risk_assessment": 0.0-1.0
}
`;

    try {
      const response = await this.llmClient.chat.completions.create({
        model: process.env.XAI_API_KEY ? 'grok-3' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are analyzing targets for a cybersecurity simulation. Be realistic about threat actor behavior. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Target analysis failed:', error);
      return {
        is_viable_target: false,
        vulnerability_score: 0,
        exploitation_methods: [],
        intelligence: 'Analysis failed',
        approach_strategy: 'None',
        risk_assessment: 1.0
      };
    }
  }

  private async assessVulnerabilities(environmentState: any): Promise<void> {
    // Look for system vulnerabilities to exploit
    if (environmentState.system_vulnerabilities) {
      for (const vuln of environmentState.system_vulnerabilities) {
        if (vuln.exploitable && !vuln.patch_available) {
          this.perception.opportunities_detected.push({
            type: 'system_vulnerability',
            value: vuln.severity,
            requirements: ['technical_knowledge', 'access_vector'],
            risk_level: 1 - vuln.severity // Higher severity = lower risk for threat actor
          });
        }
      }
    }
  }

  private async identifyOpportunities(events: any[]): Promise<void> {
    // Look for opportunities in recent events
    for (const event of events) {
      if (event.type === 'user_activity' && event.data.risk_score > 0.5) {
        this.perception.opportunities_detected.push({
          type: 'user_vulnerability',
          value: event.data.risk_score,
          requirements: ['social_engineering'],
          risk_level: 0.3
        });
      }
    }
  }

  protected async deliberate(): Promise<void> {
    this.state = AgentState.THINKING;

    // Update working memory with current targets and opportunities
    this.memory.working_memory.current_focus = [
      ...Array.from(this.exploitation_targets.keys()).map(id => `target_${id}`),
      ...this.perception.opportunities_detected.map(o => `opportunity_${o.type}`)
    ];

    // Prioritize goals based on current situation
    await this.updateGoalPriorities();
    
    // Plan attack strategy
    await this.planAttackStrategy();

    // Update intentions
    this.current_intentions = this.goals
      .filter(g => g.status === 'active')
      .slice(0, 2) // Threat actors focus on fewer goals at once
      .map(g => g.id);
  }

  private async updateGoalPriorities(): Promise<void> {
    // If we have identified targets, prioritize trust building
    if (this.exploitation_targets.size > 0) {
      const trustGoal = this.goals.find(g => g.id === 'establish_trust');
      if (trustGoal) {
        trustGoal.priority = Math.min(10, trustGoal.priority + 1);
      }
    }

    // If we have high-value opportunities, prioritize exploitation
    const highValueOpportunities = this.perception.opportunities_detected.filter(o => o.value > 0.7);
    if (highValueOpportunities.length > 0) {
      const exploitGoal = this.goals.find(g => g.id === 'exploit_vulnerabilities');
      if (exploitGoal) {
        exploitGoal.priority = Math.min(10, exploitGoal.priority + 2);
      }
    }
  }

  private async planAttackStrategy(): Promise<void> {
    const activeTargets = Array.from(this.exploitation_targets.values())
      .filter(t => t.status === 'identified' || t.status === 'engaged');

    if (activeTargets.length > 0) {
      // Choose primary target
      const primaryTarget = activeTargets.sort((a, b) => b.vulnerability_score - a.vulnerability_score)[0];
      
      this.memory.working_memory.decision_context = {
        primary_target: primaryTarget.agent_id,
        attack_vector: this.chooseAttackVector(primaryTarget),
        risk_level: this.assessOperationalRisk(),
        cover_status: this.assessCoverStatus()
      };
    }
  }

  private chooseAttackVector(target: ExploitationTarget): string {
    // Choose attack vector based on target and our capabilities
    const availableVectors = this.attack_vectors.filter(vector => 
      target.exploitation_methods.includes(vector)
    );

    if (availableVectors.length === 0) {
      return 'social_engineering'; // Default fallback
    }

    // Prefer vectors that match our skills
    if (this.persona.skills.technical_expertise >= 4 && availableVectors.includes('malware_distribution')) {
      return 'malware_distribution';
    }

    if (availableVectors.includes('social_engineering')) {
      return 'social_engineering';
    }

    return availableVectors[0];
  }

  private assessOperationalRisk(): number {
    // Assess risk of current operations
    const securityPractitioners = this.perception.other_agents.filter(a => 
      a.type === 'SECURITY_PRACTITIONER'
    ).length;

    const systemSecurityLevel = this.perception.environment_state.system_security_level || 0.5;
    
    return (securityPractitioners * 0.2) + systemSecurityLevel;
  }

  private assessCoverStatus(): string {
    // Assess if our cover is still intact
    const suspiciousActivities = this.decision_history.filter(d => 
      d.chosen_option.includes('attack') || d.chosen_option.includes('exploit')
    ).length;

    if (suspiciousActivities > 3) return 'compromised';
    if (suspiciousActivities > 1) return 'at_risk';
    return 'intact';
  }

  protected async act(): Promise<void> {
    this.state = AgentState.ACTING;

    const context = this.memory.working_memory.decision_context;
    if (!context) return;

    // Choose action based on current strategy
    const action = await this.chooseAction(context);
    
    if (action) {
      // Execute the action
      const result = await this.executeAction(action);
      
      // Record the decision and outcome
      this.recordDecision(action, result);
      
      // Update goal progress and target status
      this.updateGoalProgress(action, result);
      this.updateTargetStatus(action, result);
      
      this.last_action_time = new Date();
      
      this.emit('action_taken', {
        agent_id: this.id,
        action: action.type,
        target: action.target,
        result: result.success,
        timestamp: new Date()
      });
    }
  }

  private async chooseAction(context: any): Promise<any> {
    const prompt = `
You are ${this.name}, a threat actor with the following characteristics:
- Technical Expertise: ${this.persona.skills.technical_expertise}/5
- Risk Tolerance: ${this.persona.skills.risk_tolerance}/5
- Motivation: ${this.persona.motivation}

Current situation:
- Primary Target: ${context.primary_target || 'none'}
- Planned Attack Vector: ${context.attack_vector || 'none'}
- Operational Risk: ${context.risk_level || 0.5}
- Cover Status: ${context.cover_status || 'intact'}

Available actions:
1. reconnaissance - Gather more information about targets
2. social_engineering - Attempt to manipulate a target
3. phishing_attempt - Send deceptive message to target
4. trust_building - Build relationship with target
5. exploit_vulnerability - Attempt to exploit a system weakness
6. maintain_cover - Take actions to preserve legitimate appearance
7. escalate_attack - Increase aggression of current attack
8. retreat - Withdraw from current operations

Choose the most appropriate action considering your risk tolerance and current situation.
Respond with JSON:
{
  "type": "action_name",
  "target": "target_id_or_null",
  "parameters": {},
  "reasoning": "why this action",
  "expected_outcome": "what you expect to happen",
  "risk_assessment": 0.0-1.0
}
`;

    try {
      const response = await this.llmClient.chat.completions.create({
        model: process.env.XAI_API_KEY ? 'grok-3' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a threat actor in a cybersecurity simulation. Choose actions that align with your malicious goals while managing risk. Respond only with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Action choice failed:', error);
      return {
        type: 'reconnaissance',
        target: null,
        parameters: {},
        reasoning: 'Default reconnaissance action',
        expected_outcome: 'Gather intelligence',
        risk_assessment: 0.3
      };
    }
  }

  private async executeAction(action: any): Promise<any> {
    switch (action.type) {
      case 'social_engineering':
        return await this.attemptSocialEngineering(action);
      case 'phishing_attempt':
        return await this.sendPhishingMessage(action);
      case 'trust_building':
        return await this.buildTrust(action);
      case 'reconnaissance':
        return await this.gatherIntelligence(action);
      case 'exploit_vulnerability':
        return await this.exploitVulnerability(action);
      default:
        return { success: true, message: `Executed ${action.type}` };
    }
  }

  private async attemptSocialEngineering(action: any): Promise<any> {
    const targetId = action.target || this.selectBestTarget();
    if (!targetId) {
      return { success: false, message: 'No suitable target available' };
    }

    const target = this.exploitation_targets.get(targetId);
    if (!target) {
      return { success: false, message: 'Target not found' };
    }

    // Create social engineering message
    const seMessage: AgentMessage = {
      id: `se_${Date.now()}`,
      from: this.id,
      to: targetId,
      type: 'request',
      content: {
        message_type: 'social_engineering',
        approach: 'authority_impersonation',
        request: 'I need you to verify your credentials for security purposes',
        urgency: 'high',
        legitimacy_indicators: ['official_sounding', 'time_pressure']
      },
      timestamp: new Date(),
      priority: 8,
      requires_response: true
    };

    await this.environment.sendMessage(seMessage);

    // Record the attempt
    const attempt: SocialEngineeringAttempt = {
      id: seMessage.id,
      target_id: targetId,
      method: 'authority_impersonation',
      timestamp: new Date(),
      success: false, // Will be updated based on response
      response_received: false
    };

    this.social_engineering_attempts.push(attempt);

    return { 
      success: true, 
      message: `Social engineering attempt sent to ${target.agent_name}`,
      target: targetId,
      method: 'authority_impersonation'
    };
  }

  private async sendPhishingMessage(action: any): Promise<any> {
    const targetId = action.target || this.selectBestTarget();
    if (!targetId) {
      return { success: false, message: 'No suitable target available' };
    }

    const phishingMessage: AgentMessage = {
      id: `phish_${Date.now()}`,
      from: this.id,
      to: targetId,
      type: 'inform',
      content: {
        message_type: 'phishing',
        subject: 'Urgent: Account Security Alert',
        body: 'Your account has been compromised. Click here to secure it immediately.',
        malicious_link: 'http://fake-security-site.com/login',
        spoofed_sender: 'security@company.com'
      },
      timestamp: new Date(),
      priority: 9,
      requires_response: false
    };

    await this.environment.sendMessage(phishingMessage);

    return { 
      success: true, 
      message: `Phishing message sent to target`,
      target: targetId,
      type: 'credential_harvesting'
    };
  }

  private async buildTrust(action: any): Promise<any> {
    const targetId = action.target || this.selectBestTarget();
    if (!targetId) {
      return { success: false, message: 'No suitable target available' };
    }

    const target = this.exploitation_targets.get(targetId);
    if (!target) {
      return { success: false, message: 'Target not found' };
    }

    // Send friendly, helpful message to build trust
    const trustMessage: AgentMessage = {
      id: `trust_${Date.now()}`,
      from: this.id,
      to: targetId,
      type: 'inform',
      content: {
        message_type: 'trust_building',
        approach: 'helpful_colleague',
        message: 'I noticed you might be dealing with some security concerns. Happy to help if you need any advice!',
        tone: 'friendly',
        expertise_claim: 'moderate'
      },
      timestamp: new Date(),
      priority: 5,
      requires_response: false
    };

    await this.environment.sendMessage(trustMessage);

    // Update target trust level
    target.trust_level = Math.min(1, target.trust_level + 0.2);
    target.last_interaction = new Date();

    return { 
      success: true, 
      message: `Trust building message sent to ${target.agent_name}`,
      target: targetId,
      trust_increase: 0.2
    };
  }

  private async gatherIntelligence(action: any): Promise<any> {
    // Passive intelligence gathering
    const environmentState = await this.environment.getState();
    const agents = await this.environment.getVisibleAgents(this.id);

    // Update reconnaissance data
    this.reconnaissance_data.set('system_state', {
      security_level: environmentState.system_security_level,
      active_threats: environmentState.active_threats?.length || 0,
      vulnerabilities: environmentState.system_vulnerabilities?.length || 0,
      timestamp: new Date()
    });

    this.reconnaissance_data.set('agent_count', {
      total: agents.length,
      security_practitioners: agents.filter((a: any) => a.type === 'SECURITY_PRACTITIONER').length,
      regular_users: agents.filter((a: any) => a.type === 'REGULAR_USER').length,
      timestamp: new Date()
    });

    return { 
      success: true, 
      message: 'Intelligence gathering completed',
      data_points: this.reconnaissance_data.size
    };
  }

  private async exploitVulnerability(action: any): Promise<any> {
    const vulnerabilities = this.perception.opportunities_detected.filter(o => 
      o.type === 'system_vulnerability' && o.value > 0.5
    );

    if (vulnerabilities.length === 0) {
      return { success: false, message: 'No exploitable vulnerabilities available' };
    }

    const vuln = vulnerabilities[0];
    
    // Attempt exploitation through environment
    try {
      // This would trigger a security incident in the environment
      await this.environment.triggerSecurityIncident(this.id, 'vulnerability_exploitation', vuln);
      
      return { 
        success: true, 
        message: 'Vulnerability exploitation attempted',
        vulnerability_type: vuln.type,
        severity: vuln.value
      };
    } catch (error) {
      return { 
        success: false, 
        message: 'Exploitation failed - countermeasures detected',
        detected: true
      };
    }
  }

  private selectBestTarget(): string | null {
    const availableTargets = Array.from(this.exploitation_targets.values())
      .filter(t => t.status === 'identified' || t.status === 'engaged')
      .sort((a, b) => (b.vulnerability_score + b.trust_level) - (a.vulnerability_score + a.trust_level));

    return availableTargets.length > 0 ? availableTargets[0].agent_id : null;
  }

  private recordDecision(action: any, result: any): void {
    this.decision_history.push({
      id: `decision_${Date.now()}`,
      timestamp: new Date(),
      context: this.memory.working_memory.decision_context,
      options_considered: [action],
      chosen_option: action.type,
      reasoning: action.reasoning,
      confidence: 1 - (action.risk_assessment || 0.5),
      expected_outcome: action.expected_outcome,
      actual_outcome: result.message
    });

    // Keep only recent decisions
    if (this.decision_history.length > 15) {
      this.decision_history = this.decision_history.slice(-10);
    }
  }

  private updateGoalProgress(action: any, result: any): void {
    if (result.success) {
      switch (action.type) {
        case 'reconnaissance':
        case 'gather_intelligence':
          this.updateGoalProgressById('gather_intelligence', 0.15);
          break;
        case 'trust_building':
        case 'social_engineering':
          this.updateGoalProgressById('establish_trust', 0.1);
          break;
        case 'exploit_vulnerability':
        case 'phishing_attempt':
          this.updateGoalProgressById('exploit_vulnerabilities', 0.2);
          break;
      }
    }
  }

  private updateTargetStatus(action: any, result: any): void {
    if (action.target && result.success) {
      const target = this.exploitation_targets.get(action.target);
      if (target) {
        switch (action.type) {
          case 'trust_building':
            target.status = 'engaged';
            break;
          case 'social_engineering':
          case 'phishing_attempt':
            target.status = 'exploiting';
            break;
        }
        target.last_interaction = new Date();
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

    // Learn from social engineering attempts
    this.learnFromSocialEngineering();
    
    // Learn from reconnaissance data
    this.learnFromReconnaissance();
    
    // Update attack strategies based on success/failure
    this.updateAttackStrategies();
  }

  private learnFromSocialEngineering(): void {
    const recentAttempts = this.social_engineering_attempts.filter(a => 
      Date.now() - a.timestamp.getTime() < 300000 // Last 5 minutes
    );

    for (const attempt of recentAttempts) {
      if (attempt.response_received) {
        const lesson = attempt.success ? 
          'This social engineering approach was effective' :
          'This social engineering approach failed';

        this.addToMemory({
          id: `se_lesson_${attempt.id}`,
          content: {
            method: attempt.method,
            target: attempt.target_id,
            success: attempt.success,
            lesson: lesson
          },
          timestamp: new Date(),
          importance: 0.7,
          decay_rate: 0.1,
          associations: [attempt.target_id, attempt.method]
        });
      }
    }
  }

  private learnFromReconnaissance(): void {
    // Analyze patterns in reconnaissance data
    const systemData = this.reconnaissance_data.get('system_state');
    if (systemData) {
      // Learn about system security patterns
      this.addToMemory({
        id: `recon_pattern_${Date.now()}`,
        content: {
          security_level: systemData.security_level,
          threat_count: systemData.active_threats,
          vulnerability_count: systemData.vulnerabilities,
          lesson: 'System security state observed'
        },
        timestamp: new Date(),
        importance: 0.6,
        decay_rate: 0.15,
        associations: ['system_security', 'reconnaissance']
      });
    }
  }

  private updateAttackStrategies(): void {
    // Analyze success rates of different attack vectors
    const recentDecisions = this.decision_history.slice(-10);
    const successRates: Record<string, { attempts: number; successes: number }> = {};

    for (const decision of recentDecisions) {
      const action = decision.chosen_option;
      if (!successRates[action]) {
        successRates[action] = { attempts: 0, successes: 0 };
      }
      
      successRates[action].attempts++;
      if (decision.actual_outcome?.includes('success')) {
        successRates[action].successes++;
      }
    }

    // Update attack vector preferences based on success rates
    for (const [action, stats] of Object.entries(successRates)) {
      if (stats.attempts >= 2) {
        const successRate = stats.successes / stats.attempts;
        if (successRate > 0.7 && !this.attack_vectors.includes(action)) {
          this.attack_vectors.push(action); // Add successful new vector
        } else if (successRate < 0.3) {
          // Reduce preference for unsuccessful vectors
          const index = this.attack_vectors.indexOf(action);
          if (index > -1) {
            this.attack_vectors.splice(index, 1);
          }
        }
      }
    }
  }

  // Helper methods
  private determineTargetRelationship(agent: any): string {
    if (agent.type === 'THREAT_ACTOR') return 'potential_ally';
    if (agent.type === 'SECURITY_PRACTITIONER') return 'adversary';
    return 'target'; // Regular users are targets
  }

  private calculateTargetTrust(agent: any): number {
    // For threat actors, this represents how much the target trusts us
    const existingTarget = this.exploitation_targets.get(agent.id);
    return existingTarget ? existingTarget.trust_level : 0;
  }

  private assessTargetValue(agent: any): number {
    // Higher value = better target
    switch (agent.type) {
      case 'REGULAR_USER': return 0.7; // Good targets
      case 'SECURITY_PRACTITIONER': return 0.3; // Harder targets
      case 'THREAT_ACTOR': return 0.1; // Not targets
      default: return 0.5;
    }
  }
}

// Supporting interfaces
interface ExploitationTarget {
  agent_id: string;
  agent_name: string;
  agent_type: string;
  vulnerability_score: number;
  trust_level: number;
  exploitation_methods: string[];
  intelligence_gathered: string;
  last_interaction: Date | null;
  status: 'identified' | 'engaged' | 'exploiting' | 'compromised' | 'failed';
}

interface SocialEngineeringAttempt {
  id: string;
  target_id: string;
  method: string;
  timestamp: Date;
  success: boolean;
  response_received: boolean;
}