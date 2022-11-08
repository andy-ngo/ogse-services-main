/**
* Cristina Ruiz Martin
* ARSLab - Carleton University
*
* receiver:
* Cadmium implementation of CD++ Receiver atomic model
*/

#ifndef __RECEIVER_HPP__
#define __RECEIVER_HPP__


#include <cadmium/modeling/ports.hpp>
#include <cadmium/modeling/message_bag.hpp>

#include <limits>
#include <assert.h>
#include <string>

#include <cadmium/web/web_model.hpp>
#include <cadmium/web/output/message_type.hpp>

#include "../data_structures/message.hpp"

using namespace cadmium;
using namespace std;

//Port definition
    struct Receiver_defs{
        struct out : public cadmium::web::web_out_port<Message_t> { };
        struct in : public cadmium::web::web_in_port<Message_t> { };
    };
   
    template<typename TIME>
    class Receiver{
        public:
            //Parameters to be overwriten when instantiating the atomic model
            TIME   preparationTime;
            // default constructor
            Receiver() noexcept{
              preparationTime  = TIME("00:00:10");
              state.ackNum    = 0;
              state.sending     = false;
            }
            
            // state definition
            struct state_type{
              int ackNum;
              bool sending;
            }; 
            state_type state;
            // ports definition
            using input_ports=std::tuple<typename Receiver_defs::in>;
            using output_ports=std::tuple<typename Receiver_defs::out>;

            // internal transition
            void internal_transition() {
              state.sending = false; 
            }

            // external transition
            void external_transition(TIME e, typename make_message_bags<input_ports>::type mbs) { 
                if(get_messages<typename Receiver_defs::in>(mbs).size()>1) 
                    assert(false && "one message per time uniti");
                vector<Message_t> message_port_in;
                message_port_in = get_messages<typename Receiver_defs::in>(mbs);
                state.ackNum = message_port_in[0].bit;
                state.sending = true;                           
            }

            // confluence transition
            void confluence_transition(TIME e, typename make_message_bags<input_ports>::type mbs) {
                internal_transition();
                external_transition(TIME(), std::move(mbs));
            }

            // output function
            typename make_message_bags<output_ports>::type output() const {
              typename make_message_bags<output_ports>::type bags;
              Message_t out_aux;
              out_aux = Message_t(0, state.ackNum);
              get_messages<typename Receiver_defs::out>(bags).push_back(out_aux);
              return bags;
            }

            // time_advance function
            TIME time_advance() const {  
              TIME next_internal;
              if (state.sending) {
                next_internal = preparationTime;
              }else {
                next_internal = std::numeric_limits<TIME>::infinity();
              }    
              return next_internal;
            }

            friend std::ostringstream& operator<<(std::ostringstream& os, const typename Receiver<TIME>::state_type& i) {
                os << i.ackNum;
                return os;
            }

            message_type get_state_message_type() {
            	vector<string> fields({ "ackNum" });
            	string description = "Acknowledgment number.";

            	return message_type("s_receiver", fields, description);
            }
        };     
  

#endif // __RECEIVER_HPP__
