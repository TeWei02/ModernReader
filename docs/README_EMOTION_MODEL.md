# CoreML 情緒分析模型整合

## 快速開始

本專案提供了將情緒分析模型整合到 iOS 應用程式的完整解決方案。

### 文件結構

```
ModernReader/
├── convert_emotion_model.py              # Python 模型轉換腳本
├── test_emotion_conversion.py            # 測試腳本
├── EMOTION_ANALYSIS_INTEGRATION.md       # 詳細整合文檔
├── examples/
│   └── emotion_analysis_example.swift    # 使用範例 (UIKit & SwiftUI)
└── web/frontend/ios/App/App/
    └── EmotionAnalysisService.swift      # iOS 服務實作
```

## 第一步：模型轉換

### 安裝依賴

```bash
# 安裝基礎套件
pip install -r requirements-dev.txt

# 根據您的模型格式安裝對應框架
pip install torch        # 對於 PyTorch 模型
# 或
pip install tensorflow   # 對於 TensorFlow/Keras 模型
```

### 轉換模型

**從 PyTorch 轉換：**
```bash
python convert_emotion_model.py \
    --input your_model.pt \
    --format pytorch \
    --input-shape 1,128 \
    --output EmotionLSTM.mlpackage
```

**從 TensorFlow/Keras 轉換：**
```bash
python convert_emotion_model.py \
    --input your_model.h5 \
    --format keras \
    --output EmotionLSTM.mlpackage
```

### 測試轉換腳本

執行測試腳本以驗證轉換流程：

```bash
# 安裝測試所需套件
pip install torch coremltools

# 執行測試
python test_emotion_conversion.py
```

## 第二步：iOS 整合

### 添加模型到 Xcode

1. 將生成的 `EmotionLSTM.mlpackage` 拖入 Xcode 專案
2. 確保勾選目標 Target
3. 驗證模型在 "Copy Bundle Resources" 中

### 使用服務

```swift
import UIKit

class MyViewController: UIViewController {
    private let emotionService = EmotionAnalysisService()
    
    func analyzeText() {
        let text = "I am so happy today!"
        let emotion = emotionService.analyze(text: text)
        print("檢測到的情緒: \(emotion)")
    }
}
```

### 獲取詳細結果

```swift
let confidences = emotionService.analyzeWithConfidence(text: text)
for (emotion, confidence) in confidences {
    print("\(emotion): \(String(format: "%.2f%%", confidence * 100))")
}
```

## 支援的情緒類型

- 😊 **joy** (喜悅)
- 😢 **sadness** (悲傷)
- 😠 **anger** (憤怒)
- 😨 **fear** (恐懼)
- 😐 **neutral** (中性)

## 核心功能

### Python 轉換腳本 (`convert_emotion_model.py`)

- ✅ 支援 PyTorch 和 TensorFlow/Keras 模型
- ✅ 自動模型追蹤和優化
- ✅ 添加模型元數據
- ✅ 支援自訂輸入形狀
- ✅ 目標 iOS 15+ 部署

### Swift 服務 (`EmotionAnalysisService.swift`)

- ✅ 自動模型載入
- ✅ 文字預處理（分詞、填充）
- ✅ Neural Engine 加速
- ✅ 情緒檢測
- ✅ 置信度分數
- ✅ 錯誤處理

## 技術架構

```
[輸入文字]
    ↓
[分詞 & 詞彙映射]
    ↓
[填充/截斷至固定長度]
    ↓
[轉換為 MLMultiArray]
    ↓
[CoreML 模型推理]
    ↓
[提取最高機率情緒]
    ↓
[返回情緒標籤]
```

## 效能優化建議

1. **模型量化**：減少模型大小
   ```python
   # 在轉換時添加量化
   coreml_model = ct.convert(
       model,
       convert_to="mlprogram",
       compute_precision=ct.precision.FLOAT16
   )
   ```

2. **批次處理**：處理多個文字
   ```swift
   let texts = ["text1", "text2", "text3"]
   let results = texts.map { emotionService.analyze(text: $0) }
   ```

3. **結果快取**：避免重複計算
   ```swift
   private var cache: [String: String] = [:]
   
   func analyzeCached(text: String) -> String {
       if let cached = cache[text] {
           return cached
       }
       let result = emotionService.analyze(text: text)
       cache[text] = result
       return result
   }
   ```

## 常見問題

### Q: 模型檔案太大怎麼辦？

A: 使用模型量化技術：
- Float16 量化：減少 ~50% 大小
- Int8 量化：減少 ~75% 大小
- 注意：量化可能略微降低準確度

### Q: 如何使用自己的詞彙表？

A: 修改 `EmotionAnalysisService.swift` 中的 `setupVocabulary()` 方法，從 JSON 或 plist 檔案載入訓練時使用的詞彙表。

### Q: 支援哪些 iOS 版本？

A: 目前轉換腳本設定為 iOS 15+。可以修改 `minimum_deployment_target` 參數以支援更早版本。

### Q: 如何處理中文或其他語言？

A: 需要使用相應的分詞器（如 jieba for Chinese）並確保詞彙表包含目標語言的詞彙。

## 進階使用

### 自訂情緒標籤

修改 `EmotionAnalysisService.swift`：

```swift
private let emotionLabels = ["happy", "sad", "angry", "fearful", "surprised", "disgusted"]
```

### 調整輸入長度

修改 `maxSequenceLength` 以匹配您的模型：

```swift
private let maxSequenceLength = 256  // 預設是 128
```

## 相關文檔

- [詳細整合指南](EMOTION_ANALYSIS_INTEGRATION.md)
- [使用範例](examples/emotion_analysis_example.swift)
- [Core ML 文檔](https://developer.apple.com/documentation/coreml)

## 授權

本專案遵循 ModernReader 的授權條款。

## 貢獻

歡迎提交 Pull Request 來改進這個整合方案！
