// Core persona and simulation types

export interface Persona {
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
    technical_expertise: number; // 1-5
    privacy_concern: number;     // 1-5
    risk_tolerance: number;      // 1-5
    security_awareness: number;  // 1-5
  };
  behavioral_patterns: string[];
  motivation: string;
  position?: { x: number; y: number; z: number };
}

export interface WorkflowStep {
  id: number;
  title: string;
  interface_description: string;
  user_prompt: string;
  available_actions: string[];
  system_responses: Record<string, string>;
  security_elements: string[];
  decision_points: DecisionPoint[];
  is_critical?: boolean;
}

export interface DecisionPoint {
  question: string;
  options: string[];
  security_impact: string;
  correct_choice?: string;
  is_security_critical: boolean;
}

export interface Scenario {
  id: number;
  title: string;
  description: string;
  system_context: {
    system_type: string;
    user_goals: string[];
    environmental_factors: string[];
    security_requirements: string[];
    constraints: string[];
  };
  workflow_steps: WorkflowStep[];
  success_criteria: string[];
  security_elements: string[];
}



export interface SimulationOutput {
  id: string;
  persona_id: string;
  persona_name: string;
  step: number;
  action: string;
  action_category?: string; // For action matrix analysis
  reasoning: string;
  security_assessment: string;
  confidence: number;
  thinking?: string;
  thinking_process?: {
    initial_assessment: string;
    observations: string[];
    option_evaluation: {
      option: string;
      pros: string[];
      cons: string[];
      risk_level: string;
    }[];
    decision_rationale: string;
    uncertainty_points: string[];
  };
  timestamp: string;
  step_title?: string;
  error?: boolean;
  vulnerabilities_found?: string[]; // Track vulnerabilities discovered
  persona_characteristics_displayed?: {
    technical_expertise: number;
    privacy_concern: number;
    risk_tolerance: number;
    security_awareness: number;
  }; // LLM-assessed characteristics for PFI calculation
}

export interface SimulationRequest {
  personas: Persona[];
  scenario: Scenario;
  timeline_scope: TimelineScope;
  speed: number;
}

export interface SimulationResponse {
  success: boolean;
  outputs: SimulationOutput[];
  metrics: SimulationMetrics;
  scenario_used: string;
  error?: string;
  details?: string;
}

export interface SimulationMetrics {
  total_personas: number;
  total_steps: number;
  average_confidence: number;
  behavioral_diversity: number | null;
  vulnerability_discoveries: number;
  execution_time: string;
  persona_fidelity_scores?: Record<string, number>;
}

export type TimelineScope = 
  | 'single-interaction'  // 30s - 5min
  | 'single-session'      // 5min - 30min  
  | 'multi-session'       // Hours - Days
  | 'long-term';          // Weeks - Months

export interface PersonaState {
  current_alertness: number;
  security_fatigue: number;
  trust_relationships: Record<string, number>;
  learned_patterns: string[];
  recent_experiences: Experience[];
}

export interface Experience {
  timestamp: string;
  type: string;
  outcome: string;
  success: boolean;
}

export interface VulnerabilityDiscovery {
  id: string;
  persona_id: string;
  vulnerability_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  discovery_method: string;
  timestamp: string;
}

export interface EvaluationMetrics {
  persona_fidelity_index: number;    // Cosine similarity (-1 to 1)
  behavioral_diversity_index: number; // Shannon entropy
  vulnerability_discovery_rate: number; // Unique vulnerabilities found
  // Extended metrics for the evaluation framework
  persona_fidelity_scores?: Record<string, number>;
  action_entropy: number;
  action_matrix?: Record<string, Record<string, number>>;
  vulnerability_detection_rate?: {
    unique_vulnerabilities: number;
    critical_count: number;
    discovery_scores: Record<string, number>;
    vulnerabilities_detail: Array<{
      type: string;
      severity: string;
      persona_id: string;
      step: number;
    }>;
  };
}

// UI State types
export interface AppState {
  activeTab: 'personas' | 'scenarios' | 'simulation';
  selectedPersonas: Persona[];
  activeScenario: Scenario | null;
  isRunning: boolean;
  simulationOutputs: SimulationOutput[];
  timelineScope: TimelineScope;
  speed: number;
}

// API Response types
export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// LLM Integration types
export interface LLMPrompt {
  persona: Persona;
  scenario_step: WorkflowStep;
  context?: string;
  previous_actions?: SimulationOutput[];
}

