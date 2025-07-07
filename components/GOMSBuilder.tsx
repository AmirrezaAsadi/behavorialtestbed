'use client';

import React, { useState, useEffect } from 'react';
import { GOMSOperator, GOMSFlow, GOMSUIElement, convertGOMSToWorkflow } from '../lib/types';

// Icons for UI
const Icons = {
  Plus: ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  X: ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  Save: ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17,21 17,13 7,13 7,21"></polyline>
      <polyline points="7,3 7,8 15,8"></polyline>
    </svg>
  ),
  ArrowRight: ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Edit: ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Folder: ({ className = "", size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
  )
};

// Common preset templates
const OPERATOR_TEMPLATES = {
  EMAIL_INITIAL_VIEW: {
    name: "EMAIL_INITIAL_VIEW",
    description: "Initial email view where user first encounters the message",
    available_actions: ["scan_header", "read_content", "check_sender", "scroll_down", "close_email"],
    decision_point: "What catches attention first?",
    ui_context: {
      focused_elements: [
        {
          element_id: "sender_field",
          position: "top-left",
          interaction_type: "clickable",
          security_level: "high",
          description: "Email sender display"
        },
        {
          element_id: "content_area",
          position: "main-area",
          interaction_type: "scrollable",
          security_level: "medium",
          description: "Email content body"
        }
      ]
    }
  },
  SENDER_INVESTIGATION: {
    name: "SENDER_INVESTIGATION",
    description: "User investigating email sender details",
    available_actions: ["hover_sender", "verify_contact", "check_domain", "cross_reference"],
    decision_point: "Sender seems legitimate/suspicious?",
    ui_context: {
      focused_elements: [
        {
          element_id: "sender_field",
          position: "highlighted",
          interaction_type: "clickable",
          security_level: "high",
          description: "Highlighted sender information"
        },
        {
          element_id: "verification_popup",
          position: "overlay",
          interaction_type: "clickable",
          security_level: "critical",
          description: "Sender verification options"
        }
      ]
    }
  },
  CONTENT_ANALYSIS: {
    name: "CONTENT_ANALYSIS",
    description: "User analyzing email content for suspicious elements",
    available_actions: ["read_full_content", "hover_links", "check_attachments", "analyze_language"],
    decision_point: "Content seems safe/suspicious?",
    ui_context: {
      focused_elements: [
        {
          element_id: "content_area",
          position: "highlighted",
          interaction_type: "scrollable",
          security_level: "medium",
          description: "Email body content"
        },
        {
          element_id: "link_highlighter",
          position: "automatic",
          interaction_type: "hoverable",
          security_level: "critical",
          description: "Highlighted links in content"
        }
      ]
    }
  }
};

interface GOMSBuilderProps {
  initialFlow?: GOMSFlow;
  onSave: (flow: GOMSFlow, workflowSteps: any[]) => void;
}

