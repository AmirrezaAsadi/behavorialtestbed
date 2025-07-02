'use client';

import React, { useState, useEffect, useRef } from 'react';

// Simple SVG icons to replace lucide-react
const Icons = {
  Play: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21"></polygon>
    </svg>
  ),
  Pause: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  ),
  FastForward: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="13,19 22,12 13,5"></polygon>
      <polygon points="2,19 11,12 2,5"></polygon>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3l-9.5 9.5-5 1 1-5 9.5-9.5z"></path>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17,21 17,13 7,13 7,21"></polyline>
      <polyline points="7,3 7,8 15,8"></polyline>
    </svg>
  ),
  Zap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
      <polyline points="17,6 23,6 23,12"></polyline>
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22,4 12,14.01 9,11.01"></polyline>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
};

// Types
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
    user_goals: string[];
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
  reasoning: string;
  confidence: number;
  timestamp: string;
  thinking?: string;
}

const SciFiPersonaLab = () => {
  const [activeTab, setActiveTab] = useState('personas');
  const [timelineScope, setTimelineScope] = useState('single-interaction');
  const [currentDay, setCurrentDay] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selectedPersonas, setSelectedPersonas] = useState<Persona[]>([]);
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [simulationOutputs, setSimulationOutputs] = useState<SimulationOutput[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const matrixRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Animated matrix background - FIXED VERSION
    const canvas = matrixRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Store dimensions to avoid null checks later
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
      // Double check that ctx is still available
      if (!ctx) return;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.fillStyle = '#00ff41';
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
      user_goals: [],
      environmental_factors: [],
      security_requirements: [],
      constraints: []
    },
    workflow_steps: [],
    tasks: [],
    success_criteria: [],
    security_elements: []
  });

  // API functions
  const runSimulation = async () => {
    if (selectedPersonas.length === 0) {
      alert('Please select personas first');
      return;
    }

    setIsRunning(true);
    setSimulationOutputs([]);

    try {
      const response = await fetch('/api/simulation/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personas: selectedPersonas,
          scenario: activeScenario || null, // Use default if no scenario selected
          timeline_scope: timelineScope,
          speed: speed
        }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const result = await response.json();
      setSimulationOutputs(result.outputs);
    } catch (error) {
      console.error('Simulation error:', error);
      alert('Simulation failed. Please check your API configuration.');
    } finally {
      setIsRunning(false);
    }
  };

  // Persona Editor Modal
  const PersonaEditor = () => {
    if (!editingPersona) return null;

    const updatePersona = (field: string, value: any) => {
      if (!editingPersona) return;
      setEditingPersona({ ...editingPersona, [field]: value });
    };

    const updateDemographics = (field: string, value: any) => {
      if (!editingPersona) return;
      setEditingPersona({
        ...editingPersona,
        demographics: { ...editingPersona.demographics, [field]: value }
      });
    };

    const updateSkills = (field: string, value: number) => {
      if (!editingPersona) return;
      setEditingPersona({
        ...editingPersona,
        skills: { ...editingPersona.skills, [field]: value }
      });
    };

    const savePersona = () => {
      if (!editingPersona) return;
      
      const existingIndex = personas.findIndex(p => p.id === editingPersona.id);
      if (existingIndex >= 0) {
        // Update existing
        const updatedPersonas = [...personas];
        updatedPersonas[existingIndex] = editingPersona;
        setPersonas(updatedPersonas);
      } else {
        // Add new
        setPersonas([...personas, editingPersona]);
      }
      
      setEditingPersona(null);
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <HolographicPanel className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-cyan-400 font-mono font-bold text-lg">PERSONA EDITOR</div>
              <button 
                onClick={() => setEditingPersona(null)}
                className="text-red-400 hover:text-red-300"
              >
                <Icons.X />
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 font-mono text-xs block mb-1">NAME</label>
                <input
                  type="text"
                  value={editingPersona.name}
                  onChange={(e) => updatePersona('name', e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 font-mono text-xs block mb-1">TYPE</label>
                <select
                  value={editingPersona.type}
                  onChange={(e) => updatePersona('type', e.target.value)}
                  className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                >
                  <option value="THREAT_ACTOR">THREAT_ACTOR</option>
                  <option value="SECURITY_PRACTITIONER">SECURITY_PRACTITIONER</option>
                  <option value="REGULAR_USER">REGULAR_USER</option>
                </select>
              </div>
            </div>

            {/* Demographics */}
            <div className="space-y-4">
              <div className="text-cyan-400 font-mono font-bold text-sm">DEMOGRAPHICS</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 font-mono text-xs block mb-1">AGE</label>
                  <input
                    type="number"
                    value={editingPersona.demographics.age}
                    onChange={(e) => updateDemographics('age', parseInt(e.target.value))}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-mono text-xs block mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={editingPersona.demographics.location}
                    onChange={(e) => updateDemographics('location', e.target.value)}
                    className="w-full bg-black/50 border border-cyan-500/30 rounded px-3 py-2 text-cyan-400 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="text-cyan-400 font-mono font-bold text-sm">SKILLS (1-5)</div>
              {Object.entries(editingPersona.skills).map(([skill, level]) => (
                <div key={skill}>
                  <label className="text-gray-400 font-mono text-xs block mb-1">
                    {skill.replace('_', ' ').toUpperCase()}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={level}
                    onChange={(e) => updateSkills(skill, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded appearance-none slider"
                  />
                  <div className="text-cyan-400 font-mono text-xs mt-1">{level}/5</div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingPersona(null)}
                className="px-4 py-2 bg-gray-600/20 border border-gray-500 text-gray-400 rounded font-mono text-sm"
              >
                CANCEL
              </button>
              <button
                onClick={savePersona}
                className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm flex items-center gap-2"
              >
                <Icons.Save />
                SAVE PERSONA
              </button>
            </div>
          </div>
        </HolographicPanel>
      </div>
    );
  };

  const HolographicPanel: React.FC<{
    children: React.ReactNode;
    className?: string;
    glow?: boolean;
  }> = ({ children, className = "", glow = false }) => (
    <div className={`
      bg-black/20 backdrop-blur-md border border-cyan-500/30 rounded-lg
      ${glow ? 'shadow-[0_0_20px_rgba(34,211,238,0.3)]' : ''}
      ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-lg" />
      <div className="relative z-10 p-4">
        {children}
      </div>
    </div>
  );

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

  const SimulationControl = () => {
    const canCalculateEntropy = selectedPersonas.length > 1;
    
    return (
      <HolographicPanel glow className="space-y-4">
        <div className="text-cyan-400 font-mono font-bold text-sm flex items-center gap-2">
          <Icons.Zap />
          SIMULATION CONTROL MATRIX
        </div>
        
        <div className="space-y-3">
          <div className="text-gray-400 font-mono text-xs">
            SELECTED PERSONAS: {selectedPersonas.length}
          </div>
          
          {selectedPersonas.length === 0 && (
            <div className="text-red-400 font-mono text-xs border border-red-500/30 rounded p-2 bg-red-500/10">
              ⚠ NO PERSONAS SELECTED
            </div>
          )}
          
          {selectedPersonas.length === 1 && (
            <div className="text-yellow-400 font-mono text-xs border border-yellow-500/30 rounded p-2 bg-yellow-500/10">
              ⚠ ENTROPY CALCULATION REQUIRES MULTIPLE PERSONAS
            </div>
          )}
          
          {canCalculateEntropy && (
            <div className="text-green-400 font-mono text-xs border border-green-500/30 rounded p-2 bg-green-500/10">
              ✓ ENTROPY CALCULATION ENABLED
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={runSimulation}
            disabled={selectedPersonas.length === 0}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              selectedPersonas.length === 0
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : isRunning 
                  ? 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                  : 'border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
          >
            {isRunning ? 'ABORT' : 'INITIALIZE'}
          </button>
          
          <button 
            disabled={selectedPersonas.length === 0}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              selectedPersonas.length === 0
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : 'border-yellow-500 bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
            }`}
          >
            FAST FWD
          </button>
          
          <button 
            disabled={selectedPersonas.length === 0}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              selectedPersonas.length === 0
                ? 'border-gray-600 bg-gray-600/20 text-gray-500 cursor-not-allowed'
                : 'border-purple-500 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
            }`}
          >
            ANALYZE
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-gray-400 font-mono text-xs">SPEED MULTIPLIER</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-gray-700 rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-300"
                style={{ width: `${(speed / 10) * 100}%` }}
              />
            </div>
            <span className="text-cyan-400 font-mono text-xs w-8">{speed}X</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded appearance-none slider"
          />
        </div>
      </HolographicPanel>
    );
  };

  const tabs = [
    { id: 'personas', label: 'PERSONAS', icon: Icons.Users },
    { id: 'scenarios', label: 'SCENARIOS', icon: Icons.Settings },
    { id: 'simulation', label: 'SIMULATION', icon: Icons.Play }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Matrix Background */}
      <canvas 
        ref={matrixRef}
        className="fixed inset-0 opacity-10 pointer-events-none"
      />
      
      {/* Persona Editor Modal */}
      <PersonaEditor />
      
      {/* Main Interface */}
      <div className="relative z-10 p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-mono font-bold text-cyan-400 mb-2 tracking-wider">
            PERSONA SECURITY LAB
          </h1>
          <div className="text-sm font-mono text-gray-400">
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
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500' 
                      : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10'
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
              <div className="text-cyan-400 font-mono font-bold text-lg">PERSONA LIBRARY</div>
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
                className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm flex items-center gap-2"
              >
                <Icons.Plus />
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
                    setSelectedPersonas(prev => 
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
            <div className="text-cyan-400 font-mono font-bold text-lg">SCENARIO BUILDER</div>
            <div className="text-gray-400 font-mono text-sm">
              Built-in phishing email scenario ready for testing. More scenarios coming soon.
            </div>
            
            <HolographicPanel>
              <div className="text-cyan-400 font-mono font-bold text-sm mb-4">DEFAULT SCENARIO</div>
              <div className="border border-cyan-500/30 rounded p-3 bg-cyan-500/10">
                <div className="text-cyan-400 font-mono font-bold text-sm">Email Phishing Response</div>
                <div className="text-gray-400 font-mono text-xs mt-1">Employee receives suspicious email and must decide how to respond</div>
                <div className="text-yellow-400 font-mono text-xs mt-2">
                  2 STEPS | EMAIL_SYSTEM
                </div>
              </div>
            </HolographicPanel>

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
                      <div className="text-cyan-400 font-mono font-bold text-sm">{scenario.title}</div>
                      <div className="text-gray-400 font-mono text-xs mt-1">{scenario.description}</div>
                      <div className="text-yellow-400 font-mono text-xs mt-2">
                        {scenario.tasks.length} TASKS | {scenario.system_context.system_type}
                      </div>
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
              {/* Selected Personas Display */}
              <HolographicPanel>
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4">ACTIVE PERSONAS</div>
                {selectedPersonas.length === 0 ? (
                  <div className="text-gray-400 font-mono text-sm text-center py-8">
                    NO PERSONAS SELECTED - GO TO PERSONAS TAB TO SELECT
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPersonas.map(persona => (
                      <div key={persona.id} className="border border-cyan-500/30 rounded p-3 bg-cyan-500/10">
                        <div className="text-cyan-400 font-mono font-bold text-sm">{persona.name}</div>
                        <div className="text-gray-400 font-mono text-xs">{persona.type.replace('_', ' ')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </HolographicPanel>

              {/* Simulation Output */}
              <HolographicPanel>
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4 flex items-center gap-2">
                  <Icons.CheckCircle />
                  SIMULATION OUTPUT
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {simulationOutputs.length === 0 ? (
                    <div className="text-gray-400 font-mono text-sm text-center py-8">
                      NO SIMULATION DATA - CLICK INITIALIZE TO START
                    </div>
                  ) : (
                    simulationOutputs.map((output, index) => (
                      <div key={index} className="border border-gray-600 rounded p-3 bg-gray-900/50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                          <div className="text-cyan-400 font-mono font-bold text-xs">{output.persona_name}</div>
                          <div className="text-gray-400 font-mono text-xs">STEP {output.step}</div>
                        </div>
                        <div className="text-gray-300 font-mono text-xs">
                          <strong>ACTION:</strong> {output.action}
                        </div>
                        <div className="text-gray-300 font-mono text-xs mt-1">
                          <strong>REASONING:</strong> {output.reasoning}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </HolographicPanel>
            </div>
            
            <div className="space-y-6">
              <SimulationControl />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SciFiPersonaLab;