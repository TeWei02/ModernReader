/**
 * 學術模組：arXiv 整合、PDF 生成、引用管理
 * 嚴謹的學術格式驗證與自動化處理
 */

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  published: string;
  updated: string;
  pdfUrl: string;
  arxivUrl: string;
  doi?: string;
}

export interface CitationStyle {
  format: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Vancouver';
  generateCitation(paper: Paper): string;
}

export class AcademicModule {
  private readonly ARXIV_API = 'https://export.arxiv.org/api/query';
  private readonly ARXIV_PDF_BASE = 'https://arxiv.org/pdf';

  /**
   * 從 arXiv 抓取論文
   */
  async fetchFromArxiv(id: string): Promise<Paper> {
    // 移除版本號，只保留核心 ID
    const cleanId = id.split('v')[0];
    
    try {
      const response = await fetch(`${this.ARXIV_API}?id_list=${cleanId}`);
      const xml = await response.text();
      
      // 解析 XML (實際實現需使用 XML 解析器)
      const paper = this.parseArxivXML(xml);
      
      if (!paper) {
        throw new Error(`Paper not found: ${id}`);
      }
      
      return paper;
    } catch (error) {
      throw new Error(`Failed to fetch from arXiv: ${error}`);
    }
  }

  /**
   * 驗證 arXiv 格式
   */
  async validateFormat(paper: Paper): Promise<boolean> {
    // 檢查必要欄位
    const requiredFields = ['id', 'title', 'authors', 'abstract', 'published'];
    for (const field of requiredFields) {
      if (!paper[field as keyof Paper]) {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    // 驗證 arXiv ID 格式
    const arxivIdPattern = /^\d{4}\.\d{4,5}(v\d+)?$/;
    if (!arxivIdPattern.test(paper.id)) {
      console.error('Invalid arXiv ID format');
      return false;
    }
    
    // 驗證 PDF URL
    if (!paper.pdfUrl.startsWith(this.ARXIV_PDF_BASE)) {
      console.error('Invalid PDF URL');
      return false;
    }
    
    return true;
  }

  /**
   * 生成 PDF (包含內嵌按鈕)
   */
  async generatePDF(
    paper: Paper, 
    options: { 
      citation: string;
      includeButton: boolean;
    }
  ): Promise<string> {
    // 生成 PDF 內容
    const citation = this.generateCitation(paper, options.citation as any);
    
    const pdfContent = `
% ModernReader Generated PDF
\\documentclass{article}
\\usepackage{hyperref}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}

\\title{${paper.title}}
\\author{${paper.authors.join(', ')}}
\\date{Published: ${paper.published}}

\\begin{document}

\\maketitle

\\begin{abstract}
${paper.abstract}
\\end{abstract}

\\section*{Categories}
${paper.categories.join(', ')}

\\section*{Citation}
${citation}

${options.includeButton ? `
\\section*{Download}
\\href{${paper.pdfUrl}}{\\fbox{\\textbf{📥 Download PDF}}}
` : ''}

\\end{document}
    `;
    
    // 在實際應用中，這裡會調用 PDF 生成服務
    // 返回模擬的 PDF URL
    const pdfId = `mr_${paper.id}_${Date.now()}`;
    return `/public/papers/${pdfId}.pdf`;
  }

  /**
   * 創建 PDF 下載按鈕 (HTML/React 組件)
   */
  createPDFButton(pdfUrl: string): string {
    return `
<button 
  onclick="window.open('${pdfUrl}', '_blank')"
  style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s;
  "
  onmouseover="this.style.transform='scale(1.05)'"
  onmouseout="this.style.transform='scale(1)'"
>
  <span>📥</span>
  <span>Download PDF</span>
</button>
    `.trim();
  }

  /**
   * 生成引用
   */
  generateCitation(paper: Paper, style: keyof CitationStyle): string {
    const year = new Date(paper.published).getFullYear();
    const firstAuthor = paper.authors[0].split(' ').pop(); // 取姓氏
    
    switch (style) {
      case 'APA':
        return `${paper.authors.map(a => {
          const parts = a.split(' ');
          const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ');
          return `${parts.pop()}, ${initials}`;
        }).join(', ')} (${year}). ${paper.title}. arXiv:${paper.id}`;
        
      case 'MLA':
        return `${paper.authors.join(', ')}. "${paper.title}." arXiv:${paper.id}, ${year}.`;
        
      case 'IEEE':
        return `[1] ${paper.authors.map(a => {
          const parts = a.split(' ');
          return `${parts.slice(0, -1).map(p => p[0] + '.').join('')} ${parts.pop()}`;
        }).join(', ')}, "${paper.title}," arXiv:${paper.id}, ${year}.`;
        
      default:
        return `${paper.authors.join(', ')}. "${paper.title}." arXiv:${paper.id} (${year}).`;
    }
  }

  /**
   * 解析 arXiv XML 回應
   */
  private parseArxivXML(xml: string): Paper | null {
    // 簡化的 XML 解析 (實際需使用 DOMParser 或 xml2js)
    // 這裡是示意實現
    const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
    if (!entryMatch) return null;
    
    const entry = entryMatch[1];
    
    const extract = (tag: string) => {
      const match = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
      return match ? match[1].trim() : '';
    };
    
    const extractAuthors = () => {
      const matches = entry.match(/<name>([^<]+)<\/name>/g);
      return matches ? matches.map(m => m.replace(/<[^>]+>/g, '')) : [];
    };
    
    const extractCategories = () => {
      const matches = entry.match(/<category[^>]*term="([^"]+)"/g);
      return matches ? matches.map(m => {
        const term = m.match(/term="([^"]+)"/);
        return term ? term[1] : '';
      }) : [];
    };
    
    const idMatch = extract("id").match(/arxiv\.org\/abs\/(\S+)/);
    const id = idMatch ? idMatch[1] : extract('id');
    
    return {
      id,
      title: extract('title'),
      authors: extractAuthors(),
      abstract: extract('summary'),
      categories: extractCategories(),
      published: extract('published'),
      updated: extract('updated'),
      pdfUrl: `${this.ARXIV_PDF_BASE}/${id}`,
      arxivUrl: `https://arxiv.org/abs/${id}`
    };
  }

  /**
   * 獲取可用來源
   */
  getAvailableSources(): string[] {
    return ['arXiv', 'PubMed', 'DOI', 'Semantic Scholar'];
  }
}
