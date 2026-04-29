# 貢獻指南

歡迎加入 ModernReader Universal 社群！本文件將指導你如何貢獻。

---

## 🌟 貢獻方式

### 💻 程式碼貢獻
- 新功能開發
- Bug 修復
- 效能優化
- 測試撰寫

### 📚 文件貢獻
- 翻譯 (我們需要多語言支援！)
- 教學撰寫
- API 文件更新
- 範例程式

### 🔌 硬體貢獻
- PCB 設計改進
- 外殼設計
- 新感測器整合
- BOM 優化

### 🎨 設計貢獻
- UI/UX 改進
- Logo 與品牌資產
- 圖示設計
- 宣傳材料

### 🧪 研究貢獻
- 新分類演算法
- 應用案例研究
- 論文合作
- 資料集建立

### 💬 社群貢獻
- 回答問題
- 組織活動
- 推廣專案
- 用戶支援

---

## 🚀 開始貢獻

### 第一步：Fork 與克隆

```bash
# 1. 在 GitHub 上 Fork 專案
# 2. 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/Universal.git
cd Universal

# 3. 添加上游 remote
git remote add upstream https://github.com/ModernReader/Universal.git
```

### 第二步：選擇任務

**尋找適合的 issue**:
- [`good first issue`](https://github.com/ModernReader/Universal/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) - 適合新手
- [`help wanted`](https://github.com/ModernReader/Universal/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) - 需要幫助
- [`bug`](https://github.com/ModernReader/Universal/issues?q=is%3Aissue+is%3Aopen+label%3A%22bug%22) - Bug 修復

**沒有看到合適的？**
- 開一個新 issue 描述你的想法
- 在 Discord 討論
- 直接開始，然後提交 PR

### 第三步：建立分支

```bash
# 從 main 建立新分支
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name

# 分支命名規範
# feature/xxx - 新功能
# bugfix/xxx - Bug 修復
# docs/xxx - 文件更新
# refactor/xxx - 重構
# test/xxx - 測試
```

### 第四步：開發

**設定開發環境**:

```bash
# 後端開發
cd software/backend
pip install -r requirements.txt
pip install -r requirements-dev.txt  # 開發依賴

# 執行測試
pytest

# 程式碼格式檢查
black .
flake8
```

**開發建議**:
- 遵循現有的程式碼風格
- 撰寫清晰的註解
- 添加測試覆蓋新功能
- 保持 commit 小而專注

### 第五步：提交變更

```bash
# 添加變更
git add path/to/changed/files

# 撰寫清晰的 commit message
git commit -m "feat: add new sensor support for MQ-135

- Implement MQ-135 gas sensor driver
- Add calibration routine
- Update documentation

Closes #123"

# Commit message 規範:
# feat: 新功能
# fix: Bug 修復
# docs: 文件更新
# style: 格式調整 (不影響功能)
# refactor: 重構
# test: 測試相關
# chore: 工具、設定等非功能性變更
```

### 第六步：推送與 Pull Request

```bash
# 推送到你的 fork
git push origin feature/your-feature-name

# 在 GitHub 上建立 Pull Request
```

**PR 描述模板**:

```markdown
## 描述
簡短說明這個 PR 做了什麼

## 相關 Issue
Closes #123

## 變更類型
- [ ] 新功能
- [ ] Bug 修復
- [ ] 文件更新
- [ ] 重構
- [ ] 其他 (請說明)

## 測試
說明你如何測試這些變更

## 檢查清單
- [ ] 程式碼通過 lint 檢查
- [ ] 添加了適當的測試
- [ ] 更新了文件
- [ ] 沒有破壞現有功能
```

---

## 📐 程式碼規範

### Python

遵循 [PEP 8](https://pep8.org/) 標準。

```python
# 好的變數命名
sensor_data = read_sensor()
total_count = calculate_total(items)

# 函數文件字串
def process_signal(data: np.ndarray) -> dict:
    """
    Process raw signal data and extract features.
    
    Args:
        data: Raw signal array
        
    Returns:
        Dictionary containing extracted features
        
    Raises:
        ValueError: If data is empty
    """
    pass
```

**工具**:
- `black` - 自動格式化
- `flake8` - 風格檢查
- `mypy` - 型別檢查
- `pytest` - 測試

### C++ (韌體)

遵循 [Arduino 程式碼風格](https://www.arduino.cc/reference/en/language/structure/further-syntax/codingstyleguide/)。

```cpp
// 好的變數命名
int sensorValue = analogRead(SENSOR_PIN);
float temperature = readTemperature();

// 函數註解
/**
 * @brief Read data from DHT22 sensor
 * 
 * @param pin GPIO pin number
 * @return float Temperature in Celsius
 */
float readDHT22(int pin) {
    // 實作...
}
```

**工具**:
- `clang-format` - 格式化
- `cpplint` - 風格檢查

### JavaScript

遵循現代 ES6+ 標準。

```javascript
// 使用 const/let 而非 var
const API_URL = 'http://localhost:8000';
let connectionState = 'disconnected';

// 使用箭頭函數
const processData = (data) => {
    return data.map(item => transform(item));
};

// 有意義的變數名稱
const websocketConnection = new WebSocket(url);
```

---

## 🧪 測試指南

### 後端測試

```bash
# 執行所有測試
pytest

# 執行特定測試
pytest tests/test_inference.py

# 含覆蓋率報告
pytest --cov=app --cov-report=html
```

### 韌體測試

```bash
# 編譯測試
arduino-cli compile --fqbn esp32:esp32:esp32 firmware/audio_node

# 硬體在環測試 (需要實際硬體)
platformio test -e esp32
```

### 前端測試

```bash
# 執行測試 (如果設置了 Jest 等)
npm test

# E2E 測試
npm run test:e2e
```

---

## 📝 文件指南

### Markdown 風格

- 使用 ATX 風格標題 (`#`, `##`, `###`)
- 列表使用 `-` 或 `*`
- 程式碼區塊指定語言
- 連結使用描述性文字

```markdown
# 好的標題

## 安裝步驟

1. 第一步
2. 第二步

- 項目一
- 項目二

[查看文件](docs/README.md)
```

### 文件結構

```
docs/
├── assembly/           # 組裝指南
├── api/               # API 文件
├── contribution/      # 貢獻相關
├── theory/            # 理論基礎
└── tutorials/         # 教學
```

---

## 🤝 行為準則

### 我們的承諾

為了營造開放且歡迎的環境，我們承諾：

- **包容**: 無論背景、身份、經驗水平，都歡迎參與
- **尊重**: 以尊重的態度對待他人
- **建設性**: 提供建設性的回饋
- **耐心**: 對新手保持耐心
- **專業**: 保持專業的溝通方式

### 不可接受的行為

- 使用性別化語言或圖像
- 人身攻擊或貶低性評論
- 公開或私下騷擾
- 未經同意發布他人私人資訊
- 其他不當行為

### 執行

不當行為可向專案維護者舉報：
- Email: conduct@modernreader.org
- Discord: 私信管理員

---

## 🏆 認可

### 貢獻者層級

| 層級 | 要求 | 獎勵 |
|------|------|------|
| 🌱 Sprout | 第一個 PR 合併 | Discord 角色 |
| 🌿 Grower | 5 個 PR 合併 | GitHub 貢獻者徽章 |
| 🌳 Tree | 20 個 PR 合併 | 專案網站列出名字 |
| 🌲 Legend | 50+ 個 PR 合併 | 顧問委員會席位 |

### 月度貢獻者

每個月我們會選出優秀貢獻者：
- 部落格專訪
- 社群媒體宣傳
- 小禮物 (貼紙、T-shirt)

---

## ❓ 常見問題

### Q: 我是新手，可以貢獻嗎？
**A**: 當然可以！從 `good first issue` 開始，我們會協助你。

### Q: 我的英文不好怎麼辦？
**A**: 沒關係！你可以貢獻程式碼、文件翻譯、或任何你擅長的領域。

### Q: 我需要簽署 CLA 嗎？
**A**: 不需要。透過提交 PR，你同意以 MIT/CERN OHL 授權你的貢獻。

### Q: 我可以為商業目的使用這個專案嗎？
**A**: 可以！這就是開源的精神。只需遵守授權條款即可。

### Q: 如何聯絡維護者？
**A**: 
- GitHub Issues: 技術問題
- Discord: 即時討論
- Email: hello@modernreader.org (一般諮詢)

---

## 🙏 感謝

感謝所有貢獻者讓 ModernReader 變得更好！

<a href="https://github.com/ModernReader/Universal/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ModernReader/Universal" />
</a>

---

<div align="center">

**一起建造未來！**

[返回主頁](../../README.md) | [查看 Issue](https://github.com/ModernReader/Universal/issues) | [加入 Discord](https://discord.gg/modernreader)

</div>
