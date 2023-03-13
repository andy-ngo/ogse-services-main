import MessageState from '../app-framework/data_structures/simulation/message_state.js';
import MessageOutput from '../app-framework/data_structures/simulation/message_output.js';
import Frame from '../app-framework/data_structures/simulation/frame.js';

var ws;

var results;    //frame object
var timeframe;  //time used as input for Frame object
var first = 1; //represents whether this is first timeframe or not

self.onmessage = function(message) {
    if(message.data.includes('connect')){
        console.log(message.data);
        ws = new WebSocket('ws://localhost:85');
        let messageArr = message.data.split(',');
        var logFileName = messageArr[1];
        ws.onopen = () => ws.send(logFileName);
        ws.onmessage = function(payload) {
            if (payload.data == "EOF"){
                console.log(results);
                self.postMessage(results);
            } else {
                console.log(payload.data);
                var split = payload.data.split(";");
                if (split[0] == "time"){ //skip definition of csv columns line
                    continue;
                } else if (split[0] != timeframe && first == 1){ //first timeframe
                    timeframe = split[0];
                    results = new Frame(timeframe);
                    first = 0;
                } else if (split[0] != timeframe && first == 0) { //new timeframe
                    console.log(results);
                    self.postMessage(results);
                    timeframe = split[0];
                    results = new Frame(timeframe);
                    //ws.send(logFileName); //this line will repeat until entire file is complete
                } else {
                    var message;
                    if (split[3]) { //port_name exists (output_message)
                        message = new MessageOutput(split[2], split[3], split[4]);
                        results.add_output_message(message);
                    } else { //state_message
                        message = new MessageState(split[2], split[4]);
                        results.add_state_message(message);
                    }
                }
//                if (payload.data.indexOf(";") == -1 && first == 1){ //first timeframe name received
//                    timeframe = payload.data;
//                    results = new Frame(timeframe);
//                    first = 0;
//                } else if (payload.data.indexOf(";") == -1 && first == 0){ //every other timeframe name received
//                    console.log(results);
//                    self.postMessage(results);
//                    timeframe = payload.data;
//                    results = new Frame(timeframe);
//                    ws.send(data);
//                } else { //any message of timeframe received
//                    var split = payload.data.split(";").map(d => d.split(","));
//                    if (split[0].length == 1){ //if first part of array doesn't have comma (state_message)
//                        message = new MessageState(split[0][0],split[1]);
//                        results.add_state_message(message);
//                    } else { //if first part of array has comma (output_message)
//                        message = new MessageOutput(split[0][0],split[0][1],split[1]);
//                        results.add_output_message(message);
//                    }
//                }
            }
        }
    } else if(message.data.includes('disconnect')) {
        if (ws != null)
            ws.close();
    }
}

const onError = (error) => {
    stompClient.disconnect();
    self.postMessage("Error: "+error.message);
}