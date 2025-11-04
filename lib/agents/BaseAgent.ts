/**
 * Base Agent Class - Foundation for Autonomous Agent Behavior
 * 
 * Key Agent Concepts Implemented:
 * 1. Autonomy - Agents make independent decisions
 * 2. Reactivity - Agents respond to environment changes
 * 3. Proactivity - Agents pursue goals actively
 * 4. Social Ability - Agents interact with other agents
 */

import { EventEmitter } from 'events';
import { Persona } from '../types';

// Agent States
export enum AgentState {
  IDLE = 'idle',
  THINKING = 'thinking',
  ACTING = 'acting',
  INTERACTING = 'interacting',
  LEARNING = 'learning',
  SUSPENDED = 'suspended'
}

// Agent Goals and Motivations
export interface AgentGoal {
  id: string;
  type: 'primary' | 'secondary' | 'emergent';
  description: string;
  priority: number; // 1-10
  deadline?: Date;
  progress: number; // 0-1
  status: 'active' | 'completed' | 'failed' | 'paused';
  subgoals?: AgentGoal[];
}

// Agent Memory System
export interface AgentMemory {
  short_term: MemoryItem[];
  long_term: MemoryItem[];
  episodic: EpisodicMemory[];
  semantic: SemanticMemory[];
  working_memory: WorkingMemory;
}

export interface MemoryItem {
  id: string;
  content: any;
  timestamp: Date;
  importance: number; // 0-1
  decay_rate: number;
  associations: string[]; // IDs of related memories
  emotional_valence?: number; // -1 to 1
}

export interface EpisodicMemory extends MemoryItem {
  event_type: string;
  participants: string[];
  location: string;
  outcome: string;
  lessons_learned: string[];
}

export interface SemanticMemory extends MemoryItem {
  concept: string;
  relationships: Record<string, number>; // concept -> strength
  confidence: number;
}

export interface WorkingMemory {
  current_focus: string[];
  active_goals: string[];
  recent_observations: string[];
  decision_context: any;
}

// Agent Perception System
export interface AgentPerception {
  environment_state: any;
  other_agents: AgentInfo[];
  recent_events: EnvironmentEvent[];
  threats_detected: ThreatInfo[];
  opportunities_detected: OpportunityInfo[];
}

export interface AgentInfo {
  id: string;
  name: string;
  type: string;
  last_seen: Date;
  relationship: string;
  trust_level: number;
  threat_level: number;
}

export interface EnvironmentEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
  data: any;
  relevance: number; // 0-1
}

export interface ThreatInfo {
  type: string;
  severity: number;
  source: string;
  confidence: number;
  countermeasures: string[];
}

export interface OpportunityInfo {
  type: string;
  value: number;
  requirements: string[];
  risk_level: number;
}

// Agent Decision Making
export interface AgentDecision {
  id: string;
  timestamp: Date;
  context: any;
  options_considered: DecisionOption[];
  chosen_option: string;
  reasoning: string;
  confidence: number;
  expected_outcome: string;
  actual_outcome?: string;
}

export interface DecisionOption {
  id: string;
  action: string;
  expected_utility: number;
  risk_assessment: number;
  resource_cost: number;
  social_impact: number;
}

// Agent Communication
export interface AgentMessage {
  id: string;
  from: string;
  to: string | string[]; // Can be broadcast
  type: 'inform' | 'request' | 'propose' | 'accept' | 'reject' | 'query' | 'threat' | 'warning';
  content: any;
  timestamp: Date;
  priority: number;
  requires_response: boolean;
  conversation_id?: string;
}

/**
 * Base Agent Class
 * 
 * This implements the core agent architecture following the BDI (Belief-Desire-Intention) model:
 * - Beliefs: Agent's knowledge about the world (memory + perception)
 * - Desires: Agent's goals and motivations
 * - Intentions: Agent's current plans and commitments
 */
export abstract class BaseAgent extends EventEmitter {
  protected id: string;
  protected name: string;
  protected persona: Persona;
  protected state: AgentState = AgentState.IDLE;
  protected memory: AgentMemory;
  protected goals: AgentGoal[] = [];
  protected current_intentions: string[] = [];
  protected perception: AgentPerception;
  protected decision_history: AgentDecision[] = [];
  protected message_queue: AgentMessage[] = [];
  protected is_active: boolean = false;
  protected cycle_count: number = 0;
  protected last_action_time: Date = new Date();

  // Agent Capabilities
  protected reasoning_engine: any; // Will be LLM-based
  protected planning_system: any;
  protected learning_system: any;

  constructor(persona: Persona) {
    super();
    this.id = persona.id;
    this.name = persona.name;
    this.persona = persona;
    this.initializeMemory();
    this.initializeGoals();
    this.initializePerception();
  }

  // Core Agent Lifecycle
  public async start(): Promise<void> {
    this.is_active = true;
    this.state = AgentState.IDLE;
    this.emit('agent_started', { agent_id: this.id, timestamp: new Date() });
    
    // Start the agent's main loop
    this.runAgentLoop();
  }

