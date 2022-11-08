/**
* Cristina Ruiz Martin
* ARSLab - Carleton University
*
* Subnet:
* Cadmium implementation of CD++ Subnet atomic model
*/

#ifndef _SUBNET_HPP__
#define _SUBNET_HPP__

#include <cadmium/modeling/ports.hpp>
#include <cadmium/modeling/message_bag.hpp>

#include <limits>
#include <assert.h>
#include <string>
#include <random>

#include <cadmium/web/web_model.hpp>
#include <cadmium/web/output/message_type.hpp>

#include "../data_structures/message.hpp"

using namespace cadmium;
using namespace std;

//Port definition
struct Subnet_defs{
    struct out : public cadmium::web::web_out_port<Message_t> {};
    struct in : public cadmium::web::web_in_port<Message_t> {};
};

template<typename TIME> class Subnet{
    public:
    // ports definition
    using input_ports=tuple<typename Subnet_defs::in>;
    using output_ports=tuple<typename Subnet_defs::out>;
    // state definition
    struct state_type{
        bool transmitting;
        Message_t packet;
        int index;
    }; 
    state_type state;    
    // default constructor
    Subnet() {
        state.transmitting = false;
        state.index        = 0;
    }     
    // internal transition
    void internal_transition() {
        state.transmitting = false;  
    }
    // external transition
    void external_transition(TIME e, typename make_message_bags<input_ports>::type mbs) { 
        vector<Message_t> bag_port_in;
        bag_port_in = get_messages<typename Subnet_defs::in>(mbs);
        if(bag_port_in.size()>1) assert(false && "One message at a time");                
        state.index ++;
        if ((double)rand() / (double) RAND_MAX  < 0.95){                
            state.packet = bag_port_in[0];
            state.transmitting = true;  
        }else{
            state.transmitting = false;
        }                              
    }
    // confluence transition
    void confluence_transition(TIME e, typename make_message_bags<input_ports>::type mbs) {
        internal_transition();
        external_transition(TIME(), move(mbs));
    }
    // output function
    typename make_message_bags<output_ports>::type output() const {
        typename make_message_bags<output_ports>::type bags;
        vector<Message_t> bag_port_out;            
        bag_port_out.push_back(state.packet);
        get_messages<typename Subnet_defs::out>(bags) = bag_port_out; 
        return bags;
    }
    // time_advance function
    TIME time_advance() const {
        TIME next_internal;
        if (state.transmitting) {            
            next_internal = TIME("00:00:03:000");
        }else {
            next_internal = numeric_limits<TIME>::infinity();
        }    
        return next_internal;
    }

    friend ostringstream& operator<<(ostringstream& os, const typename Subnet<TIME>::state_type& i) {
        os << i.index << "," << i.transmitting;
        return os;
    }

    message_type get_state_message_type() {
    	vector<string> fields({ "index", "transmitting" });
    	string description = "index is something, transmitting is something else";

    	return message_type("s_subnet", fields, description);
    }
};    
#endif // _SUBNET_HPP__
