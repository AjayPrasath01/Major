package com.srm.machinemonitor.Configs;

import com.srm.machinemonitor.Handlers.ArduinoWebSocketHandShakeHandler;
import com.srm.machinemonitor.Handlers.ArduinoWebSocketHandlers;
import com.srm.machinemonitor.Handlers.WebSocketHandlers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Autowired
    ArduinoWebSocketHandShakeHandler arduinoWebSocketHandShakeHandler;

    @Autowired
    ArduinoWebSocketHandlers arduinoWebSocketHandlers;

    @Autowired
    WebSocketHandlers webSocketHandlers;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandlers, "/ws");
        registry.addHandler(webSocketHandlers, "/ws").withSockJS();
        registry.addHandler(arduinoWebSocketHandlers, "/arduino/ws")
                .setAllowedOriginPatterns("*")
                .setHandshakeHandler(arduinoWebSocketHandShakeHandler);
    }

}
