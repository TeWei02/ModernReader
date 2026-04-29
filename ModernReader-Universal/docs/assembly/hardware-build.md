# ModernReader 硬體組裝完整指南

本指南將帶領你從零開始組裝完整的 ModernReader 系統。

## 📋 事前準備

### 工具清單
- 麵包板 x1
- 杜邦線 (公對公、公對母、母對母) 各一包
- 剪線鉗
- 剝線鉗
- 萬用電表 (選配，用於除錯)
- USB 數據線 (Micro USB 或 USB-C，視 ESP32 版本而定)

### 元件清單
見 [物料清單](../../hardware/bom/complete_bom.csv)

---

## 🔌 節點一：音訊輸入節點 (Audio Node)

### 功能
使用 INMP441 I2S 麥克風擷取環境聲音，透過 WiFi 傳送到後端伺服器。

### 接線圖

```
INMP441          ESP32
───────          ─────
VDD      ──────> 3.3V
GND      ──────> GND
SCK      ──────> GPIO26
WS       ──────> GPIO22
SD       ──────> GPIO21
L/R      ──────> GND (選擇左聲道)
```

### 步驟

1. **準備 ESP32**
   - 將 ESP32 插入麵包板
   - 確認電源軌連接正確

2. **連接 INMP441**
   - VDD 接 3.3V (注意：不是 5V！)
   - GND 接 GND
   - SCK 接 GPIO26
   - WS 接 GPIO22
   - SD 接 GPIO21
   - L/R 接 GND

3. **上傳韌體**
   ```bash
   # 安裝 Arduino CLI (如果還沒有)
   curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
   
   # 安裝 ESP32 核心
   arduino-cli core install esp32:esp32
   
   # 編譯並上傳
   cd ../../firmware/audio_node
   arduino-cli compile --fqbn esp32:esp32:esp32 audio_node.ino
   arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 audio_node.ino
   ```
   *注意：將 `/dev/ttyUSB0` 替換為你的實際埠號*

4. **配置 WiFi**
   - 開啟 serial monitor
   - 輸入你的 WiFi 憑證
   - 或使用預設的 AP 模式配網

---

## 🌡️ 節點二：環境感測節點 (Environment Node)

### 功能
讀取溫度、濕度、光照等環境參數。

### 接線圖 (DHT22 + BH1750)

```
DHT22          ESP32
─────          ─────
VCC      ──────> 3.3V
DATA     ──────> GPIO4
GND      ──────> GND

BH1750         ESP32
──────         ─────
VCC      ──────> 3.3V
GND      ──────> GND
SCL      ──────> GPIO22 (I2C)
SDA      ──────> GPIO21 (I2C)
ADDR     ──────> GND (設定 I2C 地址)
```

### 步驟

1. **連接 DHT22**
   - VCC 接 3.3V
   - DATA 接 GPIO4
   - GND 接 GND
   - 在 VCC 和 DATA 之間加一個 10kΩ 上拉電阻

2. **連接 BH1750**
   - VCC 接 3.3V
   - GND 接 GND
   - SCL 接 GPIO22
   - SDA 接 GPIO21

3. **上傳韌體**
   ```bash
   cd ../../firmware/env_node
   arduino-cli compile --fqbn esp32:esp32:esp32 env_node.ino
   arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 env_node.ino
   ```

---

## 💡 節點三：輸出節點 (Output Node)

### 功能
接收伺服器狀態指令，控制 LED、震動馬達、伺服馬達。

### 接線圖

```
WS2812B        ESP32
───────        ─────
VCC      ──────> 5V (外部電源)
GND      ──────> GND (與 ESP32 共地)
DI       ──────> GPIO18

震動馬達       ESP32
────────       ─────
+ (紅)   ──────> 5V (外部電源)
- (黑)   ──────> Collector (NPN 電晶體)
基極     ──────> GPIO19 (透過 220Ω 電阻)
發射極   ──────> GND

SG90 Servo     ESP32
────────       ─────
Brown    ──────> GND
Red      ──────> 5V (外部電源)
Orange   ──────> GPIO5 (PWM)
```

### ⚠️ 重要警告
- ** servo 和震動馬達必須使用外部 5V 電源！**
- **ESP32 的 GND 必須與外部電源的 GND 相連 (共地)**
- **直接從 ESP32 供電會導致不穩定甚至損壞**

### 步驟

