var count = 0;
const webWorker = new Worker('/static/js/webworker.js', {type: 'module'});

//TODO: convert webworker to module
//TODO: work on poster for poster fair and send draft to prof
//TODO:

function setConnected(connected) {
	$("#connect").prop("disabled", connected);
	$("#disconnect").prop("disabled", !connected);
	$("#send").prop("disabled", !connected);
}

function connect() {
    webWorker.postMessage("connect");
	setConnected(true);
	$("#resultsmessage").append("Connection has started.\n");
}

function disconnect() {
    webWorker.postMessage("disconnect");
	setConnected(false);
	$("#resultsmessage").append("Connection has ended.\n");
}

function sendData() {
    webWorker.postMessage("request,"  + $("#uuid").val());
}

webWorker.onmessage = function(message) {
    //TODO: reading frame object messages instead
	$("#resultsmessage").append(count + ": " + message + "\n");
	count = count + 1;
	document.getElementById("resultsmessage").scrollTop = document.getElementById("resultsmessage").scrollHeight;
}

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