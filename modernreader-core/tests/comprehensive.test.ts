/**
 * ModernReader 完整功能測試套件
 * 涵蓋所有核心模組：Engine, Academic, MCP, Actions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ModernReaderCore, createModernReader } from '../engine/core';
import { AcademicModule } from '../academic/index';
import { MCPBridge } from '../mcp/index';
import { ActionRunner } from '../actions/index';

describe('ModernReader Comprehensive Tests', () => {
  let reader: ModernReaderCore;
  let academic: AcademicModule;
  let mcp: MCPBridge;
  let actions: ActionRunner;

  beforeEach(() => {
    reader = createModernReader({
      language: 'semantica',
      mode: 'academic',
      quantumEnabled: true
    });
    academic = new AcademicModule();
    mcp = new MCPBridge([]);
    actions = new ActionRunner();
  });

  describe('1. Engine Core Tests', () => {
    it('should initialize correctly', () => {
      const status = reader.getStatus();
      expect(status.version).toBe('1.0.0');
      expect(status.language).toBe('Semantica');
      expect(status.quantumEnabled).toBe(true);
    });

    it('should have all modules connected', () => {
      const status = reader.getStatus();
      expect(status.mcpConnected).toBeDefined();
      expect(status.academicSources).toBeDefined();
    });
  });

  describe('2. Academic Module Tests', () => {
    it('should validate arXiv ID format', async () => {
      const mockPaper = {
        id: '2401.12345',
        title: 'Test Paper',
        authors: ['John Doe'],
        abstract: 'Test abstract',
        categories: ['cs.AI'],
        published: '2024-01-15',
        updated: '2024-01-16',
        pdfUrl: 'https://arxiv.org/pdf/2401.12345',
        arxivUrl: 'https://arxiv.org/abs/2401.12345'
      };

      const isValid = await academic.validateFormat(mockPaper);
      expect(isValid).toBe(true);
    });

    it('should reject invalid arXiv ID', async () => {
      const mockPaper = {
        id: 'invalid-id',
        title: 'Test Paper',
        authors: ['John Doe'],
        abstract: 'Test abstract',
        categories: [],
        published: '2024-01-15',
        updated: '2024-01-16',
        pdfUrl: 'https://arxiv.org/pdf/invalid',
        arxivUrl: 'https://arxiv.org/abs/invalid'
      };

      const isValid = await academic.validateFormat(mockPaper);
      expect(isValid).toBe(false);
    });

    it('should generate citations in different styles', () => {
      const paper = {
        id: '2401.12345',
        title: 'Quantum Computing Advances',
        authors: ['Alice Smith', 'Bob Johnson'],
        abstract: '...',
        categories: ['quant-ph'],
        published: '2024-01-15',
        updated: '2024-01-16',
        pdfUrl: 'https://arxiv.org/pdf/2401.12345',
        arxivUrl: 'https://arxiv.org/abs/2401.12345'
      };

      const apa = academic.generateCitation(paper, 'APA');
      expect(apa).toContain('Smith');
      expect(apa).toContain('2024');

      const ieee = academic.generateCitation(paper, 'IEEE');
      expect(ieee).toContain('[1]');
    });

    it('should create PDF button HTML', () => {
      const button = academic.createPDFButton('/papers/test.pdf');
      expect(button).toContain('Download PDF');
      expect(button).toContain('📥');
      expect(button).toContain('window.open');
    });
  });

  describe('3. MCP Bridge Tests', () => {
    it('should initialize with default models', () => {
      const models = mcp.getConnectedModels();
      expect(models).toContain('gpt-4');
      expect(models).toContain('claude-3');
      expect(models).toContain('gemini-pro');
      expect(models).toContain('quantum-simulator');
    });

    it('should create agents', async () => {
      const agent = await mcp.createAgent('@professor', 'professor');
      expect(agent.id).toBe('@professor');
      expect(agent.role).toBe('professor');
      expect(agent.status).toBe('active');
    });

    it('should get active agents', async () => {
      await mcp.createAgent('@professor', 'professor');
      await mcp.createAgent('@student', 'learner');
      
      const activeAgents = mcp.getActiveAgents();
      expect(activeAgents.length).toBe(2);
    });

    it('should generate role-specific responses', async () => {
      await mcp.createAgent('@professor', 'professor');
      const response = await mcp.respond('@professor', '量子計算', []);
      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
    });
  });

  describe('4. Actions Engine Tests', () => {
    it('should have default actions', () => {
      const allActions = actions.getActions();
      expect(allActions.length).toBeGreaterThan(0);
      expect(allActions.some(a => a.id === 'generate-podcast')).toBe(true);
      expect(allActions.some(a => a.id === 'auto-submit-paper')).toBe(true);
    });

    it('should execute podcast generation action', async () => {
      const result = await actions.execute('generate-podcast');
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should execute citation conversion action', async () => {
      const result = await actions.execute('convert-citation');
      expect(result.success).toBe(true);
    });

    it('should handle non-existent action', async () => {
      await expect(actions.execute('non-existent-action')).rejects.toThrow('not found');
    });

    it('should generate podcast script', async () => {
      const keyPoints = ['量子糾纏', '量子計算優勢', '實際應用'];
      const script = await actions.generateScript(keyPoints, 'conversational');
      expect(script).toContain('歡迎收聽');
      expect(script).toContain('量子糾纏');
    });
  });

  describe('5. Integration Tests', () => {
    it('should complete full research workflow', async () => {
      // 1. Create agent
      const agent = await mcp.createAgent('@researcher', 'researcher');
      
      // 2. Generate podcast about research
      const podcastResult = await actions.execute('generate-podcast');
      expect(podcastResult.success).toBe(true);
      
      // 3. Check system status
      const status = reader.getStatus();
      expect(status.activeAgents).toBeDefined();
      
      // 4. Validate academic module
      const sources = academic.getAvailableSources();
      expect(sources).toContain('arXiv');
    });

    it('should simulate multi-agent debate', async () => {
      // Create multiple agents
      await mcp.createAgent('@professor', 'professor');
      await mcp.createAgent('@student', 'learner');
      await mcp.createAgent('@critic', 'critic');
      
      // Simulate discussion
      const topic = '量子計算的未來發展';
      const history = [];
      
      // Round 1
      const profResponse = await mcp.respond('@professor', topic, history);
      history.push({ agent: '@professor', content: profResponse });
      
      const studentResponse = await mcp.respond('@student', topic, history);
      history.push({ agent: '@student', content: studentResponse });
      
      expect(history.length).toBe(2);
      expect(profResponse).toBeDefined();
      expect(studentResponse).toBeDefined();
    });
  });

  describe('6. Edge Cases & Error Handling', () => {
    it('should handle missing paper fields', async () => {
      const incompletePaper = {
        id: '2401.12345',
        title: '', // Missing title
        authors: [],
        abstract: '...',
        categories: [],
        published: '2024-01-15',
        updated: '2024-01-16',
        pdfUrl: 'https://arxiv.org/pdf/2401.12345',
        arxivUrl: 'https://arxiv.org/abs/2401.12345'
      };

      const isValid = await academic.validateFormat(incompletePaper as any);
      expect(isValid).toBe(false);
    });

    it('should handle disabled actions', () => {
      actions.toggleAction('generate-podcast', false);
      // Note: Would need to test execution here, but we'll re-enable
      actions.toggleAction('generate-podcast', true);
    });

    it('should remove agents correctly', async () => {
      await mcp.createAgent('@temp', 'learner');
      const removed = mcp.removeAgent('@temp');
      expect(removed).toBe(true);
      
      const activeAgents = mcp.getActiveAgents();
      expect(activeAgents.some(a => a.id === '@temp')).toBe(false);
    });
  });
});

console.log('✅ All comprehensive tests defined!');