export interface LLMResponse {
  chosen_action: string;
  reasoning: string;
  security_assessment: string;
  confidence: number;
  thinking_process: string;
  alternative_considered?: string;
}

// Predefined persona templates
export interface PersonaTemplate {
  id: string;
  name: string;
  category: 'threat_actor' | 'security_practitioner' | 'regular_user';
  template: Omit<Persona, 'id'>;
}

// Scenario templates
export interface ScenarioTemplate {
  id: string;
  name: string;
  category: 'phishing' | 'authentication' | 'social_engineering' | 'privacy' | 'mobile_security';
  template: Omit<Scenario, 'id'>;
}

// Analytics and reporting
export interface AnalyticsReport {
  simulation_id: string;
  timestamp: string;
  personas_tested: number;
  scenarios_completed: number;
  total_vulnerabilities: number;
  key_findings: string[];
  recommendations: string[];
  detailed_metrics: EvaluationMetrics;
}

// Export utility type for form handling
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// GOMS Framework Interfaces
export interface GOMSUIElement {
  element_id: string;
  position: string; // e.g., "top-left", "main-area", "toolbar"
  interaction_type: 'clickable' | 'hoverable' | 'scrollable' | 'input';
  description?: string;
}

export interface GOMSOperator {
  id: string;
  name: string; // e.g., "EMAIL_INITIAL_VIEW", "SENDER_INVESTIGATION"
  description: string;
  available_actions: string[]; // e.g., ["scan_header", "read_content", "check_sender"]
  next_steps: string[]; // IDs of possible next operators
  decision_point: string; // e.g., "What catches attention first?"
  ui_context: {
    focused_elements: GOMSUIElement[];
  };
  position?: { x: number; y: number }; // For visual flow builder positioning
}

export interface GOMSFlow {
  id: string;
  name: string;
  description: string;
  goal: string;
  operators: GOMSOperator[];
}

// Helper for converting between GOMS and WorkflowStep
export function convertGOMSToWorkflow(gomsFlow: GOMSFlow): WorkflowStep[] {
  return gomsFlow.operators.map((operator, index) => {
    // Find critical elements based on position or interaction type
    const criticalElements = operator.ui_context.focused_elements.filter(
      el => el.position.includes('modal') || el.interaction_type === 'input'
    );
    
    return {
      id: index + 1,
      title: operator.name,
      interface_description: operator.description,
      user_prompt: operator.decision_point,
      available_actions: operator.available_actions,
      system_responses: {},
      security_elements: operator.ui_context.focused_elements.map(element => 
        `${element.element_id} (${element.position})`
      ),
      decision_points: [{
        question: operator.decision_point,
        options: operator.next_steps,
        security_impact: criticalElements.length > 0 
          ? `Interaction with ${criticalElements.length} critical elements` 
          : "Low security impact",
        is_security_critical: criticalElements.length > 0
      }],
      is_critical: criticalElements.length > 0
    };
  });
}

export function convertWorkflowToGOMS(steps: WorkflowStep[]): GOMSFlow {
  const operators = steps.map((step, index) => {
    // Parse security elements to extract UI elements
    const focusedElements = step.security_elements.map(element => {
      const matches = element.match(/(.+) \((.+)\)/);
      return {
        element_id: matches?.[1] || element,
        position: matches?.[2] || "unknown",
        interaction_type: "clickable" as const,
        description: ""
      };
    });

    // If no security elements with parsed format, create generic ones
    if (focusedElements.length === 0 && step.security_elements.length > 0) {
      step.security_elements.forEach((element, i) => {
        focusedElements.push({
          element_id: element,
          position: "unknown",
          interaction_type: "clickable",
          description: ""
        });
      });
    }

    return {
      id: `operator_${step.id}`,
      name: step.title,
      description: step.interface_description,
      available_actions: step.available_actions,
      next_steps: step.decision_points?.[0]?.options || [],
      decision_point: step.user_prompt || step.decision_points?.[0]?.question || "",
      ui_context: {
        focused_elements: focusedElements
      }
    };
  });

  return {
    id: `flow_${Date.now()}`,
    name: "Converted Flow",
    description: "Flow converted from WorkflowSteps",
    goal: "Automated conversion from existing workflow steps",
    operators
  };
}