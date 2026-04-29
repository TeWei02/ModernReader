// ModernReader ESP32 Output Node Firmware
// Controls LED, vibration, servo based on WS states

#include <WiFi.h>
#include <WebSocketsClient.h>
#include <ESP32Servo.h>
#include <ArduinoJson.h>

const char *ssid = "YOUR_WIFI_SSID";
const char *password = "YOUR_WIFI_PASSWORD";
const char *websocket_server = "192.168.1.100"; // Backend host only
const int websocket_port = 8000;

WebSocketsClient webSocket;

Servo servo;
int servoPin = 19; // PWM capable pin
int ledPin = 2;    // Built-in LED or external RGB pin
int vibPin = 18;   // Vibration motor via transistor

String currentState = "calm";
int ledValue = 50;
int vibrationValue = 0;
int servoValue = 80;

void setup()
{
    Serial.begin(115200);
    delay(1000);

    // WiFi
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("WiFi connected");

    // Hardware init
    servo.attach(servoPin);
    pinMode(ledPin, OUTPUT);
    pinMode(vibPin, OUTPUT);

    // WebSocket
    webSocket.begin(websocket_server, websocket_port, "/ws");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(5000);
}

void loop()
{
    webSocket.loop();
    updateOutput();
    delay(50);
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_TEXT:
    {
        String message = String((char *)payload);
        DynamicJsonDocument doc(1024);
        DeserializationError err = deserializeJson(doc, message);
        if (err)
        {
            Serial.printf("JSON parse error: %s\n", err.c_str());
            return;
        }

        currentState = doc["state"].as<String>();
        if (doc["tangible"].is<JsonObject>())
        {
            if (doc["tangible"]["led"].is<JsonArray>())
            {
                JsonArray ledArray = doc["tangible"]["led"].as<JsonArray>();
                if (ledArray.size() >= 3)
                {
                    ledValue = ((int)ledArray[0] + (int)ledArray[1] + (int)ledArray[2]) / 3;
                }
            }
            vibrationValue = doc["tangible"]["vibration"] | vibrationValue;
            servoValue = doc["tangible"]["servo"] | servoValue;
        }
        Serial.printf("New state: %s\n", currentState.c_str());
        break;
    }
    }
}

void updateOutput()
{
    int pulse = (int)(40 * sin(millis() / 180.0));
    if (currentState == "chaotic")
    {
        analogWrite(ledPin, constrain(ledValue + pulse, 0, 255));
        analogWrite(vibPin, constrain(vibrationValue + pulse, 0, 255));
        servo.write(constrain(servoValue + pulse / 3, 0, 180));
        return;
    }

    analogWrite(ledPin, constrain(ledValue, 0, 255));
    analogWrite(vibPin, constrain(vibrationValue, 0, 255));
    servo.write(constrain(servoValue, 0, 180));
}
