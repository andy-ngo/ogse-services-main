'use strict';

var ogse = {
	frame: function(time) {
		this.time = time;

		this.messages = {
			output : [],
			state : []
		}
	},
	output_message: function(model, port, value) {
		this.model = model;
		this.port = port;
		this.value = value != undefined ? value : null;
	},

	state_message: function(model, value) {
        this.model = model;
        this.value = value != undefined ? value : null;
    }
}

ogse.frame.prototype.add_message = function(message, type) {
	this.messages[type].push(message);

	return message;
}

ogse.frame.prototype.add_output_message = function(message) {
	return this.add_message(message, "output");
}

ogse.frame.prototype.add_state_message = function(message) {
	return this.add_message(message, "state");
}