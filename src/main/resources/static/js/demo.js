var ws;
const webWorker = new Worker('/static/js/webworker.js');
const results = [];
const temp = 0;

function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
}

function connect() {
	ws = new WebSocket('ws://localhost:8080/user');
	ws.onmessage = function(data) {
	    if (data == "") onError(new Error("No UUID provided."));
	    else
	    {
	        //post("http://localhost:8080/demo", read_value("uuid","uuid"));
	        webWorker.postMessage("connect," + uuid);
	        sendResults(data.data);
	    }

	}
	setConnected(true);
}

function disconnect() {
	if (ws != null) {
		ws.close();
	}
	setConnected(false);
	console.log("Websocket is disconnected");
}

function sendData() {
	var data = JSON.stringify({
		'uuid' : $("#uuid").val()
	})
	ws.send(data);
}

function sendResults(message) {
	$("#resultsmessage").append(message + "\n");
}

function read_value(id,name)
{
    const data = new FormData();
    var value = document.getElementById(id).value;

    if(value.length ==0) throw new Error("Parameter " + name + " is empty.");

    data.append(name, value);
    return data;
}
/*
function post(url,data)
{
    return fetch(url, {method: 'post',body: data });
}

*/
function stopWorker()
{
    webWorker.terminate();
    webWorker = undefined;
}

$(function() {
	$("form").on('submit', function(e) {
		e.preventDefault();
	});
	$("#connect").click(function() {
		connect();
	});
	$("#disconnect").click(function() {
		disconnect();
	});
	$("#send").click(function() {
		sendData();
	});
});