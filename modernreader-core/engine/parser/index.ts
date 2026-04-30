/**
 * Semantica 語法解析器
 * 嚴格遵循語言規範，解析 intent、flow、simulation、algorithm
 */

export interface AST {
  type: 'intent' | 'flow' | 'simulation' | 'algorithm';
  name?: string;
  body: any;
}

export class SemanticaParser {
  /**
   * 解析 Semantica 代碼
   */
  parse(code: string): AST {
    const trimmed = code.trim();
    
    // 檢測類型
    if (trimmed.startsWith('intent')) {
      return this.parseIntent(trimmed);
    } else if (trimmed.startsWith('flow')) {
      return this.parseFlow(trimmed);
    } else if (trimmed.startsWith('simulation')) {
      return this.parseSimulation(trimmed);
    } else if (trimmed.startsWith('algorithm')) {
      return this.parseAlgorithm(trimmed);
    }
    
    throw new Error(`Unknown Semantica construct: ${trimmed.substring(0, 20)}...`);
  }

  /**
   * 解析 intent
   */
  private parseIntent(code: string): AST {
    const match = code.match(/intent\s+(\w+)\s*\{([\s\S]*)\}/);
    if (!match) {
      throw new Error('Invalid intent syntax');
    }
    
    const [, name, bodyStr] = match;
    const body = this.parseBody(bodyStr);
    
    return { type: 'intent', name, body };
  }

  /**
   * 解析 flow
   */
  private parseFlow(code: string): AST {
    const match = code.match(/flow\s+(\w+)\s*\{([\s\S]*)\}/);
    if (!match) {
      throw new Error('Invalid flow syntax');
    }
    
    const [, name, bodyStr] = match;
    const body = this.parseBody(bodyStr);
    
    return { type: 'flow', name, body };
  }

  /**
   * 解析 simulation
   */
  private parseSimulation(code: string): AST {
    const match = code.match(/simulation\s+(\w+)\s*\{([\s\S]*)\}/);
    if (!match) {
      throw new Error('Invalid simulation syntax');
    }
    
    const [, name, bodyStr] = match;
    const body = this.parseBody(bodyStr);
    
    return { type: 'simulation', name, body };
  }

  /**
   * 解析 algorithm
   */
  private parseAlgorithm(code: string): AST {
    const match = code.match(/algorithm\s+(\w+)\s*\{([\s\S]*)\}/);
    if (!match) {
      throw new Error('Invalid algorithm syntax');
    }
    
    const [, name, bodyStr] = match;
    const body = this.parseBody(bodyStr);
    
    return { type: 'algorithm', name, body };
  }

  /**
   * 解析身體內容
   */
  private parseBody(bodyStr: string): any {
    const result: any = {};
    const lines = bodyStr.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;
      
      // 解析 key: value
      const kvMatch = trimmed.match(/(\w+):\s*(.+)/);
      if (kvMatch) {
        const [, key, value] = kvMatch;
        result[key] = this.parseValue(value);
      }
    }
    
    return result;
  }

  /**
   * 解析值
   */
  private parseValue(value: string): any {
    value = value.trim();
    
    // 移除結尾逗號
    if (value.endsWith(',')) {
      value = value.slice(0, -1);
    }
    
    // 布爾值
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // 數字
    if (/^\d+$/.test(value)) return parseInt(value, 10);
    if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
    
    // 字符串
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    
    // 數組
    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value.slice(1, -1).split(',').map(i => this.parseValue(i.trim()));
      return items;
    }
    
    // 對象
    if (value.startsWith('{') && value.endsWith('}')) {
      return this.parseBody(value.slice(1, -1));
    }
    
    return value;
  }

  /**
   * 提取內容 (用於 flow input)
   */
  async extractContent(input: string): Promise<string> {
    // 模擬內容提取
    return `Extracted content from ${input}`;
  }
}
