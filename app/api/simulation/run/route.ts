import { NextRequest, NextResponse } from 'next/server';

// Multi-agent interaction types (local to API)
interface PersonaConnection {
  target_persona_id: string;
  relationship_type: 'unknown' | 'colleague' | 'friend' | 'adversary' | 'subordinate' | 'superior' | 'family';
  trust_level: number;
  influence_weight: number;
  communication_frequency: 'never' | 'rare' | 'occasional' | 'frequent' | 'constant';
  discovered_through?: string;
  interaction_history: PersonaInteraction[];
}

interface PersonaInteraction {
  id: string;
  timestamp: string;
  initiator_id: string;
  target_id: string;
  interaction_type: 'communication' | 'observation' | 'influence_attempt' | 'collaboration' | 'conflict';
  content: string;
  success: boolean;
  trust_change?: number;
  influence_applied?: number;
  context: string;
  outcome: string;
}

interface GroupDynamics {
  group_id: string;
  member_ids: string[];
  group_type: 'informal' | 'formal' | 'adversarial' | 'collaborative';
  cohesion_level: number;
  influence_network: Record<string, Record<string, number>>;
  communication_patterns: {
    dominant_speakers: string[];
    quiet_members: string[];
    information_flow: string;
  };
  emergent_behaviors: string[];
}

// Multi-agent simulation state
class MultiAgentSimulation {
  private personas: Map<string, Persona> = new Map();
  private connections: Map<string, PersonaConnection[]> = new Map();
  private groups: GroupDynamics[] = [];
  private interactionHistory: PersonaInteraction[] = [];
  
  constructor(personas: Persona[]) {
    personas.forEach(persona => {
      this.personas.set(persona.id, persona);
      this.connections.set(persona.id, persona.connections || []);
    });
  }
  
  // Discover potential connections between personas based on their characteristics
  discoverConnections(persona1Id: string, persona2Id: string): PersonaConnection | null {
    const persona1 = this.personas.get(persona1Id);
    const persona2 = this.personas.get(persona2Id);
    
    if (!persona1 || !persona2 || persona1Id === persona2Id) return null;
    
    // Check if connection already exists
    const existing = this.connections.get(persona1Id)?.find(c => c.target_persona_id === persona2Id);
    if (existing) return existing;
    
    // Calculate connection probability based on persona characteristics
    let connectionProbability = 0;
    let relationshipType: PersonaConnection['relationship_type'] = 'unknown';
    let trustLevel = 3; // Default neutral trust
    
    // Same organization type increases connection probability
    if (persona1.type === persona2.type) {
      connectionProbability += 0.4;
      relationshipType = 'colleague';
      trustLevel = 4;
    }
    
    // Similar backgrounds
    if (persona1.demographics.background === persona2.demographics.background) {
      connectionProbability += 0.3;
    }
    
    // Same location
    if (persona1.demographics.location === persona2.demographics.location) {
      connectionProbability += 0.2;
    }
    
    // Threat actors vs security practitioners (adversarial)
    if ((persona1.type === 'THREAT_ACTOR' && persona2.type === 'SECURITY_PRACTITIONER') ||
        (persona1.type === 'SECURITY_PRACTITIONER' && persona2.type === 'THREAT_ACTOR')) {
      relationshipType = 'adversary';
      trustLevel = 1;
      connectionProbability += 0.1; // They might know of each other
    }
    
    // Create connection if probability threshold is met
    if (connectionProbability > 0.3 || Math.random() < 0.1) { // 10% chance for random connections
      const connection: PersonaConnection = {
        target_persona_id: persona2Id,
        relationship_type: relationshipType,
        trust_level: trustLevel,
        influence_weight: this.calculateInfluenceWeight(persona1, persona2),
        communication_frequency: this.determineCommunicationFrequency(relationshipType),
        discovered_through: 'simulation_discovery',
        interaction_history: []
      };
      
      // Add bidirectional connection
      this.connections.get(persona1Id)?.push(connection);
      const reverseConnection = { ...connection, target_persona_id: persona1Id };
      this.connections.get(persona2Id)?.push(reverseConnection);
      
      return connection;
    }
    
    return null;
  }
  
  private calculateInfluenceWeight(persona1: Persona, persona2: Persona): number {
    let influence = 0.5; // Base influence
    
    // Higher technical expertise increases influence in technical contexts
    influence += (persona1.skills.technical_expertise - persona2.skills.technical_expertise) * 0.1;
    
    // Social traits (if available)
    if (persona1.social_traits && persona2.social_traits) {
      influence += (persona1.social_traits.influence_power - persona2.social_traits.influence_susceptibility) * 0.1;
    }
    
    return Math.max(0, Math.min(1, influence));
  }
  
