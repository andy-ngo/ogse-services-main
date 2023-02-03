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
    /*if(message.data.includes(';')) {
        results[temp] = message.data;
        temp++;
    } else {
        for (let i = 0; i < results.length; i++){
            output.value += results[i];
            output.scrollTop = output.scrollHeight;
        }
        results = [];
    }*/
    if(message.data.includes("error")) {
        output.value += message.data;
        output.style.color = 'red';
    } else {
        for (let result of message.data) {
            output.value += (result + "\n");
        }
        output.value += "Received one timeframe of simulation results.\n";
        //output.value += message.data;
    }
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