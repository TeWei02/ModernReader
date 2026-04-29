/**
 * 量子計算模擬器整合
 * 提供基礎量子電路模擬和優化功能
 */

export interface Qubit {
  id: string
  state: [number, number] // [alpha, beta] for |ψ⟩ = α|0⟩ + β|1⟩
}

export interface QuantumGate {
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'SWAP' | 'Toffoli' | 'custom'
  targets: number[]
  controls?: number[]
  params?: Record<string, number>
}

export interface QuantumCircuit {
  id: string
  qubits: number
  gates: QuantumGate[]
  measurements?: number[]
}

export interface QuantumSimulationResult {
  circuitId: string
  probabilities: Record<string, number>
  measuredState?: string
  executionTime: number
}

export class QuantumSimulator {
  private circuits: Map<string, QuantumCircuit> = new Map()
  private results: Map<string, QuantumSimulationResult> = new Map()

  /**
   * 建立量子電路
   */
  createCircuit(qubits: number, id?: string): QuantumCircuit {
    const circuitId = id || `circuit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const circuit: QuantumCircuit = {
      id: circuitId,
      qubits,
      gates: []
    }
    this.circuits.set(circuitId, circuit)
    console.log(`[Quantum] Circuit created: ${circuitId} with ${qubits} qubits`)
    return circuit
  }

  /**
   * 添加量子閘
   */
  addGate(circuitId: string, gate: QuantumGate): void {
    const circuit = this.circuits.get(circuitId)
    if (!circuit) throw new Error(`Circuit not found: ${circuitId}`)
    
    circuit.gates.push(gate)
    console.log(`[Quantum] Gate ${gate.type} added to ${circuitId}`)
  }

  /**
   * 添加 Hadamard 閘
   */
  hadamard(circuitId: string, qubit: number): void {
    this.addGate(circuitId, { type: 'H', targets: [qubit] })
  }

  /**
   * 添加 Pauli-X 閘 (NOT)
   */
  pauliX(circuitId: string, qubit: number): void {
    this.addGate(circuitId, { type: 'X', targets: [qubit] })
  }

  /**
   * 添加 CNOT 閘
   */
  cnot(circuitId: string, control: number, target: number): void {
    this.addGate(circuitId, { 
      type: 'CNOT', 
      targets: [target], 
      controls: [control] 
    })
  }

  /**
   * 模擬量子電路（簡化版本）
   * 實際實現需要完整的量子態向量計算
   */
  simulate(circuitId: string, shots = 1000): QuantumSimulationResult {
    const circuit = this.circuits.get(circuitId)
    if (!circuit) throw new Error(`Circuit not found: ${circuitId}`)

    const startTime = Date.now()
    
    // 簡化模擬：假設所有 qubits 初始為 |0⟩
    // 實際實現需要使用複數矩陣運算
    
    let probabilities: Record<string, number> = {}
    
    if (circuit.gates.length === 0) {
      // 沒有閘，所有機率都在 |00...0⟩
      const zeroState = '0'.repeat(circuit.qubits)
      probabilities[zeroState] = 1.0
    } else {
      // 簡化：根據 H 閘數量估算疊加態
      const hGates = circuit.gates.filter(g => g.type === 'H').length
      const numStates = Math.pow(2, Math.min(hGates, circuit.qubits))
      const prob = 1 / numStates
      
      for (let i = 0; i < numStates; i++) {
        const state = i.toString(2).padStart(circuit.qubits, '0')
        probabilities[state] = prob
      }
    }

    // 模擬測量
    let measuredState: string | undefined
    if (circuit.measurements || circuit.gates.length > 0) {
      const rand = Math.random()
      let cumulative = 0
      for (const [state, prob] of Object.entries(probabilities)) {
        cumulative += prob
        if (rand <= cumulative) {
          measuredState = state
          break
        }
      }
    }

    const result: QuantumSimulationResult = {
      circuitId,
      probabilities,
      measuredState,
      executionTime: Date.now() - startTime
    }

    this.results.set(circuitId, result)
    console.log(`[Quantum] Simulation completed: ${circuitId} in ${result.executionTime}ms`)
    
    return result
  }

  /**
   * 執行 Grover 搜尋算法（簡化）
   */
  groverSearch(circuitId: string, targetState: string): QuantumSimulationResult {
    const circuit = this.circuits.get(circuitId)
    if (!circuit) throw new Error(`Circuit not found: ${circuitId}`)

    // 初始化：所有 qubits 加 H 閘
    for (let i = 0; i < circuit.qubits; i++) {
      this.hadamard(circuitId, i)
    }

    // Oracle（標記目標態）- 簡化實現
    // 實際 Grover 需要更複雜的 oracle 構造

    // 擴散操作 - 簡化實現
    
    return this.simulate(circuitId)
  }

  /**
   * 獲取模擬結果
   */
  getResult(circuitId: string): QuantumSimulationResult | undefined {
    return this.results.get(circuitId)
  }

  /**
   * 優化電路（移除冗餘閘）
   */
  optimizeCircuit(circuitId: string): void {
    const circuit = this.circuits.get(circuitId)
    if (!circuit) throw new Error(`Circuit not found: ${circuitId}`)

    // 簡化優化：移除連續的相同閘（如 X-X = I）
    const optimizedGates: QuantumGate[] = []
    
    for (let i = 0; i < circuit.gates.length; i++) {
      const current = circuit.gates[i]
      const next = circuit.gates[i + 1]
      
      if (next && 
          current.type === next.type && 
          JSON.stringify(current.targets) === JSON.stringify(next.targets)) {
        // 跳過這兩個閘（它們互相抵消）
        i++
      } else {
        optimizedGates.push(current)
      }
    }

    circuit.gates = optimizedGates
    console.log(`[Quantum] Circuit ${circuitId} optimized: ${circuit.gates.length} gates`)
  }

  /**
   * 導出電路為 Semantica 語法
   */
  exportToSemantica(circuitId: string): string {
    const circuit = this.circuits.get(circuitId)
    if (!circuit) throw new Error(`Circuit not found: ${circuitId}`)

    let code = `quantum circuit ${circuitId} {\n`
    code += `  qubits: ${circuit.qubits}\n`
    code += `  gates: [\n`
    
    circuit.gates.forEach(gate => {
      code += `    { type: "${gate.type}", targets: [${gate.targets.join(', ')}]`
      if (gate.controls) {
        code += `, controls: [${gate.controls.join(', ')}]`
      }
      code += ' }\n'
    })
    
    code += `  ]\n`
    code += `}\n`
    
    return code
  }
}

// 使用示例
const simulator = new QuantumSimulator()

// 建立 Bell 態電路
const bellCircuit = simulator.createCircuit(2, 'bell_state')
simulator.hadamard(bellCircuit.id, 0)
simulator.cnot(bellCircuit.id, 0, 1)

// 模擬
const result = simulator.simulate(bellCircuit.id)
console.log('Bell State Result:', result)

// 優化電路
simulator.optimizeCircuit(bellCircuit.id)

// 導出為 Semantica
const semanticaCode = simulator.exportToSemantica(bellCircuit.id)
console.log('\nSemantica Code:')
console.log(semanticaCode)