  private determineCommunicationFrequency(relationshipType: PersonaConnection['relationship_type']): PersonaConnection['communication_frequency'] {
    switch (relationshipType) {
      case 'colleague': return 'frequent';
      case 'friend': return 'frequent';
      case 'family': return 'constant';
      case 'adversary': return 'rare';
      case 'superior': return 'occasional';
      case 'subordinate': return 'occasional';
      default: return 'rare';
    }
  }
  
  // Simulate interaction between two personas
  async simulateInteraction(initiatorId: string, targetId: string, context: string, aiClient: any): Promise<PersonaInteraction | null> {
    const initiator = this.personas.get(initiatorId);
    const target = this.personas.get(targetId);
    
    if (!initiator || !target) return null;
    
    const connection = this.connections.get(initiatorId)?.find(c => c.target_persona_id === targetId);
    
    // Generate interaction using AI
    const interactionPrompt = `
You are simulating an interaction between two personas in a cybersecurity scenario.

INITIATOR: ${initiator.name} (${initiator.type})
- Technical Expertise: ${initiator.skills.technical_expertise}/5
- Trust Level towards target: ${connection?.trust_level || 3}/5
- Relationship: ${connection?.relationship_type || 'unknown'}

TARGET: ${target.name} (${target.type})
- Technical Expertise: ${target.skills.technical_expertise}/5
- Security Awareness: ${target.skills.security_awareness}/5

CONTEXT: ${context}

Simulate what happens when ${initiator.name} attempts to interact with ${target.name} in this context. Consider:
- Their relationship type and trust level
- Their different expertise levels
- Potential for social engineering, collaboration, or conflict
- Realistic human behavior and responses

Respond with JSON:
{
  "interaction_type": "communication|observation|influence_attempt|collaboration|conflict",
  "content": "what the initiator says/does",
  "target_response": "how the target responds",
  "success": true/false,
  "trust_change": -2 to +2,
  "influence_applied": 0 to 1,
  "outcome": "description of the result"
}
    `;
    
    try {
      const response = await aiClient.chat.completions.create({
        model: 'grok-3',
        messages: [{ role: 'user', content: interactionPrompt }],
        temperature: 0.8,
        max_tokens: 500
      });
      
      const result = JSON.parse(response.choices[0].message.content);
      
      const interaction: PersonaInteraction = {
        id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        initiator_id: initiatorId,
        target_id: targetId,
        interaction_type: result.interaction_type,
        content: result.content,
        success: result.success,
        trust_change: result.trust_change || 0,
        influence_applied: result.influence_applied || 0,
        context: context,
        outcome: result.outcome
      };
      
      // Update trust levels
      if (connection && result.trust_change) {
        connection.trust_level = Math.max(1, Math.min(5, connection.trust_level + result.trust_change));
      }
      
      // Store interaction
      this.interactionHistory.push(interaction);
      connection?.interaction_history.push(interaction);
      
      return interaction;
    } catch (error) {
      console.error('Error simulating interaction:', error);
      return null;
    }
  }
  
  // Get personas that might interact in current context
  getPotentialInteractions(personaId: string, context: string): string[] {
    const connections = this.connections.get(personaId) || [];
    return connections
      .filter(c => c.communication_frequency !== 'never')
      .map(c => c.target_persona_id);
  }
  
  // Get current state for metrics
  getMetrics(): any {
    const totalConnections = Array.from(this.connections.values()).reduce((sum, conns) => sum + conns.length, 0);
    const totalPossibleConnections = this.personas.size * (this.personas.size - 1);
    
    return {
      total_interactions: this.interactionHistory.length,
      connection_discovery_rate: totalConnections / totalPossibleConnections,
      trust_network_density: totalConnections / totalPossibleConnections,
      group_formation_events: this.groups.length,
      social_engineering_attempts: this.interactionHistory.filter(i => 
        i.interaction_type === 'influence_attempt' && 
        i.outcome.includes('social engineering')
      ).length
    };
  }
}

// Initialize the AI client - you can switch between different providers
let aiClient: any = null;

// Try to initialize OpenAI-compatible client (Grok or OpenAI)
async function initializeAIClient() {
  if (aiClient) return aiClient;
  
  try {
    const { default: OpenAI } = await import('openai');
    
    // Check for Grok API key first
    if (process.env.XAI_API_KEY) {
      aiClient = new OpenAI({
        apiKey: process.env.XAI_API_KEY,
        baseURL: 'https://api.x.ai/v1',
      });
      console.log('Using Grok AI (xAI) for simulations');
      return aiClient;
    }
    
    // Fallback to OpenAI if available
    if (process.env.OPENAI_API_KEY) {
      aiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('Using OpenAI for simulations');
      return aiClient;
    }
    
    throw new Error('No AI API key found');
  } catch (error) {
    console.error('Failed to initialize AI client:', error);
    return null;
  }
}

