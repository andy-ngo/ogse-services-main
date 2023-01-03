let socket = null;
let console = document.querySelector("#console");
let stompClient;

document.querySelector("#connect").addEventListener("click", ev => {
    console.innerHTML = "";
    printLine("Opening connection...");

    const socket = new SockJS('/results-channel');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
});

const onConnected = (ev) => {
    let uuid = document.querySelector("#uuid").value;

    if (uuid == "") onError(new Error("No UUID provided."));

    else {
        stompClient.subscribe("/client/results.send", onMessageReceived);
        stompClient.subscribe("/client/results.done", onCompleteReceived);
        stompClient.subscribe("/client/connection.closed", onConnectionClosed);
        stompClient.send("/server/results.ask", {}, JSON.stringify({ uuid: uuid }));
    }
}

const onError = (error) => {
    stompClient.disconnect();
    printLine(error.message);
    console.style.color = 'red';
}

const onMessageReceived = (payload) => {
    printLine(payload.body+"\n");
    //output.scrollTop = output.scrollHeight;
}

const onCompleteReceived = (payload) => {
    //output.value += ("Received 10 simulation results.\n")
    printLine("Done receiving simulation messages.");
    stompClient.disconnect();
    // TODO: I thought this would trigger a disconnect on the server but it doesn't
}

const onConnectionClosed = (payload) => {
    printLine("Connection closed.");
}

const printLine = (line) => {
    console.innerHTML += `${line}<br>`;
    console.scrollTop = console.scrollHeight;
}

function read_value(id, name, mandatory) {
    const data = new FormData();
	var value = elem(id).value;

	if (value.length == 0 && mandatory) throw new Error("Parameter " + name + " is mandatory.");

	data.append(name, value)
    return data;
}

function post(url, data) {
	return fetch(url, { method: 'post', body: data });
}

/*
use the frontnend to use a timer to keep requesting the results
--> webworkers (similar to parallel)
--> create a new webworker --> call in the html file
    --> create a data structure to hold simulation results
--> object my be held in memory
--> each time a new time frame is
--> main window on creates one frame
--> in worker js create empty array, request from backend, till file done, when ever new frame is reached send array
    --> start another empty array, keep this loop till it is finished
--> as processing lines in backend, use a check to make sure that its a new time frame (has a single digit)
--> on frontend have a way to show that the time frame has finished
--> postMEssage in webworkers: it is used to communicate to the worker,
read up on how streaming is done

/*
function open_websocket(id){
    var uuid = elem(id).value;
    socket = new WebSocket("wss://localhost:8080/demo/connect/" + uuid);
}

socket.onopen = function(e){
    alert('[open] Connection Established');
};

socket.onmessage = function(event){
    alert('[message] Data received from server: ${event.data}');
    document.getElementById("reeceived").value += '${event.data}';
};

socket.onclose = function(event){
    alert('[close] Connection Closed');
};

socket.onerror = function(error){
    alert('[error]');
};

function handle_error(error) {
	alert(error.toString());
}

function elem(id) {
	return document.querySelector("#" + id);
}
*/