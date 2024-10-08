//=========================================== Import Libraries here ====================================================
// Your area


//======================================================================================================================
//=========================================== Don't Touch these values =================================================
#include <Arduino.h>
#include <ArduinoJson.h>
#include "ESP8266WiFi.h"
extern "C" {
  #include "user_interface.h"
  #include "wpa2_enterprise.h"
}
#include <ESP8266WiFiMulti.h>
#include <WebSocketsClient.h>
#include <Hash.h>

#define development true

String ORGANIZATION = "<ORGANIZATIONNAME>";
String TOKEN = "<TOKEN>";
const String SERVER_URL = "<DOMAIN_ADDRESS>";
const String MACHINENAME = "<MACHINENAME>";
const char* fingerprint = "<FINGERPRINT>";

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

//=========================================== END ======================================================================
//======================================================================================================================
/*
╭╮╭╮╭┳━━┳━━━┳━━╮╭━━━┳━━━┳━━━━┳━━━┳━━┳╮╱╱╭━━━╮
┃┃┃┃┃┣┫┣┫╭━━┻┫┣╯╰╮╭╮┃╭━━┫╭╮╭╮┃╭━╮┣┫┣┫┃╱╱┃╭━╮┃
┃┃┃┃┃┃┃┃┃╰━━╮┃┃╱╱┃┃┃┃╰━━╋╯┃┃╰┫┃╱┃┃┃┃┃┃╱╱┃╰━━╮
┃╰╯╰╯┃┃┃┃╭━━╯┃┃╱╱┃┃┃┃╭━━╯╱┃┃╱┃╰━╯┃┃┃┃┃╱╭╋━━╮┃
╰╮╭╮╭╋┫┣┫┃╱╱╭┫┣╮╭╯╰╯┃╰━━╮╱┃┃╱┃╭━╮┣┫┣┫╰━╯┃╰━╯┃
╱╰╯╰╯╰━━┻╯╱╱╰━━╯╰━━━┻━━━╯╱╰╯╱╰╯╱╰┻━━┻━━━┻━━━╯
*/
const char* SSID = "<SSIDNAME>";
const char* PASSWORD = "<SSIDPASSWORD>";
/*
╭━━━╮╱╱╱╱╱╱╱╱╭╮╱╭━━━┳━━━┳━━━┳━━━━╮
┃╭━╮┃╱╱╱╱╱╱╱╱┃┃╱┃╭━╮┃╭━╮┃╭━╮┃╭╮╭╮┃
┃╰━━┳━━┳━┳┳━━┫┃╱┃╰━╯┃┃╱┃┃╰━╯┣╯┃┃╰╯
╰━━╮┃┃━┫╭╋┫╭╮┃┃╱┃╭━━┫┃╱┃┃╭╮╭╯╱┃┃
┃╰━╯┃┃━┫┃┃┃╭╮┃╰╮┃┃╱╱┃╰━╯┃┃┃╰╮╱┃┃
╰━━━┻━━┻╯╰┻╯╰┻━╯╰╯╱╱╰━━━┻╯╰━╯╱╰╯
*/
const int SERIAL_PORT = 9600;
//======================================================================================================================
//=========================================== Required Functions =======================================================
void print(const String value){
  if (development){
    Serial.print(value);
  }
}

void print(const float value){
  if (development){
    Serial.print(value);
  }
}

void print(const char value[]){
  if (development){
    Serial.print(value);
  }
}

void print(const char value){
  if (development){
    Serial.print(value);
  }
}

void print(const double value){
  if (development){
    Serial.print(value);
  }
}

void print(const long value){
  if (development){
    Serial.print(value);
  }
}

void print(const long long value){
  if (development){
    Serial.print(value);
  }
}

void print(const int value){
  if (development){
    Serial.print(value);
  }
}

void print(const Printable& value){
  if (development){
    Serial.print(value);
  }
}

void println(const String value){
  if (development){
    Serial.println(value);
  }
}

void println(const int value){
  if (development){
    Serial.println(value);
  }
}

