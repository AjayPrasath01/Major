//=========================================== Import Libraries here ====================================================
// Your area


//======================================================================================================================
//=========================================== Don't Touch these values =================================================
#include "ESP8266WiFi.h"
#include <ESP8266HTTPClient.h>

String ORGANIZATION = "<ORGANIZATIONNAME>";
String TOKEN = "<TOKEN>";
const String SERVER_URL = "<DOMAIN_ADDRESS>";
const String MACHINENAME = "<MACHINENAME>";
bool TESTING = true;
long dataSent = 0;
long timeSlept = 0;
WiFiClient wificlient;
HTTPClient http;
//=========================================== END ======================================================================
//======================================================================================================================
//=========================================== WIFI DETAILS =============================================================
const String SSID = "<SSIDNAME>";
const String PASSWORD = "<SSIDPASSWORD>";
//=========================================== WIFI DETAILS END =========================================================
//======================================================================================================================
//=========================================== SERIAL PORT ==============================================================
const int SERIAL_PORT = 9600;
//=========================================== SERIAL PORT END ==========================================================
//======================================================================================================================
//=========================================== Required Functions =======================================================

void connectWiFi(){
  // Connect to Wi-Fi network
  Serial.println("");
  Serial.println("");
  Serial.print("Connecting to ");
  Serial.print(SSID, true);
  Serial.print(".....");


  WiFi.begin(SSID, PASSWORD);
  WiFi.mode(WIFI_STA);
  delay(100);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Wi-Fi connected successfully");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("RSSI: ");
  Serial.println(WiFi.RSSI());


}

String formateData(String data){
  data.replace(" ", "%20");
  data.replace("/", "%2F");
  data.replace("%", "%25");
  return data;
}
// On Webpage log
void log(String log, String logType){
  log = formateData(log);
  String url = SERVER_URL + "/api/log/data?machineName="+ MACHINENAME + "&organization=" + ORGANIZATION + "&token=" + TOKEN + "&logType=" + logType +"&log=" + log;
  http.begin(wificlient, url);
  http.addHeader("host", SERVER_URL);
  int code = http.GET();
  if (code == 200){
    Serial.println("Log sent successfully");
  }else{
    Serial.println("Error while sending log" + String(code));
  }
  http.end();
  delay(300);
}

String dataSenderUrlGenerator(String dataValue, String dataType, String sensorName){
  String url = SERVER_URL + "/api/setter/data?dataValue=" + dataValue + "&dataType=" + dataType + "&machineName=" + MACHINENAME + "&sensorName=" + sensorName + "&organization=" + ORGANIZATION + "&token=" + TOKEN;
}

void addDataSentInTestIng(){
if (TESTING){
        dataSent += 1;
    }
}
// Datatype like hertz, celcius,
bool sendData(int dataValue, String dataType, String sensorName){
  addDataSentInTestIng();
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  http.begin(wificlient, url);
  http.addHeader("host", SERVER_URL);
  int code = http.GET();
  if (code == 200){
    return true;
  }else{
    return false;
  }
  http.end();
  delay(300);
}

bool sendData(float dataValue, String dataType, String sensorName){
  addDataSentInTestIng();
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  http.begin(wificlient, url);
  http.addHeader("host", SERVER_URL);
  int code = http.GET();
  if (code == 200){
    return true;
  }else{
    return false;
  }
  http.end();
  delay(300);
}

bool sendData(long dataValue, String dataType, String sensorName){
  addDataSentInTestIng();
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  http.begin(wificlient, url);
  http.addHeader("host", SERVER_URL);
  int code = http.GET();
  if (code == 200){
    return true;
  }else{
    return false;
  }
  http.end();
  delay(300);
}

bool sendData(double dataValue, String dataType, String sensorName){
   addDataSentInTestIng();
  String url = dataSenderUrlGenerator(String(dataValue), dataType, sensorName);
  http.begin(wificlient, url);
  http.addHeader("host", SERVER_URL);
  int code = http.GET();
  if (code == 200){
    return true;
  }else{
    return false;
  }
  http.end();
  delay(300);
}

void sleep(long ms){
    if (TESTING){
        timeSlept += ms;
    }
}


//=========================================== Required Functions ENDS ==================================================
//======================================================================================================================

String MODE = "DEV";

//=========================================== Don't Touch ==============================================================
//=========================================== Don't Touch ==============================================================
//=========================================== Don't Touch ==============================================================
void setup() {
  /* Dont remove the below function */
  log("Testing begins", "INFO");
  connectWiFi();
  _setup();
  if (MODE == "DEV"){
      Serial.begin(SERIAL_PORT);
  }
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

  //Please Don't Send data for every millisecond maximum one data per 30 second
}
