# Enhanced Agent System Setup

## 🚀 Quick Start

### 1. **Push the Code**
```bash
git add .
git commit -m "Add enhanced multi-agent system with autonomous agents

- Add BaseAgent with BDI architecture and autonomous behavior loops
- Add SecurityPractitionerAgent and ThreatActorAgent implementations  
- Add SharedEnvironment for dynamic multi-agent interactions
- Add AgentSimulationManager for orchestrating concurrent agents
- Add new API endpoint /api/simulation/agent-run for enhanced simulations
- Preserve all existing functionality and metrics (Shannon entropy, etc.)
- Add comprehensive documentation and examples"

git push origin main
```

### 2. **Test the Enhancement**

#### Option A: Use New API Endpoint
```bash
# Test the new agent system
curl -X POST http://localhost:3000/api/simulation/agent-run \
  -H "Content-Type: application/json" \
  -d '{
    "personas": [...your personas...],
    "scenario": {...your scenario...},
    "config": {
      "simulation_duration_minutes": 2,
      "enable_emergent_behaviors": true
    }
  }'
```

#### Option B: Run Example
```bash
# Run the demo example
cd behavorialtestbed
npx ts-node examples/basic_agent_simulation.ts
```

### 3. **Integration Options**

#### **Immediate Use (Recommended)**
- Your existing system continues working unchanged
- New agent system available at `/api/simulation/agent-run`
- Same UI can call either endpoint

#### **Gradual Migration**
- Test agent system with small scenarios first
- Compare results with original system
- Gradually adopt for more complex simulations

### 4. **Dependencies**
All dependencies already in your package.json:
- ✅ OpenAI SDK (for LLM calls)
- ✅ Next.js (for API routes)  
- ✅ TypeScript (for type safety)
- ✅ Node.js events (for agent communication)

### 5. **Environment Variables**
Same as your existing system:
```bash
XAI_API_KEY=your_grok_key        # Preferred
OPENAI_API_KEY=your_openai_key   # Fallback
```

## 🎯 What You Get Immediately

### **Enhanced Behavioral Testing**
- True concurrent multi-agent execution
- Real autonomous decision-making
- Emergent behavior detection
- Dynamic agent interactions

### **Better Research Data**
- All your existing metrics (Shannon entropy, persona fidelity, etc.)
- Plus: interaction patterns, trust networks, goal achievement
- Real-time monitoring capabilities
- Emergent behavior analysis

### **Learning Platform**
- Hands-on agent development experience
- BDI architecture implementation
- Multi-agent coordination patterns
- Complex systems emergence

## 🔍 Quick Verification

After pushing, verify everything works:

1. **Original system still works:**
   ```bash
   curl -X GET http://localhost:3000/api/simulation/run
   ```

2. **New agent system available:**
   ```bash
   curl -X GET http://localhost:3000/api/simulation/agent-run
   ```

3. **No breaking changes:**
   - Your UI should work unchanged
   - All existing API responses preserved
   - Same persona and scenario formats

## 📚 Next Steps

1. **Read the guides:**
   - `ENHANCED_SYSTEM_OVERVIEW.md` - System comparison
   - `AGENT_DEVELOPMENT_GUIDE.md` - Development tutorial

2. **Try the example:**
   - `examples/basic_agent_simulation.ts` - Working demo

3. **Extend the system:**
   - Add RegularUserAgent implementation
   - Create custom agent types
   - Add new interaction patterns

## 🆘 If Something Breaks

The enhancement is completely isolated:
1. Delete the new files
2. Your original system is untouched
3. Everything works as before

But it shouldn't break anything - all new code is separate!