'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Clock, Calendar, Users, TrendingUp, AlertTriangle, CheckCircle, Zap, Edit, Plus, Save, X, Settings } from 'lucide-react';

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
    // Animated matrix background
    const canvas = matrixRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
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
    if (selectedPersonas.length === 0 || !activeScenario) {
      alert('Please select personas and a scenario first');
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
          scenario: activeScenario,
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
              <Edit size={14} />
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
          <Zap size={16} />
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
            disabled={selectedPersonas.length === 0 || !activeScenario}
            className={`px-3 py-2 rounded font-mono text-xs font-bold border transition-all ${
              selectedPersonas.length === 0 || !activeScenario
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
    { id: 'personas', label: 'PERSONAS', icon: Users },
    { id: 'scenarios', label: 'SCENARIOS', icon: Settings },
    { id: 'simulation', label: 'SIMULATION', icon: Play }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Matrix Background */}
      <canvas 
        ref={matrixRef}
        className="fixed inset-0 opacity-10 pointer-events-none"
      />
      
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
                  <Icon size={16} />
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
                className="px-4 py-2 bg-green-500/20 border border-green-500 text-green-400 rounded font-mono text-sm"
              >
                <Plus size={16} className="inline mr-2" />
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
              Select or create scenarios for persona testing
            </div>
            
            {scenarios.length > 0 && (
              <HolographicPanel>
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4">AVAILABLE SCENARIOS</div>
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
                <div className="text-cyan-400 font-mono font-bold text-sm mb-4">SIMULATION OUTPUT</div>
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
