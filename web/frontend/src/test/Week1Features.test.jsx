import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock speechSynthesis 與 SpeechSynthesisUtterance（App 語音導讀依賴）
function mockSpeech() {
  window.speechSynthesis = { speak: vi.fn(), cancel: vi.fn(), getVoices: () => [] };
  window.SpeechSynthesisUtterance = class {
    constructor(text) { this.text = text; }
  };
}

describe('ModernReader 核心閱讀功能', () => {
  beforeEach(() => {
    localStorage.clear();
    mockSpeech();
    vi.restoreAllMocks();
  });

  it('應該渲染預設書籍的多段落內容', () => {
    render(<App />);
    // 正文與目錄都可能出現段落開頭，容許多個匹配
    expect(screen.getAllByText(/在資訊快速流動的時代/).length).toBeGreaterThan(0);
    expect(screen.getByText(/TABLE OF CONTENTS/)).toBeInTheDocument();
    expect(screen.getByText(/下一段/)).toBeInTheDocument();
  });

  it('應該能切換到下一段並更新進度', () => {
    render(<App />);
    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/下一段/));
    expect(screen.getByText(/2 \/ 3/)).toBeInTheDocument();
  });

  it('應該能用語音導讀朗讀目前段落', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/語音導讀/));
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });

  it('應該能生成離線摘要', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/生成摘要/));
    expect(screen.getByText(/本段重點：/)).toBeInTheDocument();
  });

  it('應該能記錄情緒標記', () => {
    render(<App />);
    fireEvent.click(screen.getByText('啟發'));
    expect(screen.getByText(/已標記為「啟發」/)).toBeInTheDocument();
  });

  it('空問題不會觸發書籍問答', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /詢問 ModernReader/ }));
    expect(screen.queryByText(/ModernReader 的回應/)).not.toBeInTheDocument();
  });

  it('詢問書籍會回應最相關的段落', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/問問這本書/), {
      target: { value: 'ModernReader' },
    });
    fireEvent.click(screen.getByRole('button', { name: /詢問 ModernReader/ }));
    expect(screen.getByText(/根據目前書籍內容，最相關的段落是/)).toBeInTheDocument();
  });
});
