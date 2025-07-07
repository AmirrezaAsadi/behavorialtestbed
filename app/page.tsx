'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// Complete SVG icons with props support
interface IconProps {
  className?: string;
  size?: number;
}

const Icons = {
  Play: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="5,3 19,12 5,21"></polygon>
    </svg>
  ),
  Pause: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  ),
  FastForward: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="13,19 22,12 13,5"></polygon>
      <polygon points="2,19 11,12 2,5"></polygon>
    </svg>
  ),
  Clock: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  ),
  Calendar: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  Users: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  TrendingUp: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
      <polyline points="17,6 23,6 23,12"></polyline>
    </svg>
  ),
  AlertTriangle: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  CheckCircle: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22,4 12,14.01 9,11.01"></polyline>
    </svg>
  ),
  Zap: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>
    </svg>
  ),
  Settings: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Edit: ({ className = "", size = 14 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3l-9.5 9.5-5 1 1-5 9.5-9.5z"></path>
    </svg>
  ),
  Plus: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  X: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Save: ({ className = "", size = 16 }: IconProps = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17,21 17,13 7,13 7,21"></polyline>
      <polyline points="7,3 7,8 15,8"></polyline>
    </svg>
  )
};

// Complete type definitions
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
  position: { x: number; y: number; z: number };
}

interface WorkflowStep {
  id: number;
  title: string;
  interface_description: string;
  user_prompt: string;
  available_actions: string[];
  system_responses: Record<string, string>;
  security_elements: string[];
  decision_points: any[];
}

interface Scenario {
  id: number;
  title: string;
  description: string;
  system_context: {
    system_type: string;
    environmental_factors: string[];
    security_requirements: string[];
    constraints: string[];
  };
  workflow_steps: WorkflowStep[];
  tasks: any[];
  success_criteria: string[];
  security_elements: string[];
}

interface SimulationOutput {
  id: string;
  persona_id: string;
  persona_name: string;
  step: number;
  action: string;
  action_category: string; // For action matrix analysis
  reasoning: string;
  confidence: number;
  timestamp: string;
  step_title?: string;
  error?: boolean;
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
  security_assessment?: string;
  vulnerabilities_found?: string[]; // Track vulnerabilities discovered
  persona_characteristics_displayed?: {
    technical_expertise: number;
    privacy_concern: number;
    risk_tolerance: number;
    security_awareness: number;
  }; // LLM-assessed characteristics for PFI calculation
}

// New interfaces for evaluation framework
interface PersonaActionMatrix {
  [personaId: string]: {
    [actionCategory: string]: number; // Count of times this action was taken
  };
}

interface EvaluationMetrics {
  persona_fidelity_scores: { [personaId: string]: number };
  behavioral_diversity_index: number;
  vulnerability_detection_rate: {
    discovery_scores: { [personaId: string]: number };
    unique_vulnerabilities: number;
    critical_count: number;
    vulnerabilities_detail: Array<{
      type: string;
      severity: string;
      discovered_by: string[];
    }>;
  };
  action_matrix: PersonaActionMatrix;
  action_entropy: number;
  semantic_similarity_matrix?: number[][];
}

// Mathematical evaluation functions based on the paper
const calculateCosineSimilarity = (vectorA: number[], vectorB: number[]): number => {
  if (vectorA.length !== vectorB.length) return 0;
  
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};

const calculatePersonaFidelityIndex = (
  predefinedCharacteristics: number[],
  assessedCharacteristics: number[]
): number => {
  return calculateCosineSimilarity(predefinedCharacteristics, assessedCharacteristics);
};

const calculateActionEntropy = (actionMatrix: PersonaActionMatrix): number => {
  // Implementation based on academic paper Section 2.1.2
  // "DI(scenario) = -∑(j=1 to m) p(aj)log p(aj)"
  
  // Group actions by step first (we use action keys that include step info)
  const stepActionMatrix: Record<number, {
    actions: Record<string, string[]>, // Map of action -> array of persona_ids
    personaCount: number              // Unique personas in this step
  }> = {};
  
  // Build step-based matrix from actionMatrix
  Object.entries(actionMatrix).forEach(([personaId, actions]) => {
    Object.entries(actions).forEach(([actionKey, count]) => {
      // Extract step from actionKey (format: "step_X_action")
      const stepMatch = actionKey.match(/step_(\d+)_/);
      const step = stepMatch ? parseInt(stepMatch[1]) : 1;
      const actionName = actionKey.replace(/^step_\d+_/, '');
      
      if (!stepActionMatrix[step]) {
        stepActionMatrix[step] = {
          actions: {},
          personaCount: 0
        };
      }
      
      if (!stepActionMatrix[step].actions[actionName]) {
        stepActionMatrix[step].actions[actionName] = [];
      }
      
      if (count > 0 && !stepActionMatrix[step].actions[actionName].includes(personaId)) {
        stepActionMatrix[step].actions[actionName].push(personaId);
      }
    });
  });
  
  // Count unique personas per step
  Object.keys(stepActionMatrix).forEach(stepKey => {
    const step = Number(stepKey);
    const uniquePersonas = new Set<string>();
    
    Object.values(stepActionMatrix[step].actions).forEach(personaIds => {
      personaIds.forEach(id => uniquePersonas.add(id));
    });
    
    stepActionMatrix[step].personaCount = uniquePersonas.size;
  });
  
  // Calculate entropy for each step
  let totalEntropy = 0;
  let stepCount = 0;
  
  Object.entries(stepActionMatrix).forEach(([stepKey, stepData]) => {
    const { actions, personaCount } = stepData;
    
    // Skip steps with only one persona (no diversity possible)
    if (personaCount <= 1) return;
    
    let stepEntropy = 0;
    
    // For each action, calculate p(aj) = proportion of personas performing the action
    Object.entries(actions).forEach(([action, personaIds]) => {
      const probability = personaIds.length / personaCount;
      if (probability > 0) {
        stepEntropy -= probability * Math.log2(probability);
      }
    });
    
    totalEntropy += stepEntropy;
    stepCount++;
  });
  
  // Average entropy across steps
  const finalEntropy = stepCount > 0 ? totalEntropy / stepCount : 0;
  return finalEntropy;
};

const calculateVulnerabilityDiscoveryScore = (
  vulnerabilitiesFound: string[],
  scenariosTested: number
): number => {
  if (scenariosTested === 0) return 0;
  return vulnerabilitiesFound.length / scenariosTested;
};

const buildActionMatrix = (outputs: SimulationOutput[]): PersonaActionMatrix => {
  const matrix: PersonaActionMatrix = {};
  
  outputs.forEach(output => {
    if (!matrix[output.persona_id]) {
      matrix[output.persona_id] = {};
    }
    
    const actionCategory = output.action_category || categorizeAction(output.action);
    matrix[output.persona_id][actionCategory] = (matrix[output.persona_id][actionCategory] || 0) + 1;
  });
  
  return matrix;
};

const categorizeAction = (action: string): string => {
  const actionLower = action.toLowerCase();
  
  // Categorize actions based on security behavior patterns
  if (actionLower.includes('click') || actionLower.includes('open')) return 'direct_engagement';
  if (actionLower.includes('verify') || actionLower.includes('check')) return 'verification';
  if (actionLower.includes('ignore') || actionLower.includes('delete')) return 'avoidance';
  if (actionLower.includes('report') || actionLower.includes('alert')) return 'reporting';
  if (actionLower.includes('share') || actionLower.includes('forward')) return 'information_sharing';
  if (actionLower.includes('password') || actionLower.includes('credential')) return 'credential_management';
  if (actionLower.includes('download') || actionLower.includes('install')) return 'software_interaction';
  if (actionLower.includes('permission') || actionLower.includes('access')) return 'permission_management';
  
  return 'other';
};

const extractVulnerabilities = (outputs: SimulationOutput[]): Array<{
  type: string;
  severity: string;
  discovered_by: string[];
}> => {
  const vulnerabilityMap = new Map<string, {type: string; severity: string; discovered_by: Set<string>}>();
  
  outputs.forEach(output => {
    if (output.vulnerabilities_found) {
      output.vulnerabilities_found.forEach(vuln => {
        const key = vuln.toLowerCase();
        if (!vulnerabilityMap.has(key)) {
          vulnerabilityMap.set(key, {
            type: vuln,
            severity: assessVulnerabilitySeverity(vuln),
            discovered_by: new Set()
          });
        }
        vulnerabilityMap.get(key)!.discovered_by.add(output.persona_name);
      });
    }
  });
  
  return Array.from(vulnerabilityMap.values()).map(vuln => ({
    type: vuln.type,
    severity: vuln.severity,
    discovered_by: Array.from(vuln.discovered_by)
  }));
};

