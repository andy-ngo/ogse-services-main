@MessageMapping("/chat")
@SendTo("/topic/messages")
public WebSocketController send(message_test message) throws Exception {
    String time = new SimpleDateFormat("HH:mm").format(new Date());
    return new OutputMessage(message.getFrom(), message.getText(), time);
}
