//var exports = {}; //this line gets rid of DOMException stomp script failed to load error
//importScripts('https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.6.1/sockjs.min.js');
//importScripts('/static/js/stomp.js');
importScripts('/static/js/ogse.js');

var ws;

var uuid;
var results;   //frame object
var timeframe; //the time that will be used as input for Frame object
var first = 1; //represents whether this is first timeframe or not

self.onmessage = function(message) {
    if(message.data.includes('connect')){
        ws = new WebSocket('ws://localhost:8080/user');
    } else if(message.data.includes('disconnect')) {
        if (ws != null)
            ws.close();
    } else if(message.data.includes('request')){
        let messageArr = message.data.split(',');
        uuid = messageArr[1];
        var data = JSON.stringify({'uuid' : uuid});
        ws.send(data);
        ws.onmessage = function(payload) {
            if (payload == "")
                onError(new Error("No UUID provided."));
            else {
                //TODO: possibly change this for accepting exactly one single timeframe
                if (payload.data.indexOf(";") == -1 && first == 1){ //first timeframe name received
                    timeframe = payload.data;
                    results = new ogse.frame(timeframe);
                    first = 0;
                } else if (payload.data.indexOf(";") == -1 && first == 0){ //every other timeframe name received
                    console.log(results);
                    self.postMessage(results);
                    results = new ogse.frame(payload.data);
                } else { //any message of timeframe received
                    var split = payload.data.split(";").map(d => d.split(","));
                    if (split[0].length == 1){ //if first part of array doesn't have comma (state_message)
                        message = new ogse.state_message(split[0][0],split[1]);
                        results.add_state_message(message);
                    } else { //if first part of array has comma (output_message)
                        message = new ogse.output_message(split[0][0],split[0][1],split[1]);
                        results.add_output_message(message);
                    }
                }
            }
        }
    }
}

const onError = (error) => {
    stompClient.disconnect();
    self.postMessage("Error: "+error.message);
}