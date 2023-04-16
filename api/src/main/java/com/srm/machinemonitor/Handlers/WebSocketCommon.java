package com.srm.machinemonitor.Handlers;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.io.IOException;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public interface WebSocketCommon extends WebSocketMessageBrokerConfigurer {

    Map<BigInteger, JSONObject> sharedCommands = new ConcurrentHashMap<>();
    Map<BigInteger, JSONObject> sharedResult = new ConcurrentHashMap<>();

    default void setSharedCommands(BigInteger organization_id, JSONObject object){
        sharedCommands.put(organization_id, object);
    }

    default Map<BigInteger, JSONObject> getAllSharedCommands(){
        return sharedCommands;
    }

    default JSONObject getSharedCommands(BigInteger organization_id){
        JSONObject response = sharedCommands.getOrDefault(organization_id, new JSONObject());
        sharedCommands.remove(organization_id);
        return response;
    }

    default void setSharedResult(BigInteger organization_id, JSONObject object){
        sharedResult.put(organization_id, object);
    }

    default JSONObject getSharedResult(BigInteger organization_id){
        JSONObject response = sharedResult.getOrDefault(organization_id, new JSONObject());
        sharedResult.remove(organization_id);
        return response;
    }

    default void sendMessage(WebSocketSession session, Map response) throws IOException {
        session.sendMessage(new TextMessage(new JSONObject(response).toString()));
    }

    default void sendBadRequest(WebSocketSession session) throws IOException {
        final Map response = new HashMap();
        response.put("message", "Invalid request");
        response.put("statusCode", 400);
        sendMessage(session, response);
    }

    default JSONObject convertMessage(TextMessage message){
        try{
            return new JSONObject(message.getPayload());
        }catch(JSONException e){
            return new JSONObject();
        }
    }

    default boolean checkForKey(String key, JSONObject payload){
        return payload.has(key);
    }

    default boolean checkForKey(String[] keys, JSONObject payload){
        short validKey = 0;
        for (short i=0; i<keys.length; i++){
            if (payload.has(keys[i])){
                validKey++;
            }
        }
        return validKey == keys.length;
    }
}
