package com.srm.machinemonitor.Configs;

import com.srm.machinemonitor.Handlers.ArduinoWebSocketHandlers;
import com.srm.machinemonitor.Handlers.WebSocketHandlers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new WebSocketHandlers(), "/ws");
        registry.addHandler(new WebSocketHandlers(), "/ws").withSockJS();

//        registry.addHandler(new ArduinoWebSocketHandlers(), "/arduino/ws").setAllowedOriginPatterns(clientDomain).withSockJS();
//        registry.addHandler(new ArduinoWebSocketHandlers(), "/arduino/ws").setAllowedOriginPatterns(clientDomain);
    }

}
