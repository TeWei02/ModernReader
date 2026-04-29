/**
 * Semantica 語法解析器原型
 * 將聲明式語義轉換為可執行的 AST
 */

export interface SemanticaAST {
  type: 'intent' | 'agent_communication' | 'quantum' | 'collaboration'
  id?: string
  payload: Record<string, unknown>
  children?: SemanticaAST[]
}

export class SemanticaParser {
  private tokens: string[] = []
  private position = 0

  parse(code: string): SemanticaAST[] {
    this.tokens = this.tokenize(code)
    this.position = 0
    const ast: SemanticaAST[] = []

    while (this.position < this.tokens.length) {
      const node = this.parseStatement()
      if (node) ast.push(node)
    }

    return ast
  }

  private tokenize(code: string): string[] {
    // 簡化的 tokenization，實際需要更完整的詞法分析
    return code
      .replace(/([{}:\[\]@->])/g, ' $1 ')
      .split(/\s+/)
      .filter(t => t.length > 0)
  }

  private parseStatement(): SemanticaAST | null {
    if (this.position >= this.tokens.length) return null

    const keyword = this.current()

    switch (keyword) {
      case 'intent':
        return this.parseIntent()
      case 'agent':
        return this.parseAgentCommunication()
      case 'quantum':
        return this.parseQuantum()
      case 'collaborate':
        return this.parseCollaboration()
      default:
        this.advance()
        return null
    }
  }

  private parseIntent(): SemanticaAST {
    this.advance() // consume 'intent'
    const name = this.current()
    this.advance()
    
    const payload = this.parseBlock()
    
    return {
      type: 'intent',
      id: name,
      payload
    }
  }

  private parseAgentCommunication(): SemanticaAST {
    this.advance() // consume 'agent'
    const from = this.current()
    this.advance()
    
    if (this.current() === '->') {
      this.advance()
      const to = this.current()
      this.advance()
      
      const payload = this.parseBlock()
      
      return {
        type: 'agent_communication',
        payload: {
          from,
          to,
          ...payload
        }
      }
    }
    
    return { type: 'agent_communication', payload: { from } }
  }

  private parseQuantum(): SemanticaAST {
    this.advance() // consume 'quantum'
    const operation = this.current()
    this.advance()
    
    const payload = this.parseBlock()
    
    return {
      type: 'quantum',
      payload: {
        operation,
        ...payload
      }
    }
  }

  private parseCollaboration(): SemanticaAST {
    this.advance() // consume 'collaborate'
    const payload = this.parseBlock()
    
    return {
      type: 'collaboration',
      payload
    }
  }

  private parseBlock(): Record<string, unknown> {
    const payload: Record<string, unknown> = {}
    
    if (this.current() !== '{') return payload
    this.advance() // consume '{'
    
    while (this.current() !== '}' && this.position < this.tokens.length) {
      const key = this.current()
      this.advance()
      
      if (this.current() === ':') {
        this.advance() // consume ':'
        const value = this.parseValue()
        payload[key] = value
      }
    }
    
    if (this.current() === '}') {
      this.advance() // consume '}'
    }
    
    return payload
  }

  private parseValue(): string | number | boolean | string[] {
    const token = this.current()
    this.advance()

    // 處理陣列
    if (token === '[') {
      const arr: string[] = []
      while (this.current() !== ']' && this.position < this.tokens.length) {
        arr.push(this.current())
        this.advance()
      }
      if (this.current() === ']') this.advance()
      return arr
    }

    // 處理布爾值
    if (token === 'true') return true
    if (token === 'false') return false

    // 處理數字
    if (/^\d+$/.test(token)) return parseInt(token, 10)

    // 默認作為字符串（去除引號）
    return token.replace(/^["']|["']$/g, '')
  }

  private current(): string {
    return this.tokens[this.position] || ''
  }

  private advance(): void {
    this.position++
  }
}

// 使用示例
const exampleCode = `
intent read {
  source: "https://example.com/article"
  agent: @summarizer
  output: @user.preferred_format
}

agent @researcher -> @writer {
  topic: "量子計算基礎"
  depth: intermediate
}
`

const parser = new SemanticaParser()
const ast = parser.parse(exampleCode)
console.log('Parsed AST:', JSON.stringify(ast, null, 2))
