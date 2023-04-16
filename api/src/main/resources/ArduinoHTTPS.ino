//=========================================== Import Libraries here ====================================================
// Your area


//======================================================================================================================
//=========================================== Don't Touch these values =================================================
#include "ESP8266WiFi.h"
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFiMulti.h>
#include <WiFiClientSecureBearSSL.h>

#define development true

String ORGANIZATION = "<ORGANIZATIONNAME>";
String TOKEN = "<TOKEN>";
const String SERVER_URL = "<DOMAIN_ADDRESS>";
const String MACHINENAME = "<MACHINENAME>";
const char* fingerprint = "<FINGERPRINT>";

std::unique_ptr<BearSSL::WiFiClientSecure> wificlient(new BearSSL::WiFiClientSecure);
HTTPClient https;
ESP8266WiFiMulti WiFiMulti;
//=========================================== END ======================================================================
//======================================================================================================================
//=========================================== WIFI DETAILS =============================================================
const char* SSID = "<SSIDNAME>";
const char* PASSWORD = "<SSIDPASSWORD>";
//=========================================== WIFI DETAILS END =========================================================
//======================================================================================================================
//=========================================== SERIAL PORT ==============================================================
const int SERIAL_PORT = 9600;
//=========================================== SERIAL PORT END ==========================================================
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

void println(const Printable& value){
  if (development){
    Serial.println(value);
  }
}

void printf(const char *format, ...){
  if (development){
    char buffer[128]; // adjust buffer size as needed
    va_list args;
    va_start(args, format);
    vsnprintf(buffer, sizeof(buffer), format, args);
    va_end(args);
    Serial.print(buffer);
  }
}

void debugHttpRequest(HTTPClient& https, int code){
  String responseString = https.getString();
  print("Response code : ");
  print(code);
  print(" Response : ");
  println(responseString);
  if (code == -1){
    print("---Check for the server url ");
    print(SERVER_URL);
    println("---");
  }
}

bool makeRequest(String url){
  https.begin(*wificlient, url);
  https.addHeader("host", SERVER_URL);
  int code = https.GET();
  debugHttpRequest(https, code);
  https.end();
  if (code == 200){
    println("Request sent successfully");
    return true;
  }else{
    println("Error while sending " + String(code));
    return false;
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

String formateData(String data){
  data.replace(" ", "%20");
  data.replace("/", "%2F");
  data.replace("%", "%25");
  return data;
}
// On Webpage log
void log(String log, String logType = "INFO"){
    log = formateData(log);
    String url = SERVER_URL + "/api/log/data?machineName="+ MACHINENAME + "&organization=" + ORGANIZATION + "&token=" + TOKEN + "&logType=" + logType +"&log=" + log;
    makeRequest(url);
}

String dataSenderUrlGenerator(String dataValue, String dataType, String sensorName){
  String url = SERVER_URL + "/api/setter/data?dataValue=" + dataValue + "&dataType=" + dataType + "&machineName=" + MACHINENAME + "&sensorName=" + sensorName + "&organization=" + ORGANIZATION + "&token=" + TOKEN;
  return url;
}

// Datatype like hertz, celcius,
bool sendData(int dataValue, String dataType, String sensorName){
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  return makeRequest(url);
}

bool sendData(float dataValue, String dataType, String sensorName){
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  return makeRequest(url);
}

bool sendData(long dataValue, String dataType, String sensorName){
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  return makeRequest(url);
}

bool sendData(double dataValue, String dataType, String sensorName){
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  return makeRequest(url);
}

bool sendData(long long dataValue, String dataType, String sensorName){
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  return makeRequest(url);
}


//=========================================== Required Functions ENDS ==================================================
//======================================================================================================================

String MODE = "DEV";

//=========================================== Don't Touch ==============================================================
//=========================================== Don't Touch ==============================================================
//=========================================== Don't Touch ==============================================================
void setup() {
  /* Dont remove the below function */
  if (development){
    Serial.begin(SERIAL_PORT);
  }
  connectWiFi();
  wificlient->setFingerprint(fingerprint);
  log("Testing begins", "INFO");
}

void loop() {
    _loop();
}
//=========================================== Don't Touch Above ========================================================
//=========================================== Don't Touch Above ========================================================
//=========================================== Don't Touch Above ========================================================
//======================================================================================================================
//======================================================================================================================
//=========================================== Your code ================================================================

void _setup(){
    MODE = "DEV"; // Change to PROD for Production
    // When MODE is DEV Serial will automatically begin
    // put your setup code here, to run once:
}

void _loop(){
  // put your main code here, to run repeatedly:
    int randomNumber = random(0, 10);
    int sent = sendData(randomNumber, "random", "heat");
    print("Sending data ");
    print(randomNumber);

    print(" result ");
    println(sent);
    delay(1000);
  //Please Don't Send data for every millisecond maximum one data per 30 second
}