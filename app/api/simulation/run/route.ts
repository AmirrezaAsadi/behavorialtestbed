import { NextRequest, NextResponse } from 'next/server';

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

interface SimulationRequest {
  personas: Persona[];
  scenario: Scenario;
  timeline_scope: string;
  speed: number;
}

function generatePersonaPrompt(persona: Persona, step: any): string {
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

AVAILABLE ACTIONS:
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

Respond with a JSON object containing:
{
  "chosen_action": "exact action from the list above",
  "reasoning": "detailed explanation of why you chose this action based on your persona characteristics",
  "security_assessment": "any security concerns or observations you notice",
  "confidence": 1-5,
  "thinking_process": "your internal thought process and decision-making steps"
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
`;

  try {
    const model = process.env.XAI_API_KEY ? "grok-33" : "gpt-3.5-turbo";
    
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

// LLM-DRIVEN Behavioral Diversity Index using LLM action categorization
async function calculateBehavioralDiversityIndexLLM(outputs: any[], client: any): Promise<number> {
  if (outputs.length === 0) return 0;
  
  const validOutputs = outputs.filter(o => !o.error);
  if (validOutputs.length === 0) return 0;

  // Get LLM to categorize actions into behavioral types
  const actionCategories = await getLLMActionCategorization(validOutputs, client);
  
  // Calculate Shannon entropy: H = -∑p(x)log₂p(x)
  const categoryCounts: Record<string, number> = {};
  actionCategories.forEach(category => {
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  const totalActions = actionCategories.length;
  let entropy = 0;
  
  Object.values(categoryCounts).forEach(count => {
    const probability = count / totalActions;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  });
  
  return entropy;
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
    const { personas, scenario, timeline_scope, speed } = body;

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

    // Run simulation for each persona
    for (const persona of personas) {
      let stepCounter = 1;
      
      // Process each workflow step
      for (const step of activeScenario.workflow_steps) {
        try {
          const prompt = generatePersonaPrompt(persona, step);
          
          console.log(`Running simulation for ${persona.name} - Step ${stepCounter}`);
          
          // Determine which model to use
          const model = process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo";
          
          const completion = await client.chat.completions.create({
            model: model,
            messages: [
              {
                role: "system",
                content: "You are a behavioral simulation system. Respond only with valid JSON matching the requested format. Stay in character as the specified persona. Be realistic and consider the persona's background when making decisions."
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
              thinking_process: response
            };
          }

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
            timestamp: new Date().toISOString(),
            step_title: step.title,
            persona_skills: persona.skills // Store for fidelity calculation
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

    console.log('LLM evaluation completed');

    return NextResponse.json({
      success: true,
      outputs: simulationOutputs,
      metrics: evaluationMetrics,
      scenario_used: activeScenario.title,
      ai_model: process.env.XAI_API_KEY ? "grok-3" : "gpt-3.5-turbo",
      evaluation_framework: {
        persona_fidelity_scores: evaluationMetrics.persona_fidelity_scores,
        behavioral_diversity_index: evaluationMetrics.behavioral_diversity_index,
        vulnerability_detection_rate: evaluationMetrics.vulnerability_detection_rate
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