# ModernReader 快速啟動指南

歡迎！這份指南將幫助你在 **5 分鐘內** 開始使用 ModernReader。

---

## 🚀 選項 A: 軟體模擬版 (無需硬體)

### 步驟 1: 克隆專案

```bash
git clone https://github.com/ModernReader/Universal.git
cd ModernReader-Universal/software/backend
```

### 步驟 2: 安裝依賴

```bash
pip install -r requirements.txt
```

**requirements.txt 內容**:
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
websockets==12.0
librosa==0.10.1
numpy==1.26.3
scipy==1.12.0
scikit-learn==1.4.0
pydantic==2.5.3
python-multipart==0.0.6
```

### 步驟 3: 啟動伺服器

```bash
python main.py
```

你應該看到：
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### 步驟 4: 開啟 Dashboard

在瀏覽器訪問：**http://localhost:8000/dashboard**

你應該看到即時狀態顯示頁面。

### 步驟 5: 測試系統

**方法一：使用模擬客戶端**

在新終端機視窗：
```bash
cd ModernReader-Universal/software/backend
python simulate_client.py
```

**方法二：使用 curl**

```bash
curl -X POST http://localhost:8000/api/signals \
  -H "Content-Type: application/json" \
  -d '{
    "node_id": "test-mic",
    "source_type": "audio",
    "timestamp": '$(date +%s)',
    "features": {
      "rms": 0.25,
      "zcr": 0.15,
      "centroid": 2800
    }
  }'
```

**方法三：使用電腦麥克風 (需要 sounddevice)**

```bash
pip install sounddevice
python main.py --use-local-mic
```

---

## 🔌 選項 B: 完整硬體版

需要硬體？請參閱 [完整硬體組裝指南](docs/assembly/hardware-build.md)

### 快速材料清單

| 元件 | 數量 | 約略價格 |
|------|------|----------|
| ESP32 DevKit | 2 | $12 |
| INMP441 麥克風 | 1 | $3 |
| DHT22 | 1 | $2 |
| WS2812B LED | 5 | $2.5 |
| SG90 Servo | 1 | $2 |
| 震動馬達 | 1 | $1 |
| 麵包板 + 線材 | 1 | $5 |
| **總計** | | **~$27.5** |

### 快速組裝

1. **音訊節點**: ESP32 + INMP441
2. **輸出節點**: ESP32 + LED + Servo + 震動馬達
3. **上傳韌體**: 使用 Arduino IDE 或 arduino-cli
4. **配置 WiFi**: 透過 Serial Monitor
5. **啟動後端**: `python main.py`
6. **觀察效果**: 對著麥克風說話，看 LED 變化！

詳細步驟請見 [硬體組裝指南](docs/assembly/hardware-build.md)

---

## 📱 選項 C: Docker 一鍵部署

```bash
cd ModernReader-Universal/docker
docker-compose up -d
```

訪問：
- Dashboard: http://localhost:8000/dashboard
- API Docs: http://localhost:8000/docs

---

## 🧪 驗證安裝

### 檢查後端

```bash
curl http://localhost:8000/api/state/latest
```

應該返回類似：
```json
{
  "state": "calm",
  "confidence": 0.85,
  "timestamp": 1714377600
}
```

### 檢查 WebSocket

開啟瀏覽器開發者工具 Console，貼上：

```javascript
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => console.log('Received:', event.data);
ws.onerror = (err) => console.error('Error:', err);
```

### 執行完整 Demo

```bash
cd ModernReader-Universal/software/backend
python run_demo.py
```

這會自動執行三個場景並產生日誌。

---

## ❓ 常見問題

### Q: Port 8000 已被使用
**解法**: 使用其他 port

```bash
python main.py --port 8001
```

### Q: ImportError: No module named 'librosa'
**解法**: 確認已安裝依賴

```bash
pip install -r requirements.txt
```

### Q: Dashboard 無法連線
**解法**: 
1. 確認後端正在運行
2. 檢查防火牆設定
3. 嘗試 `http://127.0.0.1:8000/dashboard`

### Q: ESP32 無法上傳程式
**解法**:
1. 安裝正確的 USB 驅動
2. 選擇正確的 COM port
3. 按住 BOOT 按鈕再按 RESET

---

## 📚 下一步

完成快速開始後，你可以：

1. **閱讀文件**
   - [系統架構詳解](docs/theory/architecture.md)
   - [Semantica 語言規範](docs/theory/semantica-spec.md)
   - [貢獻指南](docs/contribution/how-to-contribute.md)

2. **嘗試範例**
   - [`examples/basic/mic_to_led`](examples/basic/mic_to_led)
   - [`examples/basic/temp_to_vibration`](examples/basic/temp_to_vibration)
   - [`examples/advanced/multi_node_sync`](examples/advanced/multi_node_sync)

3. **加入社群**
   - [Discord](https://discord.gg/modernreader)
   - [GitHub Discussions](https://github.com/ModernReader/Universal/discussions)
   - [論壇](https://forum.modernreader.org)

4. **開始貢獻**
   - 尋找 [`good first issue`](https://github.com/ModernReader/Universal/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
   - 閱讀 [貢獻指南](docs/contribution/how-to-contribute.md)
   - 提交你的第一個 PR！

---

## 🆘 需要幫助？

- **文件問題**: 開 GitHub Issue
- **技術問題**: Discord #help 頻道
- **一般諮詢**: hello@modernreader.org

---

<div align="center">

**祝你使用愉快！** 🎉

[返回主頁](README.md) | [查看範例](examples/) | [加入社群](https://discord.gg/modernreader)

</div>