  public async stop(): Promise<void> {
    this.is_active = false;
    this.state = AgentState.SUSPENDED;
    this.emit('agent_stopped', { agent_id: this.id, timestamp: new Date() });
  }

  // Main Agent Loop - This is where the magic happens!
  private async runAgentLoop(): Promise<void> {
    while (this.is_active) {
      try {
        this.cycle_count++;
        
        // 1. PERCEIVE - Gather information about environment
        await this.perceive();
        
        // 2. DELIBERATE - Update beliefs, desires, and intentions
        await this.deliberate();
        
        // 3. ACT - Execute chosen actions
        await this.act();
        
        // 4. LEARN - Update memory and adapt behavior
        await this.learn();
        
        // 5. COMMUNICATE - Process messages and send responses
        await this.communicate();
        
        // Wait before next cycle (simulates thinking time)
        await this.sleep(this.getThinkingDelay());
        
      } catch (error) {
        console.error(`Agent ${this.name} error in cycle ${this.cycle_count}:`, error);
        this.emit('agent_error', { agent_id: this.id, error, cycle: this.cycle_count });
        
        // Brief pause before retrying
        await this.sleep(1000);
      }
    }
  }

  // Abstract methods that subclasses must implement
  protected abstract perceive(): Promise<void>;
  protected abstract deliberate(): Promise<void>;
  protected abstract act(): Promise<void>;
  protected abstract learn(): Promise<void>;

  // Communication System
  protected async communicate(): Promise<void> {
    // Process incoming messages
    while (this.message_queue.length > 0) {
      const message = this.message_queue.shift()!;
      await this.processMessage(message);
    }
  }

  public receiveMessage(message: AgentMessage): void {
    this.message_queue.push(message);
    this.emit('message_received', { agent_id: this.id, message });
  }

  protected async processMessage(message: AgentMessage): Promise<void> {
    // Store in memory
    this.addToMemory({
      id: `msg_${message.id}`,
      content: message,
      timestamp: new Date(),
      importance: message.priority / 10,
      decay_rate: 0.1,
      associations: [message.from]
    });

    // Respond based on message type
    switch (message.type) {
      case 'inform':
        await this.handleInformMessage(message);
        break;
      case 'request':
        await this.handleRequestMessage(message);
        break;
      case 'threat':
        await this.handleThreatMessage(message);
        break;
      // Add more message types as needed
    }
  }

  protected async handleInformMessage(message: AgentMessage): Promise<void> {
    // Update beliefs based on information received
    // This is where agents learn from each other
  }

  protected async handleRequestMessage(message: AgentMessage): Promise<void> {
    // Decide whether to fulfill the request
    // Consider relationship, current goals, resources
  }

  protected async handleThreatMessage(message: AgentMessage): Promise<void> {
    // Assess threat and take defensive action
    // Update threat model and alert other agents if necessary
  }

  // Memory Management
  protected initializeMemory(): void {
    this.memory = {
      short_term: [],
      long_term: [],
      episodic: [],
      semantic: [],
      working_memory: {
        current_focus: [],
        active_goals: [],
        recent_observations: [],
        decision_context: {}
      }
    };
  }

  protected addToMemory(item: MemoryItem): void {
    this.memory.short_term.push(item);
    
    // Consolidate to long-term if important enough
    if (item.importance > 0.7) {
      this.memory.long_term.push(item);
    }
    
    // Limit short-term memory size
    if (this.memory.short_term.length > 50) {
      this.memory.short_term = this.memory.short_term
        .sort((a, b) => b.importance - a.importance)
        .slice(0, 30);
    }
  }

  // Goal Management
  protected initializeGoals(): void {
    // Initialize goals based on persona type
    this.goals = this.createInitialGoals();
  }

  protected abstract createInitialGoals(): AgentGoal[];

  protected addGoal(goal: AgentGoal): void {
    this.goals.push(goal);
    this.goals.sort((a, b) => b.priority - a.priority);
    this.emit('goal_added', { agent_id: this.id, goal });
  }

  protected completeGoal(goalId: string): void {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.status = 'completed';
      goal.progress = 1;
      this.emit('goal_completed', { agent_id: this.id, goal });
    }
  }

  // Perception System
  protected initializePerception(): void {
    this.perception = {
      environment_state: {},
      other_agents: [],
      recent_events: [],
      threats_detected: [],
      opportunities_detected: []
    };
  }

  // Utility Methods
  protected getThinkingDelay(): number {
    // Vary thinking time based on persona characteristics
    const baseDelay = 1000; // 1 second
    const expertiseMultiplier = (6 - this.persona.skills.technical_expertise) * 0.2;
    return baseDelay * expertiseMultiplier;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API for external systems
  public getState(): AgentState {
    return this.state;
  }

  public getGoals(): AgentGoal[] {
    return [...this.goals];
  }

  public getMemory(): AgentMemory {
    return { ...this.memory };
  }

  public getPerception(): AgentPerception {
    return { ...this.perception };
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPersona(): Persona {
    return this.persona;
  }
}