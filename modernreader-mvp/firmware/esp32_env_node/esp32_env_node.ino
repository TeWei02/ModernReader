// ESP32 Environment Node MVP
// Reads DHT22 + BH1750 and posts features to FastAPI /api/signals

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <BH1750.h>
#include <DHT.h>

const char *ssid = "YOUR_WIFI";
const char *password = "YOUR_PASS";
const char *server = "192.168.1.100"; // Backend host
const int serverPort = 8000;

#define DHT_PIN 4
#define DHT_TYPE DHT22

DHT dht(DHT_PIN, DHT_TYPE);
BH1750 lightMeter;

void setup()
{
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("WiFi connected");

    dht.begin();
    Wire.begin();
    lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
}

void loop()
{
    float temp = dht.readTemperature();
    float humidity = dht.readHumidity();
    float light = lightMeter.readLightLevel();

    if (isnan(temp) || isnan(humidity))
    {
        Serial.println("DHT read failed");
        delay(1500);
        return;
    }

    if (light < 0)
    {
        light = 0;
    }

    StaticJsonDocument<256> doc;
    doc["node_id"] = "env-01";
    doc["source_type"] = "env";
    doc["timestamp"] = millis() / 1000.0;

    JsonObject features = doc.createNestedObject("features");
    features["temp"] = temp;
    features["humidity"] = humidity;
    features["light"] = light;
    // Small baseline values keep state machine stable when no audio stream is attached.
    features["rms"] = 0.06;
    features["zcr"] = 0.05;
    features["centroid"] = 1200;

    String payload;
    serializeJson(doc, payload);
    postSignal(payload);

    delay(2000);
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