void println(const long value){
  if (development){
    Serial.println(value);
  }
}

void println(const float value){
  if (development){
    Serial.println(value);
  }
}

void println(const long long value){
  if (development){
    Serial.println(value);
  }
}

void println(const char value){
  if (development){
    Serial.println(value);
  }
}

void println(const char value[]){
  if (development){
    Serial.println(value);
  }
}

void println(void){
 if (development){
    Serial.println();
  }
}

void println(const Printable& value){
  if (development){
    Serial.println(value);
  }
}


void cprintf(const char *format, ...){
  va_list args;
  if (development){
    char buffer[512]; // adjust buffer size as needed
    va_start(args, format);
    vsnprintf(buffer, sizeof(buffer), format, args);
    va_end(args);
    Serial.print(buffer);
  }
}


void connectWiFi(){
  // Connect to Wi-Fi network
  println("");
  println("");
  print("Connecting to ");
  print(SSID);
  print(".....");

  WiFiMulti.addAP(SSID, PASSWORD);
  WiFiMulti.addAP("Ajays iPhone", "12345678");
  WiFi.mode(WIFI_STA);
  delay(100);

  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(500);
    print(".");
  }
  println("");
  println("Wi-Fi connected successfully");

  print("Connected SSID: ");
  println(WiFi.SSID());
  print("IP address: ");
  println(WiFi.localIP());
  print("RSSI: ");
  println(WiFi.RSSI());
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case WStype_DISCONNECTED:
            cprintf("[WSc] Disconnected! due to : %s\n", payload);
            break;
        case WStype_CONNECTED:
            {
                cprintf("[WSc] Connected to url: %s\n",  payload);
				        webSocket.sendTXT("Connected");
            }
            break;
        case WStype_TEXT:
            cprintf("[WSc] get text: %s\n", payload);
            baseMessageHandler(payload);
            break;
        case WStype_BIN:
            cprintf("[WSc] get binary length: %u\n", length);
            hexdump(payload, length);
            break;
    }

}

bool sendAsBinary(String payload){
  uint8_t data[payload.length() + 1]; // add 1 for null terminator
  strncpy((char*)data, payload.c_str(), sizeof(data));
  return webSocket.sendBIN(data, payload.length() + 1);
}

bool sendMessage(String payload){
  return webSocket.sendTXT(payload);
}

bool log(const String log, const String type = "INFO"){
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["type"] = "log";
  jsonDoc["logType"] = type;
  jsonDoc["logData"] = log;
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  return sendMessage(jsonString);
}

bool sendSensorData(String sensorName, String dataType, float value){
  StaticJsonDocument<200> jsonDoc;
  jsonDoc["type"] = "data";
  jsonDoc["sensorName"] = sensorName;
  jsonDoc["value"] = value;
  jsonDoc["dataType"] = dataType;
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  return sendMessage(jsonString);
}


void sleep(unsigned long milliseconds){
  unsigned long startTime = millis();
  while (millis() - startTime < milliseconds) {
    webSocket.loop();
  }
}

void baseMessageHandler(unsigned char* messagePayload){
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, messagePayload);
  if (error) {
    println("Failed to deserialize JSON");
    return;
  }
  if (doc["statusCode"] == 400){
    print("Bab request got ");
    String message = doc["message"];
    println(message);
  }else{
    onMessageHandler(doc);
  }
}

