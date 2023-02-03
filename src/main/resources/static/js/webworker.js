var exports = {}; //this line gets rid of DOMException stomp script failed to load error
//import * as SockJS from 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js';
//import * as Stomp from 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';
importScripts('https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js');
importScripts('/static/js/stomp.js');
var uuid;
var results = [];

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
    results.push(payload.body);
    //self.postMessage(payload.body+"\n");
}

const onCompleteReceived = (payload) => {
    //TODO: need to sort array since even though websocket is TCP connection not receiving lines in order
    //TODO: (may be due to Stomp https://github.com/jmesnil/stomp-websocket/issues/108)
    //console.log(results.sort(function(a, b){return a-b}));
    self.postMessage(results);
    //self.postMessage("Received one timeframe of simulation results.\n");
    stompClient.disconnect();
    results = [];
}

const onConnectionClosed = (payload) => {
    self.postMessage("Connection closed.\n");
}