/**
 * Semantica Runtime
 * Unified execution engine for semantic code
 */

import { SemanticaParser } from '../parser/index.js'
import { QuantumSimulator } from './quantum.js'
import { ClawProtocol } from '../../protocols/claw/index.js'
import { AgentRegistry } from '../../moltbook/registry/index.js'

export class SemanticaRuntime {
  private parser: SemanticaParser
  private quantum: QuantumSimulator
  private claw: ClawProtocol
  private registry: AgentRegistry

  constructor() {
    this.parser = new SemanticaParser()
    this.quantum = new QuantumSimulator()
    this.claw = new ClawProtocol()
    this.registry = new AgentRegistry()
  }

  async execute(code: string): Promise<any> {
    const ast = this.parser.parse(code)
    
    for (const node of ast) {
      switch (node.type) {
        case 'intent':
          return await this.executeIntent(node)
        case 'flow':
          return await this.executeFlow(node)
        case 'algorithm':
          return await this.executeAlgorithm(node)
      }
    }
  }

  private async executeIntent(node: any): Promise<any> {
    const { name, params } = node
    console.log(`Executing intent: ${name}`)
    console.log(`Parameters:`, params)
    
    // Route to appropriate agent via Claw
    if (params.agent) {
      const response = await this.claw.send({
        from: '@runtime',
        to: params.agent.replace('@', ''),
        semanticRoute: `${params.agent}/${name}`,
        content: params
      })
      return response
    }
    
    return { status: 'executed', intent: name }
  }

  private async executeFlow(node: any): Promise<any> {
    const { name, body } = node
    console.log(`Executing flow: ${name}`)
    
    const results: any[] = []
    for (const step of body || []) {
      if (step.type === 'agent_call') {
        const response = await this.claw.send({
          from: '@runtime',
          to: step.name!,
          semanticRoute: `${step.name}/${Object.keys(step.params!)[0]}`,
          content: step.params
        })
        results.push(response)
      }
    }
    
    return { status: 'completed', flow: name, results }
  }

  private async executeAlgorithm(node: any): Promise<any> {
    const { name, params } = node
    console.log(`Executing algorithm: ${name}`)
    
    if (name === 'grover_search') {
      // Demo quantum search
      const database = ['apple', 'banana', 'cherry']
      const target = 'cherry'
      const index = this.quantum.groverSearch(database, target)
      return { result: database[index], index }
    }
    
    return { status: 'executed', algorithm: name }
  }

  registerAgent(agent: any): void {
    this.registry.register(agent)
  }

  getRegistry(): AgentRegistry {
    return this.registry
  }

  getQuantum(): QuantumSimulator {
    return this.quantum
  }

  getClaw(): ClawProtocol {
    return this.claw
  }
}

// Demo execution
async function main() {
  console.log('🚀 Semantica Runtime v1.0\n')
  
  const runtime = new SemanticaRuntime()
  
  // Register demo agents
  runtime.registerAgent({
    id: '@summarizer',
    capabilities: ['summarize', 'condense'],
    status: 'active'
  })
  
  runtime.registerAgent({
    id: '@researcher',
    capabilities: ['fetch', 'search'],
    status: 'active'
  })
  
  // Execute hello world
  console.log('=== Hello World ===')
  const helloCode = `
    intent greet {
      target: @user
      message: "Hello from Semantica!"
    }
  `
  const helloResult = await runtime.execute(helloCode)
  console.log('Result:', helloResult, '\n')
  
  // Execute quantum search
  console.log('=== Quantum Search ===')
  const quantumResult = runtime.getQuantum().groverSearch(
    ['apple', 'banana', 'cherry', 'date'],
    'cherry'
  )
  console.log('Found at index:', quantumResult, '\n')
  
  console.log('✅ Semantica Runtime Ready!')
}

main().catch(console.error)

export default SemanticaRuntime