interface Persona {
  id: string;
  name: string;
  type: 'THREAT_ACTOR' | 'SECURITY_PRACTITIONER' | 'REGULAR_USER';
  subtype: string;
  demographics: {
    age: number;
    background: string;
    location: string;
    languages: string[];
    nationality: string;
  };
  skills: {
    technical_expertise: number;
    privacy_concern: number;
    risk_tolerance: number;
    security_awareness: number;
  };
  behavioral_patterns: string[];
  motivation: string;
  position?: { x: number; y: number; z: number };
  // Multi-agent properties
  social_traits?: {
    communication_style: 'direct' | 'indirect' | 'persuasive' | 'collaborative' | 'aggressive';
    influence_susceptibility: number;
    influence_power: number;
    group_preference: 'leader' | 'follower' | 'independent' | 'observer';
    trust_default: number;
  };
  connections?: PersonaConnection[];
}

interface Scenario {
  id: number;
  title: string;
  description: string;
  system_context: {
    system_type: string;
  };
  workflow_steps: Array<{
    title: string;
    interface_description: string;
    user_prompt: string;
    available_actions: string[];
    security_elements: string[];
  }>;
  tasks: any[];
}

interface SimulationConfig {
  allow_free_form_actions?: boolean;
  action_exploration_mode?: boolean;
  threat_discovery_focus?: boolean;
  behavioral_diversity_weight?: number;
  multi_agent?: {
    enable_persona_interactions: boolean;
    interaction_discovery_rate: number;
    influence_propagation_enabled: boolean;
    group_formation_enabled: boolean;
    social_engineering_scenarios: boolean;
    max_interaction_depth: number;
    interaction_types: ('communication' | 'observation' | 'influence' | 'collaboration')[];
  };
}

interface SimulationRequest {
  personas: Persona[];
  scenario: Scenario;
  timeline_scope: string;
  speed: number;
  config?: SimulationConfig;
}

function generatePersonaPrompt(persona: Persona, step: any, config?: any): string {
  const isThreatFocused = config?.threat_discovery_focus ?? true;
  const isExplorationMode = config?.action_exploration_mode ?? true;
  
  return `
You are ${persona.name}, a ${persona.type.replace('_', ' ').toLowerCase()} with the following characteristics:

DEMOGRAPHICS:
- Age: ${persona.demographics.age}
- Background: ${persona.demographics.background}
- Location: ${persona.demographics.location}
- Languages: ${persona.demographics.languages.join(', ')}
- Nationality: ${persona.demographics.nationality}

SKILLS (1-5 scale):
- Technical Expertise: ${persona.skills.technical_expertise}/5
- Privacy Concern: ${persona.skills.privacy_concern}/5
- Risk Tolerance: ${persona.skills.risk_tolerance}/5
- Security Awareness: ${persona.skills.security_awareness}/5

BEHAVIORAL PATTERNS:
${persona.behavioral_patterns.map(pattern => `- ${pattern}`).join('\n')}

MOTIVATION: ${persona.motivation}

CURRENT SITUATION:
${step.interface_description}

WHAT YOU SEE:
${step.user_prompt}

SUGGESTED ACTIONS:
${step.available_actions.map((action: string, index: number) => `${index + 1}. ${action}`).join('\n')}

${step.security_elements?.length > 0 ? `
SECURITY INDICATORS VISIBLE:
${step.security_elements.map((element: string) => `• ${element}`).join('\n')}
` : ''}

Based on your persona characteristics, what action would you take? Consider:
- Your technical expertise level when evaluating technical elements
- Your security awareness when assessing risks
- Your risk tolerance when making decisions
- Your motivation and background when reasoning

You can choose from the suggested actions above OR describe any other action you would realistically take in this situation. ${isExplorationMode ? 'Be creative and consider what a real person with your characteristics might do, including unexpected behaviors, workarounds, or novel approaches.' : ''} ${isThreatFocused ? 'Think about potential security vulnerabilities or attack vectors you might discover or exploit.' : ''}

Respond with a JSON object containing:
{
  "chosen_action": "describe the action you would take (can be from suggestions or your own)",
  "reasoning": "detailed explanation of why you chose this action based on your persona characteristics",
  "security_assessment": "any security concerns or observations you notice",
  "confidence": 1-5,
  "thinking_process": "your internal thought process and decision-making steps",
  "observations": ["list", "of", "specific", "observations"],
  "option_evaluation": [
    {
      "option": "action option",
      "pros": ["advantages"],
      "cons": ["disadvantages"],
      "risk_level": "LOW|MEDIUM|HIGH|CRITICAL"
    }
  ],
  "uncertainty_points": ["any", "uncertainties", "or", "doubts"],
  "potential_vulnerabilities": ["any", "security", "vulnerabilities", "you", "notice", "or", "could", "exploit"]
}
`;
}

