package com.srm.machinemonitor.Handlers;

import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Other.BaseData;
import com.srm.machinemonitor.Models.Other.CustomUserDetails;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.Log;
import com.srm.machinemonitor.Models.Tables.Machines;
import com.srm.machinemonitor.Models.Tables.MlModels;
import com.srm.machinemonitor.Modes;
import com.srm.machinemonitor.Services.*;
import lombok.AllArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.adapter.standard.StandardWebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.math.BigInteger;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import org.json.JSONException;
import org.springframework.web.util.UriComponentsBuilder;


@Component
public class WebSocketHandlers extends TextWebSocketHandler implements WebSocketCommon {

    @Autowired(required = true)
    DataDAO dataDAO;

    @Autowired(required = true)
    LogDAO logDAO;

    @Autowired(required = true)
    MachinesDAO machinesDAO;

    @Autowired
    DevDataDAO devDataDAO;

    @Autowired
    MlModelDAO mlModelDAO;

    @Value("${defaultThreadCountWebpageWebsocket}")
    int defaultThreadCountWebpageWebsocket;

    @Value("${maxPoolSizeWebpageWebsocket}")
    int maxPoolSizeWebpageWebsocket;

    @Value("${keepAliveSecondsWebpageWebsocket}")
    int keepAliveSecondsWebpageWebsocket;

    @Value("${MlServer}")
    String MlServer;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(defaultThreadCountWebpageWebsocket);
        registration.taskExecutor().maxPoolSize(maxPoolSizeWebpageWebsocket);
        registration.taskExecutor().keepAliveSeconds(keepAliveSecondsWebpageWebsocket);
    }


    final static List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    final static Map<String, ConcurrentHashMap> clientsMap = new ConcurrentHashMap<>();

    final static Map<String, ConcurrentHashMap> clientLogSubscribe = new ConcurrentHashMap<>();

    final static Map<String, ConcurrentHashMap> clientDataSubscribe = new ConcurrentHashMap<>();

