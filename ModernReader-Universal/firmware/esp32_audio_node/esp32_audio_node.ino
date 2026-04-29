// ESP32 Audio Node MVP - INMP441 I2S Mic
// Sends features to FastAPI gateway

#include <WiFi.h>
#include <HTTPClient.h>
#include <driver/i2s.h>
#include <ArduinoJson.h>

const char *ssid = "YOUR_WIFI";
const char *password = "YOUR_PASS";
const char *server = "192.168.1.100"; // Backend host
const int serverPort = 8000;

#define I2S_WS 22
#define I2S_SD 21
#define I2S_SCK 26
#define I2S_PORT I2S_NUM_0
#define SAMPLE_RATE 16000
#define SAMPLE_BITS 16
#define BUFFER_LEN 1024

void setup()
{
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
        delay(500);
    Serial.println("Connected");

    i2s_config_t i2s_config = {
        .mode = i2s_mode_t(I2S_MODE_MASTER | I2S_MODE_RX),
        .sample_rate = SAMPLE_RATE,
        .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
        .channel_format = I2S_CHANNEL_FMT_RIGHT_LEFT,
        .communication_format = I2S_COMM_FORMAT_STAND_I2S,
        .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
        .dma_buf_count = 4,
        .dma_buf_len = BUFFER_LEN,
    };
    i2s_driver_install(I2S_PORT, &i2s_config, 0, NULL);
    i2s_pin_config_t pin_config = {
        .bck_io_num = I2S_SCK,
        .ws_io_num = I2S_WS,
        .data_out_num = I2S_PIN_NO_CHANGE,
        .data_in_num = I2S_SD};
    i2s_set_pin(I2S_PORT, &pin_config);
}

void loop()
{
    size_t bytesRead;
    int16_t samples[BUFFER_LEN];
    i2s_read(I2S_PORT, samples, BUFFER_LEN * sizeof(int16_t), &bytesRead, portMAX_DELAY);
    if (bytesRead > 0)
    {
        // Simple RMS
        float rms = 0;
        for (int i = 0; i < bytesRead / 2; i++)
            rms += sq(samples[i]);
        rms = sqrt(rms / (bytesRead / 2)) / 32768.0;

        // Build JSON payload for /api/signals
        StaticJsonDocument<256> doc;
        doc["node_id"] = "audio-01";
        doc["source_type"] = "audio";
        doc["timestamp"] = millis() / 1000.0;
        JsonObject features = doc.createNestedObject("features");
        features["rms"] = rms;
        features["zcr"] = 0.08;      // placeholder for edge device approximation
        features["centroid"] = 1700; // placeholder for edge device approximation

        String payload;
        serializeJson(doc, payload);
        postSignal(payload);
    }
    delay(250);
}

void postSignal(const String &payload)
{
    if (WiFi.status() != WL_CONNECTED)
    {
        return;
    }

    HTTPClient http;
    String url = String("http://") + server + ":" + String(serverPort) + "/api/signals";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    int code = http.POST(payload);
    if (code > 0)
    {
        Serial.printf("POST /api/signals -> %d\n", code);
    }
    else
    {
        Serial.printf("POST error: %d\n", code);
    }
    http.end();
}
