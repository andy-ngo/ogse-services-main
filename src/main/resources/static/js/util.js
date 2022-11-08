
function download(name, blob) {
	var href = window.URL.createObjectURL(blob);
	var link = document.createElement('a');

	link.download = name;
	link.href = href;

	document.body.appendChild(link);
	
	link.click();    
	link.remove();   
}

function get_blob(response) {
	if (response.ok) return response.blob();
	
	else return get_error(response);
}

function get_json(response) {
	if (response.ok) return response.json();
	
	else return get_error(response);
}

function get_error(response) {
	return response.json().then(json => { throw new Error(json.message) });
}

function handle_error(error) {
	alert(error.toString());
}

function show_output(id, content) {
	elem(id).innerHTML = content;
	
	elem(id).className = "output code";
}

function post(url, data) {
	return fetch(url, { method: 'post', body: data });
}

function _delete(url, uuid) {
	const data = new FormData();

	data.append("uuid", uuid);

	return fetch(url, { method: 'delete', body: data });
}

function read_files(id, data, name, mandatory) {
	var files = Array.from(elem(id).files);
	
	if (files.length == 0 && mandatory) throw new Error("Parameter " + name + " is mandatory.");
	
	files.forEach(f => data.append(name, f)) ;
}

function read_value(id, data, name, mandatory) {
	var value = elem(id).value;

	if (value.length == 0 && mandatory) throw new Error("Parameter " + name + " is mandatory.");
	
	data.append(name, value)
}

function read_json(id, data, name, mandatory) {
	var value = elem(id).value;
	var json = JSON.parse(value);
	
	data.append(name, json)
}

function read_meta(id_name, id_description, data, name, mandatory) {
	var v_name = elem(id_name).value;
	var v_description = elem(id_description).value;
	
	if (v_name.length == 0 && mandatory) throw new Error("Parameter name is mandatory.");
	
	data.append(name, JSON.stringify({ name: v_name, description: v_description }));
}

function elem(id) {
	return document.querySelector("#" + id);
}