// Cosine similarity calculation
function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) return 0;
  
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

// LLM grades the demonstrated characteristics on 1-5 scale
async function getLLMCharacteristicGrading(persona: Persona, outputs: any[], client: any): Promise<number[]> {
  const prompt = `
You are an expert behavioral analyst. Based on the following persona definition and their actual actions/reasoning in a security scenario, grade how much each characteristic was demonstrated in their behavior.

DEFINED PERSONA CHARACTERISTICS:
- Technical Expertise: ${persona.skills.technical_expertise}/5
- Privacy Concern: ${persona.skills.privacy_concern}/5  
- Risk Tolerance: ${persona.skills.risk_tolerance}/5
- Security Awareness: ${persona.skills.security_awareness}/5

PERSONA ACTIONS AND REASONING:
${outputs.map(output => `
Step ${output.step}: ${output.step_title}
Action Taken: ${output.action}
Reasoning: ${output.reasoning}
Security Assessment: ${output.security_assessment || 'None provided'}
`).join('\n')}

Based on the actual behavior shown above, grade how much each characteristic was DEMONSTRATED (not defined) on a 1-5 scale:

1 = Very Low demonstration of this characteristic
2 = Low demonstration  
3 = Moderate demonstration
4 = High demonstration
5 = Very High demonstration

Respond with a JSON object:
{
  "technical_expertise_demonstrated": 1-5,
  "privacy_concern_demonstrated": 1-5,
  "risk_tolerance_demonstrated": 1-5,
  "security_awareness_demonstrated": 1-5,
  "grading_rationale": "Explain your grading based on specific actions and reasoning shown"
}
  #we added thisline
`;

  try {
    const model = process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo";
    
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a behavioral analysis expert. Grade demonstrated characteristics based on actual behavior, not persona definitions. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for consistent grading
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from LLM grader');

    const grading = JSON.parse(response);
    
    return [
      grading.technical_expertise_demonstrated || 3,
      grading.privacy_concern_demonstrated || 3,
      grading.risk_tolerance_demonstrated || 3,
      grading.security_awareness_demonstrated || 3
    ];
    
  } catch (error) {
    console.error('Error in LLM characteristic grading:', error);
    // Fallback to middle values if LLM grading fails
    return [3, 3, 3, 3];
  }
}

// LLM categorizes actions into behavioral types
async function getLLMActionCategorization(outputs: any[], client: any): Promise<string[]> {
  const prompt = `
You are a behavioral categorization expert. Analyze these security-related actions and categorize each one based on the BEHAVIORAL APPROACH taken, not the literal action.

ACTIONS TO CATEGORIZE:
${outputs.map((output, index) => `
${index + 1}. Persona: ${output.persona_name}
   Action: ${output.action}
   Reasoning: ${output.reasoning}
   Security Assessment: ${output.security_assessment || 'None'}
`).join('\n')}

Categorize each action into ONE of these behavioral categories:
- "CAUTIOUS_VERIFICATION" - Careful checking, validation, seeking confirmation
- "IMMEDIATE_BLOCKING" - Quick defensive actions, blocking, deleting
- "RISK_TAKING" - Clicking, downloading, proceeding despite warnings  
- "EXPERT_ANALYSIS" - Technical investigation, header checking, forensic approach
- "DELEGATION" - Forwarding to others, seeking help from authorities
- "IGNORE_DISMISS" - Dismissing, ignoring, minimal engagement
- "SOCIAL_ENGINEERING_AWARE" - Recognizing manipulation tactics
- "COMPLIANCE_FOCUSED" - Following policies, procedures, protocols
- "CREATIVE_WORKAROUND" - Novel approaches, unexpected solutions, creative thinking
- "EXPLORATORY_BEHAVIOR" - Investigating, testing, experimenting with the system
- "SECURITY_BYPASS" - Attempting to circumvent security measures
- "UNCONVENTIONAL_ACTION" - Actions not fitting standard categories

Respond with a JSON array of categories in the same order as the actions:
{
  "action_categories": ["CATEGORY1", "CATEGORY2", ...],
  "categorization_rationale": "Brief explanation of categorization approach"
}
`;

  try {
    const model = process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo";
    
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a behavioral analysis expert. Categorize actions based on behavioral approach, not literal content. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2, // Lower temperature for consistent categorization
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from LLM categorizer');

    const categorization = JSON.parse(response);
    return categorization.action_categories || [];
    
  } catch (error) {
    console.error('Error in LLM action categorization:', error);
    // Fallback to simple categorization
    return outputs.map(() => 'UNKNOWN_BEHAVIOR');
  }
}

