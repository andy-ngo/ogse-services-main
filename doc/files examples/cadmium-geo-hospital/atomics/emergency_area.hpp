
#ifndef _EMERGENCY_GENERATOR_HPP__
#define _EMERGENCY_GENERATOR_HPP__
/*
#include <limits>
#include <assert.h>
#include <random>
#include <cmath>
*/
#include <string>
#include <iostream>
#include <vector>
#include <nlohmann/json.hpp>

#include "../web-extension/web_ports.hpp"
#include "../web-extension/web_tools.hpp"

#include "../data_structures/emergency.hpp"

using namespace cadmium;

using json = nlohmann::json;


//Port definition
struct EmergencyArea_defs{
    struct rejected_1 : public web::in_port<Emergency_t> {};
    struct out_1 : public web::out_port<Emergency_t> {};
    struct out_2 : public web::out_port<Emergency_t> {};
    struct out_3 : public web::out_port<Emergency_t> {};
};

// model parameters
struct EmergencyArea_params {
	string id = ""; 		// geo area id
	int population = 0;			// population count for geo area
	int emergency_max = 0;		// maximum number of emergency patients in one output
	int n_ports = 0;			// number of connected hospitals
};

template<typename TIME> 
class EmergencyArea{
    public:

    // ports definition
    using output_ports = tuple<typename EmergencyArea_defs::out_1,
    									EmergencyArea_defs::out_2,
										EmergencyArea_defs::out_3>;

	using input_ports = tuple<typename EmergencyArea_defs::rejected_1>;

    struct state_type {
		int dead = 0;				// number of dead population
		int port_i = 1;				// next hospital to be targeted, by index
		int quantity = 0;
    };

    state_type state;
    EmergencyArea_params params;

    EmergencyArea();

    EmergencyArea(EmergencyArea_params ext_params) {
    	params = ext_params;

		// generate an initial count for the first emergency to output.
    	// It will be output before the first internal transition
		state.quantity = web::tools::Random(1, params.emergency_max);
	}

    static EmergencyArea_params params_from_feature(json j) {
		struct EmergencyArea_params p;

		// 1.9 is a bit, high from surface research, according to Ottawa Hospital rates, it should be more like 1.6
		// But areas generate emergencies with some random factor.
		float rate = 1.9 / 1000;

		p.id = j.at("properties").at("dauid").get<string>();
		p.population = j.at("properties").at("DApop_2016").get<int>();
		p.n_ports = 3;
		p.emergency_max = web::tools::round_to_int(rate * p.population);

		return p;
    }

    void external_transition(TIME e, typename make_message_bags<input_ports>::type mbs) {
    	const Emergency_t * p_em = NULL;

    	// One area can be linked to max 3 hospitals through separate ports. However, one hospital may be
    	// linked back to a variable number of areas. Since the number of ports varies and Cadmium doesn't
    	// support variable number of ports, each hospital rejects emergencies to all connected areas.
    	// Therefore, a model can receive multiple rejections simultaneously but, only one should target
    	// the current area at a given time because processing in hospitals is instantaneous.
		for(const auto &i : get_messages<typename EmergencyArea_defs::rejected_1>(mbs)) {
			if (i.area_id != params.id) continue;

			// Should only receive one emergency targeted to this area per time unit.
			assert(!p_em);

			p_em = &i;
		}

		if (!p_em) return;

    	// Emergency was only partially processed, the remaining must be sent to another port if possible.
        state.quantity = p_em->quantity;
    	state.port_i++;
    }

    void internal_transition() {

    	if (state.quantity == 0 && params.emergency_max > 0) {
    		state.port_i = 1;
    		state.quantity = rand() % (params.emergency_max) + 1;
    	}

    	else if (state.port_i > params.n_ports) {
			state.dead += state.quantity;
    		state.port_i = 1;
    		state.quantity = 0;
    	}

    	else {
    		state.quantity = 0;
    	}


    	/*
    	if (!state.active && params.n_ports == 0) {
			state.dead += state.quantity;
    	}

    	else if (!state.active) {
    		state.active = true;
    		state.port_i = 1;
    		state.quantity = rand() % (params.emergency_max - 1) + 1;
    	}

    	else {
    		state.active = false;
    	}*/
    }

    // output function
    typename make_message_bags<output_ports>::type output() const {
    	typename make_message_bags<output_ports>::type bags;

    	// Check that there is an emergency and that there is a hospital left to send it to
    	if (state.quantity == 0 || state.port_i > params.n_ports) return bags;

    	// This model sends the message to the first port. If it is rejected, then it'll try the second port
    	// To do this, we track the current port in the state.target variable. A value of -1 indicates that
    	// it was rejected by all ports. We set the value to 0 to start the cycle.

    	Emergency_t em = Emergency_t(params.id, state.port_i, state.quantity);

		if (state.port_i == 1) get<message_bag<typename EmergencyArea_defs::out_1>>(bags).messages.push_back(em);
		else if (state.port_i == 2) get<message_bag<typename EmergencyArea_defs::out_2>>(bags).messages.push_back(em);
		else if (state.port_i == 3) get<message_bag<typename EmergencyArea_defs::out_3>>(bags).messages.push_back(em);

		return bags;
    }
	
    TIME time_advance() const {
    	if (state.quantity > 0) return TIME("0:00:00:000");

    	// In 24h, the model outputs the emergency
    	else return TIME("24:00:00:000");
    }

    void confluence_transition(TIME e, typename make_message_bags<input_ports>::type mbs) {
		internal_transition();
        external_transition(TIME(), move(mbs));
    }

    friend ostringstream& operator<<(ostringstream& os, const typename EmergencyArea<TIME>::state_type& i) {
        os << i.dead;

		return os;
    }

    message_type get_state_message_type() {
    	vector<string> fields({ "dead" });
    	string description = "Number of deaths due to rejected emergencies.";

    	return message_type("s_area", fields, description);
    }
};    
#endif // _EMERGENCYGENERATOR_HPP_
