/**
 * Moltbook Environment - Agent Registry
 * Discovery and management of agents in the shared environment
 */

export interface Agent {
  id: string
  capabilities: string[]
  status: 'active' | 'busy' | 'offline'
  metadata?: Record<string, any>
  lastSeen: number
}

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map()
  
  register(agent: Agent): void {
    this.agents.set(agent.id, {
      ...agent,
      lastSeen: Date.now()
    })
  }
  
  unregister(agentId: string): boolean {
    return this.agents.delete(agentId)
  }
  
  get(agentId: string): Agent | undefined {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.lastSeen = Date.now()
      this.agents.set(agentId, agent)
    }
    return agent
  }
  
  findByCapability(capability: string): Agent[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.capabilities.includes(capability) && agent.status === 'active'
    )
  }
  
  getAll(): Agent[] {
    return Array.from(this.agents.values())
  }
  
  updateStatus(agentId: string, status: Agent['status']): void {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.status = status
      agent.lastSeen = Date.now()
      this.agents.set(agentId, agent)
    }
  }
  
  heartbeat(agentId: string): void {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.lastSeen = Date.now()
      this.agents.set(agentId, agent)
    }
  }
  
  cleanup(staleTimeout: number = 60000): void {
    const now = Date.now()
    for (const [id, agent] of this.agents.entries()) {
      if (now - agent.lastSeen > staleTimeout) {
        this.agents.delete(id)
      }
    }
  }
}

// Example usage
const registry = new AgentRegistry()
console.log('Agent Registry Ready')
export default registry
