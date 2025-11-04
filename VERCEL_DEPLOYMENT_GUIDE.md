# Vercel Deployment Guide - Enhanced Multi-Agent System

## Quick Access Guide

After deploying to Vercel, you'll have access to both the original system and the new enhanced multi-agent system through the same UI.

### How to Access the Enhanced System

1. **Open your Vercel deployment** (e.g., `https://your-app.vercel.app`)

2. **Look for the "AGENT SYSTEM SELECTION" panel** in the simulation configuration area

3. **Check the box**: "Use Enhanced Multi-Agent System (BDI Architecture)"

4. **Configure the enhanced system** with these new options:
   - **Duration**: 1-10 minutes (default: 3 minutes)
   - **Max Agents**: 2-20 concurrent agents (default: 10)
   - **Emergent Behaviors**: Enable detection of group behaviors
   - **Agent Learning**: Enable agents to learn from interactions
   - **Memory Persistence**: Enable long-term memory across interactions

5. **Run your simulation** - it will automatically use the enhanced system

## What's Different in the Enhanced System

### Visual Indicators
- **Green highlighting** when enhanced system is selected
- **Status message**: "ENHANCED AGENT SYSTEM - BDI ARCHITECTURE ENABLED"
- **Original multi-agent options hidden** (they're replaced by the enhanced system)

### Enhanced Capabilities
- **Autonomous agents** with Belief-Desire-Intention (BDI) architecture
- **Real-time interactions** between agents during simulation
- **Emergent behavior detection** from group dynamics
- **Memory systems** (short-term, long-term, episodic, semantic)
- **Dynamic goal adaptation** based on environment changes
- **Sophisticated threat modeling** with adaptive responses

## API Endpoints

The system automatically chooses the correct API endpoint:

- **Original System**: `/api/simulation/run`
- **Enhanced System**: `/api/simulation/agent-run`

## Backward Compatibility

✅ **Your existing scenarios work with both systems**
✅ **All personas are compatible**
✅ **Same UI for both systems**
✅ **Results format is consistent**

## Deployment Steps

1. **Push your changes** to your GitHub repository
2. **Vercel auto-deploys** (if connected to GitHub)
3. **Access your app** at your Vercel URL
4. **Toggle between systems** using the new checkbox

## Troubleshooting

### If the enhanced system option doesn't appear:
- Clear your browser cache
- Check that the deployment completed successfully
- Verify all new files were committed to your repository

### If you get API errors:
- Check the Vercel function logs
- Ensure all dependencies are installed
- Verify the new API endpoint is deployed

## System Comparison

| Feature | Original System | Enhanced System |
|---------|----------------|-----------------|
| Agent Architecture | Simple state-based | BDI (Belief-Desire-Intention) |
| Interactions | Predefined | Autonomous & emergent |
| Memory | Session-only | Persistent multi-layer |
| Learning | None | Adaptive learning |
| Behavior Analysis | Shannon entropy | Emergent behavior detection |
| Simulation Duration | Step-based | Time-based (minutes) |

## Next Steps

1. **Deploy to Vercel** (push your code)
2. **Test both systems** with your existing scenarios
3. **Explore enhanced features** with multi-agent scenarios
4. **Compare results** between original and enhanced systems

The enhanced system is designed to provide deeper insights into security behavior through more realistic agent interactions and emergent group dynamics.