const GOMSBuilder: React.FC<GOMSBuilderProps> = ({ initialFlow, onSave }) => {
  // Default empty flow structure
  const defaultFlow: GOMSFlow = {
    id: `flow_${Date.now()}`,
    name: "New GOMS Flow",
    description: "Define your scenario workflow",
    goal: "Complete the security task",
    operators: []
  };

  const [flow, setFlow] = useState<GOMSFlow>(initialFlow || defaultFlow);
  const [currentOperatorId, setCurrentOperatorId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Find current operator being edited
  const currentOperator = flow.operators.find(op => op.id === currentOperatorId);

  // Add a new operator from template or blank
  const addOperator = (template?: any) => {
    const newOperator: GOMSOperator = {
      id: `operator_${Date.now()}`,
      name: template?.name || "NEW_OPERATOR",
      description: template?.description || "Describe this step",
      available_actions: template?.available_actions || ["action_1", "action_2"],
      next_steps: template?.next_steps || [],
      decision_point: template?.decision_point || "What does the user decide?",
      ui_context: {
        focused_elements: template?.ui_context?.focused_elements || [{
          element_id: "default_element",
          position: "center",
          interaction_type: "clickable",
          security_level: "low",
          description: "Default UI element"
        }]
      }
    };
    
    setFlow(prev => ({
      ...prev,
      operators: [...prev.operators, newOperator]
    }));
    setCurrentOperatorId(newOperator.id);
    setShowTemplates(false);
  };

  // Update operator details
  const updateOperator = (id: string, field: keyof GOMSOperator, value: any) => {
    setFlow(prev => ({
      ...prev,
      operators: prev.operators.map(op => 
        op.id === id ? { ...op, [field]: value } : op
      )
    }));
  };

  // Update flow metadata
  const updateFlow = (field: keyof GOMSFlow, value: any) => {
    setFlow(prev => ({ ...prev, [field]: value }));
  };

  // Add/Update UI element in current operator
  const updateUIElement = (operatorId: string, elementIndex: number, field: keyof GOMSUIElement, value: any) => {
    setFlow(prev => ({
      ...prev,
      operators: prev.operators.map(op => {
        if (op.id === operatorId) {
          const updatedElements = [...op.ui_context.focused_elements];
          updatedElements[elementIndex] = {
            ...updatedElements[elementIndex],
            [field]: value
          };
          return {
            ...op,
            ui_context: {
              ...op.ui_context,
              focused_elements: updatedElements
            }
          };
        }
        return op;
      })
    }));
  };

  // Add new UI element to current operator
  const addUIElement = (operatorId: string) => {
    setFlow(prev => ({
      ...prev,
      operators: prev.operators.map(op => {
        if (op.id === operatorId) {
          return {
            ...op,
            ui_context: {
              ...op.ui_context,
              focused_elements: [
                ...op.ui_context.focused_elements,
                {
                  element_id: `element_${Date.now()}`,
                  position: "center",
                  interaction_type: "clickable",
                  security_level: "low",
                  description: ""
                }
              ]
            }
          };
        }
        return op;
      })
    }));
  };

  // Remove UI element from current operator
  const removeUIElement = (operatorId: string, elementIndex: number) => {
    setFlow(prev => ({
      ...prev,
      operators: prev.operators.map(op => {
        if (op.id === operatorId) {
          const updatedElements = [...op.ui_context.focused_elements];
          updatedElements.splice(elementIndex, 1);
          return {
            ...op,
            ui_context: {
              ...op.ui_context,
              focused_elements: updatedElements
            }
          };
        }
        return op;
      })
    }));
  };

  // Delete operator
  const deleteOperator = (id: string) => {
    setFlow(prev => ({
      ...prev,
      operators: prev.operators.filter(op => op.id !== id)
    }));
    if (currentOperatorId === id) {
      setCurrentOperatorId(null);
    }
  };

  // Handle array inputs (actions, next steps)
  const handleArrayInput = (operatorId: string, field: 'available_actions' | 'next_steps', value: string) => {
    setFlow(prev => ({
      ...prev,
      operators: prev.operators.map(op => {
        if (op.id === operatorId) {
          return {
            ...op,
            [field]: value.split('\n').filter(line => line.trim() !== '')
          };
        }
        return op;
      })
    }));
  };

  // Save the flow and convert to workflow steps
  const handleSave = () => {
    const workflowSteps = convertGOMSToWorkflow(flow);
    onSave(flow, workflowSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-cyan-300 font-mono font-bold text-lg">GOMS WORKFLOW BUILDER</div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-blue-500/30 border border-blue-400 text-blue-300 rounded font-mono text-sm"
          >
            <Icons.Folder className="inline mr-2" />
            TEMPLATES
          </button>
          <button 
            onClick={() => addOperator()}
            className="px-4 py-2 bg-green-500/30 border border-green-500 text-green-300 rounded font-mono text-sm"
          >
            <Icons.Plus className="inline mr-2" />
            ADD OPERATOR
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-purple-500/30 border border-purple-400 text-purple-300 rounded font-mono text-sm"
          >
            <Icons.Save className="inline mr-2" />
            SAVE FLOW
          </button>
        </div>
      </div>

      {/* Flow Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-mono text-xs mb-1 font-semibold">FLOW NAME</label>
          <input 
            type="text"
            value={flow.name}
            onChange={(e) => updateFlow('name', e.target.value)}
            className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
          />
        </div>
        <div>
          <label className="block text-white font-mono text-xs mb-1 font-semibold">GOAL</label>
          <input 
            type="text"
            value={flow.goal}
            onChange={(e) => updateFlow('goal', e.target.value)}
            className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
          />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-white font-mono text-xs mb-1 font-semibold">DESCRIPTION</label>
          <textarea 
            value={flow.description}
            onChange={(e) => updateFlow('description', e.target.value)}
            className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-16 shadow-sm"
          />
        </div>
      </div>

      {/* Template Selector Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-cyan-300 font-mono font-bold">OPERATOR TEMPLATES</h3>
              <button 
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-200"
              >
                <Icons.X />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(OPERATOR_TEMPLATES).map(([key, template]) => (
                <div 
                  key={key} 
                  className="border border-gray-700 rounded-lg p-4 hover:border-cyan-500 cursor-pointer bg-gray-800/50"
                  onClick={() => addOperator(template)}
                >
                  <div className="font-mono text-cyan-400 font-bold text-sm mb-2">{template.name}</div>
                  <p className="text-gray-300 text-sm mb-3">{template.description}</p>
                  <div className="text-xs text-gray-400">
                    <div>Actions: {template.available_actions.length}</div>
                    <div>UI Elements: {template.ui_context.focused_elements.length}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Operator List & Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Operator List */}
        <div className="space-y-2">
          <div className="text-yellow-300 font-mono font-bold text-sm mb-2">OPERATORS</div>
          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {flow.operators.map((op) => (
              <div 
                key={op.id}
                className={`border p-3 rounded cursor-pointer flex justify-between items-center ${
                  currentOperatorId === op.id 
                    ? 'bg-cyan-900/20 border-cyan-500' 
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-500'
                }`}
                onClick={() => setCurrentOperatorId(op.id)}
              >
                <div>
                  <div className="font-mono text-sm">{op.name}</div>
                  <div className="text-gray-400 text-xs mt-1 truncate max-w-[200px]">{op.description}</div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteOperator(op.id); }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Icons.X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Operator Editor */}
        <div className="md:col-span-2">
          {currentOperator ? (
            <div className="space-y-4">
              <div className="text-green-300 font-mono font-bold text-sm">EDIT OPERATOR</div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-mono text-xs mb-1 font-semibold">OPERATOR NAME</label>
                  <input 
                    type="text"
                    value={currentOperator.name}
                    onChange={(e) => updateOperator(currentOperator.id, 'name', e.target.value)}
                    className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-white font-mono text-xs mb-1 font-semibold">DECISION POINT</label>
                  <input 
                    type="text"
                    value={currentOperator.decision_point}
                    onChange={(e) => updateOperator(currentOperator.id, 'decision_point', e.target.value)}
                    className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm shadow-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white font-mono text-xs mb-1 font-semibold">DESCRIPTION</label>
                <textarea 
                  value={currentOperator.description}
                  onChange={(e) => updateOperator(currentOperator.id, 'description', e.target.value)}
                  className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-16 shadow-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-mono text-xs mb-1 font-semibold">AVAILABLE ACTIONS (one per line)</label>
                  <textarea 
                    value={currentOperator.available_actions.join('\n')}
                    onChange={(e) => handleArrayInput(currentOperator.id, 'available_actions', e.target.value)}
                    className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-24 shadow-sm"
                    placeholder="scan_header&#10;read_content&#10;check_sender"
                  />
                </div>
                <div>
                  <label className="block text-white font-mono text-xs mb-1 font-semibold">NEXT STEPS (operator names, one per line)</label>
                  <textarea 
                    value={currentOperator.next_steps.join('\n')}
                    onChange={(e) => handleArrayInput(currentOperator.id, 'next_steps', e.target.value)}
                    className="w-full bg-black/70 border border-cyan-500/50 rounded px-3 py-2 text-cyan-200 font-mono text-sm h-24 shadow-sm"
                    placeholder="SENDER_INVESTIGATION&#10;CONTENT_ANALYSIS&#10;IMMEDIATE_ACTION"
                  />
                </div>
              </div>
              
              {/* UI Context Editor */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-white font-mono text-xs mb-1 font-semibold">UI ELEMENTS</label>
                  <button 
                    onClick={() => addUIElement(currentOperator.id)}
                    className="px-2 py-1 bg-green-500/30 border border-green-500/70 text-green-300 rounded font-mono text-xs"
                  >
                    <Icons.Plus className="inline mr-1" size={12} />
                    ADD UI ELEMENT
                  </button>
                </div>
                
                <div className="space-y-3 mt-2">
                  {currentOperator.ui_context.focused_elements.map((element, idx) => (
                    <div key={idx} className="border border-gray-700 rounded p-3 bg-black/40">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-cyan-300 font-mono text-xs">ELEMENT #{idx + 1}</div>
                        <button 
                          onClick={() => removeUIElement(currentOperator.id, idx)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Icons.X size={12} />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 font-mono text-xs mb-1">Element ID</label>
                          <input 
                            type="text"
                            value={element.element_id}
                            onChange={(e) => updateUIElement(currentOperator.id, idx, 'element_id', e.target.value)}
                            className="w-full bg-black/70 border border-gray-600 rounded px-2 py-1 text-cyan-200 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-mono text-xs mb-1">Position</label>
                          <input 
                            type="text"
                            value={element.position}
                            onChange={(e) => updateUIElement(currentOperator.id, idx, 'position', e.target.value)}
                            className="w-full bg-black/70 border border-gray-600 rounded px-2 py-1 text-cyan-200 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 font-mono text-xs mb-1">Interaction Type</label>
                          <select
                            value={element.interaction_type}
                            onChange={(e) => updateUIElement(currentOperator.id, idx, 'interaction_type', e.target.value)}
                            className="w-full bg-black/70 border border-gray-600 rounded px-2 py-1 text-cyan-200 font-mono text-xs"
                          >
                            <option value="clickable">Clickable</option>
                            <option value="hoverable">Hoverable</option>
                            <option value="scrollable">Scrollable</option>
                            <option value="input">Input</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-300 font-mono text-xs mb-1">Security Level</label>
                          <select
                            value={element.security_level}
                            onChange={(e) => updateUIElement(currentOperator.id, idx, 'security_level', e.target.value)}
                            className="w-full bg-black/70 border border-gray-600 rounded px-2 py-1 text-cyan-200 font-mono text-xs"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-gray-300 font-mono text-xs mb-1">Description</label>
                          <input 
                            type="text"
                            value={element.description || ""}
                            onChange={(e) => updateUIElement(currentOperator.id, idx, 'description', e.target.value)}
                            className="w-full bg-black/70 border border-gray-600 rounded px-2 py-1 text-cyan-200 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-10">
              <div className="text-gray-500 text-center">
                <p className="mb-4">Select an operator to edit or add a new one</p>
                <button 
                  onClick={() => addOperator()}
                  className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded font-mono text-sm"
                >
                  <Icons.Plus className="inline mr-2" />
                  ADD OPERATOR
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Flow Preview (basic version) */}
      {flow.operators.length > 0 && (
        <div>
          <div className="text-purple-300 font-mono font-bold text-sm mb-3">FLOW PREVIEW</div>
          <div className="border border-gray-700 rounded p-4 bg-gray-900/30 overflow-x-auto">
            <div className="flex items-center flex-wrap gap-4">
              {flow.operators.map((op, index) => (
                <div key={op.id} className="flex items-center">
                  <div 
                    className={`border rounded p-2 min-w-[180px] ${
                      currentOperatorId === op.id ? 'border-cyan-500 bg-cyan-900/20' : 'border-gray-700'
                    }`}
                    onClick={() => setCurrentOperatorId(op.id)}
                  >
                    <div className="font-mono text-sm text-cyan-300">{op.name}</div>
                    <div className="text-xs text-gray-400 mt-1 truncate" style={{maxWidth: '180px'}}>{op.decision_point}</div>
                  </div>
                  
                  {index < flow.operators.length - 1 && (
                    <div className="mx-2">
                      <Icons.ArrowRight className="text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GOMSBuilder;