const assessVulnerabilitySeverity = (vulnerability: string): string => {
  const vulnLower = vulnerability.toLowerCase();
  
  if (vulnLower.includes('credential') || vulnLower.includes('password') || 
      vulnLower.includes('phishing') || vulnLower.includes('malware')) {
    return 'critical';
  }
  if (vulnLower.includes('social engineering') || vulnLower.includes('data leak') ||
      vulnLower.includes('unauthorized access')) {
    return 'high';
  }
  if (vulnLower.includes('permission') || vulnLower.includes('privacy')) {
    return 'medium';
  }
  return 'low';
};

const calculateComprehensiveMetrics = (
  outputs: SimulationOutput[],
  personas: Persona[]
): EvaluationMetrics => {
  const actionMatrix = buildActionMatrix(outputs);
  const actionEntropy = calculateActionEntropy(actionMatrix);
  const vulnerabilities = extractVulnerabilities(outputs);
  
  // Calculate Persona Fidelity Index for each persona
  const personaFidelityScores: { [personaId: string]: number } = {};
  personas.forEach(persona => {
    const personaOutputs = outputs.filter(o => o.persona_id === persona.id);
    if (personaOutputs.length > 0) {
      // Average the assessed characteristics across all outputs for this persona
      const avgAssessed = [0, 0, 0, 0]; // [tech, privacy, risk, security]
      let count = 0;
      
      personaOutputs.forEach(output => {
        if (output.persona_characteristics_displayed) {
          avgAssessed[0] += output.persona_characteristics_displayed.technical_expertise;
          avgAssessed[1] += output.persona_characteristics_displayed.privacy_concern;
          avgAssessed[2] += output.persona_characteristics_displayed.risk_tolerance;
          avgAssessed[3] += output.persona_characteristics_displayed.security_awareness;
          count++;
        }
      });
      
      if (count > 0) {
        avgAssessed.forEach((_, i) => avgAssessed[i] /= count);
        
        const predefined = [
          persona.skills.technical_expertise,
          persona.skills.privacy_concern,
          persona.skills.risk_tolerance,
          persona.skills.security_awareness
        ];
        
        personaFidelityScores[persona.id] = calculatePersonaFidelityIndex(predefined, avgAssessed);
      }
    }
  });
  
  // Calculate discovery scores
  const discoveryScores: { [personaId: string]: number } = {};
  const scenariosTested = new Set(outputs.map(o => o.step)).size || 1;
  
  personas.forEach(persona => {
    const personaVulns = outputs
      .filter(o => o.persona_id === persona.id && o.vulnerabilities_found)
      .flatMap(o => o.vulnerabilities_found || []);
    
    const uniqueVulns = [...new Set(personaVulns)];
    discoveryScores[persona.id] = calculateVulnerabilityDiscoveryScore(uniqueVulns, scenariosTested);
  });
  
  return {
    persona_fidelity_scores: personaFidelityScores,
    behavioral_diversity_index: actionEntropy,
    vulnerability_detection_rate: {
      discovery_scores: discoveryScores,
      unique_vulnerabilities: vulnerabilities.length,
      critical_count: vulnerabilities.filter(v => v.severity === 'critical').length,
      vulnerabilities_detail: vulnerabilities
    },
    action_matrix: actionMatrix,
    action_entropy: actionEntropy
  };
};

// UI Components
const HolographicPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}> = ({ children, className = "", glow = false }) => (
  <div className={`
    bg-white/90 backdrop-blur-md border border-cyan-200/60 rounded-lg relative
    ${glow ? 'shadow-[0_0_15px_rgba(34,211,238,0.15)]' : ''}
    ${className}
  `}>
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/20 to-purple-100/20 rounded-lg" />
    <div className="relative z-10 p-4">
      {children}
    </div>
  </div>
);

// PersonaEditor moved outside main component
interface PersonaEditorProps {
  editingPersona: Persona | null;
  personas: Persona[];
  setEditingPersona: (persona: Persona | null) => void;
  setPersonas: (personas: Persona[] | ((prev: Persona[]) => Persona[])) => void;
}

