package com.lifecycle.services.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Component
public class WebSocketEventListener
{
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handlesWebSocketConnectListener(final SessionConnectedEvent event)
    {
        LOGGER.info("We have a new connection!");
    }

    @EventListener
    public void webSocketConnectListenerMessage(final String message)
    {
        LOGGER.info(message);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(final SessionConnectedEvent event)
    {
        ModelResults results = new ModelResults();
        sendingOperations.convertAndSend("/client/connection.closed", results);
    }
}
