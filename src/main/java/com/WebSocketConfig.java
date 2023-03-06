package com;

import com.lifecycle.services.websocket.WebSocketHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer
{
    @Value("${app.folders.visualizations}")
    private String APP_FOLDERS_VISUALIZATIONS;

    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new WebSocketHandler(APP_FOLDERS_VISUALIZATIONS), "/user");
    }
}
