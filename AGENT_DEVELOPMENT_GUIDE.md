# Agent Development Guide

## 🎯 Learning Path: From Sequential to True Multi-Agent Systems

This guide will teach you how to develop autonomous agents and enhance the behavioral testbed into a truly agentic system.

## 📚 Core Agent Concepts

### 1. **Autonomy**
Agents make independent decisions without external control:
```typescript
// ❌ Old way: Sequential prompting
for (const persona of personas) {
  const response = await llm.complete(prompt);
}

// ✅ New way: Autonomous agents
const agents = personas.map(p => new SecurityPractitionerAgent(p));
await Promise.all(agents.map(agent => agent.start()));
```

### 2. **Reactivity** 
Agents respond to environment changes in real-time:
```typescript
protected async perceive(): Promise<void> {
  // Continuously monitor environment
  const threats = await this.environment.getThreats();
  const otherAgents = await this.environment.getVisibleAgents();
  
  // React to changes
  if (threats.length > this.lastThreatCount) {
    this.addGoal(createThreatResponseGoal());
  }
}
```

### 3. **Proactivity**
Agents pursue goals actively:
```typescript
protected async deliberate(): Promise<void> {
  // Update goal priorities based on situation
  if (this.perception.threats_detected.length > 0) {
    this.prioritizeGoal('detect_threats');
  }
  
  // Plan actions to achieve goals
  await this.planActions();
}
```

### 4. **Social Ability**
Agents interact and influence each other:
```typescript
// Autonomous interaction decision
if (this.shouldWarnOthers(threat)) {
  const message = this.createWarningMessage(threat);
  await this.environment.broadcastMessage(message);
}
```

## 🏗️ Architecture Overview

### Agent Hierarchy
```
BaseAgent (Abstract)
├── SecurityPractitionerAgent
├── ThreatActorAgent
├── RegularUserAgent (TODO)
└── CustomAgent (Your extensions)
```

### Key Components

1. **BaseAgent**: Core agent architecture with BDI model
2. **SharedEnvironment**: Dynamic world where agents interact
3. **AgentSimulationManager**: Orchestrates multi-agent simulations
4. **Memory System**: Short-term, long-term, episodic, and semantic memory
5. **Goal System**: Hierarchical goals with priorities and progress tracking

## 🚀 Getting Started

### Step 1: Understanding the Agent Loop

Every agent runs this continuous loop:

```typescript
while (this.is_active) {
  await this.perceive();    // 👁️ Gather information
  await this.deliberate();  // 🧠 Make decisions
  await this.act();         // 🎬 Execute actions
  await this.learn();       // 📚 Update knowledge
  await this.communicate(); // 💬 Process messages
  await this.sleep(delay);  // ⏱️ Wait for next cycle
}
```

### Step 2: Create Your First Custom Agent

```typescript
import { BaseAgent, AgentGoal } from './BaseAgent';

export class CustomSecurityAgent extends BaseAgent {
  protected createInitialGoals(): AgentGoal[] {
    return [
      {
        id: 'monitor_network',
        type: 'primary',
        description: 'Monitor network traffic for anomalies',
        priority: 8,
        progress: 0,
        status: 'active'
      }
    ];
  }

  protected async perceive(): Promise<void> {
    // Your perception logic
    const networkEvents = await this.environment.getNetworkEvents();
    this.analyzeNetworkTraffic(networkEvents);
  }

  protected async deliberate(): Promise<void> {
    // Your decision-making logic
    if (this.detectedAnomalies.length > 0) {
      this.addGoal(this.createInvestigationGoal());
    }
  }

  protected async act(): Promise<void> {
    // Your action execution logic
    const action = await this.chooseAction();
    await this.executeAction(action);
  }

  protected async learn(): Promise<void> {
    // Your learning logic
    this.updateAnomalyDetectionModel();
  }
}
```

### Step 3: Test Your Agent

