/**
 * Semantica 語義解析器
 * 將自然語言意圖轉換為 AST
 */

export interface ASTNode {
  type: 'intent' | 'flow' | 'algorithm';
  action: string;
  params?: Record<string, any>;
  content?: string;
}

export class SemanticaParser {
  parse(code: string): ASTNode {
    const trimmed = code.trim();
    
    // 解析 intent
    if (trimmed.startsWith('intent')) {
      const match = trimmed.match(/intent\s+(\w+)\s*\{([\s\S]*?)\}/);
      if (match) {
        return {
          type: 'intent',
          action: match[1],
          params: this.parseParams(match[2])
        };
      }
    }
    
    // 解析 flow
    if (trimmed.startsWith('flow')) {
      const match = trimmed.match(/flow\s+(\w+)\s*\{([\s\S]*?)\}/);
      if (match) {
        return {
          type: 'flow',
          action: match[1],
          params: this.parseParams(match[2])
        };
      }
    }
    
    // 解析 algorithm
    if (trimmed.startsWith('algorithm')) {
      const match = trimmed.match(/algorithm\s+(\w+)\s*\{([\s\S]*?)\}/);
      if (match) {
        return {
          type: 'algorithm',
          action: match[1],
          params: this.parseParams(match[2])
        };
      }
    }
    
    throw new Error(`無法解析 Semantica 代碼：${code}`);
  }
  
  private parseParams(content: string): Record<string, any> {
    const params: Record<string, any> = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;
      
      // 解析 key: value
      const match = trimmed.match(/(\w+):\s*(.+)/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        
        // 移除引號
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        
        // 解析陣列
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(v => v.trim());
        }
        
        // 解析數字
        if (/^\d+$/.test(value)) {
          value = parseInt(value, 10);
        } else if (/^\d+\.\d+$/.test(value)) {
          value = parseFloat(value);
        }
        
        // 解析布林
        if (value === 'true') value = true;
        if (value === 'false') value = false;
        
        params[key] = value;
      }
    }
    
    return params;
  }
}

// 導出單例
export const parser = new SemanticaParser();
