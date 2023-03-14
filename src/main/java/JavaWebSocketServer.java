import java.io.FileNotFoundException;
import java.net.InetSocketAddress;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.io.File;
import java.util.Scanner;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class JavaWebSocketServer extends WebSocketServer {
    private Set<WebSocket> connections = Collections.synchronizedSet(new HashSet<>());
    private Scanner scan = null;

    public JavaWebSocketServer(int port) {
        super(new InetSocketAddress(port));
    }

    @Override
    public void onStart() {
        System.out.println("JavaWebSocketServer started on port " + getPort());
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        connections.add(conn);
        System.out.println("New connection from " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        connections.remove(conn);
        System.out.println("Connection closed: " + reason);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("Received message: " + message);
        String folder = "C:/4thYrProjectWebsite/app-tyler-andy/sample/gis with files/" + message;
        File file = new File(folder);
        String currentTime;
//        if (scan == null) scan = new Scanner(file);
        if (scan == null) {
            try {
                scan = new Scanner(file);
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            }
        }
        String line =  scan.nextLine();
        String[] split = line.split(";");
        currentTime = split[0];
        if (currentTime.equals("time")){ //don't send first line of csv with column definitions
            line = scan.nextLine();
            split = line.split(";");
            currentTime = split[0];
        }
        System.out.println("Timeframe:" + currentTime);
        conn.send(line);
        System.out.println(line);
        do {
            line = scan.nextLine();
            conn.send(line);
            System.out.println(line);
            split = line.split(";");
            if (!currentTime.equals(split[0])){
                System.out.println("One timeframe sent");
                break;
            } else {
                System.out.println(line);
            }
        } while(scan.hasNextLine()); //need to change condition

        if (!scan.hasNextLine()) {
            scan.close();
            System.out.println("EOF");
            conn.send("EOF");
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {
        ex.printStackTrace();
    }

    public static void main(String[] args) {
        JavaWebSocketServer server = new JavaWebSocketServer(85);
        server.start();
    }
}
