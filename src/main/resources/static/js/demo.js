importScripts('https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js');// Stomp from 'https://cdnjs.cloudflare.com/ajax/libs/stomp.js/2.3.3/stomp.min.js';
importScripts('https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.4.0/sockjs.min.js');// SockJS from 'https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.4.0/sockjs.min.js';
//let output = document.getElementById("received");

//maybe have webworker just do stompClient.send("/server/results.ask", {}, JSON.stringify({ uuid: uuid })); command
//and possibly receive? but how would it do that when webworker thread can't access SockJS socket or Stomp libraries.
self.onmessage = function(message) {
    if (message.data.includes('connect')){
        console.log(message);
        //const socket = new SockJS('/demo-channel');
        stompClient = Stomp.over(new SockJS('/demo-channel'));
        stompClient.connect({}, onConnected, onError);
    }
}

/*document.querySelector("#connect").addEventListener("click", ev => {
    output.value += "Opening connection...\n";

    let uuid = document.querySelector("#uuid").value;
    if (uuid == "") onError(new Error("No UUID provided."));
    else {
    	post("http://localhost:8080/demo", read_value("uuid", "uuid"));
        const socket = new SockJS('/demo-channel');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
});*/

const onConnected = (ev) => {
    let uuid = document.querySelector("#uuid").value;
    stompClient.subscribe("/client/results.send", onMessageReceived);
    stompClient.subscribe("/client/results.done", onCompleteReceived);
    stompClient.subscribe("/client/connection.closed", onConnectionClosed);
    stompClient.send("/server/results.ask", {}, JSON.stringify({ uuid: uuid }));
}

const onError = (error) => {
    stompClient.disconnect();
    self.postMessage("Error: "+error.message);
    //output.value += error.message;
    //output.style.color = 'red';
}

const onMessageReceived = (payload) => {
    //output.value += (payload.body+"\n");
    self.postMessage(payload.body+"\n");
    //output.scrollTop = output.scrollHeight;
}

const onCompleteReceived = (payload) => {
    //output.value += ("Received 10 simulation results.\n");
    self.postMessage("Received 10 simulation results.\n");
    stompClient.disconnect();
}

const onConnectionClosed = (payload) => {
    //output.value += ("Connection closed.\n");
    self.postMessage("Connection closed. \n");
}

function read_value(id, name) {
    const data = new FormData();
	var value = 3;//document.getElementById(id).value;

	if (value.length == 0) throw new Error("Parameter " + name + " is empty.");

	data.append(name, value)
    return data;
}

function post(url, data) {
	return fetch(url, { method: 'post', body: data });
}