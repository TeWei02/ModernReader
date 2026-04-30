/**
 * Moltbook 執行環境
 * Agent 註冊、發現與管理
 */

export interface Agent {
  id: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'busy';
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  participants: string[];
  startTime: number;
  lastActivity: number;
}

export class MoltbookEnvironment {
  private agents: Map<string, Agent> = new Map();
  private sessions: Map<string, Session> = new Map();
  private sessionCount = 0;

  registerAgent(agent: Agent): void {
    if (this.agents.has(agent.id)) {
      console.log(`🔄 更新 Agent: ${agent.id}`);
    } else {
      console.log(`✅ 註冊 Agent: ${agent.id}`);
    }
    this.agents.set(agent.id, agent);
  }

  unregisterAgent(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  getAgent(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  listAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  findAgentsByCapability(capability: string): Agent[] {
    return Array.from(this.agents.values()).filter(
      agent => agent.capabilities.includes(capability) && agent.status === 'active'
    );
  }

  createSession(participants: string[]): Session {
    const id = `session_${++this.sessionCount}`;
    const session: Session = {
      id,
      participants,
      startTime: Date.now(),
      lastActivity: Date.now()
    };
    this.sessions.set(id, session);
    console.log(`🆕 建立會話：${id} (${participants.join(', ')})`);
    return session;
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  updateSessionActivity(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
    }
  }

  endSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getActiveSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  getStatus(): { agents: number; sessions: number } {
    return {
      agents: this.agents.size,
      sessions: this.sessions.size
    };
  }
}
