var exports = {}; //this line gets rid of DOMException stomp script failed to load error
//import * as SockJS from 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js';
//import * as Stomp from 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';
importScripts('https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js');
importScripts('/static/js/stomp.js');
var uuid;

//maybe have webworker just do stompClient.send("/server/results.ask", {}, JSON.stringify({ uuid: uuid })); command
//and possibly receive?
self.onmessage = function(message) {
    if (message.data.includes('connect')){
        console.log(message);
        let messageArr = message.data.split(',');
        uuid = messageArr[1];
        const socket = new SockJS('/demo-channel');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
}

const onConnected = (ev) => {
    stompClient.subscribe("/client/results.send", onMessageReceived);
    stompClient.subscribe("/client/results.done", onCompleteReceived);
    stompClient.subscribe("/client/connection.closed", onConnectionClosed);
    stompClient.send("/server/results.ask", {}, JSON.stringify({ uuid: uuid }));
}

const onError = (error) => {
    stompClient.disconnect();
    self.postMessage("Error: "+error.message);
}

const onMessageReceived = (payload) => {
    self.postMessage(payload.body+"\n");
}

const onCompleteReceived = (payload) => {
    self.postMessage("Received one timeframe of simulation results.\n");
    stompClient.disconnect();
}

const onConnectionClosed = (payload) => {
    self.postMessage("Connection closed.\n");
}