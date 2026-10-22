import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('應該渲染 ModernReader 品牌與預設書籍標題', () => {
    render(<App />);
    expect(screen.getByText('ModernReader')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('示範文章');
  });

  it('應該提供書籍匯入按鈕', () => {
    render(<App />);
    expect(screen.getByText(/匯入書籍/)).toBeInTheDocument();
  });

  it('應該提供語音導讀、摘要與 Podcast 控制', () => {
    render(<App />);
    expect(screen.getByText(/語音導讀/)).toBeInTheDocument();
    expect(screen.getByText(/生成摘要/)).toBeInTheDocument();
    expect(screen.getByText(/Podcast MP3/)).toBeInTheDocument();
  });

  it('應該提供書籍問答的文字輸入框', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/問問這本書/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /詢問 ModernReader/ })).toBeInTheDocument();
  });

  it('應該顯示情緒標記按鈕', () => {
    render(<App />);
    ['啟發', '平靜', '困惑', '緊張'].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });
});
