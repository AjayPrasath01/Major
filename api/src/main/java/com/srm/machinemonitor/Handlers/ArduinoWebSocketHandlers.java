package com.srm.machinemonitor.Handlers;

import com.srm.machinemonitor.Constants;
import com.srm.machinemonitor.Models.Tables.Data;
import com.srm.machinemonitor.Models.Tables.DevData;
import com.srm.machinemonitor.Models.Tables.Machines;
import com.srm.machinemonitor.RateLimiter;
import com.srm.machinemonitor.Services.DataDAO;
import com.srm.machinemonitor.Services.DevDataDAO;
import com.srm.machinemonitor.Services.MachinesDAO;
import lombok.AllArgsConstructor;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class ArduinoWebSocketHandlers extends TextWebSocketHandler implements WebSocketCommon {

    private final RateLimiter rateLimiter = new RateLimiter(1, 500);

    @Autowired
    MachinesDAO machinesDAO;
    @Autowired
    DataDAO dataDAO;
    @Autowired
    DevDataDAO devDataDAO;

    @Value("${defaultThreadCountArduinoWebsocket}")
    int defaultThreadCountArduinoWebsocket;

    @Value("${maxPoolSizeArduinoWebsocket}")
    int maxPoolSizeArduinoWebsocket;

    @Value("${keepAliveSecondsArduinoWebsocket}")
    int keepAliveSecondsArduinoWebsocket;


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
            System.out.println(payload);
            String key = details.get(Constants.MACHINETOKEN) + "/" + details.get(payload.getString(Constants.SENSOR_NAME));
            if (rateLimiter.allow(key)){
                BigInteger mchineId = (BigInteger) details.get(payload.getString(Constants.SENSOR_NAME));
                Machines machine = machinesDAO.findById(mchineId).orElse(null);
                if (machine == null){
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Machine or sensor removed by owner");
                    sendMessage(session, response);
                }else{
                    LocalDateTime date = LocalDateTime.now();
                    if (machine.getMode().equals(Constants.DEV)){
                        DevData data = new DevData();
                        data.setDate(date);
                        data.setData_type(payload.getString(Constants.DATATYPE_PAYLOAD));
                        data.setMachineId(machine.getId());
                        data.setValue(String.valueOf(payload.get("value")));
                        devDataDAO.save(data);
                    }else{
                        Data data = new Data();
                        data.setDate(date);
                        data.setData_type(payload.getString(Constants.DATATYPE_PAYLOAD));
                        data.setMachineId(machine.getId());
                        data.setValue(String.valueOf(payload.get("value")));
                        dataDAO.save(data);
                    }
                }
            }else{
                Map<String, String> responseMessage = new HashMap<>();
                responseMessage.put("message", "Too many request 1 request per 500ms");
                responseMessage.put("statusCode", "429");
                sendMessage(session, responseMessage);
            }
            System.out.println(payload);
        }
        catch (JSONException e) {
            sendBadRequest(session);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed");
        super.afterConnectionClosed(session, status);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println(session);
        System.out.println("Contention ");
        super.afterConnectionEstablished(session);
    }
}
