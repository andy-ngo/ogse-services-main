package com;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
    @Override
    public void registerStompEndpoints(final StompEndpointRegistry registry)
    {
        registry.addEndpoint("/demo-channel").withSockJS();
    }

    @Override
    public void configureMessageBroker(final MessageBrokerRegistry registry)
    {
        registry.setApplicationDestinationPrefixes("/server");
        registry.enableSimpleBroker("/client");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(500 * 1024);
        registry.setSendBufferSizeLimit(1024 * 1024);
        registry.setSendTimeLimit(20000);
    }
}