```typescript
// Create test scenario
const scenario = {
  title: "Network Monitoring Test",
  workflow_steps: [/* your steps */]
};

// Create simulation manager
const manager = new AgentSimulationManager(scenario, llmClient);

// Add your custom agent
const persona = createCustomPersona();
await manager.createAgents([persona]);

// Run simulation
const result = await manager.runSimulation();
```

## 🧠 Advanced Agent Development

### Memory Management

Agents have sophisticated memory systems:

```typescript
// Add important information to memory
this.addToMemory({
  id: 'threat_analysis_001',
  content: threatAnalysis,
  timestamp: new Date(),
  importance: 0.9,        // High importance
  decay_rate: 0.05,       // Slow decay
  associations: ['threat', 'phishing'],
  emotional_valence: -0.8 // Negative emotion
});

// Query memory
const relatedMemories = this.memory.short_term.filter(m => 
  m.associations.includes('phishing')
);
```

### Goal-Driven Behavior

Implement sophisticated goal hierarchies:

```typescript
// Dynamic goal creation
private createEmergentGoal(situation: any): AgentGoal {
  return {
    id: `emergent_${Date.now()}`,
    type: 'emergent',
    description: `Respond to ${situation.type}`,
    priority: this.calculatePriority(situation),
    progress: 0,
    status: 'active',
    deadline: new Date(Date.now() + 300000), // 5 minutes
    subgoals: this.breakDownGoal(situation)
  };
}

// Goal prioritization
private updateGoalPriorities(): void {
  this.goals.sort((a, b) => {
    // Consider urgency, importance, and current situation
    const scoreA = this.calculateGoalScore(a);
    const scoreB = this.calculateGoalScore(b);
    return scoreB - scoreA;
  });
}
```

### Advanced Interactions

Create sophisticated agent interactions:

```typescript
// Negotiation between agents
async negotiateWithAgent(targetId: string, proposal: any): Promise<any> {
  const negotiationMessage = {
    id: `negotiate_${Date.now()}`,
    from: this.id,
    to: targetId,
    type: 'propose',
    content: {
      proposal: proposal,
      benefits: this.calculateBenefits(proposal),
      terms: this.generateTerms(proposal)
    },
    requires_response: true
  };
  
  return await this.sendMessageAndWaitForResponse(negotiationMessage);
}

// Coalition formation
async formCoalition(agentIds: string[], purpose: string): Promise<Coalition> {
  const coalition = new Coalition(purpose, [this.id, ...agentIds]);
  
  // Invite agents to join
  for (const agentId of agentIds) {
    await this.inviteToCoalition(agentId, coalition);
  }
  
  return coalition;
}
```

## 🌟 Emergent Behavior Examples

The system can detect and analyze emergent behaviors:

### 1. **Trust Networks**
```typescript
// Agents naturally form trust relationships
if (interaction.outcome === 'helpful') {
  this.updateTrust(interaction.from, +0.1);
} else if (interaction.outcome === 'deceptive') {
  this.updateTrust(interaction.from, -0.3);
  this.warnOthersAbout(interaction.from);
}
```

### 2. **Information Cascades**
```typescript
// Information spreads through the network
onReceiveInformation(info: any, from: string): void {
  if (this.trustLevel(from) > 0.7) {
    this.believeInformation(info);
    this.shareWithTrustedAgents(info); // Cascade effect
  }
}
```

### 3. **Collective Defense**
```typescript
// Agents coordinate defense against threats
onThreatDetected(threat: ThreatInfo): void {
  this.broadcastThreatWarning(threat);
  this.requestBackup(threat);
  this.implementCountermeasures(threat);
}
```

## 🔧 Extending the System

### Add New Agent Types

1. **Create the agent class**:
```typescript
export class ComplianceOfficerAgent extends BaseAgent {
  // Implement compliance-specific behavior
}
```

2. **Register in AgentSimulationManager**:
```typescript
case 'COMPLIANCE_OFFICER':
  agent = new ComplianceOfficerAgent(persona, this.llmClient, this.environment);
  break;
```

### Add New Environment Features

