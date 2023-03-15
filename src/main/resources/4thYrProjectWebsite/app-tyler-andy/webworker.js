//import MessageState from '../app-framework/data_structures/simulation/message-state.js';
//import MessageOutput from '../app-framework/data_structures/simulation/message-output.js';
//import Frame from '../app-framework/data_structures/simulation/frame.js';
//import Simulation from '../app-framework/data_structures/simulation/simulation.js';

var ws;

var frame = { //frame json object
    type: 'frame-ready',
    time: null,
    state_messages: [],
    output_messages: []
};
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
                console.log(frame);
                self.postMessage(frame);
                frame = { type: 'simulation-ready' };
                console.log(frame);
                self.postMessage(frame);
            } else {
                //console.log(payload.data);
                var split = payload.data.split(";");
                if (first == 1){ //first timeframe
                    frame.time = split[0];
                    first = 0;
                    addMessage(payload.data);
                } else if (split[0] != frame.time && first == 0) { //new timeframe
                    console.log(frame);
                    self.postMessage(frame);
                    frame = {
                        type: 'frame-ready',
                        time: null,
                        state_messages: [],
                        output_messages: []
                    };
                    frame.time = split[0];
                    addMessage(payload.data);
                    ws.send(logFileName); //this line will repeat until entire file is complete
                } else {
                    addMessage(payload.data);
                }
            }
        }
    } else if(message.data.includes('disconnect')) {
        if (ws != null)
            ws.close();
    }
}

const addMessage = (data) => { //TODO: need to figure out how to organize new csv file into output and state message
    var split = data.split(";").map(d => d.split(","));
    if (split[3] != "") { //port_name exists (output_message)
        frame.output_messages.push([split[2], split[3], split[4]]);
    } else { //state_message
        frame.state_messages.push([split[2], split[4]]);
    }
}

//var split = payload.data.split(";").map(d => d.split(","));
//if (split[0].length == 1){ //if first part of array doesn't have comma (state_message)
//    message = new MessageState(split[0][0],split[1]);
//    frame.add_state_message(message);
//} else { //if first part of array has comma (output_message)
//    message = new MessageOutput(split[0][0],split[0][1],split[1]);
//    frame.add_output_message(message);
//}