// LLM analyzes and extracts vulnerabilities from simulation outputs
async function getLLMVulnerabilityAnalysis(outputs: any[], scenario: any, client: any): Promise<Array<{
  id: string;
  persona_id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  step: number;
}>> {
  const prompt = `
You are a cybersecurity vulnerability expert. Analyze these simulation outputs to identify security vulnerabilities that were discovered, missed, or created by the personas' actions.

SCENARIO CONTEXT:
Title: ${scenario?.title || 'Unknown'}
Description: ${scenario?.description || 'Unknown'}
System Type: ${scenario?.system_context?.system_type || 'Unknown'}

SIMULATION OUTPUTS:
${outputs.filter(o => !o.error).map(output => `
Persona: ${output.persona_name} (${output.persona_id})
Step ${output.step}: ${output.step_title}
Action: ${output.action}
Reasoning: ${output.reasoning}
Security Assessment: ${output.security_assessment || 'None provided'}
---
`).join('\n')}

Identify ALL security vulnerabilities from these outputs. Look for:
1. Vulnerabilities DISCOVERED by personas (mentioned in their security assessments)
2. Vulnerabilities MISSED (risky actions taken without proper assessment)
3. Vulnerabilities CREATED (actions that introduce new security risks)

For each vulnerability found, classify the TYPE and SEVERITY:

VULNERABILITY TYPES:
- phishing_attack, malware_threat, social_engineering, credential_theft, 
- data_exposure, malicious_link, access_violation, policy_violation,
- authentication_bypass, privilege_escalation, information_disclosure

SEVERITY LEVELS:
- critical: Could lead to complete system compromise
- high: Could lead to significant data loss or unauthorized access  
- medium: Could lead to limited unauthorized access or data exposure
- low: Minor security concern with limited impact

Respond with a JSON array:
{
  "vulnerabilities": [
    {
      "persona_id": "persona_id_here",
      "type": "vulnerability_type",
      "severity": "critical|high|medium|low", 
      "description": "Detailed description of the vulnerability",
      "step": step_number,
      "discovery_method": "how this vulnerability was identified (discovered/missed/created)"
    }
  ],
  "analysis_summary": "Overall vulnerability assessment summary"
}
`;

  try {
    const model = process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo";
    
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert. Identify and classify security vulnerabilities from simulation data. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) throw new Error('No response from LLM vulnerability analyzer');

    const analysis = JSON.parse(response);
    
    return (analysis.vulnerabilities || []).map((vuln: any, index: number) => ({
      id: `llm_vuln_${index}_${vuln.type}`,
      persona_id: vuln.persona_id,
      type: vuln.type,
      severity: vuln.severity,
      description: vuln.description,
      step: vuln.step || 0
    }));
    
  } catch (error) {
    console.error('Error in LLM vulnerability analysis:', error);
    return [];
  }
}

// LLM-DRIVEN Persona Fidelity Index - Paper Formula: PFI(pi) = C⃗(pi)·⃗S(pi) / |C⃗(pi)|·|⃗S(pi)|
async function calculatePersonaFidelityIndexLLM(personas: Persona[], outputs: any[], client: any): Promise<Record<string, number>> {
  const fidelityScores: Record<string, number> = {};
  
  for (const persona of personas) {
    const personaOutputs = outputs.filter(o => o.persona_id === persona.id && !o.error);
    
    if (personaOutputs.length === 0) {
      fidelityScores[persona.id] = 0;
      continue;
    }
    
    // Defined characteristics vector C⃗(pi) - from persona definition
    const definedVector = [
      persona.skills.technical_expertise,
      persona.skills.privacy_concern, 
      persona.skills.risk_tolerance,
      persona.skills.security_awareness
    ];
    
    // LLM-generated demonstrated characteristics vector ⃗S(pi)
    const demonstratedVector = await getLLMCharacteristicGrading(persona, personaOutputs, client);
    
    // Calculate cosine similarity
    const fidelityScore = cosineSimilarity(definedVector, demonstratedVector);
    fidelityScores[persona.id] = Math.max(-1, Math.min(1, fidelityScore)); // Clamp to [-1, 1]
  }
  
  return fidelityScores;
}