```typescript
// Extend SharedEnvironment
export class EnhancedEnvironment extends SharedEnvironment {
  private complianceRules: ComplianceRule[] = [];
  
  async checkCompliance(action: any): Promise<ComplianceResult> {
    // Your compliance checking logic
  }
  
  async generateComplianceEvent(): Promise<void> {
    // Generate compliance-related events
  }
}
```

### Add New Interaction Types

```typescript
// Extend AgentMessage types
type ExtendedMessageType = 
  | 'inform' | 'request' | 'propose' | 'accept' | 'reject'
  | 'negotiate' | 'delegate' | 'escalate' | 'audit';

// Implement new message handlers
protected async handleNegotiateMessage(message: AgentMessage): Promise<void> {
  const proposal = message.content.proposal;
  const response = await this.evaluateProposal(proposal);
  await this.sendResponse(message.from, response);
}
```

## 📊 Evaluation and Metrics

### Custom Metrics

Add your own evaluation metrics:

```typescript
export interface CustomEvaluationMetrics extends EvaluationMetrics {
  trust_network_density: number;
  information_flow_efficiency: number;
  coalition_formation_rate: number;
  adaptation_speed: number;
}

// Calculate custom metrics
calculateTrustNetworkDensity(): number {
  const totalPossibleConnections = this.agents.size * (this.agents.size - 1);
  const actualConnections = this.countTrustConnections();
  return actualConnections / totalPossibleConnections;
}
```

### Behavioral Analysis

```typescript
// Analyze agent behavior patterns
analyzeAgentBehaviorPatterns(): BehaviorPattern[] {
  const patterns = [];
  
  // Detect cooperation patterns
  const cooperationPattern = this.detectCooperationPattern();
  if (cooperationPattern.strength > 0.7) {
    patterns.push(cooperationPattern);
  }
  
  // Detect competition patterns
  const competitionPattern = this.detectCompetitionPattern();
  if (competitionPattern.strength > 0.5) {
    patterns.push(competitionPattern);
  }
  
  return patterns;
}
```

## 🎮 Testing and Debugging

### Agent Debugging

```typescript
// Enable detailed logging
agent.on('decision_made', (event) => {
  console.log(`Agent ${event.agent_id} chose ${event.action} because: ${event.reasoning}`);
});

agent.on('goal_updated', (event) => {
  console.log(`Goal ${event.goal_id} progress: ${event.progress}`);
});

// Monitor agent state
const agentState = {
  current_state: agent.getState(),
  active_goals: agent.getGoals().filter(g => g.status === 'active'),
  memory_size: agent.getMemory().short_term.length,
  recent_decisions: agent.getRecentDecisions()
};
```

### Simulation Analysis

```typescript
// Analyze simulation results
const analysis = {
  interaction_patterns: analyzeInteractionPatterns(result.agent_interactions),
  goal_achievement: analyzeGoalAchievement(result.simulation_outputs),
  emergent_behaviors: categorizeEmergentBehaviors(result.emergent_behaviors),
  system_evolution: analyzeSystemEvolution(result.environment_events)
};
```

## 🚀 Next Steps

1. **Implement RegularUserAgent** - Create agents for regular users
2. **Add More Interaction Types** - Negotiation, delegation, escalation
3. **Enhance Learning** - Implement reinforcement learning
4. **Add Visualization** - Real-time agent interaction visualization
5. **Performance Optimization** - Optimize for larger agent populations
6. **Domain-Specific Agents** - Create agents for specific security domains

## 📖 Key Learning Resources

- **BDI Architecture**: Belief-Desire-Intention model
- **Multi-Agent Systems**: Coordination, cooperation, competition
- **Game Theory**: Strategic interactions between agents
- **Machine Learning**: Agent learning and adaptation
- **Complex Systems**: Emergence and self-organization

## 🤝 Contributing

To contribute new agent types or features:

1. Follow the BaseAgent interface
2. Add comprehensive tests
3. Document behavior patterns
4. Include evaluation metrics
5. Provide usage examples

This system provides a solid foundation for learning agent development while creating a truly multi-agent behavioral testbed for security research.