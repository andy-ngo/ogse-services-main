#ifndef BOOST_SIMULATION_MESSAGE_HPP
#define BOOST_SIMULATION_MESSAGE_HPP

#include <assert.h>
#include <iostream>
#include <string>

#include <cadmium/web/output/message_type.hpp>

using namespace std;
using namespace cadmium::web::output;

/*******************************************/
/**************** Message_t ****************/
/*******************************************/
struct Message_t{
  Message_t(){}
  Message_t(int i_packet, int i_bit)
   :packet(i_packet), bit(i_bit){}

  	int   packet;
  	int   bit;

	static message_type get_message_type() {
		vector<string> fields({ "packet", "bit" });
		string description = "packet is ??? and bit is ???";

		return message_type("o_packet", fields, description);
	}
};

istream& operator>> (istream& is, Message_t& msg);

ostream& operator<<(ostream& os, const Message_t& msg);


#endif // BOOST_SIMULATION_MESSAGE_HPP