// Behavioral Diversity Index implementation
// Following Section 2.1.2: "DI(scenario) = -∑(j=1 to m) p(aj)log p(aj)"
async function calculateBehavioralDiversityIndexLLM(outputs: any[], client: any): Promise<number> {
  if (outputs.length === 0) return 0;
  
  const validOutputs = outputs.filter(o => !o.error);
  if (validOutputs.length === 0) return 0;

  // Step 1: Create persona-action matrix grouped by step
  const stepMap: Record<number, { 
    actions: Record<string, string[]>, // Map of action -> array of persona_ids
    personaCount: number              // Unique personas in this step
  }> = {};
  
  // Organize outputs by step and collect unique personas per step
  validOutputs.forEach(output => {
    const step = output.step || 1;
    const personaId = output.persona_id;
    const action = output.action;
    
    if (!stepMap[step]) {
      stepMap[step] = { 
        actions: {},
        personaCount: 0
      };
    }
    
    if (!stepMap[step].actions[action]) {
      stepMap[step].actions[action] = [];
    }
    
    // Only add persona once per action per step
    if (!stepMap[step].actions[action].includes(personaId)) {
      stepMap[step].actions[action].push(personaId);
    }
  });
  
  // Count unique personas per step
  Object.keys(stepMap).forEach(stepKey => {
    const step = Number(stepKey);
    const uniquePersonas = new Set<string>();
    
    Object.values(stepMap[step].actions).forEach(personaIds => {
      personaIds.forEach(id => uniquePersonas.add(id));
    });
    
    stepMap[step].personaCount = uniquePersonas.size;
  });

  // Step 2: Calculate entropy for each step per paper's formula
  let totalEntropy = 0;
  let stepCount = 0;
  
  Object.entries(stepMap).forEach(([stepKey, stepData]) => {
    const { actions, personaCount } = stepData;
    
    // Skip steps with only one persona (no diversity possible)
    if (personaCount <= 1) return;
    
    let stepEntropy = 0;
    
    // For each action, calculate p(aj) = proportion of personas performing the action
    Object.entries(actions).forEach(([action, personaIds]) => {
      // p(aj) is the proportion of personas that perform action aj
      const probability = personaIds.length / personaCount;
      if (probability > 0) {
        stepEntropy -= probability * Math.log2(probability);
      }
    });
    
    totalEntropy += stepEntropy;
    stepCount++;
  });
  
  // Average entropy across steps
  const diversityIndex = stepCount > 0 ? totalEntropy / stepCount : 0;
  
  return diversityIndex;
}

// LLM-DRIVEN Vulnerability Detection using LLM analysis
async function calculateVulnerabilityDetectionRateLLM(outputs: any[], scenario: any, client: any) {
  const vulnerabilities = await getLLMVulnerabilityAnalysis(outputs, scenario, client);
  
  // Remove duplicates based on type and persona
  const uniqueVulnerabilities = vulnerabilities.filter((vuln, index, arr) => 
    arr.findIndex(v => v.type === vuln.type && v.persona_id === vuln.persona_id) === index
  );
  
  const severityCounts = {
    low: uniqueVulnerabilities.filter(v => v.severity === 'low').length,
    medium: uniqueVulnerabilities.filter(v => v.severity === 'medium').length,
    high: uniqueVulnerabilities.filter(v => v.severity === 'high').length,
    critical: uniqueVulnerabilities.filter(v => v.severity === 'critical').length
  };
  
  const scenariosTestd = scenario?.workflow_steps?.length || 1;
  
  return {
    unique_vulnerabilities: uniqueVulnerabilities.length,
    total_vulnerabilities: vulnerabilities.length,
    discovery_rate: uniqueVulnerabilities.length / scenariosTestd,
    severity_breakdown: severityCounts,
    critical_count: severityCounts.critical,
    high_count: severityCounts.high,
    vulnerabilities_detail: uniqueVulnerabilities
  };
}

