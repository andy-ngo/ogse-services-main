#ifndef BOOST_SIMULATION_MESSAGE_HPP
#define BOOST_SIMULATION_MESSAGE_HPP

#include <assert.h>
#include <iostream>
#include <string>
#include <vector>

#include "../web-extension/output/message_type.hpp"

struct Emergency_t{
	Emergency_t(): area_id(""), port_i(0), quantity(0){}

//	NOTE: I keep this here because the Input Reader (for testing) doesn't support strings, so switch when testing.
//	Emergency_t(int area_id, int port_i, int quantity):
//		area_id(area_id), port_i(port_i), quantity(quantity) {}
//
//		int area_id = area_id;
//		int port_i;
//		int quantity;

	Emergency_t(string area_id, int port_i, int quantity):
		area_id(area_id), port_i(port_i), quantity(quantity) {}

		string area_id = area_id;
		int port_i;
		int quantity;

	static message_type get_message_type() {
		vector<string> fields({ "area_id", "port_i", "quantity" });
		string description = "area_id is the unique identifier of the emergency area, port_i is the port index through which the message was emitted, quantity is the count of emergencies sent with the message.";

		return message_type("o_emergency", fields, description);
	}
};

ostream& operator<<(ostream& os, const Emergency_t& msg) {
	  os << msg.area_id << "," << msg.port_i << "," << msg.quantity;

	  return os;
}

istream& operator>> (istream& is, Emergency_t& msg) {
	is >> msg.area_id;
	is >> msg.port_i;
	is >> msg.quantity;

	return is;
}

#endif // BOOST_SIMULATION_EMERGENCY_HPP
