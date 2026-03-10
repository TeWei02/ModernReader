# GitHub Pages 部署指南

您的 ModernReader 項目已經準備好部署到 GitHub Pages！

## 🚀 部署步驟

### 1. 在 GitHub 上創建倉庫

1. 前往 https://github.com/new
2. 倉庫名稱填寫：`ModernReader`
3. **不要**勾選 "Add a README file"、"Add .gitignore" 或 "Choose a license"
4. 點擊 "Create repository"

### 2. 連接到 GitHub 倉庫

在終端機執行以下命令：

```bash
git remote add origin https://github.com/tewei02/ModernReader.git
git push -u origin main
```

### 3. 啟用 GitHub Pages

1. 前往倉庫的 Settings -> Pages
2. 在 "Build and deployment" 下：
   - **Source**: 選擇 "GitHub Actions"
3. 等待幾分鐘讓 GitHub Actions 自動部署

### 4. 訪問您的網站

部署完成後，您的網站將會在以下地址訪問：
**https://tewei02.github.io/ModernReader/**

## ✅ 已完成的配置

- ✅ Git 倉庫已初始化
- ✅ 所有文件已提交
- ✅ Vite 配置已更新（base: '/ModernReader/'）
- ✅ GitHub Actions 部署工作流已創建
- ✅ 分支已設置為 main

## 📝 重要提示

1. **倉庫必須是公開的（Public）** 才能使用 GitHub Pages
2. 第一次部署可能需要 5-10 分鐘
3. 之後每次推送到 main 分支都會自動重新部署

## 🔄 未來更新流程

當您想要更新網站時，只需：

```bash
git add .
git commit -m "描述您的更改"
git push
```

GitHub Actions 會自動構建和部署新版本！

## ❓ 疑難排解

如果部署失敗：
1. 檢查 GitHub 倉庫的 "Actions" 標籤查看錯誤日誌
2. 確保 Settings -> Pages 中選擇了 "GitHub Actions"
3. 確保倉庫是公開的

---

**準備好了嗎？** 執行上面第 2 步的命令來推送到 GitHub！
