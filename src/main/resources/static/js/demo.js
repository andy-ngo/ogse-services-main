let socket = new WebSocket("wss://localhost:8080/demo/connect/1234");

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