//    final static List<Map> clients = new CopyOnWriteArrayList<>();

    final static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        /*
        Subscribing here
        JsonObject should have values like lastDataTime, machineName, sensorName
         */
        try {
            final JSONObject payload = convertMessage(message);
            final Map response = new HashMap();
            Map clientDetails = clientsMap.get(session.getId());
            if(checkForKey(Constants.LOGSUBSCRIBED, payload)){
                if (payload.getBoolean(Constants.LOGSUBSCRIBED)){
                    clientDetails.remove(Constants.LASTSENTVALUE);
                    if (checkForKey(Constants.MACHINENAME, payload)){
                        clientDetails.put(Constants.MACHINENAME, payload.get(Constants.MACHINENAME));
                        clientLogSubscribe.put(session.getId(), (ConcurrentHashMap) clientDetails);
                        System.out.println("Length of Log subscribtion websocket " + clientLogSubscribe.size());
                        response.put("message", "Subscribed to log data");
                        response.put("statusCode", 200);
                        sendMessage(session, response);
                        System.out.println("Subscribed to log");
                    }else{
                        response.put("message", "Machine name is missing");
                        response.put("statusCode", 400);
                        sendMessage(session, response);
                    }
                }else{
                    clientLogSubscribe.remove(session.getId());
                    clientsMap.get(session.getId()).remove(Constants.LASTSENTVALUE);
                    System.out.println("UnSubscribed to log");
                }
            }else if(checkForKey(Constants.DATASUBSCRIBED, payload)){
                if (payload.getBoolean(Constants.DATASUBSCRIBED)){
                    if (checkForKey(new String[]{Constants.MACHINENAME, Constants.SENSOR, Constants.STARTDATE, Constants.ENDDATE, Constants.ISALIVE, Constants.MODE}, payload)){
                        clientDetails.put(Constants.MACHINENAME, payload.get(Constants.MACHINENAME));
                        clientDetails.put(Constants.SENSOR, payload.get(Constants.SENSOR));
                        clientDetails.put(Constants.STARTDATE, payload.get(Constants.STARTDATE));
                        clientDetails.put(Constants.ENDDATE, payload.get(Constants.ENDDATE));
                        clientDetails.put(Constants.ISALIVE, payload.get(Constants.ISALIVE));
                        clientDetails.put(Constants.ISHANDLED, false);
                        clientDetails.put(Constants.MODE, payload.get(Constants.MODE));
                        clientDetails.remove(Constants.MODELKEY);
                        clientDetails.put(Constants.DATASUBSCRIBED, payload.getBoolean(Constants.DATASUBSCRIBED));
//                    Machines machine = machinesDAO.getIdByMachineNameAndSensorsAndOrganizationId((String) payload.get(Constants.MACHINENAME), (String) payload.get(Constants.SENSOR), (int) clientDetails.get(Constants.ORGANIZATION_ID));
                        if (payload.getBoolean(Constants.ISALIVE)){
                            clientDataSubscribe.put(session.getId(), (ConcurrentHashMap) clientDetails);
                        }else{
                            clientDataSubscribe.remove(session.getId());
                        }
                    }else{
                        sendBadRequest(session);
                    }
                }else{
                    clientDataSubscribe.remove(session.getId());
                }
            } else if (checkForKey(new String[]{Constants.IsArduinoCommand, Constants.MACHINENAME, Constants.ORGANIZATION_NAME}, payload)){
                JSONObject command = new JSONObject();
                command.put(Constants.MACHINENAME, payload.get(Constants.MACHINENAME));
                command.put(Constants.COMMAND, payload.get(Constants.COMMAND));
                setSharedCommands((BigInteger) clientDetails.get(Constants.ORGANIZATION_ID), command);
            }
            else {
                sendBadRequest(session);
            }
        }catch (JSONException e){
        sendBadRequest(session);
            System.out.println(e);
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        ConcurrentHashMap<String, Object> sessionDetails = new ConcurrentHashMap();
        if ((UsernamePasswordAuthenticationToken)session.getPrincipal() != null){
            sessionDetails.put(Constants.USERNAME, ((CustomUserDetails)((UsernamePasswordAuthenticationToken)session.getPrincipal()).getPrincipal()).getUsername());
            sessionDetails.put(Constants.ORGANIZATION_ID, ((CustomUserDetails)((UsernamePasswordAuthenticationToken)session.getPrincipal()).getPrincipal()).getOrganizationId());
            sessionDetails.put(Constants.ROLE, ((CustomUserDetails)((UsernamePasswordAuthenticationToken)session.getPrincipal()).getPrincipal()).getRole());
            sessionDetails.put(Constants.SESSION, session);
            clientsMap.put(session.getId(), sessionDetails);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        clientsMap.remove(session.getId());
        clientLogSubscribe.remove(session.getId());
        clientDataSubscribe.remove(session.getId());
    }

    @Scheduled(fixedRate = 500)
    public void HandleRequest() throws IOException {
        for (ConcurrentHashMap clientDetails : clientsMap.values()){
            try {
                if (clientDetails.containsKey(Constants.ISHANDLED) && !(boolean)clientDetails.get(Constants.ISHANDLED)){
                    Machines machines = machinesDAO.findByMachineNameAndSensorsAndOrganizationId((String) clientDetails.get(Constants.MACHINENAME), (String) clientDetails.get(Constants.SENSOR), (BigInteger) clientDetails.get(Constants.ORGANIZATION_ID));
                    LocalDateTime startDate = parseLocalDateTime((String) clientDetails.get(Constants.STARTDATE));
                    LocalDateTime endDate = null;
                    if ((boolean)clientDetails.get(Constants.ISALIVE)){
                        endDate = LocalDateTime.now();
                    }else{
                        endDate = parseLocalDateTime((String) clientDetails.get(Constants.ENDDATE));
                    }
                    List datas = null;
                    if (Objects.equals((String) clientDetails.get(Constants.MODE), String.valueOf(Modes.DEV).toLowerCase())){
                        datas = devDataDAO.getDataBetweenTimeWithMachineId(machines.getId(), startDate, endDate);
                    }else{
                        datas = dataDAO.getDataBetweenTimeWithMachineId(machines.getId(), startDate, endDate);
                    }
                    if ((boolean)clientDetails.get(Constants.ISALIVE)){
                        if (datas.size() > 0){
                            updateLastDataValue(clientDetails, datas);
                        }else{
                            updateLastDataValue(clientDetails, endDate);
                        }
                    }
                    clientDetails.put(Constants.MACHINEID, machines.getId());
                    final Map response = new HashMap();
                    response.put("data", datas);
                    response.put("newData", true);
                    sendToChart(response, clientDetails);
                    clientDetails.put(Constants.ISHANDLED, true);
                }
            }catch(DateTimeParseException e){
                System.out.println(e);
                sendBadRequest((WebSocketSession) clientDetails.get(Constants.SESSION));
                // To make it invalid request
                clientDetails.remove(Constants.ISHANDLED);
            }
        }
    }

    @Scheduled(fixedRate = 1000)
    public void PredictCondition() throws IOException {
        for (ConcurrentHashMap clientDetails : clientDataSubscribe.values()){
            System.out.println("Prediction");
            if (clientDetails.containsKey(Constants.ISALIVE) && (boolean) clientDetails.get(Constants.ISALIVE) && !clientDetails.containsKey(Constants.MODELKEY)){
                System.out.println("Prediction 2");
                Machines machines = machinesDAO.findByMachineNameAndSensorsAndOrganizationId((String) clientDetails.get(Constants.MACHINENAME), (String) clientDetails.get(Constants.SENSOR), (BigInteger) clientDetails.get(Constants.ORGANIZATION_ID));
                List<MlModels> mlModels = mlModelDAO.findAllByMchineIdsLike("%" + String.valueOf(machines.getId()) + "%");
                String modelKey = "";
                if (mlModels.size() > 0){
                    modelKey = mlModels.get(0).getModelKey();
                }
                if (!modelKey.isBlank()){
                    clientDetails.put(Constants.MODELKEY, modelKey);
                }
            }else{
                Machines machines = machinesDAO.findByMachineNameAndSensorsAndOrganizationId((String) clientDetails.get(Constants.MACHINENAME), (String) clientDetails.get(Constants.SENSOR), (BigInteger) clientDetails.get(Constants.ORGANIZATION_ID));
                Map<String, Object> params = new HashMap<>();
                params.put(Constants.MODELKEY, (String) clientDetails.get(Constants.MODELKEY));
                params.put(Constants.MODE, (String) clientDetails.get(Constants.MODE));
                params.put("machineIds", machines.getId());
                try {
                    ResponseEntity result = requestMLServerToPredict(params);
                    Map<String, Object> data = new HashMap<>();
                    data.put("prediction", result.getBody());
                    sendToMl(data, clientDetails);
                    System.out.println(result);
                } catch (Exception e) {
                    Map<String, Object> data = new HashMap<>();
                    data.put("prediction", 2);
                    sendToMl(data, clientDetails);
                    System.out.println(e);
                }
            }
        }
    }

    @Scheduled(fixedRate = 500)
    public void DataSheduledSender() throws IOException {
        for (ConcurrentHashMap clientDetails : clientDataSubscribe.values()){
            if (clientDetails.containsKey(Constants.ISHANDLED) && clientDetails.containsKey(Constants.LASTDATATIME) && clientDetails.containsKey(Constants.MODE) && (boolean)clientDetails.get(Constants.ISHANDLED) && (boolean)clientDetails.get(Constants.ISALIVE)){
                List datas = null;
                if (Objects.equals((String) clientDetails.get(Constants.MODE), String.valueOf(Modes.DEV).toLowerCase())){
                    datas = devDataDAO.findAllByMachineIdAndDateGreaterThanOrderByDateAsc((BigInteger)clientDetails.get(Constants.MACHINEID), (LocalDateTime) clientDetails.get(Constants.LASTDATATIME));
                }else{
                    datas = dataDAO.findAllByMachineIdAndDateGreaterThanOrderByDateAsc((BigInteger)clientDetails.get(Constants.MACHINEID), (LocalDateTime) clientDetails.get(Constants.LASTDATATIME));
                }
                if (datas.size() > 0){
                    updateLastDataValue(clientDetails, datas);
                    final Map response = new HashMap();
                    response.put("data", datas);
                    sendToChart(response, clientDetails);
                }
            }
        }
    }

    @Scheduled(fixedRate = 500)
    public void LogSheduledSender() throws IOException {
        for (ConcurrentHashMap clientDetails : clientLogSubscribe.values()){
            LocalDateTime lastValueTime = null;
            if (clientDetails.containsKey(Constants.LASTSENTVALUE)){
                lastValueTime = (LocalDateTime) clientDetails.get(Constants.LASTSENTVALUE);
            }else{
                LocalDateTime dateTime = LocalDateTime.of(2023, 3, 2, 0, 0, 0, 0);
                // Possible smallest dateTimeValue
                lastValueTime = dateTime.withHour(0).withMinute(0).withSecond(0).withNano(0);
            }
            List<Log> logs = logDAO.findAllLogByMachineNameAndOrganizationIdANDTimeGte((String) clientDetails.get(Constants.MACHINE_NAME), (BigInteger) clientDetails.get(Constants.ORGANIZATION_ID), lastValueTime);
            final Map res = new HashMap();
            if (logs != null && logs.size() > 0){
                clientDetails.put(Constants.LASTSENTVALUE, LocalDateTime.now());
                res.put(Constants.DATA, logs);
                res.put(Constants.TO, "logConsole");
                sendMessage((WebSocketSession) clientDetails.get(Constants.SESSION), res);
            }
        }
    }

    private ResponseEntity requestMLServerToPredict(Map<String, Object> queryParams){
        RestTemplate restTemplate = new RestTemplate();
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(MlServer + "/learner/predict");
        for (String key : queryParams.keySet()) {
            builder.queryParam(key, queryParams.get(key));
        }

        String url = builder.toUriString();
        return restTemplate.getForEntity(url, String.class);
    }

    private LocalDateTime parseLocalDateTime(String dateTime){
        try{
            DateTimeFormatter formatter = new DateTimeFormatterBuilder()
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("HH:mm:ss yyyy-MM-dd "))
                    .appendOptional(DateTimeFormatter.ofPattern("HH:mm:ss yyyy/MM/dd "))
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"))
                    .appendOptional(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS"))
                    .toFormatter();
            return LocalDateTime.parse(dateTime, formatter);
        }catch(DateTimeParseException e){
            Instant instant = Instant.parse(dateTime);
            return instant.atZone(ZoneId.systemDefault()).toLocalDateTime();
        }
    }

    private void sendToChart(Map response, Map clientDetails) throws IOException {
        response.put(Constants.TO, "charts");
        sendMessage((WebSocketSession) clientDetails.get(Constants.SESSION), response);
    }

    private void sendToMl(Map response, Map clientDetails) throws IOException {
        response.put(Constants.TO, Constants.ML);
        sendMessage((WebSocketSession) clientDetails.get(Constants.SESSION), response);
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        Map response = new HashMap();
        response.put("message", "transporterror");
        sendMessage(session,response);
    }

    private void updateLastDataValue(ConcurrentHashMap clientDetails, List datas){
        clientDetails.put(Constants.LASTDATATIME, ((BaseData)datas.get(datas.size() - 1)).getDate());
    }

    private void updateLastDataValue(ConcurrentHashMap clientDetails, LocalDateTime date){
        clientDetails.put(Constants.LASTDATATIME, date);
    }

//    @Scheduled(fixedRate = 1000)
//    public void streamData() throws IOException {
//        /*
//        Message will be sent from here
//        depending on the message recieved
//         */
//        for (int i=0; i<clients.size(); i++){
//            final Map currentClient = clients.get(i);
//            final List<Data> dataToSent = dataDAO.getDataFromDateSensor((LocalDateTime) currentClient.get("lastData"),
//                    (String) currentClient.get("machineName"),
//                    (String) currentClient.get("sensorName"));
//                final WebSocketSession session = (WebSocketSession) currentClient.get("session");
//                if (dataToSent.size() > 0){
//                    final Map d = new HashMap<>();
//                    final List<LocalDateTime> x = new ArrayList<>();
//                    final List<Double> y = new ArrayList<>();
//                    final List<String> dataType = new ArrayList<>();
//                    for (Data data : dataToSent){
//                        x.add(data.getDate());
//                        y.add(Double.valueOf(data.getValue()));
//                        dataType.add(data.getData_type());
//                    }
//                    d.put("X", x);
//                    d.put("Y", y);
//                    d.put("xAxis", "DateTime");
//                    d.put("yAxis", dataToSent.get(0).getData_type());
//                    d.put("dataType", dataType);
//                    d.put("chartType", machinesDAO.getChartType((String) currentClient.get("machineName")));
//                    d.put("isNewData", currentClient.get("firstRequest"));
//                    currentClient.put("firstRequest", false);
//
//                    System.out.println(dataToSent);
//                    session.sendMessage(new TextMessage(new JSONObject(d).toString()));
//                    currentClient.put("lastData", dataToSent.get(dataToSent.size()-1).getDate());
//                }else{
//                    if (currentClient.containsKey("firstRequest")){
//                        if ((boolean) currentClient.get("firstRequest")){
//                            currentClient.put("firstRequest", false);
//                            final Map d = new HashMap<>();
//                            d.put("X", new ArrayList<>());
//                            d.put("Y", new ArrayList<>());
//                            d.put("dataType", new ArrayList<>());
//                            d.put("chartType", machinesDAO.getChartType((String) currentClient.get("machineName")));
//                            d.put("isNewData", true);
//                            d.put("xAxis", "DateTime");
//                            session.sendMessage(new TextMessage(new JSONObject(d).toString()));
//                        }
//                    }
//                }
//        }
//    }
}
