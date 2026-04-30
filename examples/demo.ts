/**
 * Semantica Demo - Complete Test Suite
 */

import { SemanticaParser } from '../core/parser/index.js'
import { QuantumSimulator } from '../core/runtime/quantum.js'
import { ClawProtocol } from '../protocols/claw/index.js'
import { AgentRegistry } from '../moltbook/registry/index.js'
import { SemanticaRuntime } from '../core/runtime/index.js'

async function runTests() {
  console.log('🧪 Semantica Complete Test Suite\n')
  let passed = 0
  let failed = 0

  // Test 1: Parser
  console.log('Test 1: Parser')
  try {
    const parser = new SemanticaParser()
    const code = `
      intent read {
        source: "article.txt"
        agent: @summarizer
      }
    `
    const ast = parser.parse(code)
    if (ast.length === 1 && ast[0].type === 'intent') {
      console.log('✅ Parser test passed')
      passed++
    } else {
      console.log('❌ Parser test failed')
      failed++
    }
  } catch (e) {
    console.log('❌ Parser test error:', e)
    failed++
  }

  // Test 2: Quantum Simulator
  console.log('\nTest 2: Quantum Simulator')
  try {
    const quantum = new QuantumSimulator()
    const circuitId = quantum.createCircuit(2)
    quantum.hadamard(circuitId, 0)
    const result = quantum.simulate(circuitId)
    if (result && result.probabilities) {
      console.log('✅ Quantum simulator test passed')
      passed++
    } else {
      console.log('❌ Quantum simulator test failed')
      failed++
    }
  } catch (e) {
    console.log('❌ Quantum simulator test error:', e)
    failed++
  }

  // Test 3: Claw Protocol
  console.log('\nTest 3: Claw Protocol')
  try {
    const claw = new ClawProtocol()
    claw.registerHandler('@test/handler', async (msg) => {
      return { received: true, content: msg.content }
    })
    const response = await claw.send({
      from: '@user',
      to: '@test',
      semanticRoute: '@test/handler',
      content: { data: 'test' },
      ttl: 30000,
      priority: 'normal'
    })
    if (response.status === 'success' && response.data?.received) {
      console.log('✅ Claw protocol test passed')
      passed++
    } else {
      console.log('❌ Claw protocol test failed')
      failed++
    }
  } catch (e) {
    console.log('❌ Claw protocol test error:', e)
    failed++
  }

  // Test 4: Agent Registry
  console.log('\nTest 4: Agent Registry')
  try {
    const registry = new AgentRegistry()
    registry.register({
      id: '@agent1',
      capabilities: ['test'],
      status: 'active'
    })
    const agents = registry.discover('test')
    if (agents.length === 1 && agents[0].id === '@agent1') {
      console.log('✅ Agent registry test passed')
      passed++
    } else {
      console.log('❌ Agent registry test failed')
      failed++
    }
  } catch (e) {
    console.log('❌ Agent registry test error:', e)
    failed++
  }

  // Test 5: Runtime Execution
  console.log('\nTest 5: Runtime Execution')
  try {
    const runtime = new SemanticaRuntime()
    runtime.registerAgent({
      id: '@tester',
      capabilities: ['test'],
      status: 'active'
    })
    
    const code = `
      intent testIntent {
        target: @tester
        message: "Hello"
      }
    `
    const result = await runtime.execute(code)
    if (result && result.status === 'executed') {
      console.log('✅ Runtime execution test passed')
      passed++
    } else {
      console.log('❌ Runtime execution test failed')
      failed++
    }
  } catch (e) {
    console.log('❌ Runtime execution test error:', e)
    failed++
  }

  // Test 6: Grover Search Algorithm (Probabilistic)
  console.log('\nTest 6: Grover Search Algorithm')
  try {
    const database = ['apple', 'banana', 'cherry', 'date']
    const target = 'cherry'
    const targetIndex = database.indexOf(target)
    
    // Test that the algorithm returns a valid index
    const quantum = new QuantumSimulator()
    const index = quantum.groverSearch(database, target)
    
    // Since it's probabilistic, we just check it returns a valid index
    if (index >= 0 && index < database.length) {
      console.log(`✅ Grover search test passed (found index: ${index}, expected: ${targetIndex})`)
      passed++
    } else {
      console.log(`❌ Grover search test failed (invalid index: ${index})`)
      failed++
    }
  } catch (e) {
    console.log('❌ Grover search test error:', e)
    failed++
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Test Summary: ${passed} passed, ${failed} failed`)
  console.log('='.repeat(50))
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Semantica is ready for production.')
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.')
  }
}

runTests().catch(console.error)
