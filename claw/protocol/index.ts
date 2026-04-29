/**
 * Claw Protocol - Agent 間的原生通訊協議
 * 基於語義的訊息路由，支援同步/非同步交流
 */

import type { Message } from '../environment/index.js'

export interface ClawMessage extends Message {
  protocol: 'claw'
  version: string
  semanticRoute: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  ttl?: number // time to live in ms
}

export interface ClawHandler {
  canHandle(route: string): boolean
  handle(message: ClawMessage): Promise<ClawMessage | void>
}

export class ClawProtocol {
  private handlers: Map<string, ClawHandler> = new Map()
  private messageHistory: ClawMessage[] = []
  readonly version = '1.0.0'

  /**
   * 註冊協定處理器
   */
  registerHandler(routePattern: string, handler: ClawHandler): void {
    this.handlers.set(routePattern, handler)
    console.log(`[Claw] Handler registered for route: ${routePattern}`)
  }

  /**
   * 解析語義路由
   */
  private parseSemanticRoute(route: string): {
    target: string
    action?: string
    params?: Record<string, string>
  } {
    // 簡單的路由解析，例如：@agent/action?param=value
    const parts = route.split('/')
    const target = parts[0]
    const action = parts[1]?.split('?')[0]
    
    const queryString = parts[1]?.split('?')[1]
    const params: Record<string, string> = {}
    
    if (queryString) {
      queryString.split('&').forEach(pair => {
        const [key, value] = pair.split('=')
        params[key] = decodeURIComponent(value)
      })
    }

    return { target, action, params }
  }

  /**
   * 發送 Claw 訊息
   */
  async send(message: Omit<ClawMessage, 'protocol' | 'version'>): Promise<ClawMessage> {
    const clawMessage: ClawMessage = {
      ...message,
      protocol: 'claw',
      version: this.version
    }

    // 檢查 TTL
    if (clawMessage.ttl && Date.now() > clawMessage.timestamp + clawMessage.ttl) {
      throw new Error('Message expired')
    }

    // 解析語義路由
    const routeInfo = this.parseSemanticRoute(clawMessage.semanticRoute)
    console.log(`[Claw] Routing message to ${routeInfo.target}/${routeInfo.action}`)

    // 尋找合適的處理器
    let handler: ClawHandler | undefined
    for (const [pattern, h] of this.handlers.entries()) {
      if (h.canHandle(clawMessage.semanticRoute)) {
        handler = h
        break
      }
    }

    if (!handler) {
      console.warn(`[Claw] No handler found for route: ${clawMessage.semanticRoute}`)
      // 加入歷史記錄但仍返回
      this.messageHistory.push(clawMessage)
      return clawMessage
    }

    try {
      await handler.handle(clawMessage)
      this.messageHistory.push(clawMessage)
      return clawMessage
    } catch (error) {
      console.error('[Claw] Handler error:', error)
      throw error
    }
  }

  /**
   * 廣播訊息給多個接收者
   */
  async broadcast(
    from: string,
    content: unknown,
    recipients: string[],
    priority: ClawMessage['priority'] = 'normal'
  ): Promise<ClawMessage[]> {
    const results = await Promise.allSettled(
      recipients.map(recipient =>
        this.send({
          from,
          to: recipient,
          type: 'broadcast',
          content,
          semanticRoute: `${recipient}/receive`,
          priority,
          timestamp: Date.now()
        })
      )
    )

    return results
      .filter((r): r is PromiseFulfilledResult<ClawMessage> => r.status === 'fulfilled')
      .map(r => r.value)
  }

  /**
   * 請求 - 回應模式
   */
  async requestResponse(
    from: string,
    to: string,
    content: unknown,
    timeoutMs = 5000
  ): Promise<ClawMessage> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const request = await this.send({
      id: requestId,
      from,
      to,
      type: 'request',
      content,
      semanticRoute: `${to}/handle`,
      priority: 'normal',
      timestamp: Date.now(),
      ttl: timeoutMs
    })

    // 等待回應（實際實現需要更複雜的機制）
    return new Promise((resolve, reject) => {
      const checkForResponse = () => {
        const response = this.messageHistory.find(
          m => m.inReplyTo === requestId && m.type === 'response'
        )
        
        if (response) {
          resolve(response)
        } else if (Date.now() > request.timestamp + (request.ttl || timeoutMs)) {
          reject(new Error('Request timeout'))
        } else {
          setTimeout(checkForResponse, 100)
        }
      }
      
      checkForResponse()
    })
  }

  /**
   * 獲取訊息歷史
   */
  getHistory(limit = 100): ClawMessage[] {
    return this.messageHistory.slice(-limit)
  }

  /**
   * 清除歷史
   */
  clearHistory(): void {
    this.messageHistory = []
  }

  /**
   * 導出協定狀態
   */
  exportState(): Record<string, unknown> {
    return {
      version: this.version,
      handlers: Array.from(this.handlers.keys()),
      messageCount: this.messageHistory.length
    }
  }
}

// 示例處理器
class SimpleAgentHandler implements ClawHandler {
  constructor(private agentId: string) {}

  canHandle(route: string): boolean {
    return route.startsWith(`${this.agentId}/`)
  }

  async handle(message: ClawMessage): Promise<void> {
    console.log(`[${this.agentId}] Received message:`, message.content)
    // 實際處理邏輯
  }
}

// 使用示例
const claw = new ClawProtocol()

// 註冊處理器
claw.registerHandler('@researcher/*', new SimpleAgentHandler('@researcher'))
claw.registerHandler('@writer/*', new SimpleAgentHandler('@writer'))

// 發送訊息
claw.send({
  from: '@user',
  to: '@researcher',
  type: 'request',
  content: { query: '量子計算基礎' },
  semanticRoute: '@researcher/search',
  priority: 'high',
  timestamp: Date.now()
}).then(msg => {
  console.log('Message sent:', msg.id)
})

// 廣播
claw.broadcast('@coordinator', { announcement: 'Meeting started' }, ['@researcher', '@writer'])

console.log('\nClaw Protocol State:', claw.exportState())
