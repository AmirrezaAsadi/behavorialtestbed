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

function generateSimplePhishingScenario() {
  return {
    id: 1,
    title: "Email Phishing Response",
    description: "Employee receives suspicious email and must decide how to respond",
    system_context: {
      system_type: "email_system"
    },
    workflow_steps: [
      {
        title: "Email Inbox View",
        interface_description: "Corporate email interface showing inbox with list of emails",
        user_prompt: "You see a new email from 'IT-Support@company-security.com' with subject: 'URGENT: Security Update Required - Action Needed Within 24 Hours'",
        available_actions: [
          "Open email to read full content",
          "Delete email without reading",
          "Check sender details and headers",
          "Forward to IT department for verification",
          "Mark as spam/junk"
        ],
        security_elements: [
          "External sender warning indicator",
          "Subject line uses urgency tactics",
          "Sender domain doesn't match company domain"
        ]
      },
      {
        title: "Email Content View",
        interface_description: "Full email content displayed with formatted text and download button",
        user_prompt: "Email content: 'Dear Employee, Our security systems have detected unauthorized access attempts on your account. Please download and run the attached security patch immediately to protect your data. Click here to download: [DOWNLOAD SECURITY UPDATE]'",
        available_actions: [
          "Click download link",
          "Reply asking for verification",
          "Close email and report to IT security",
          "Check email headers for authenticity",
          "Call IT department to verify"
        ],
        security_elements: [
          "Generic greeting (no personal name)",
          "Urgency pressure tactics",
          "Suspicious download link",
          "No official company signature"
        ]
      }
    ],
    tasks: []
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

    // Use provided scenario or default phishing scenario
    const activeScenario = scenario || generateSimplePhishingScenario();
    
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
          const model = process.env.XAI_API_KEY ? "grok-beta" : "gpt-3.5-turbo";
          
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
            step_title: step.title
          });

          stepCounter++;
          
          // Add delay based on speed setting (simulate thinking time)
          const delay = Math.max(100, 1000 / speed);
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
            error: true
          });
          
          stepCounter++;
        }
      }
    }

    // Calculate basic metrics
    const metrics = {
      total_personas: personas.length,
      total_steps: simulationOutputs.length,
      average_confidence: simulationOutputs.reduce((sum, output) => sum + (output.confidence || 0), 0) / simulationOutputs.length,
      behavioral_diversity: personas.length > 1 ? calculateBehavioralDiversity(simulationOutputs) : null,
      vulnerability_discoveries: countVulnerabilityDiscoveries(simulationOutputs),
      execution_time: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      outputs: simulationOutputs,
      metrics: metrics,
      scenario_used: activeScenario.title,
      ai_model: process.env.XAI_API_KEY ? "grok-beta" : "gpt-3.5-turbo"
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

function calculateBehavioralDiversity(outputs: any[]): number {
  // Simple behavioral diversity calculation based on action variety
  const actionsByPersona: { [key: string]: Set<string> } = {};
  
  outputs.forEach(output => {
    if (!actionsByPersona[output.persona_id]) {
      actionsByPersona[output.persona_id] = new Set();
    }
    actionsByPersona[output.persona_id].add(output.action);
  });
  
  const totalUniqueActions = new Set(outputs.map(o => o.action)).size;
  const avgActionsPerPersona = Object.values(actionsByPersona)
    .reduce((sum, actions) => sum + actions.size, 0) / Object.keys(actionsByPersona).length;
  
  // Return a normalized diversity score
  return Math.min(avgActionsPerPersona / totalUniqueActions, 1.0);
}

function countVulnerabilityDiscoveries(outputs: any[]): number {
  // Count potential security issues identified
  return outputs.filter(output => 
    output.security_assessment && 
    (output.security_assessment.toLowerCase().includes('risk') ||
     output.security_assessment.toLowerCase().includes('suspicious') ||
     output.security_assessment.toLowerCase().includes('threat') ||
     output.security_assessment.toLowerCase().includes('vulnerability'))
  ).length;
}