/**
 * 量子電路模擬器
 * 支援基本量子閘操作和測量
 */

export interface Qubit {
  state: [number, number]; // [α, β] 振幅
}

export interface QuantumCircuit {
  id: string;
  qubits: Qubit[];
  gates: Array<{ type: string; target: number }>;
}

export class QuantumSimulator {
  private circuits: Map<string, QuantumCircuit> = new Map();
  private circuitCount = 0;

  createCircuit(numQubits: number): QuantumCircuit {
    const id = `circuit_${++this.circuitCount}`;
    const qubits: Qubit[] = [];
    
    // 初始化所有 qubit 為 |0⟩ 狀態
    for (let i = 0; i < numQubits; i++) {
      qubits.push({ state: [1, 0] });
    }
    
    const circuit: QuantumCircuit = { id, qubits, gates: [] };
    this.circuits.set(id, circuit);
    return circuit;
  }

  hadamard(circuitId: string, qubitIndex: number): void {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) throw new Error(`電路 ${circuitId} 不存在`);
    
    const qubit = circuit.qubits[qubitIndex];
    const [alpha, beta] = qubit.state;
    
    // H 閘：|0⟩ → (|0⟩ + |1⟩)/√2, |1⟩ → (|0⟩ - |1⟩)/√2
    const sqrt2 = Math.sqrt(2);
    qubit.state = [
      (alpha + beta) / sqrt2,
      (alpha - beta) / sqrt2
    ];
    
    circuit.gates.push({ type: 'H', target: qubitIndex });
  }

  pauliX(circuitId: string, qubitIndex: number): void {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) throw new Error(`電路 ${circuitId} 不存在`);
    
    const qubit = circuit.qubits[qubitIndex];
    const [alpha, beta] = qubit.state;
    
    // X 閘 (NOT): |0⟩ ↔ |1⟩
    qubit.state = [beta, alpha];
    circuit.gates.push({ type: 'X', target: qubitIndex });
  }

  cnot(circuitId: string, control: number, target: number): void {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) throw new Error(`電路 ${circuitId} 不存在`);
    
    // 簡化模擬：如果控制 qubit 有 |1⟩ 分量，翻轉目標 qubit
    const controlQubit = circuit.qubits[control];
    const targetQubit = circuit.qubits[target];
    
    if (Math.abs(controlQubit.state[1]) > 0.5) {
      const [alpha, beta] = targetQubit.state;
      targetQubit.state = [beta, alpha];
    }
    
    circuit.gates.push({ type: 'CNOT', target });
  }

  simulate(circuitId: string): { state: string; probabilities: number[] } {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) throw new Error(`電路 ${circuitId} 不存在`);
    
    // 計算測量機率
    const probabilities = circuit.qubits.map(q => 
      Math.abs(q.state[1]) ** 2 // |1⟩ 的機率
    );
    
    // 生成狀態描述
    const stateDesc = circuit.qubits
      .map((q, i) => `q${i}: [${q.state[0].toFixed(3)}, ${q.state[1].toFixed(3)}]`)
      .join(', ');
    
    return {
      state: stateDesc,
      probabilities
    };
  }

  measure(circuitId: string, qubitIndex: number): 0 | 1 {
    const circuit = this.circuits.get(circuitId);
    if (!circuit) throw new Error(`電路 ${circuitId} 不存在`);
    
    const qubit = circuit.qubits[qubitIndex];
    const prob1 = Math.abs(qubit.state[1]) ** 2;
    
    // 模擬測量坍縮
    const random = Math.random();
    const result: 0 | 1 = random < prob1 ? 1 : 0;
    
    // 坍縮到測量結果
    qubit.state = result === 0 ? [1, 0] : [0, 1];
    
    return result;
  }
}

// 導出單例
export const quantumSimulator = new QuantumSimulator();

// Runtime 執行引擎
export const runtime = {
  async execute(ast: any) {
    console.log(`⚡ 執行 ${ast.type}: ${ast.action}`);
    
    // 模擬執行結果
    if (ast.type === 'intent' && ast.action === 'deep_analyze') {
      return { summary: "量子計算是具有潛力的新興技術" };
    }
    
    if (ast.type === 'flow' && ast.action === 'podcast_generation') {
      return { formattedScript: "Podcast 腳本已生成" };
    }
    
    if (ast.type === 'intent' && ast.action === 'simulate') {
      return { 
        setting: "虛擬會議室", 
        characters: ["用戶", "AI 導師"],
        objective: "探索量子計算概念"
      };
    }
    
    if (ast.type === 'algorithm' && ast.action === 'build_graph') {
      return { nodes: [], edges: [], clusters: [] };
    }
    
    return { success: true };
  },
  
  quantum: quantumSimulator
};
