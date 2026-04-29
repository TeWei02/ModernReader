/**
 * Moltbook - Agent 交流與協作的共享環境
 * 提供會話管理、狀態持久化、Agent 註冊與發現
 */

export interface AgentInfo {
  id: string
  name: string
  capabilities: string[]
  endpoint?: string
  status: 'active' | 'idle' | 'busy' | 'offline'
  metadata?: Record<string, unknown>
}

export interface Session {
  id: string
  participants: string[] // agent ids
  messages: Message[]
  createdAt: number
  updatedAt: number
  state: Record<string, unknown>
}

export interface Message {
  id: string
  from: string
  to?: string | string[]
  type: 'request' | 'response' | 'broadcast' | 'event'
  content: unknown
  timestamp: number
  inReplyTo?: string
}

export class MoltbookEnvironment {
  private agents: Map<string, AgentInfo> = new Map()
  private sessions: Map<string, Session> = new Map()
  private messageQueue: Message[] = []

  /**
   * 註冊 Agent
   */
  registerAgent(agent: AgentInfo): void {
    this.agents.set(agent.id, agent)
    console.log(`[Moltbook] Agent registered: ${agent.id} (${agent.name})`)
  }

  /**
   * 註銷 Agent
   */
  unregisterAgent(agentId: string): void {
    this.agents.delete(agentId)
    console.log(`[Moltbook] Agent unregistered: ${agentId}`)
  }

  /**
   * 獲取 Agent 資訊
   */
  getAgent(agentId: string): AgentInfo | undefined {
    return this.agents.get(agentId)
  }

  /**
   * 搜尋具有特定能力的 Agent
   */
  findAgentsByCapability(capability: string): AgentInfo[] {
    return Array.from(this.agents.values()).filter(agent =>
      agent.capabilities.includes(capability) && agent.status !== 'offline'
    )
  }

  /**
   * 建立新會話
   */
  createSession(participants: string[], initialState?: Record<string, unknown>): Session {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: Session = {
      id: sessionId,
      participants,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      state: initialState || {}
    }
    this.sessions.set(sessionId, session)
    console.log(`[Moltbook] Session created: ${sessionId} with ${participants.length} participants`)
    return session
  }

  /**
   * 獲取會話
   */
  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId)
  }

  /**
   * 發送訊息
   */
  sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Message {
    const fullMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    // 加入對應會話
    if (message.type === 'broadcast') {
      // 廣播給所有 Agent
      this.messageQueue.push(fullMessage)
    } else {
      // 尋找包含發送者和接收者的會話
      const relevantSessions = Array.from(this.sessions.values()).filter(
        s => s.participants.includes(message.from) && 
             (!message.to || s.participants.includes(Array.isArray(message.to) ? message.to[0] : message.to))
      )

      if (relevantSessions.length > 0) {
        relevantSessions.forEach(s => {
          s.messages.push(fullMessage)
          s.updatedAt = Date.now()
        })
      } else {
        // 沒有合適會話，加入全局佇列
        this.messageQueue.push(fullMessage)
      }
    }

    console.log(`[Moltbook] Message sent: ${fullMessage.id} from ${message.from}`)
    return fullMessage
  }

  /**
   * Agent 間直接通訊（Claw 協議基礎）
   */
  async communicate(fromAgentId: string, toAgentId: string, content: unknown): Promise<Message> {
    const from = this.getAgent(fromAgentId)
    const to = this.getAgent(toAgentId)

    if (!from) throw new Error(`Agent not found: ${fromAgentId}`)
    if (!to) throw new Error(`Agent not found: ${toAgentId}`)

    const message = this.sendMessage({
      from: fromAgentId,
      to: toAgentId,
      type: 'request',
      content
    })

    // 更新 Agent 狀態
    this.updateAgentStatus(fromAgentId, 'busy')
    
    return message
  }

  /**
   * 更新 Agent 狀態
   */
  updateAgentStatus(agentId: string, status: AgentInfo['status']): void {
    const agent = this.agents.get(agentId)
    if (agent) {
      agent.status = status
      this.agents.set(agentId, agent)
    }
  }

  /**
   * 獲取待處理訊息
   */
  getPendingMessages(agentId?: string): Message[] {
    if (agentId) {
      return this.messageQueue.filter(
        m => !m.to || m.to === agentId || (Array.isArray(m.to) && m.to.includes(agentId))
      )
    }
    return [...this.messageQueue]
  }

  /**
   * 清除已處理訊息
   */
  clearProcessedMessages(messageIds: string[]): void {
    this.messageQueue = this.messageQueue.filter(m => !messageIds.includes(m.id))
  }

  /**
   * 導出環境狀態
   */
  exportState(): Record<string, unknown> {
    return {
      agents: Array.from(this.agents.values()),
      sessions: Array.from(this.sessions.values()),
      pendingMessages: this.messageQueue.length
    }
  }
}

// 使用示例
const moltbook = new MoltbookEnvironment()

// 註冊 Agents
moltbook.registerAgent({
  id: '@researcher',
  name: 'Research Agent',
  capabilities: ['search', 'analyze', 'summarize'],
  status: 'active'
})

moltbook.registerAgent({
  id: '@writer',
  name: 'Writing Agent',
  capabilities: ['write', 'edit', 'format'],
  status: 'active'
})

moltbook.registerAgent({
  id: '@summarizer',
  name: 'Summary Agent',
  capabilities: ['summarize', 'extract'],
  status: 'idle'
})

// 建立會話
const session = moltbook.createSession(['@researcher', '@writer'], {
  topic: '量子計算基礎',
  depth: 'intermediate'
})

// Agent 通訊
moltbook.communicate('@researcher', '@writer', {
  action: 'research',
  topic: '量子糾纏',
  deadline: Date.now() + 3600000
}).then(msg => {
  console.log('Message delivered:', msg.id)
})

console.log('\nEnvironment State:', moltbook.exportState())
