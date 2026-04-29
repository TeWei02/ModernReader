/**
 * Claw Protocol
 * Native agent communication protocol for Semantica
 */

export interface ClawMessage {
  id: string
  from: string
  to: string
  semanticRoute: string
  content: any
  timestamp: number
  ttl: number
  priority: 'low' | 'normal' | 'high' | 'critical'
}

export interface ClawResponse {
  messageId: string
  status: 'success' | 'error' | 'pending'
  data?: any
  error?: string
}

export class ClawProtocol {
  private messageQueue: ClawMessage[] = []
  private handlers: Map<string, (msg: ClawMessage) => Promise<any>> = new Map()
  
  async send(message: Omit<ClawMessage, 'id' | 'timestamp'>): Promise<ClawResponse> {
    const clawMessage: ClawMessage = {
      ...message,
      id: `claw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ttl: message.ttl || 30000,
      priority: message.priority || 'normal'
    }
    
    this.messageQueue.push(clawMessage)
    
    // Route to handler if exists
    const handler = this.handlers.get(message.semanticRoute)
    if (handler) {
      try {
        const result = await handler(clawMessage)
        return {
          messageId: clawMessage.id,
          status: 'success',
          data: result
        }
      } catch (error) {
        return {
          messageId: clawMessage.id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
    
    return {
      messageId: clawMessage.id,
      status: 'pending',
      error: 'No handler registered for route'
    }
  }
  
  registerHandler(route: string, handler: (msg: ClawMessage) => Promise<any>): void {
    this.handlers.set(route, handler)
  }
  
  async broadcast(content: any, exclude?: string[]): Promise<ClawResponse[]> {
    const responses: ClawResponse[] = []
    
    for (const [route] of this.handlers) {
      if (!exclude?.includes(route)) {
        const response = await this.send({
          from: '@system',
          to: route.split('/')[0],
          semanticRoute: route,
          content
        })
        responses.push(response)
      }
    }
    
    return responses
  }
  
  getQueue(): ClawMessage[] {
    return this.messageQueue.filter(msg => Date.now() - msg.timestamp < msg.ttl)
  }
}

// Example usage
const claw = new ClawProtocol()
console.log('Claw Protocol Ready')
export default claw
