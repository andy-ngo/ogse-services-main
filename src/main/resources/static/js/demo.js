let stompClient;
let output = document.getElementById("received");

document.querySelector("#connect").addEventListener("click", ev => {
    output.value += "Opening connection...\n";

    let uuid = document.querySelector("#uuid").value;
    if (uuid == "") onError(new Error("No UUID provided."));
    else {
    	post("http://localhost:8080/demo", read_value("uuid", "uuid"));
        const socket = new SockJS('/demo-channel');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }
});

const onConnected = (ev) => {
    let uuid = document.querySelector("#uuid").value;
    stompClient.subscribe("/client/results.send", onMessageReceived);
    stompClient.subscribe("/client/results.done", onCompleteReceived);
    stompClient.subscribe("/client/connection.closed", onConnectionClosed);
    stompClient.send("/server/results.ask", {}, JSON.stringify({ uuid: uuid }));
}

const onError = (error) => {
    stompClient.disconnect();
    output.value += error.message;
    console.style.color = 'red';
}

const onMessageReceived = (payload) => {
    output.value += (payload.body);
}

const onCompleteReceived = (payload) => {
    output.value += ("Done receiving simulation messages.\n");
    stompClient.disconnect();
    // TODO: I thought this would trigger a disconnect on the server but it doesn't
}

const onConnectionClosed = (payload) => {
    output.value += ("Connection closed.\n");
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