const PersonaEditor: React.FC<PersonaEditorProps> = ({
  editingPersona,
  personas,
  setEditingPersona,
  setPersonas
}) => {
  if (!editingPersona) return null;

  // Use useCallback to prevent recreation of handlers
  const updatePersona = useCallback((field: string, value: any) => {
    if (editingPersona) {
      setEditingPersona({ ...editingPersona, [field]: value });
    }
  }, [editingPersona, setEditingPersona]);

  const updateDemographics = useCallback((field: string, value: any) => {
    if (editingPersona) {
      setEditingPersona({
        ...editingPersona,
        demographics: { ...editingPersona.demographics, [field]: value }
      });
    }
  }, [editingPersona, setEditingPersona]);

  const updateSkills = useCallback((field: string, value: number) => {
    if (editingPersona) {
      setEditingPersona({
        ...editingPersona,
        skills: { ...editingPersona.skills, [field]: value }
      });
    }
  }, [editingPersona, setEditingPersona]);

  const updateBehavioralPatterns = useCallback((index: number, value: string) => {
    if (editingPersona) {
      const newPatterns = [...editingPersona.behavioral_patterns];
      newPatterns[index] = value;
      setEditingPersona({ ...editingPersona, behavioral_patterns: newPatterns });
    }
  }, [editingPersona, setEditingPersona]);

  const addBehavioralPattern = useCallback(() => {
    if (editingPersona) {
      setEditingPersona({
        ...editingPersona,
        behavioral_patterns: [...editingPersona.behavioral_patterns, '']
      });
    }
  }, [editingPersona, setEditingPersona]);

  const removeBehavioralPattern = useCallback((index: number) => {
    if (editingPersona) {
      setEditingPersona({
        ...editingPersona,
        behavioral_patterns: editingPersona.behavioral_patterns.filter((_, i) => i !== index)
      });
    }
  }, [editingPersona, setEditingPersona]);

  const savePersona = useCallback(() => {
    if (!editingPersona) return;
    
    const existingIndex = personas.findIndex(p => p.id === editingPersona.id);
    if (existingIndex >= 0) {
      const updatedPersonas = [...personas];
      updatedPersonas[existingIndex] = editingPersona;
      setPersonas(updatedPersonas);
    } else {
      setPersonas((prev: Persona[]) => [...prev, editingPersona]);
    }
    
    setEditingPersona(null);
  }, [editingPersona, personas, setPersonas, setEditingPersona]);

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <HolographicPanel className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-cyan-700 font-mono font-bold text-lg">PERSONA EDITOR</div>
            <div className="flex gap-2">
              <button 
                onClick={savePersona}
                className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm hover:bg-green-500/30"
              >
                <Icons.Save className="inline mr-2" />
                SAVE
              </button>
              <button 
                onClick={() => setEditingPersona(null)}
                className="px-4 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded font-mono text-sm hover:bg-red-500/30"
              >
                <Icons.X className="inline mr-2" />
                CANCEL
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="text-yellow-700 font-mono font-bold">BASIC INFO</div>
              
              <div>
                <label className="block text-gray-700 font-mono text-xs mb-1">NAME</label>
                <input 
                  type="text"
                  value={editingPersona.name}
                  onChange={(e) => updatePersona('name', e.target.value)}
                  className="w-full bg-white border border-cyan-200/60 rounded px-3 py-2 text-cyan-700 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-mono text-xs mb-1">TYPE</label>
                <select 
                  value={editingPersona.type}
                  onChange={(e) => updatePersona('type', e.target.value)}
                  className="w-full bg-white border border-cyan-200/60 rounded px-3 py-2 text-cyan-700 font-mono text-sm"
                >
                  <option value="THREAT_ACTOR">THREAT ACTOR</option>
                  <option value="SECURITY_PRACTITIONER">SECURITY PRACTITIONER</option>
                  <option value="REGULAR_USER">REGULAR USER</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-xs mb-1">SUBTYPE</label>
                <input 
                  type="text"
                  value={editingPersona.subtype}
                  onChange={(e) => updatePersona('subtype', e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                />
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-4">
              <div className="text-yellow-400 font-mono font-bold">DEMOGRAPHICS</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 font-mono text-xs mb-1">AGE</label>
                  <input 
                    type="number"
                    value={editingPersona.demographics.age}
                    onChange={(e) => updateDemographics('age', parseInt(e.target.value))}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 font-mono text-xs mb-1">NATIONALITY</label>
                  <input 
                    type="text"
                    value={editingPersona.demographics.nationality}
                    onChange={(e) => updateDemographics('nationality', e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-xs mb-1">LOCATION</label>
                <input 
                  type="text"
                  value={editingPersona.demographics.location}
                  onChange={(e) => updateDemographics('location', e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-xs mb-1">BACKGROUND</label>
                <textarea 
                  value={editingPersona.demographics.background}
                  onChange={(e) => updateDemographics('background', e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm h-20"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-mono text-xs mb-1">LANGUAGES (comma separated)</label>
                <input 
                  type="text"
                  value={editingPersona.demographics.languages.join(', ')}
                  onChange={(e) => updateDemographics('languages', e.target.value.split(', '))}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="text-yellow-400 font-mono font-bold">SKILL MATRIX (1-5)</div>
              
              {Object.entries(editingPersona.skills).map(([skill, level]) => (
                <div key={skill}>
                  <label className="block text-gray-400 font-mono text-xs mb-2">
                    {skill.replace('_', ' ').toUpperCase()}
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      value={level}
                      onChange={(e) => updateSkills(skill, parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-cyan-400 font-mono text-sm w-8">{level}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Behavioral Patterns */}
            <div className="space-y-4">
              <div className="text-yellow-400 font-mono font-bold">BEHAVIORAL PATTERNS</div>
              
              {editingPersona.behavioral_patterns.map((pattern, index) => (
                <div key={`pattern-${index}`} className="flex gap-2">
                  <input 
                    type="text"
                    value={pattern}
                    onChange={(e) => updateBehavioralPatterns(index, e.target.value)}
                    className="flex-1 bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                  />
                  <button 
                    onClick={() => removeBehavioralPattern(index)}
                    className="px-2 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded"
                  >
                    <Icons.X />
                  </button>
                </div>
              ))}
              
              <button 
                onClick={addBehavioralPattern}
                className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm"
              >
                <Icons.Plus className="inline mr-2" />
                ADD PATTERN
              </button>
            </div>

            {/* Motivation */}
            <div className="lg:col-span-2">
              <div className="text-yellow-400 font-mono font-bold mb-2">MOTIVATION</div>
              <textarea 
                value={editingPersona.motivation}
                onChange={(e) => {
                  if (editingPersona) {
                    setEditingPersona({ ...editingPersona, motivation: e.target.value });
                  }
                }}
                className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm h-20"
                placeholder="What drives this persona's decisions and actions?"
              />
            </div>
          </div>
        </div>
      </HolographicPanel>
    </div>
  );
};

// ScenarioBuilder moved outside main component
interface ScenarioBuilderProps {
  newScenario: Omit<Scenario, 'id'>;
  setNewScenario: (scenario: Omit<Scenario, 'id'> | ((prev: Omit<Scenario, 'id'>) => Omit<Scenario, 'id'>)) => void;
  scenarios: Scenario[];
  setScenarios: (scenarios: Scenario[] | ((prev: Scenario[]) => Scenario[])) => void;
}

const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({
  newScenario,
  setNewScenario,
  scenarios,
  setScenarios
}) => {
  // Use useCallback to prevent function recreation
  const updateNewScenario = useCallback((field: string, value: any) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({ ...prev, [field]: value }));
  }, [setNewScenario]);

  const updateSystemContext = useCallback((field: string, value: any) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      system_context: { ...prev.system_context, [field]: value }
    }));
  }, [setNewScenario]);

  const addWorkflowStep = useCallback(() => {
    const newStep = {
      id: Date.now(),
      title: '',
      interface_description: '',
      user_prompt: '',
      available_actions: [''],
      system_responses: {},
      security_elements: [''],
      decision_points: []
    };
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: [...prev.workflow_steps, newStep]
    }));
  }, [setNewScenario]);

  const updateWorkflowStep = useCallback((index: number, field: string, value: any) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }));
  }, [setNewScenario]);

  const removeWorkflowStep = useCallback((index: number) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.filter((_, i) => i !== index)
    }));
  }, [setNewScenario]);

  const updateWorkflowStepActions = useCallback((stepIndex: number, actionIndex: number, value: string) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          available_actions: step.available_actions.map((action, j) => 
            j === actionIndex ? value : action
          )
        } : step
      )
    }));
  }, [setNewScenario]);

  const addActionToStep = useCallback((stepIndex: number) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          available_actions: [...step.available_actions, '']
        } : step
      )
    }));
  }, [setNewScenario]);

  const removeActionFromStep = useCallback((stepIndex: number, actionIndex: number) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          available_actions: step.available_actions.filter((_, j) => j !== actionIndex)
        } : step
      )
    }));
  }, [setNewScenario]);

  const updateSecurityElements = useCallback((stepIndex: number, elementIndex: number, value: string) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          security_elements: step.security_elements.map((element, j) => 
            j === elementIndex ? value : element
          )
        } : step
      )
    }));
  }, [setNewScenario]);

  const addSecurityElement = useCallback((stepIndex: number) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          security_elements: [...step.security_elements, '']
        } : step
      )
    }));
  }, [setNewScenario]);

  const removeSecurityElement = useCallback((stepIndex: number, elementIndex: number) => {
    setNewScenario((prev: Omit<Scenario, 'id'>) => ({
      ...prev,
      workflow_steps: prev.workflow_steps.map((step, i) => 
        i === stepIndex ? {
          ...step,
          security_elements: step.security_elements.filter((_, j) => j !== elementIndex)
        } : step
      )
    }));
  }, [setNewScenario]);

  const saveScenario = useCallback(() => {
    if (!newScenario.title.trim()) {
      alert('Please enter a scenario title');
      return;
    }
    
    const scenarioToSave = {
      ...newScenario,
      id: Date.now()
    };
    
    setScenarios((prev: Scenario[]) => [...prev, scenarioToSave]);
    
    // Reset form
    setNewScenario({
      title: '',
      description: '',
      system_context: {
        system_type: '',
        environmental_factors: [],
        security_requirements: [],
        constraints: []
      },
      workflow_steps: [],
      tasks: [],
      success_criteria: [],
      security_elements: []
    });
    
    alert('Scenario saved successfully!');
  }, [newScenario, setScenarios, setNewScenario]);

  return (
    <HolographicPanel glow className="space-y-6">
      <div className="text-cyan-600 font-mono font-bold text-lg">SCENARIO DEFINITION MATRIX</div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">SCENARIO TITLE</label>
            <input 
              type="text"
              value={newScenario.title}
              onChange={(e) => updateNewScenario('title', e.target.value)}
              placeholder="e.g., CORPORATE EMAIL RESPONSE"
              className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">DESCRIPTION</label>
            <textarea 
              value={newScenario.description}
              onChange={(e) => updateNewScenario('description', e.target.value)}
              placeholder="Describe the security scenario..."
              className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-20 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">SYSTEM TYPE</label>
            <select 
              value={newScenario.system_context.system_type}
              onChange={(e) => updateSystemContext('system_type', e.target.value)}
              className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
            >
              <option value="">SELECT SYSTEM TYPE</option>
              <option value="web-application">WEB APPLICATION</option>
              <option value="mobile-app">MOBILE APPLICATION</option>
              <option value="email-system">EMAIL SYSTEM</option>
              <option value="banking-system">BANKING SYSTEM</option>
              <option value="social-media">SOCIAL MEDIA PLATFORM</option>
              <option value="iot-device">IOT DEVICE</option>
              <option value="cloud-service">CLOUD SERVICE</option>
              <option value="enterprise-network">ENTERPRISE NETWORK</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">ENVIRONMENTAL CONTEXT</label>
            <textarea 
              value={newScenario.system_context.environmental_factors?.join('\n')}
              onChange={(e) => updateSystemContext('environmental_factors', e.target.value.split('\n'))}
              placeholder="Time pressure, distractions, contextual factors..."
              className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-16 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">SECURITY REQUIREMENTS</label>
            <textarea 
              value={newScenario.system_context.security_requirements?.join('\n')}
              onChange={(e) => updateSystemContext('security_requirements', e.target.value.split('\n'))}
              placeholder="Authentication, authorization, data protection..."
              className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-16 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-yellow-300 font-mono font-bold text-base">WORKFLOW STEPS</div>
          <button 
            onClick={addWorkflowStep}
            className="px-4 py-2 bg-green-500/30 border border-green-500 text-green-300 rounded font-mono text-sm shadow-sm"
          >
            <Icons.Plus className="inline mr-2" />
            ADD STEP
          </button>
        </div>
        
        <div className="space-y-4">
          {newScenario.workflow_steps.map((step, stepIndex) => (
            <div key={`step-${step.id}`} className="border border-gray-600 rounded p-4 bg-gray-900/70 shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="text-cyan-300 font-mono font-bold text-sm">STEP {stepIndex + 1}</div>
                <button 
                  onClick={() => removeWorkflowStep(stepIndex)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Icons.X />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">STEP TITLE</label>
                  <input 
                    type="text"
                    value={step.title}
                    onChange={(e) => updateWorkflowStep(stepIndex, 'title', e.target.value)}
                    placeholder="e.g., Email Authentication Check"
                    className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">INTERFACE DESCRIPTION</label>
                  <textarea 
                    value={step.interface_description}
                    onChange={(e) => updateWorkflowStep(stepIndex, 'interface_description', e.target.value)}
                    placeholder="Describe what the user sees..."
                    className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-16 shadow-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-200 font-mono text-xs mb-1 font-semibold">USER PROMPT</label>
                <textarea 
                  value={step.user_prompt}
                  onChange={(e) => updateWorkflowStep(stepIndex, 'user_prompt', e.target.value)}
                  placeholder="What specific situation/content does the user encounter?"
                  className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-20 shadow-sm"
                />
              </div>

              {/* Available Actions */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-200 font-mono text-xs font-semibold">AVAILABLE ACTIONS</label>
                  <button 
                    onClick={() => addActionToStep(stepIndex)}
                    className="px-2 py-1 bg-green-500/30 border border-green-500 text-green-300 rounded font-mono text-xs shadow-sm"
                  >
                    <Icons.Plus className="inline mr-1" />
                    ADD ACTION
                  </button>
                </div>
                <div className="space-y-2">
                  {step.available_actions.map((action, actionIndex) => (
                    <div key={`action-${stepIndex}-${actionIndex}`} className="flex gap-2">
                      <input 
                        type="text"
                        value={action}
                        onChange={(e) => updateWorkflowStepActions(stepIndex, actionIndex, e.target.value)}
                        placeholder={`Action ${actionIndex + 1}`}
                        className="flex-1 bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
                      />
                      <button 
                        onClick={() => removeActionFromStep(stepIndex, actionIndex)}
                        className="px-2 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded"
                      >
                        <Icons.X />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Elements */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-200 font-mono text-xs font-semibold">SECURITY ELEMENTS</label>
                  <button 
                    onClick={() => addSecurityElement(stepIndex)}
                    className="px-2 py-1 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-xs"
                  >
                    <Icons.Plus className="inline mr-1" />
                    ADD ELEMENT
                  </button>
                </div>
                <div className="space-y-2">
                  {step.security_elements.map((element, elementIndex) => (
                    <div key={`element-${stepIndex}-${elementIndex}`} className="flex gap-2">
                      <input 
                        type="text"
                        value={element}
                        onChange={(e) => updateSecurityElements(stepIndex, elementIndex, e.target.value)}
                        placeholder={`Security indicator ${elementIndex + 1}`}
                        className="flex-1 bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                      />
                      <button 
                        onClick={() => removeSecurityElement(stepIndex, elementIndex)}
                        className="px-2 py-2 bg-red-500/20 border border-red-500 text-red-400 rounded"
                      >
                        <Icons.X />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          onClick={() => setNewScenario({
            title: '',
            description: '',
            system_context: { system_type: '', environmental_factors: [], security_requirements: [], constraints: [] },
            workflow_steps: [],
            tasks: [],
            success_criteria: [],
            security_elements: []
          })}
          className="px-6 py-2 bg-gray-500/20 border border-gray-500 text-gray-400 rounded font-mono text-sm"
        >
          CLEAR FORM
        </button>
        <button 
          onClick={saveScenario}
          className="px-6 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm"
        >
          <Icons.Save className="inline mr-2" />
          SAVE SCENARIO
        </button>
      </div>
    </HolographicPanel>
  );
};

const SciFiPersonaLab = () => {
  // Enhanced state management for simulation control
  const [activeTab, setActiveTab] = useState('personas');
  const [timelineScope, setTimelineScope] = useState('single-interaction');
  const [currentDay, setCurrentDay] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [simulationOutputs, setSimulationOutputs] = useState<SimulationOutput[]>([]);
  const [evaluationMetrics, setEvaluationMetrics] = useState<EvaluationMetrics | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const matrixRef = useRef<HTMLCanvasElement>(null);

  // Matrix background animation
  useEffect(() => {
    const canvas = matrixRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvasWidth / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      if (!ctx) return;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.fillStyle = '#39FF14'; // Bright neon green
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvasHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  // Default personas
  const [personas, setPersonas] = useState<Persona[]>([
    {
      id: 'martin_hayes',
      name: 'MARTIN HAYES',
      type: 'THREAT_ACTOR',
      subtype: 'Sophisticated/Ideological',
      demographics: {
        age: 29,
        background: 'Former government IT worker, political activist',
        location: 'Eastern Europe',
        languages: ['English', 'Russian'],
        nationality: 'Polish'
      },
      skills: {
        technical_expertise: 4,
        privacy_concern: 2,
        risk_tolerance: 5,
        security_awareness: 4
      },
      behavioral_patterns: [
        'Conducts extensive reconnaissance before targeting',
        'Uses sophisticated social engineering',
        'Plans long-term campaigns for maximum impact'
      ],
      motivation: 'Believes hacking serves greater good against corrupt institutions',
      position: { x: 20, y: 30, z: 15 }
    },
    {
      id: 'alex_chen',
      name: 'ALEX CHEN',
      type: 'SECURITY_PRACTITIONER',
      subtype: 'Enterprise Security Admin',
      demographics: {
        age: 34,
        background: 'Cybersecurity professional, 8 years experience',
        location: 'San Francisco, CA',
        languages: ['English', 'Mandarin'],
        nationality: 'American'
      },
      skills: {
        technical_expertise: 5,
        privacy_concern: 4,
        risk_tolerance: 2,
        security_awareness: 5
      },
      behavioral_patterns: [
        'Follows security protocols strictly',
        'Verifies authenticity through multiple channels',
        'Maintains high situational awareness'
      ],
      motivation: 'Protect organizational assets and user data',
      position: { x: 80, y: 60, z: 25 }
    },
    {
      id: 'sarah_johnson',
      name: 'SARAH JOHNSON',
      type: 'REGULAR_USER',
      subtype: 'Busy Professional',
      demographics: {
        age: 28,
        background: 'Marketing manager, moderate tech skills',
        location: 'Chicago, IL',
        languages: ['English'],
        nationality: 'American'
      },
      skills: {
        technical_expertise: 2,
        privacy_concern: 3,
        risk_tolerance: 3,
        security_awareness: 2
      },
      behavioral_patterns: [
        'Prioritizes convenience over security',
        'Limited time for security protocols',
        'Trusts familiar interfaces'
      ],
      motivation: 'Complete work tasks efficiently',
      position: { x: 50, y: 45, z: 20 }
    }
  ]);

  const [newScenario, setNewScenario] = useState<Omit<Scenario, 'id'>>({
    title: '',
    description: '',
    system_context: {
      system_type: '',

      environmental_factors: [],
      security_requirements: [],
      constraints: []
    },
    workflow_steps: [],
    tasks: [],
    success_criteria: [],
    security_elements: []
  });

  // Enhanced simulation functions with proper evaluation framework
  const runSimulation = async () => {
    if (selectedPersonas.length === 0) {
      alert('Please select personas first');
      return;
    }

    if (!activeScenario) {
      alert('Please create and select a scenario first using the Scenario Builder');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setSimulationCompleted(false);
    setSimulationOutputs([]);
    setEvaluationMetrics(null);

    try {
      // Simulate realistic persona behaviors for each step
      const mockOutputs: SimulationOutput[] = [];
      
      for (let stepIndex = 0; stepIndex < activeScenario.workflow_steps.length; stepIndex++) {
        const step = activeScenario.workflow_steps[stepIndex];
        
        for (const persona of selectedPersonas) {
          // Generate realistic behavior based on persona characteristics
          const behavior = generatePersonaBehavior(persona, step, stepIndex + 1);
          mockOutputs.push(behavior);
          
          // Add delay for realistic simulation
          await new Promise(resolve => setTimeout(resolve, 1000 / speed));
          setSimulationOutputs([...mockOutputs]);
        }
      }
      
      // Calculate comprehensive evaluation metrics
      const metrics = calculateComprehensiveMetrics(mockOutputs, selectedPersonas);
      setEvaluationMetrics(metrics);
      setSimulationCompleted(true);
      
      console.log('Simulation completed with metrics:', metrics);
    } catch (error) {
      console.error('Simulation error:', error);
      alert(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const generatePersonaBehavior = (
    persona: Persona, 
    step: WorkflowStep, 
    stepNumber: number
  ): SimulationOutput => {
    // Generate behavior based on persona characteristics
    const riskLevel = persona.skills.risk_tolerance;
    const techLevel = persona.skills.technical_expertise;
    const securityAwareness = persona.skills.security_awareness;
    
    // Choose action based on persona type and characteristics
    let action = '';
    let actionCategory = '';
    let vulnerabilitiesFound: string[] = [];
    
    if (persona.type === 'THREAT_ACTOR') {
      if (riskLevel >= 4) {
        action = 'Click suspicious link immediately';
        actionCategory = 'direct_engagement';
        vulnerabilitiesFound = ['phishing_vulnerability', 'credential_harvesting'];
      } else {
        action = 'Analyze link structure before clicking';
        actionCategory = 'verification';
        vulnerabilitiesFound = ['social_engineering_weakness'];
      }
    } else if (persona.type === 'SECURITY_PRACTITIONER') {
      if (securityAwareness >= 4) {
        action = 'Verify sender through secure channel';
        actionCategory = 'verification';
        vulnerabilitiesFound = ['email_spoofing', 'domain_impersonation'];
      } else {
        action = 'Report suspicious content to security team';
        actionCategory = 'reporting';
        vulnerabilitiesFound = ['process_gap'];
      }
    } else { // REGULAR_USER
      if (riskLevel >= 3 && techLevel <= 2) {
        action = 'Click link trusting familiar interface';
        actionCategory = 'direct_engagement';
        vulnerabilitiesFound = ['user_education_gap'];
      } else {
        action = 'Hesitate and seek help from IT';
        actionCategory = 'verification';
        vulnerabilitiesFound = ['usability_security_trade-off'];
      }
    }
    
    // Generate assessed characteristics (with some variation from predefined)
    const assessedCharacteristics = {
      technical_expertise: Math.max(1, Math.min(5, persona.skills.technical_expertise + (Math.random() - 0.5))),
      privacy_concern: Math.max(1, Math.min(5, persona.skills.privacy_concern + (Math.random() - 0.5))),
      risk_tolerance: Math.max(1, Math.min(5, persona.skills.risk_tolerance + (Math.random() - 0.5))),
      security_awareness: Math.max(1, Math.min(5, persona.skills.security_awareness + (Math.random() - 0.5)))
    };
    
    return {
      id: `${persona.id}_step_${stepNumber}_${Date.now()}`,
      persona_id: persona.id,
      persona_name: persona.name,
      step: stepNumber,
      action: action,
      action_category: actionCategory,
      reasoning: generateReasoning(persona, action),
      confidence: Math.floor(Math.random() * 2) + 3, // 3-5 range
      timestamp: new Date().toISOString(),
      step_title: step.title,
      vulnerabilities_found: vulnerabilitiesFound,
      persona_characteristics_displayed: assessedCharacteristics,
      thinking_process: generateThinkingProcess(persona, step, action),
      security_assessment: generateSecurityAssessment(persona, vulnerabilitiesFound)
    };
  };

  const generateReasoning = (persona: Persona, action: string): string => {
    const motivations = {
      'THREAT_ACTOR': 'Looking for opportunities to exploit system weaknesses',
      'SECURITY_PRACTITIONER': 'Following security protocols to protect organizational assets',
      'REGULAR_USER': 'Trying to complete work tasks efficiently while avoiding problems'
    };
    
    return `${motivations[persona.type]}. ${action} because ${persona.motivation}`;
  };

  const generateThinkingProcess = (persona: Persona, step: WorkflowStep, action: string) => {
    const assessments = {
      'THREAT_ACTOR': 'This looks like a potential attack vector',
      'SECURITY_PRACTITIONER': 'Need to evaluate security implications carefully',
      'REGULAR_USER': 'This seems urgent, but something feels off'
    };
    
    return {
      initial_assessment: assessments[persona.type],
      observations: [
        'Email sender appears legitimate',
        'Urgency language used',
        'Link destination unclear'
      ],
      option_evaluation: step.available_actions.slice(0, 2).map(opt => ({
        option: opt || 'Default action',
        pros: persona.type === 'THREAT_ACTOR' ? ['Quick exploitation', 'High impact'] : 
               persona.type === 'SECURITY_PRACTITIONER' ? ['Safe approach', 'Protocol compliance'] : 
               ['Fast completion', 'Avoids delays'],
        cons: persona.type === 'THREAT_ACTOR' ? ['Detection risk'] : 
               persona.type === 'SECURITY_PRACTITIONER' ? ['Time consuming'] : 
               ['Might be dangerous', 'Could cause problems'],
        risk_level: persona.skills.risk_tolerance >= 4 ? 'LOW' : 
                   persona.skills.risk_tolerance >= 3 ? 'MEDIUM' : 'HIGH'
      })),
      decision_rationale: `Based on my ${persona.skills.security_awareness}/5 security awareness and ${persona.skills.risk_tolerance}/5 risk tolerance`,
      uncertainty_points: [
        'Not sure about sender authenticity',
        'Unclear about potential consequences'
      ]
    };
  };

  const generateSecurityAssessment = (persona: Persona, vulnerabilities: string[]): string => {
    if (persona.type === 'THREAT_ACTOR') {
      return `Identified ${vulnerabilities.length} potential attack vectors for exploitation`;
    } else if (persona.type === 'SECURITY_PRACTITIONER') {
      return `Detected ${vulnerabilities.length} security risks requiring mitigation`;
    } else {
      return `Noticed ${vulnerabilities.length} concerning elements but unsure of implications`;
    }
  };

  const pauseSimulation = () => {
    setIsPaused(!isPaused);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setIsPaused(false);
    setSimulationCompleted(false);
    setSimulationOutputs([]);
    setEvaluationMetrics(null);
  };

  const restartSimulation = () => {
    resetSimulation();
    setTimeout(() => runSimulation(), 100);
  };

  const PersonaCard: React.FC<{
    persona: Persona;
    isSelected: boolean;
    onSelect: (persona: Persona) => void;
    onEdit: (persona: Persona) => void;
  }> = ({ persona, isSelected, onSelect, onEdit }) => (
    <HolographicPanel className={`cursor-pointer transition-all duration-300 ${
      isSelected ? 'border-cyan-400 bg-cyan-500/10' : 'hover:border-green-400'
    }`}>
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-cyan-400 font-mono font-bold text-sm">{persona.name}</div>
            <div className={`text-xs font-mono ${
              persona.type === 'THREAT_ACTOR' ? 'text-red-400' :
              persona.type === 'SECURITY_PRACTITIONER' ? 'text-green-400' :
              'text-blue-400'
            }`}>
              {persona.type.replace('_', ' ')}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(persona); }}
              className="text-yellow-400 hover:text-yellow-300"
            >
              <Icons.Edit />
            </button>
            <input 
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(persona)}
              className="w-4 h-4 accent-cyan-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Skills Matrix */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(persona.skills).map(([skill, level]) => (
            <div key={skill} className="space-y-1">
              <div className="text-gray-400 uppercase font-mono text-xs">
                {skill.replace('_', ' ')}
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`w-2 h-2 rounded ${
                    i <= level ? 'bg-cyan-400' : 'bg-gray-600'
                  }`} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Demographics */}
        <div className="text-xs font-mono text-gray-400">
          <div>AGE: {persona.demographics.age} | LOC: {persona.demographics.location}</div>
          <div>LANG: {persona.demographics.languages.join(', ')}</div>
        </div>
      </div>
    </HolographicPanel>
  );

  // Enhanced simulation control with proper validation and state management
  const SimulationControl = () => {
    const canCalculateEntropy = selectedPersonas.length > 1;
    const hasScenario = activeScenario && activeScenario.workflow_steps.length > 0;
    
    return (
      <HolographicPanel glow className="space-y-4">
        <div className="text-cyan-700 font-mono font-bold text-sm flex items-center gap-2">
          <Icons.Zap />
          SIMULATION CONTROL MATRIX
        </div>
        
        <div className="space-y-3">
          <div className="text-gray-600 font-mono text-xs">
            SELECTED PERSONAS: {selectedPersonas.length}
          </div>
          
          <div className="text-gray-400 font-mono text-xs">
            ACTIVE SCENARIO: {activeScenario ? `${activeScenario.title} (${activeScenario.workflow_steps.length} steps)` : 'None'}
          </div>
          
          {selectedPersonas.length === 0 && (
            <div className="text-red-400 font-mono text-xs border border-red-500/30 rounded p-2 bg-red-500/10">
              ⚠ NO PERSONAS SELECTED
            </div>
          )}
          
          {!hasScenario && (
            <div className="text-red-400 font-mono text-xs border border-red-500/30 rounded p-2 bg-red-500/10">
              ⚠ NO SCENARIO DEFINED - Use Scenario Builder
            </div>
          )}
          
          {selectedPersonas.length === 1 && (
            <div className="text-yellow-400 font-mono text-xs border border-yellow-500/30 rounded p-2 bg-yellow-500/10">
              ⚠ ENTROPY CALCULATION REQUIRES MULTIPLE PERSONAS
            </div>
          )}
          
          {canCalculateEntropy && hasScenario && (
            <div className="text-green-400 font-mono text-xs border border-green-500/30 rounded p-2 bg-green-500/10">
              ✓ READY FOR COMPREHENSIVE EVALUATION
            </div>
          )}

          {simulationCompleted && (
            <div className="text-blue-400 font-mono text-xs border border-blue-500/30 rounded p-2 bg-blue-500/10">
              ✓ SIMULATION COMPLETED - Results Available
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button 
            onClick={runSimulation}
            disabled={selectedPersonas.length === 0 || !hasScenario || isRunning}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              selectedPersonas.length === 0 || !hasScenario
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : isRunning 
                  ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400' 
                  : 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isRunning ? 'RUNNING' : 'START'}
          </button>
          
          <button 
            onClick={pauseSimulation}
            disabled={!isRunning}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              !isRunning
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : 'border-yellow-500 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            }`}
          >
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>

          <button 
            onClick={resetSimulation}
            disabled={!simulationCompleted && !isRunning}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              !simulationCompleted && !isRunning
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            RESET
          </button>
          
          <button 
            onClick={restartSimulation}
            disabled={selectedPersonas.length === 0 || !hasScenario || isRunning}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              selectedPersonas.length === 0 || !hasScenario || isRunning
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : 'border-purple-500 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
            }`}
          >
            RESTART
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-gray-600 font-mono text-xs">SPEED MULTIPLIER</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-red-400 transition-all duration-300"
                style={{ width: `${(speed / 10) * 100}%` }}
              />
            </div>
            <span className="text-cyan-700 font-mono text-xs w-8">{speed}X</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isRunning}
            className="w-full h-1 bg-gray-200 rounded appearance-none slider"
          />
        </div>
      </HolographicPanel>
    );
  };

  // Enhanced SystemStats with real evaluation metrics
  const SystemStats = () => {
    const canCalculateEntropy = selectedPersonas.length > 1;
    const hasValidMetrics = evaluationMetrics && simulationCompleted;
    
    return (
      <HolographicPanel>          <div className="text-cyan-700 font-mono font-bold text-sm mb-4">EVALUATION FRAMEWORK</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-green-400">
              {hasValidMetrics && evaluationMetrics.persona_fidelity_scores ? 
                (Object.values(evaluationMetrics.persona_fidelity_scores).reduce((a: number, b: any) => a + b, 0) / Object.keys(evaluationMetrics.persona_fidelity_scores).length).toFixed(3)
                : '--'
              }
            </div>
            <div className="text-xs font-mono text-gray-400">PERSONA FIDELITY</div>
            <div className="text-xs font-mono text-gray-500">(Cosine Similarity)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-purple-400">
              {hasValidMetrics && evaluationMetrics.action_entropy !== undefined ? 
                evaluationMetrics.action_entropy.toFixed(2)
                : canCalculateEntropy ? '0.00' : 'N/A'
              }
            </div>
            <div className="text-xs font-mono text-gray-400">BEHAVIORAL DIVERSITY</div>
            <div className="text-xs font-mono text-gray-500">(Shannon Entropy)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-red-400">
              {hasValidMetrics && evaluationMetrics.vulnerability_detection_rate ? 
                evaluationMetrics.vulnerability_detection_rate.unique_vulnerabilities.toString().padStart(2, '0')
                : '--'
              }
            </div>
            <div className="text-xs font-mono text-gray-400">VULNERABILITIES</div>
            <div className="text-xs font-mono text-gray-500">(Unique Found)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-yellow-400">
              {hasValidMetrics && evaluationMetrics.vulnerability_detection_rate ? 
                evaluationMetrics.vulnerability_detection_rate.critical_count.toString().padStart(2, '0')
                : '--'
              }
            </div>
            <div className="text-xs font-mono text-gray-400">CRITICAL</div>
            <div className="text-xs font-mono text-gray-500">(High Severity)</div>
          </div>
        </div>

        {/* Detailed Metrics Display */}
        {hasValidMetrics && (
          <div className="mt-4 space-y-3">
            {/* Persona Fidelity Breakdown */}
            <div className="border-t border-gray-600 pt-3">
              <div className="text-cyan-400 font-mono font-bold text-xs mb-2">PERSONA FIDELITY INDEX (PFI)</div>
              <div className="text-gray-500 font-mono text-xs mb-2">
                Cosine similarity between predefined C⃗(pi) and assessed S⃗(pi) characteristics
              </div>
              {Object.entries(evaluationMetrics.persona_fidelity_scores || {}).map(([personaId, score]) => {
                const persona = selectedPersonas.find(p => p.id === personaId);
                return (
                  <div key={personaId} className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">{persona?.name || personaId}</span>
                    <span className={`${(score as number) > 0.7 ? 'text-green-400' : (score as number) > 0.4 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {(score as number).toFixed(3)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Matrix Analysis */}
            {evaluationMetrics.action_matrix && (
              <div className="border-t border-gray-600 pt-3">
                <div className="text-cyan-400 font-mono font-bold text-xs mb-2">ACTION MATRIX ANALYSIS</div>
                <div className="text-gray-500 font-mono text-xs mb-2">
                  Entropy calculation: -Σ p(aj)log p(aj) = {evaluationMetrics.action_entropy.toFixed(2)}
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {Object.entries(evaluationMetrics.action_matrix).slice(0, 3).map(([personaId, actions]) => {
                    const persona = selectedPersonas.find(p => p.id === personaId);
                    return (
                      <div key={personaId} className="text-xs">
                        <span className="text-cyan-400 font-mono font-bold">{persona?.name}:</span>
                        <div className="ml-2 grid grid-cols-2 gap-1">
                          {Object.entries(actions).map(([action, count]) => (
                            <span key={action} className="text-gray-400 font-mono">
                              {action.replace('_', ' ')}: {count}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Vulnerability Discovery Rates */}
            {evaluationMetrics.vulnerability_detection_rate?.discovery_scores && (
              <div className="border-t border-gray-600 pt-3">
                <div className="text-cyan-400 font-mono font-bold text-xs mb-2">DISCOVERY RATES</div>
                <div className="text-gray-500 font-mono text-xs mb-2">
                  Discovery Score = unique vulnerabilities found / scenarios tested
                </div>
                {Object.entries(evaluationMetrics.vulnerability_detection_rate.discovery_scores).map(([personaId, score]) => {
                  const persona = selectedPersonas.find(p => p.id === personaId);
                  return (
                    <div key={personaId} className="flex justify-between text-xs font-mono">
                      <span className="text-gray-400">{persona?.name || personaId}</span>
                      <span className={`${(score as number) > 0.5 ? 'text-green-400' : (score as number) > 0.3 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {(score as number).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Vulnerability Details */}
            {evaluationMetrics.vulnerability_detection_rate?.vulnerabilities_detail && (
              <div className="border-t border-gray-600 pt-3">
                <div className="text-cyan-400 font-mono font-bold text-xs mb-2">VULNERABILITY ANALYSIS</div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {evaluationMetrics.vulnerability_detection_rate.vulnerabilities_detail.slice(0, 5).map((vuln: any, index: number) => (
                    <div key={index} className="text-xs font-mono">
                      <span className={`${
                        vuln.severity === 'critical' ? 'text-red-400' :
                        vuln.severity === 'high' ? 'text-orange-400' :
                        vuln.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {vuln.severity.toUpperCase()}
                      </span>
                      <span className="text-gray-400 ml-2">{vuln.type.replace(/_/g, ' ')}</span>
                      <div className="text-gray-500 ml-4 text-xs">
                        Found by: {vuln.discovered_by.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!canCalculateEntropy && (
          <div className="mt-4 p-3 border border-yellow-500/30 rounded bg-yellow-500/10">
            <div className="text-yellow-400 font-mono text-xs font-bold mb-1">
              ENTROPY CALCULATION DISABLED
            </div>
            <div className="text-gray-400 font-mono text-xs">
              Behavioral Diversity Index requires multiple personas for meaningful entropy calculation.
            </div>
          </div>
        )}

        {!simulationCompleted && selectedPersonas.length > 0 && activeScenario && (
          <div className="mt-4 p-3 border border-blue-500/30 rounded bg-blue-500/10">
            <div className="text-blue-400 font-mono text-xs font-bold mb-1">
              EVALUATION FRAMEWORK READY
            </div>
            <div className="text-gray-400 font-mono text-xs">
              Will calculate PFI (cosine similarity), BDI (Shannon entropy), and VDR (discovery rate).
            </div>
          </div>
        )}
      </HolographicPanel>
    );
  };

  const tabs = [
    { id: 'personas', label: 'PERSONAS', icon: Icons.Users },
    { id: 'scenarios', label: 'SCENARIOS', icon: Icons.Settings },
    { id: 'simulation', label: 'SIMULATION', icon: Icons.Play }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden relative">
      {/* Animated Matrix Background */}
      <canvas 
        ref={matrixRef}
        className="fixed inset-0 opacity-5 pointer-events-none"
      />
      
      {/* Persona Editor Modal */}
      <PersonaEditor 
        editingPersona={editingPersona}
        personas={personas}
        setEditingPersona={setEditingPersona}
        setPersonas={setPersonas}
      />
      
      {/* Main Interface */}
      <div className="relative z-10 p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono font-bold text-cyan-700 mb-2 tracking-wider">
            Persona Crash LAB
          </h1>
          <div className="text-sm font-mono text-gray-600">
            LLM-DRIVEN BEHAVIORAL TESTBED • SECURITY SIMULATION MATRIX
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-cyan-500/30 rounded-lg overflow-hidden">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-mono text-sm transition-all ${
                    activeTab === tab.id 
                      ? 'bg-cyan-100 text-cyan-700 border-cyan-300' 
                      : 'text-gray-600 hover:text-cyan-700 hover:bg-cyan-50'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'personas' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-cyan-700 font-mono font-bold text-lg">PERSONA LIBRARY</div>
              <button 
                onClick={() => setEditingPersona({
                  id: Date.now().toString(),
                  name: 'NEW PERSONA',
                  type: 'REGULAR_USER',
                  subtype: '',
                  demographics: { age: 25, background: '', location: '', languages: ['English'], nationality: '' },
                  skills: { technical_expertise: 3, privacy_concern: 3, risk_tolerance: 3, security_awareness: 3 },
                  behavioral_patterns: [''],
                  motivation: '',
                  position: { x: 50, y: 50, z: 20 }
                })}
                className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm"
              >
                <Icons.Plus className="inline mr-2" />
                CREATE PERSONA
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personas.map(persona => (
                <PersonaCard 
                  key={persona.id}
                  persona={persona}
                  isSelected={selectedPersonas.some(p => p.id === persona.id)}
                  onSelect={(persona) => {
                    setSelectedPersonas((prev: Persona[]) => 
                      prev.some(p => p.id === persona.id) 
                        ? prev.filter(p => p.id !== persona.id)
                        : [...prev, persona]
                    );
                  }}
                  onEdit={setEditingPersona}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-cyan-400 font-mono font-bold text-lg">SCENARIO MANAGEMENT</div>
              <div className="flex gap-2">              <button 
                onClick={() => setActiveScenario(null)}
                className="px-4 py-2 bg-blue-100 border border-blue-300 text-blue-700 rounded font-mono text-sm"
                >
                  CREATE NEW
                </button>
              </div>
            </div>

            {/* Scenario Builder */}
            <ScenarioBuilder 
              newScenario={newScenario}
              setNewScenario={setNewScenario}
              scenarios={scenarios}
              setScenarios={setScenarios}
            />

            {/* Custom Scenarios List */}
            {scenarios.length > 0 && (
              <HolographicPanel>
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4">CUSTOM SCENARIOS</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map(scenario => (
                    <div 
                      key={scenario.id} 
                      className={`border rounded p-3 cursor-pointer transition-all ${
                        activeScenario?.id === scenario.id 
                          ? 'border-cyan-500 bg-cyan-500/10' 
                          : 'border-gray-600 bg-gray-900/50 hover:border-cyan-400'
                      }`}
                      onClick={() => setActiveScenario(scenario)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-cyan-400 font-mono font-bold text-sm">{scenario.title}</div>
                        <div className="flex gap-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveScenario(scenario);
                            }}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            <Icons.Edit />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Delete this scenario?')) {
                                setScenarios((prev: Scenario[]) => prev.filter(s => s.id !== scenario.id));
                                if (activeScenario?.id === scenario.id) {
                                  setActiveScenario(null);
                                }
                              }
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Icons.X />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-gray-400 font-mono text-xs mt-1">{scenario.description}</div>
                      <div className="text-yellow-400 font-mono text-xs mt-2">
                        {scenario.workflow_steps.length} STEPS | {scenario.tasks.length} TASKS | {scenario.system_context.system_type.toUpperCase()}
                      </div>
                      
                      {activeScenario?.id === scenario.id && (
                        <div className="text-green-400 font-mono text-xs mt-1">
                          ✓ SELECTED FOR SIMULATION
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </HolographicPanel>
            )}
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Radar Display */}
              <HolographicPanel glow className="h-96">
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4 flex items-center gap-2">
                  <Icons.TrendingUp />
                  PERSONA RADAR MATRIX
                </div>
                
                {selectedPersonas.length === 0 ? (
                  <div className="text-gray-400 font-mono text-sm text-center py-20">
                    NO PERSONAS SELECTED - GO TO PERSONAS TAB TO SELECT
                  </div>
                ) : (
                  <div className="relative h-80 overflow-hidden">
                    {/* Radar Grid */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
                      {/* Concentric circles */}
                      {[60, 120, 180].map(radius => (
                        <circle
                          key={radius}
                          cx="200"
                          cy="160"
                          r={radius}
                          fill="none"
                          stroke="cyan"
                          strokeWidth="0.5"
                          opacity="0.3"
                        />
                      ))}
                      
                      {/* Radar sweep lines */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                        <line
                          key={angle}
                          x1="200"
                          y1="160"
                          x2={200 + 180 * Math.cos((angle - 90) * Math.PI / 180)}
                          y2={160 + 180 * Math.sin((angle - 90) * Math.PI / 180)}
                          stroke="cyan"
                          strokeWidth="0.3"
                          opacity="0.2"
                        />
                      ))}
                      
                      {/* Scanning line animation */}
                      <line
                        x1="200"
                        y1="160"
                        x2="200"
                        y2="20"
                        stroke="cyan"
                        strokeWidth="2"
                        opacity="0.8"
                        className="animate-spin"
                        style={{ transformOrigin: '200px 160px', animationDuration: '4s' }}
                      />
                    </svg>

                    {/* Persona dots on radar */}
                    {selectedPersonas.map((persona, index) => {
                      const angle = (index / selectedPersonas.length) * 360;
                      const radius = 100 + (persona.skills.technical_expertise * 15);
                      const x = 200 + radius * Math.cos((angle - 90) * Math.PI / 180);
                      const y = 160 + radius * Math.sin((angle - 90) * Math.PI / 180);
                      
                      return (
                        <div
                          key={persona.id}
                          className="absolute transition-all duration-1000"
                          style={{
                            left: `${(x/400)*100}%`,
                            top: `${(y/320)*100}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {/* Persona radar blip */}
                          <div className={`w-4 h-4 rounded-full border-2 relative ${
                            persona.type === 'THREAT_ACTOR' ? 'border-red-500 bg-red-500/30' :
                            persona.type === 'SECURITY_PRACTITIONER' ? 'border-green-500 bg-green-500/30' :
                            'border-blue-500 bg-blue-500/30'
                          }`}>
                            {/* Pulsing animation */}
                            <div className={`absolute inset-0 rounded-full animate-ping ${
                              persona.type === 'THREAT_ACTOR' ? 'bg-red-500' :
                              persona.type === 'SECURITY_PRACTITIONER' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`} />
                          </div>
                          
                          {/* Persona label */}
                          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 min-w-max">
                            <div className="bg-black/80 border border-cyan-400/50 backdrop-blur-sm px-2 py-1 rounded text-xs">
                              <div className="text-cyan-400 font-mono font-bold">{persona.name}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </HolographicPanel>

              {/* Real Simulation Output Stream with Action Matrix */}
              <HolographicPanel>
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4 flex items-center gap-2">
                  <Icons.CheckCircle />
                  BEHAVIORAL ANALYSIS STREAM
                </div>
                
                {/* Action Matrix Visualization */}
                {evaluationMetrics?.action_matrix && (
                  <div className="mb-4 p-3 border border-purple-500/30 rounded bg-purple-500/10">
                    <div className="text-purple-400 font-mono font-bold text-xs mb-2">
                      PERSONA-ACTION MATRIX (Entropy: {evaluationMetrics.action_entropy.toFixed(2)})
                    </div>
                    <div className="grid gap-1 text-xs font-mono">
                      {Object.entries(evaluationMetrics.action_matrix).map(([personaId, actions]) => {
                        const persona = selectedPersonas.find(p => p.id === personaId);
                        const totalActions = Object.values(actions).reduce((sum: number, count) => sum + count, 0);
                        return (
                          <div key={personaId} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              persona?.type === 'THREAT_ACTOR' ? 'bg-red-500' :
                              persona?.type === 'SECURITY_PRACTITIONER' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`} />
                            <span className="text-cyan-400 w-20 truncate">{persona?.name}</span>
                            <div className="flex gap-1 flex-wrap">
                              {Object.entries(actions).map(([action, count]) => (
                                <span key={action} className="px-1 py-0.5 bg-gray-700 rounded text-xs">
                                  {action.replace('_', ' ')}: {count}
                                </span>
                              ))}
                            </div>
                            <span className="text-gray-500 ml-auto">Total: {totalActions}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {simulationOutputs.length > 0 ? (
                    simulationOutputs.map((output, index) => (
                      <div key={output.id} className="border border-gray-600 rounded p-3 bg-gray-900/50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-2 h-2 rounded-full ${
                            output.error ? 'bg-red-500' :
                            output.persona_id.includes('martin') ? 'bg-red-500' :
                            output.persona_id.includes('alex') ? 'bg-green-500' :
                            'bg-blue-500'
                          } ${isRunning ? 'animate-pulse' : ''}`} />
                          <div className="text-cyan-400 font-mono font-bold text-xs">{output.persona_name}</div>
                          <div className="text-gray-400 font-mono text-xs">STEP {output.step}</div>
                          <div className="text-gray-500 font-mono text-xs">{output.step_title}</div>
                          {output.action_category && (
                            <div className="text-purple-400 font-mono text-xs bg-purple-500/20 px-2 py-1 rounded">
                              {output.action_category.replace('_', ' ').toUpperCase()}
                            </div>
                          )}
                        </div>
                        
                        {/* Persona Characteristics Assessment for PFI */}
                        {output.persona_characteristics_displayed && (
                          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded p-2 mb-3">
                            <div className="text-cyan-400 font-mono text-xs font-bold mb-1">ASSESSED CHARACTERISTICS (for PFI)</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>Tech: {output.persona_characteristics_displayed.technical_expertise.toFixed(1)}</div>
                              <div>Privacy: {output.persona_characteristics_displayed.privacy_concern.toFixed(1)}</div>
                              <div>Risk: {output.persona_characteristics_displayed.risk_tolerance.toFixed(1)}</div>
                              <div>Security: {output.persona_characteristics_displayed.security_awareness.toFixed(1)}</div>
                            </div>
                          </div>
                        )}

                        {/* Vulnerabilities Found for VDR */}
                        {output.vulnerabilities_found && output.vulnerabilities_found.length > 0 && (
                          <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-3">
                            <div className="text-red-400 font-mono text-xs font-bold mb-1">VULNERABILITIES DISCOVERED</div>
                            <div className="space-y-1">
                              {output.vulnerabilities_found.map((vuln, i) => (
                                <div key={i} className="text-gray-300 font-mono text-xs">
                                  • {vuln.replace(/_/g, ' ').toUpperCase()}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Step-by-Step Thinking Process */}
                        {output.thinking_process && (
                          <div className="space-y-3 mb-3">
                            {/* Initial Assessment */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2">
                              <div className="text-blue-400 font-mono text-xs font-bold mb-1">1. INITIAL ASSESSMENT</div>
                              <div className="text-gray-300 font-mono text-xs">
                                {output.thinking_process.initial_assessment}
                              </div>
                            </div>

                            {/* Observations */}
                            {output.thinking_process.observations.length > 0 && (
                              <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2">
                                <div className="text-purple-400 font-mono text-xs font-bold mb-1">2. OBSERVATIONS</div>
                                <div className="space-y-1">
                                  {output.thinking_process.observations.map((obs, i) => (
                                    <div key={i} className="text-gray-300 font-mono text-xs">
                                      • {obs}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Option Evaluation */}
                            {output.thinking_process.option_evaluation.length > 0 && (
                              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                                <div className="text-yellow-400 font-mono text-xs font-bold mb-1">3. OPTION EVALUATION</div>
                                <div className="space-y-2">
                                  {output.thinking_process.option_evaluation.map((option, i) => (
                                    <div key={i} className="border border-gray-700 rounded p-2 bg-gray-800/50">
                                      <div className="text-cyan-400 font-mono text-xs font-bold mb-1">
                                        OPTION: {option.option}
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <div className="text-green-400 font-mono font-bold">PROS:</div>
                                          {option.pros.map((pro, j) => (
                                            <div key={j} className="text-gray-300 font-mono">+ {pro}</div>
                                          ))}
                                        </div>
                                        <div>
                                          <div className="text-red-400 font-mono font-bold">CONS:</div>
                                          {option.cons.map((con, j) => (
                                            <div key={j} className="text-gray-300 font-mono">- {con}</div>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="mt-1">
                                        <span className="text-gray-400 font-mono text-xs">RISK: </span>
                                        <span className={`font-mono text-xs ${
                                          option.risk_level.toLowerCase().includes('high') ? 'text-red-400' :
                                          option.risk_level.toLowerCase().includes('medium') ? 'text-yellow-400' :
                                          'text-green-400'
                                        }`}>
                                          {option.risk_level}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Decision Rationale */}
                            <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                              <div className="text-green-400 font-mono text-xs font-bold mb-1">4. DECISION RATIONALE</div>
                              <div className="text-gray-300 font-mono text-xs">
                                {output.thinking_process.decision_rationale}
                              </div>
                            </div>

                            {/* Uncertainty Points */}
                            {output.thinking_process.uncertainty_points.length > 0 && (
                              <div className="bg-orange-500/10 border border-orange-500/30 rounded p-2">
                                <div className="text-orange-400 font-mono text-xs font-bold mb-1">5. UNCERTAINTIES</div>
                                <div className="space-y-1">
                                  {output.thinking_process.uncertainty_points.map((uncertainty, i) => (
                                    <div key={i} className="text-gray-300 font-mono text-xs">
                                      ? {uncertainty}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Final Action taken */}
                        <div className="bg-green-500/10 border border-green-500/30 rounded p-2 mb-2">
                          <div className="text-green-400 font-mono text-xs font-bold mb-1">FINAL ACTION:</div>
                          <div className="text-gray-300 font-mono text-xs">
                            {output.action}
                          </div>
                        </div>

                        {/* Overall Reasoning Summary */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded p-2 mb-2">
                          <div className="text-blue-400 font-mono text-xs font-bold mb-1">REASONING SUMMARY:</div>
                          <div className="text-gray-300 font-mono text-xs">
                            {output.reasoning}
                          </div>
                        </div>

                        {/* Security Assessment */}
                        {output.security_assessment && (
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded p-2 mb-2">
                            <div className="text-purple-400 font-mono text-xs font-bold mb-1">SECURITY ASSESSMENT:</div>
                            <div className="text-gray-300 font-mono text-xs">
                              {output.security_assessment}
                            </div>
                          </div>
                        )}

                        {/* Confidence and Timestamp */}
                        <div className="flex justify-between items-center text-xs font-mono text-gray-500">
                          <span>Confidence: {output.confidence}/5</span>
                          <span>{new Date(output.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  ) : isRunning ? (
                    <div className="text-yellow-400 font-mono text-sm text-center py-8 animate-pulse">
                      SIMULATION IN PROGRESS...
                    </div>
                  ) : (
                    <div className="text-gray-400 font-mono text-sm text-center py-8">
                      {selectedPersonas.length === 0 ? 
                        "NO ACTIVE SIMULATION - SELECT PERSONAS TO BEGIN" :
                        !activeScenario ?
                        "NO SCENARIO DEFINED - CREATE SCENARIO FIRST" :
                        simulationCompleted ?
                        "SIMULATION COMPLETED - Results displayed above" :
                        "SIMULATION READY - CLICK START TO BEGIN"
                      }
                    </div>
                  )}
                </div>
              </HolographicPanel>
            </div>
            
            <div className="space-y-6">
              <SimulationControl />
              <SystemStats />
              
              {/* Timeline Events Log */}
              <HolographicPanel>
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4">EVENT TIMELINE</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {isRunning ? (
                    [
                      { time: '00:01', event: 'SIMULATION INITIALIZED', type: 'system' },
                      { time: '00:03', event: 'PERSONAS LOADED', type: 'system' },
                      { time: '00:05', event: 'THREAT SCENARIO ACTIVE', type: 'threat' },
                      { time: '00:08', event: 'DECISION POINT REACHED', type: 'decision' },
                      { time: '00:12', event: 'BEHAVIORAL DIVERGENCE DETECTED', type: 'analysis' }
                    ].map((event, index) => (
                      <div key={index} className={`flex items-center gap-3 text-xs font-mono p-2 rounded ${
                        event.type === 'threat' ? 'bg-red-500/10 text-red-400' :
                        event.type === 'decision' ? 'bg-yellow-500/10 text-yellow-400' :
                        event.type === 'analysis' ? 'bg-purple-500/10 text-purple-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        <div className="text-cyan-400 w-12">{event.time}</div>
                        <div className="flex-1">{event.event}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 font-mono text-xs text-center py-4">
                      NO ACTIVE TIMELINE
                    </div>
                  )}
                </div>
              </HolographicPanel>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for sci-fi elements */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22d3ee;
          border: 2px solid #0891b2;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #22d3ee;
          border: 2px solid #0891b2;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SciFiPersonaLab;