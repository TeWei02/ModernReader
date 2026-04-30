/**
 * Claw 通訊協議
 * Agent 間的語義化通訊
 */

export interface ClawMessage {
  from: string;
  to: string;
  semanticRoute: string;
  content: any;
  priority?: number;
  ttl?: number;
  timestamp?: number;
}

export interface ClawResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class ClawProtocol {
  private messageQueue: ClawMessage[] = [];
  private handlers: Map<string, (msg: ClawMessage) => Promise<ClawResponse>> = new Map();

  registerHandler(route: string, handler: (msg: ClawMessage) => Promise<ClawResponse>): void {
    this.handlers.set(route, handler);
  }

  async send(message: ClawMessage): Promise<ClawResponse> {
    const msg: ClawMessage = {
      ...message,
      timestamp: Date.now(),
      priority: message.priority || 5,
      ttl: message.ttl || 30000
    };
    
    console.log(`📤 Claw 發送：${msg.from} -> ${msg.to} (${msg.semanticRoute})`);
    
    // 檢查是否有處理器
    const handler = this.handlers.get(msg.semanticRoute);
    if (handler) {
      try {
        return await handler(msg);
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    // 預設回應（模擬成功）
    return {
      success: true,
      data: { received: true, route: msg.semanticRoute }
    };
  }

  async broadcast(from: string, targets: string[], content: any): Promise<ClawResponse[]> {
    const responses: ClawResponse[] = [];
    
    for (const to of targets) {
      const response = await this.send({
        from,
        to,
        semanticRoute: `broadcast/${to}`,
        content
      });
      responses.push(response);
    }
    
    return responses;
  }

  getQueue(): ClawMessage[] {
    return [...this.messageQueue];
  }

  clearQueue(): void {
    this.messageQueue = [];
  }
}

// 導出單例
export const claw = new ClawProtocol();
