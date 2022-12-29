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
    printLine(payload.body);
}

const onCompleteReceived = (payload) => {
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

function elem(id) {
	return document.querySelector("#" + id);
}
*/