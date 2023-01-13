const webWorker = new Worker('/static/js/demo.js');
let output = document.getElementById("received");
const results = [];
const temp = 0;

document.querySelector("#connect").addEventListener("click", ev => {
    output.value += "Opening connection...\n";
    let uuid = document.querySelector("#uuid").value;
    if (uuid == "") onError(new Error("No UUID provided."));
    else {
        post("http://localhost:8080/demo", read_value("uuid", "uuid"));
        webWorker.postMessage("connect");
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
    output.value += message.data;
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
/*
* this function will be used to put the results into an array
* the array will be displayed when a new time frame is reached
* new array will be used for the new time frame results
*
const onresult = (e) =>
{
    console.log('Message received from main script');
    const workerResults = 'Results: ${e.data[0] * e.data[1]}';
    console.log('Posting message back to main script');

    document.getElementById("demo").innerHTML = results;
    postMessage(workerResults);
}

webWorker.onresult = (e) =>
{
    result.textContent = e.data;
    console.log('Message received from worker');
}*/

function stopWorker()
{
    webWorker.terminate();
    webWorker = undefined;
}