void setup() {
    // USE_SERIAL.begin(921600);
if (development){
  Serial.begin(115200);

  println();
  println();
  println();

  for(uint8_t t = 4; t > 0; t--) {
      cprintf("[SETUP] BOOT WAIT %d...\n", t);
      Serial.flush();
      delay(1000);
  }
}

  WiFiMulti.addAP("Peaky Blinders", "Boomer@101");

  //WiFi.disconnect();
  while(WiFiMulti.run() != WL_CONNECTED) {
      delay(100);
  }
  const uint8_t* fingerprintBytes = reinterpret_cast<const uint8_t*>(fingerprint);
  String headers = "Machinename: " + MACHINENAME + "\r\n";
  headers += "Organization: " + ORGANIZATION + "\r\n";
  headers += "Machinetoken: " + TOKEN + "\r\n";
  headers += "Origin: " + SERVER_URL;
  char* extraHeaders = new char[headers.length() + 1];
  strcpy(extraHeaders, headers.c_str());
  webSocket.setExtraHeaders(extraHeaders);
  const int startIndex = SERVER_URL.indexOf("//") + 2;
  print(SERVER_URL.substring(startIndex, SERVER_URL.length()));
  const String domain = SERVER_URL.substring(startIndex, SERVER_URL.length());
  webSocket.beginSSL(domain.c_str(), 443, "/arduino/ws");
  webSocket.onEvent(webSocketEvent);
  _setup();
}

void loop() {
    webSocket.loop();
    _loop();
}
/*

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗
╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝
██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗
╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
▀█▀ █▄█ █▀█ █▀▀   █▄█ █▀█ █░█ █▀█   █▀▀ █▀█ █▀▄ █▀▀   █░█ █▀▀ █▀█ █▀▀
░█░ ░█░ █▀▀ ██▄   ░█░ █▄█ █▄█ █▀▄   █▄▄ █▄█ █▄▀ ██▄   █▀█ ██▄ █▀▄ ██▄
*/

void onMessageHandler(StaticJsonDocument<200> jsonPayload){
  if (jsonPayload["command"] == "getip"){
    log(WiFi.localIP().toString());
  }else if (jsonPayload["command"] == "getssid"){
    log(WiFi.SSID());
  }
  else{
    log("No command found", "error");
  }
}

void _setup(){
  /*
    ╭━━━╮╱╱╭╮╱╱╱╱╱╱╱╭━━━╮╱╱╱╱╭╮
    ┃╭━╮┃╱╭╯╰╮╱╱╱╱╱╱┃╭━╮┃╱╱╱╱┃┃
    ┃╰━━┳━┻╮╭╋╮╭┳━━╮┃┃╱╰╋━━┳━╯┣━━╮
    ╰━━╮┃┃━┫┃┃┃┃┃╭╮┃┃┃╱╭┫╭╮┃╭╮┃┃━┫
    ┃╰━╯┃┃━┫╰┫╰╯┃╰╯┃┃╰━╯┃╰╯┃╰╯┃┃━┫
    ╰━━━┻━━┻━┻━━┫╭━╯╰━━━┻━━┻━━┻━━╯
    ╱╱╱╱╱╱╱╱╱╱╱╱┃┃
    ╱╱╱╱╱╱╱╱╱╱╱╱╰╯
  */
}


void _loop(){
  /*
    ╭╮╱╱╱╱╱╱╱╱╱╱╱╱╭━━━╮╱╱╱╱╭╮
    ┃┃╱╱╱╱╱╱╱╱╱╱╱╱┃╭━╮┃╱╱╱╱┃┃
    ┃┃╱╱╭━━┳━━┳━━╮┃┃╱╰╋━━┳━╯┣━━╮
    ┃┃╱╭┫╭╮┃╭╮┃╭╮┃┃┃╱╭┫╭╮┃╭╮┃┃━┫
    ┃╰━╯┃╰╯┃╰╯┃╰╯┃┃╰━╯┃╰╯┃╰╯┃┃━┫
    ╰━━━┻━━┻━━┫╭━╯╰━━━┻━━┻━━┻━━╯
    ╱╱╱╱╱╱╱╱╱╱┃┃
    ╱╱╱╱╱╱╱╱╱╱╰╯
  */
  sleep(500);
  int randomNumber = random(0, 10);
  sendSensorData("heat", "celcius", randomNumber);
}
/*
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████╗███╗░░██╗██████╗░
██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██╔════╝████╗░██║██╔══██╗
╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝█████╗░░██╔██╗██║██║░░██║
██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██████╗██╔══╝░░██║╚████║██║░░██║
╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝╚═════╝███████╗██║░╚███║██████╔╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░╚══════╝╚═╝░░╚══╝╚═════╝░
*/
