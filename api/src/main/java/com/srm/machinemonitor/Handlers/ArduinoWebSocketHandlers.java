package com.srm.machinemonitor.Handlers;

import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import com.srm.machinemonitor.Models.Tables.Log;
import com.srm.machinemonitor.Models.Tables.Machines;
import com.srm.machinemonitor.RateLimiter;
import com.srm.machinemonitor.Services.DataDAO;
import com.srm.machinemonitor.Services.DevDataDAO;
import com.srm.machinemonitor.Services.LogDAO;
import com.srm.machinemonitor.Services.MachinesDAO;
import com.srm.machinemonitor.Utils;
import lombok.AllArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ArduinoWebSocketHandlers extends TextWebSocketHandler implements WebSocketCommon {

    private final RateLimiter rateLimiter = new RateLimiter(1, 500);

    @Autowired
    MachinesDAO machinesDAO;
    @Autowired
    DataDAO dataDAO;
    @Autowired
    DevDataDAO devDataDAO;
    @Autowired
    LogDAO logDAO;

    @Value("${defaultThreadCountArduinoWebsocket}")
    int defaultThreadCountArduinoWebsocket;

    @Value("${maxPoolSizeArduinoWebsocket}")
    int maxPoolSizeArduinoWebsocket;

    @Value("${keepAliveSecondsArduinoWebsocket}")
    int keepAliveSecondsArduinoWebsocket;

    final Map<BigInteger, WebSocketSession> clients = new ConcurrentHashMap<>();


    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(defaultThreadCountArduinoWebsocket);
        registration.taskExecutor().maxPoolSize(maxPoolSizeArduinoWebsocket);
        registration.taskExecutor().keepAliveSeconds(keepAliveSecondsArduinoWebsocket);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            Map<String, Object> details = session.getAttributes();
            final JSONObject payload = convertMessage(message);
            if (checkForKey(Constants.TYPE, payload)){
                switch (payload.getString(Constants.TYPE)) {
                    case "data" -> {
                        String key = details.get(Constants.MACHINETOKEN) + "/" + details.get(payload.getString(Constants.SENSOR_NAME));
                        if (rateLimiter.allow(key)) {
                            BigInteger mchineId = (BigInteger) details.get(payload.getString(Constants.SENSOR_NAME));
                            Machines machine = machinesDAO.findById(mchineId).orElse(null);
                            if (machine == null) {
                                Map<String, String> response = new HashMap<>();
                                response.put("message", "Machine or sensor removed by owner");
                                sendMessage(session, response);
                            } else {
                                LocalDateTime date = LocalDateTime.now();
                                if (machine.getMode().equals(Constants.DEV)) {
                                    DevData data = new DevData();
                                    data.setDate(date);
                                    data.setData_type(payload.getString(Constants.DATATYPE_PAYLOAD));
                                    data.setMachineId(machine.getId());
                                    data.setValue(String.valueOf(payload.get("value")));
                                    devDataDAO.save(data);
                                } else {
                                    Data data = new Data();
                                    data.setDate(date);
                                    data.setData_type(payload.getString(Constants.DATATYPE_PAYLOAD));
                                    data.setMachineId(machine.getId());
                                    data.setValue(String.valueOf(payload.get("value")));
                                    dataDAO.save(data);
                                }
                            }
                        } else {
                            Map<String, String> responseMessage = new HashMap<>();
                            responseMessage.put("message", "Too many request 1 request per 500ms");
                            responseMessage.put("statusCode", "429");
                            sendMessage(session, responseMessage);
                        }
                    }
                    case "log" -> {
                        Log logTable = new Log();
                        String logType = payload.getString(Constants.LOGTYPE);
                        logType = Utils.verifyLogType(logType);
                        String logData = payload.getString(Constants.LOGDATA);
                        logTable.setMachineName((String) details.get(Constants.MACHINE_NAME));
                        logTable.setOrganizationId((BigInteger) details.get(Constants.ORGANIZATION_ID));
                        LocalDateTime time = LocalDateTime.now();
                        String log = time.toString() + " [" + logType + "] " + logData;
                        logTable.setLog(log);
                        logTable.setTime(LocalDateTime.now());
                        if (logData.isBlank()) {
                            sendBadRequest(session, "Log data is blank");
                        }
                        logDAO.save(logTable);
                    }
                    default -> sendBadRequest(session, "Invalid request type");
                }
            }else{
                sendBadRequest(session, "Missing type");
            }
        }
        catch (JSONException e) {
            sendBadRequest(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Map<String, Object> details = session.getAttributes();
        clients.remove((BigInteger) details.get(Constants.ORGANIZATION_ID));
        super.afterConnectionClosed(session, status);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Map<String, Object> details = session.getAttributes();
        clients.put((BigInteger) details.get(Constants.ORGANIZATION_ID), session);
        super.afterConnectionEstablished(session);
    }

    @Scheduled(fixedRate = 500)
    public void commandSender() throws IOException {
        for (Map.Entry<BigInteger, JSONObject> commands : getAllSharedCommands().entrySet()){
            WebSocketSession session = clients.get(commands.getKey());
            Map<String, Object> details = session.getAttributes();
            if (clients.containsKey(commands.getKey())){ // Geting client of the organization
                if (details.get((String) Constants.MACHINENAME).equals(commands.getValue().get(Constants.MACHINENAME))){
                    Map<String, String> passCommand = new HashMap<>();
                    passCommand.put(Constants.COMMAND, (String) commands.getValue().get(Constants.COMMAND));
                    sendMessage(session, passCommand);
                }else{
                    logSetClientNotConnected(details, commands.getValue());
                }
            }else{
                logSetClientNotConnected(details, commands.getValue());
            }
            getAllSharedCommands().remove(commands.getKey());
        }
    }

    public void logSetClientNotConnected(Map<String, Object> details, JSONObject commands){
        Log logTable = new Log();
        String logType = "ERROR";
        String logData = "Can't react the machine either is a problem with connection";
        logTable.setMachineName(commands.getString(Constants.MACHINE_NAME));
        logTable.setOrganizationId((BigInteger) details.get(Constants.ORGANIZATION_ID));
        LocalDateTime time = LocalDateTime.now();
        String log = time.toString() + " [" + logType + "] " + logData;
        logTable.setLog(log);
        logTable.setTime(LocalDateTime.now());
        logDAO.save(logTable);
    }

    public void sendBadRequest(WebSocketSession session, String message) throws IOException {
        final Map response = new HashMap();
        response.put("message", message);
        response.put("statusCode", 400);
        sendMessage(session, response);
    }
}
