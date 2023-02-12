//import Frame from '/static/js/frame.js';
//import Message from '/static/js/message.js';
const webWorker = new Worker('/static/js/webworker.js');
let output = document.getElementById("received");
const results = [];
const temp = 0;

document.querySelector("#connect").addEventListener("click", ev => {
    output.value += "Opening connection...\n";
    let uuid = document.querySelector("#uuid").value;
    if (uuid == "") onError(new Error("No UUID provided."));
    else {
        post("http://localhost:8080/demo", read_value("uuid", "uuid"));
        webWorker.postMessage("connect," + uuid);
    }
});

webWorker.onmessage = function(message) {
    output.value += message.data + "\n";
    output.value += "Received one timeframe of simulation results.\n";
    output.scrollTop = output.scrollHeight;
}

function read_value(id, name) {
    const data = new FormData();
	var value = document.getElementById(id).value;

	if (value.length == 0) throw new Error("Parameter " + name + " is empty.");

	data.append(name, value)
    return data;
}

function post(url, data) {
	return fetch(url, { method: 'post', body: data });
}

function stopWorker()
{
    webWorker.terminate();
    webWorker = undefined;
}