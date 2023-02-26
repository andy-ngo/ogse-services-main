var exports = {}; //this line gets rid of DOMException stomp script failed to load error
importScripts('https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js');
importScripts('/static/js/stomp.js');
importScripts('/static/js/ogse.js');

var uuid;
var results;   //frame object
var message;   //message object
var timeframe; //the time that will be used as input for Frame object
var first = 1; //represents whether this is first timeframe or not

self.onmessage = function(message) {
    if(message.data.includes('connect')){
        console.log(message);
        let messageArr = message.data.split(',');
        uuid = messageArr[1];
        const socket = new SockJS('/demo-channel');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
}

//TODO: need to repeatedly use send command until entire log file is read or change DemoService
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
    if (payload.body.indexOf(";") == -1 && first == 1){ //first timeframe name received
        timeframe = payload.body;
        results = new ogse.frame(timeframe);
        first = 0;
    } else if (payload.body.indexOf(";") == -1 && first == 0){ //every other timeframe name received
        timeframe = payload.body;
    } else { //any message of timeframe received
        var split = payload.body.split(";").map(d => d.split(","));
        if (split[0].length == 1){ //if first part of array doesn't have comma (state_message)
            message = new ogse.state_message(split[0][0],split[1]);
            results.add_state_message(message);
        } else { //if first part of array has comma (output_message)
            message = new ogse.output_message(split[0][0],split[0][1],split[1]);
            results.add_output_message(message);
        }
    }
}

const onCompleteReceived = (payload) => {
    console.log(results);
    self.postMessage(results);
    //stompClient.disconnect();
    stompClient.connect({}, onConnected, onError);
    results = new ogse.frame(timeframe); //create next frame object for next timeframe
    message = null;
}

const onConnectionClosed = (payload) => {
    self.postMessage("Connection closed.\n");
}
//integrate native websockets into demo
//then try to see if modules can work on webworker
//monday talk about integration into the viewer
//wednesday talk about things that can help with poster