// Comprehensive evaluation metrics implementation using LLM grading
async function calculateComprehensiveMetrics(personas: Persona[], outputs: any[], scenario: any, client: any) {
  console.log('Starting LLM-driven evaluation...');
  
  const personaFidelityScores = await calculatePersonaFidelityIndexLLM(personas, outputs, client);
  const behavioralDiversityIndex = await calculateBehavioralDiversityIndexLLM(outputs, client);
  const vulnerabilityDetectionRate = await calculateVulnerabilityDetectionRateLLM(outputs, scenario, client);
  
  return {
    total_personas: personas.length,
    total_steps: outputs.length,
    average_confidence: outputs.reduce((sum, output) => sum + (output.confidence || 0), 0) / outputs.length,
    persona_fidelity_scores: personaFidelityScores,
    behavioral_diversity_index: behavioralDiversityIndex,
    vulnerability_detection_rate: vulnerabilityDetectionRate,
    execution_time: new Date().toISOString(),
    evaluation_summary: {
      average_fidelity: Object.values(personaFidelityScores).reduce((sum: number, score: any) => sum + score, 0) / Object.keys(personaFidelityScores).length,
      diversity_entropy: behavioralDiversityIndex,
      unique_vulnerabilities_found: vulnerabilityDetectionRate.unique_vulnerabilities,
      critical_vulnerabilities: vulnerabilityDetectionRate.critical_count
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json();
    const { personas, scenario, timeline_scope, speed, config } = body;

    // Initialize AI client
    const client = await initializeAIClient();
    if (!client) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set XAI_API_KEY or OPENAI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    // Require user-defined scenario - no default fallback
    if (!scenario || !scenario.workflow_steps || scenario.workflow_steps.length === 0) {
      return NextResponse.json(
        { error: 'Scenario is required. Please create a scenario using the scenario builder.' },
        { status: 400 }
      );
    }

    const activeScenario = scenario;
    const simulationOutputs = [];
    
    // Initialize multi-agent simulation if enabled
    let multiAgentSim: MultiAgentSimulation | null = null;
    const multiAgentConfig = config?.multi_agent;
    
    if (multiAgentConfig?.enable_persona_interactions && personas.length > 1) {
      multiAgentSim = new MultiAgentSimulation(personas);
      console.log('Multi-agent simulation enabled with', personas.length, 'personas');
    }

    // Run simulation for each persona
    for (const persona of personas) {
      let stepCounter = 1;
      
      // Process each workflow step
      for (const step of activeScenario.workflow_steps) {
        try {
          // Multi-agent: Discover connections before processing this step
          let discoveredConnections: PersonaConnection[] = [];
          let stepInteractions: PersonaInteraction[] = [];
          
          if (multiAgentSim && Math.random() < (multiAgentConfig?.interaction_discovery_rate || 0.3)) {
            // Try to discover connections with other personas
            for (const otherPersona of personas) {
              if (otherPersona.id !== persona.id) {
                const connection = multiAgentSim.discoverConnections(persona.id, otherPersona.id);
                if (connection) {
                  discoveredConnections.push(connection);
                  console.log(`Discovered connection: ${persona.name} -> ${otherPersona.name} (${connection.relationship_type})`);
                }
              }
            }
          }
          
          // Multi-agent: Simulate interactions if connections exist
          if (multiAgentSim && multiAgentConfig?.enable_persona_interactions) {
            const potentialTargets = multiAgentSim.getPotentialInteractions(persona.id, step.title);
            
            for (const targetId of potentialTargets.slice(0, 2)) { // Limit to 2 interactions per step
              const interaction = await multiAgentSim.simulateInteraction(
                persona.id, 
                targetId, 
                `During step: ${step.title} - ${step.interface_description}`,
                client
              );
              
              if (interaction) {
                stepInteractions.push(interaction);
                console.log(`Interaction: ${persona.name} -> ${personas.find(p => p.id === targetId)?.name}: ${interaction.outcome}`);
              }
            }
          }
          
          // Create enhanced prompt that includes multi-agent context
          let prompt = generatePersonaPrompt(persona, step, config);
          
          // Add multi-agent context to prompt if interactions occurred
          if (stepInteractions.length > 0 || discoveredConnections.length > 0) {
            prompt += `

SOCIAL CONTEXT:
${discoveredConnections.length > 0 ? `You have discovered these connections to other people in the system:
${discoveredConnections.map(c => `- ${personas.find(p => p.id === c.target_persona_id)?.name}: ${c.relationship_type} (trust level: ${c.trust_level}/5)`).join('\n')}` : ''}

${stepInteractions.length > 0 ? `Recent interactions with others:
${stepInteractions.map(i => `- ${i.interaction_type} with ${personas.find(p => p.id === i.target_id)?.name}: ${i.outcome}`).join('\n')}` : ''}

Consider how these relationships and interactions might influence your decision in this step.`;
          }
          
          console.log(`Running simulation for ${persona.name} - Step ${stepCounter}`);
          
          // Determine which model to use
          const model = process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo";
          
          const completion = await client.chat.completions.create({
            model: model,
            messages: [
              {
                role: "system",
                content: "You are a behavioral simulation system. Respond only with valid JSON matching the requested format. Stay in character as the specified persona. Be realistic and consider the persona's background when making decisions. Consider social context and relationships with others."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000,
          });

          const response = completion.choices[0]?.message?.content;
          
          if (!response) {
            throw new Error('No response from AI service');
          }

          // Parse the JSON response
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(response);
          } catch (parseError) {
            console.error('Failed to parse AI response:', response);
            // Fallback response if JSON parsing fails
            parsedResponse = {
              chosen_action: "Unable to parse response",
              reasoning: "Error in response format",
              security_assessment: "No assessment available",
              confidence: 1,
              thinking_process: response,
              observations: ["Response parsing failed"],
              option_evaluation: [
                {
                  option: "Default option",
                  pros: ["Fallback response"],
                  cons: ["Parse error occurred"],
                  risk_level: "UNKNOWN"
                }
              ],
              uncertainty_points: ["Unable to process AI response properly"]
            };
          }

          // Check if action is from predefined list or free-form
          const isActionPredefined = step.available_actions.some(
            (availableAction: string) => availableAction.toLowerCase().trim() === parsedResponse.chosen_action.toLowerCase().trim()
          );

          simulationOutputs.push({
            id: `${persona.id}_${stepCounter}`,
            persona_id: persona.id,
            persona_name: persona.name,
            step: stepCounter,
            action: parsedResponse.chosen_action,
            reasoning: parsedResponse.reasoning,
            security_assessment: parsedResponse.security_assessment,
            confidence: parsedResponse.confidence,
            thinking: parsedResponse.thinking_process,
            thinking_process: {
              initial_assessment: parsedResponse.reasoning || 'No assessment provided',
              observations: Array.isArray(parsedResponse.observations) ? parsedResponse.observations : [],
              option_evaluation: Array.isArray(parsedResponse.option_evaluation) ? parsedResponse.option_evaluation : [],
              decision_rationale: parsedResponse.reasoning || 'No rationale provided',
              uncertainty_points: Array.isArray(parsedResponse.uncertainty_points) ? parsedResponse.uncertainty_points : []
            },
            timestamp: new Date().toISOString(),
            step_title: step.title,
            potential_vulnerabilities: Array.isArray(parsedResponse.potential_vulnerabilities) ? parsedResponse.potential_vulnerabilities : [],
            is_free_form_action: !isActionPredefined,
            action_creativity_score: isActionPredefined ? 1 : Math.min(5, Math.max(1, Math.floor(Math.random() * 3) + 3)), // Random score 3-5 for free-form actions
            persona_skills: persona.skills, // Store for fidelity calculation
            // Multi-agent interaction data
            interactions_initiated: stepInteractions.filter(i => i.initiator_id === persona.id),
            interactions_received: stepInteractions.filter(i => i.target_id === persona.id),
            influence_applied: stepInteractions
              .filter(i => i.initiator_id === persona.id)
              .reduce((sum, i) => sum + (i.influence_applied || 0), 0),
            influence_received: stepInteractions
              .filter(i => i.target_id === persona.id)
              .reduce((sum, i) => sum + (i.influence_applied || 0), 0)
          });

          stepCounter++;
          
          // Add delay based on speed setting (simulate thinking time)
          const delay = Math.max(500, 2000 / speed); // Slower minimum for better observation
          await new Promise(resolve => setTimeout(resolve, delay));
          
        } catch (stepError) {
          console.error(`Error processing step ${stepCounter} for ${persona.name}:`, stepError);
          
          simulationOutputs.push({
            id: `${persona.id}_${stepCounter}_error`,
            persona_id: persona.id,
            persona_name: persona.name,
            step: stepCounter,
            action: "Simulation error occurred",
            reasoning: `Error: ${stepError instanceof Error ? stepError.message : 'Unknown error'}`,
            security_assessment: "Unable to assess due to error",
            confidence: 1,
            thinking_process: {
              initial_assessment: "Simulation encountered an error",
              observations: ["Error occurred during simulation"],
              option_evaluation: [
                {
                  option: "Error handling",
                  pros: ["Graceful error handling"],
                  cons: ["No useful simulation data"],
                  risk_level: "UNKNOWN"
                }
              ],
              decision_rationale: `Error: ${stepError instanceof Error ? stepError.message : 'Unknown error'}`,
              uncertainty_points: ["Simulation data unavailable due to error"]
            },
            timestamp: new Date().toISOString(),
            step_title: step.title,
            error: true,
            persona_skills: persona.skills
          });
          
          stepCounter++;
        }
      }
    }

    console.log('Simulation completed, starting LLM evaluation...');

    // Calculate comprehensive evaluation metrics using LLM
    const evaluationMetrics = await calculateComprehensiveMetrics(personas, simulationOutputs, activeScenario, client);
    
    // Add multi-agent metrics if multi-agent simulation was used
    let multiAgentMetrics = {};
    if (multiAgentSim) {
      multiAgentMetrics = multiAgentSim.getMetrics();
      console.log('Multi-agent metrics calculated:', multiAgentMetrics);
    }

    console.log('LLM evaluation completed');

    return NextResponse.json({
      success: true,
      outputs: simulationOutputs,
      metrics: {
        ...evaluationMetrics,
        ...multiAgentMetrics
      },
      scenario_used: activeScenario.title,
      ai_model: process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo",
      evaluation_framework: {
        persona_fidelity_scores: evaluationMetrics.persona_fidelity_scores,
        behavioral_diversity_index: evaluationMetrics.behavioral_diversity_index,
        vulnerability_detection_rate: evaluationMetrics.vulnerability_detection_rate,
        multi_agent_metrics: multiAgentMetrics
      }
    });

  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { 
        error: 'Simulation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}