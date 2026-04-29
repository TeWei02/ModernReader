/**
 * Semantica Parser
 * Parses semantic intent declarations into AST
 */

export interface ASTNode {
  type: 'intent' | 'flow' | 'algorithm' | 'agent_call'
  name?: string
  params?: Record<string, any>
  body?: ASTNode[]
}

export class SemanticaParser {
  parse(code: string): ASTNode[] {
    const ast: ASTNode[] = []
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('//'))
    
    let currentBlock: ASTNode | null = null
    let indentLevel = 0
    
    for (const line of lines) {
      const trimmed = line.trim()
      const currentIndent = line.search(/\S/)
      
      // Intent declaration
      if (trimmed.startsWith('intent ')) {
        const name = trimmed.split(' ')[1]
        currentBlock = { type: 'intent', name, params: {}, body: [] }
        ast.push(currentBlock)
        indentLevel = currentIndent
        continue
      }
      
      // Flow declaration
      if (trimmed.startsWith('flow ')) {
        const name = trimmed.split(' ')[1]
        currentBlock = { type: 'flow', name, body: [] }
        ast.push(currentBlock)
        indentLevel = currentIndent
        continue
      }
      
      // Algorithm declaration
      if (trimmed.startsWith('algorithm ')) {
        const name = trimmed.split(' ')[1]
        currentBlock = { type: 'algorithm', name, params: {}, body: [] }
        ast.push(currentBlock)
        indentLevel = currentIndent
        continue
      }
      
      // Parameter
      if (trimmed.startsWith('param ')) {
        const [, paramName, , paramType] = trimmed.split(' ')
        if (currentBlock?.type === 'algorithm') {
          currentBlock.params[paramName] = paramType
        }
        continue
      }
      
      // Agent call in flow
      if (trimmed.startsWith('@')) {
        const parts = trimmed.match(/@(\w+)\s+(\w+)\((.*)\)/)
        if (parts) {
          const agentCall: ASTNode = {
            type: 'agent_call',
            name: parts[1],
            params: this.parseParams(parts[3])
          }
          currentBlock?.body?.push(agentCall)
        }
        continue
      }
      
      // Quantum operations
      if (trimmed.startsWith('qubits ') || trimmed.startsWith('superposition') || 
          trimmed.startsWith('oracle ') || trimmed.startsWith('diffusion ') || 
          trimmed.startsWith('measure ') || trimmed.startsWith('return ')) {
        currentBlock?.body?.push({ type: 'quantum_op', name: trimmed.split(' ')[0], params: {} })
        continue
      }
      
      // Key-value params
      if (trimmed.includes(':')) {
        const [key, value] = trimmed.split(':').map(s => s.trim())
        if (currentBlock && currentBlock.type === 'intent') {
          currentBlock.params[key] = value.replace(/"/g, '')
        }
      }
    }
    
    return ast
  }
  
  private parseParams(paramStr: string): Record<string, any> {
    const params: Record<string, any> = {}
    if (!paramStr.trim()) return params
    
    const pairs = paramStr.split(',').map(p => p.trim())
    for (const pair of pairs) {
      const [key, value] = pair.split(':').map(s => s.trim())
      params[key] = value.replace(/"/g, '')
    }
    return params
  }
}

// Example usage
const parser = new SemanticaParser()
console.log('Semantica Parser Ready')
export default parser
