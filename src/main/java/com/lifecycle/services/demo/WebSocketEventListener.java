package com.lifecycle.services.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Component
public class WebSocketEventListener {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handlesWebSocketConnectListener(final SessionConnectedEvent event)
    {
        LOGGER.info("We have a new connection!");
    }

    @EventListener
    public void handleWebSocketDisconnectListener(final SessionConnectedEvent event)
    {
        BasicMessage message = BasicMessage.builder().build();

        // TODO: for some reason, this fires only when a connection is established. The message is not received client
        // TODO: ide through this channel. Possibly because the client is not listening by that point in the init process
        sendingOperations.convertAndSend("/client/connection.closed", message);
    }
}