1. **準備外部電源**
   - 使用 5V/2A 以上的電源供應器
   - 將電源 GND 與 ESP32 GND 相連

2. **連接 WS2812B**
   - VCC 接外部 5V
   - GND 接 GND
   - DI 接 GPIO18
   - 在 DI 前串聯一個 330Ω 電阻 (可選，但建議)

3. **連接震動馬達 (透過電晶體)**
   ```
   ESP32 GPIO19 ──> 220Ω 電阻 ──> NPN 基極
   NPN 發射極 ──> GND
   NPN 集極 ──> 震動馬達負極
   震動馬達正極 ──> 5V
   ```
   - 在震動馬達兩端並聯一個 flyback diode (陰極接 5V，陽極接集極)

4. **連接 SG90 伺服馬達**
   - Brown 接 GND
   - Red 接外部 5V
   - Orange 接 GPIO5

5. **上傳韌體**
   ```bash
   cd ../../firmware/output_node
   arduino-cli compile --fqbn esp32:esp32:esp32 output_node.ino
   arduino-cli upload -p /dev/ttyUSB0 --fqbn esp32:esp32:esp32 output_node.ino
   ```

---

## 🖥️ 後端伺服器設置

### 選項 A: 本機運行

```bash
cd ../../software/backend
pip install -r requirements.txt
python main.py
```

### 選項 B: Docker 運行

```bash
cd ../../docker
docker-compose up -d
```

### 選項 C: 雲端部署
詳見 [雲端部署指南](../contribution/cloud-deployment.md)

---

## 🧪 測試與除錯

### 測試步驟

1. **啟動所有節點**
   - 給所有 ESP32 通電
   - 確認 WiFi 連線成功 (觀察 serial output)

2. **啟動後端伺服器**
   ```bash
   python main.py
   ```

3. **開啟 Dashboard**
   - 瀏覽器訪問 `http://localhost:8000/dashboard`
   - 應該能看到即時狀態更新

4. **產生測試訊號**
   - 對著麥克風說話或拍手
   - 改變環境 (吹氣、遮光)
   - 觀察 Dashboard 狀態變化

5. **驗證輸出**
   - 當狀態改變時，LED 應該變色
   - 震動馬達應該啟動
   - 伺服馬達應該轉動

### 常見問題

#### Q1: ESP32 無法連線 WiFi
- 確認 SSID 和密碼正確
- 檢查 WiFi 訊號強度
- 嘗試重啟 ESP32

#### Q2: 後端收不到資料
- 確認 ESP32 的伺服器 IP/Port 設定正確
- 檢查防火牆設定
- 使用 `ping` 測試網路連通性

#### Q3: LED 不亮
- 確認電源極性正確
- 檢查資料線連接
- 確認外部電源供電充足

#### Q4: 伺服馬達抖動或不動
- **最常見原因**: 電源不足
- 確認使用外部 5V 電源
- 確認 GND 共地

---

## 📦 外殼設計 (選配)

我們提供 3D 列印檔案，讓你的節點更專業。

下載 STL 檔案: [../../hardware/enclosure/](../../hardware/enclosure/)

### 列印設定
- 材料: PLA 或 PETG
- 層高: 0.2mm
- 填充: 20%
- 支撐: 不需要

---

## 🎓 進階應用

完成基本組裝後，你可以：

1. **新增更多感測器**
   - 土壤濕度感測器
   - 氣體感測器 (MQ 系列)
   - IMU (加速度計/陀螺儀)

2. **自訂分類規則**
   - 編輯 `backend/inference.py`
   - 訓練自己的 ML 模型

3. **建立多節點網絡**
   - 部署多個音訊節點到不同位置
   - 實現空間定位

4. **整合到其他平台**
   - Home Assistant
   - Node-RED
   - IFTTT

---

## 🤝 尋求協助

遇到問題？加入我們的社群：

- **Discord**: https://discord.gg/modernreader
- **論壇**: https://forum.modernreader.org
- **GitHub Issues**: https://github.com/ModernReader/Universal/issues

---

## 📝 貢獻

改進這份指南？歡迎提交 Pull Request！

詳見 [貢獻指南](../contribution/how-to-contribute.md)

---

<div align="center">

**Happy Building! 🔨**

[返回主頁](../../README.md) | [查看範例](../../examples/) | [加入社群](https://discord.gg/modernreader)

</div>
