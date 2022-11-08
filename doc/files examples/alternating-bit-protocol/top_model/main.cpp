//Cadmium Simulator headers
#include <cadmium/modeling/ports.hpp>
#include <cadmium/modeling/dynamic_model.hpp>
#include <cadmium/modeling/dynamic_model_translator.hpp>
#include <cadmium/engine/pdevs_dynamic_runner.hpp>
#include <cadmium/basic_model/pdevs/iestream.hpp>
#include <cadmium/web/web_logger.hpp>
#include <cadmium/web/web_model.hpp>
#include <cadmium/web/web_results.hpp>
#include <NDTime.hpp>
#include <iostream>
#include <string>
#include <chrono>
// #include <algorithm>

//Messages structures, Atomic model headers
#include "../data_structures/message.hpp"
#include "../atomics/subnet.hpp"
#include "../atomics/sender.hpp"
#include "../atomics/receiver.hpp"

//C++ headers

using namespace std;
using namespace cadmium;
using namespace cadmium::basic_models::pdevs;

using TIME = NDTime;

/***** Define input port for coupled models *****/
struct inp_control : public cadmium::web::web_in_port<int>{};
struct inp_1 : public cadmium::web::web_in_port<Message_t>{};
struct inp_2 : public cadmium::web::web_in_port<Message_t>{};
/***** Define output ports for coupled model *****/
struct outp_ack : public cadmium::web::web_out_port<int>{};
struct outp_1 : public cadmium::web::web_out_port<Message_t>{};
struct outp_2 : public cadmium::web::web_out_port<Message_t>{};
struct outp_pack : public cadmium::web::web_out_port<int>{};

/****** Input Reader atomic model declaration *******************/
template<typename T>
class InputReader_Int : public web::web_iestream_input<int,T> {
public:
    InputReader_Int() = default;
    InputReader_Int(const char* file_path) : web::web_iestream_input<int,T>(file_path) {}
};

int main(int argc, char ** argv) {

    if (argc < 2) {
        cout << "Program used with wrong parameters. The program must be invoked as follow:";
        cout << argv[0] << " path to the input file " << endl;
        return 1; 
    }
    /****** Input Reader atomic model instantiation *******************/
    string input = argv[1];
    const char * i_input = input.c_str();
    shared_ptr<dynamic::modeling::model> input_reader = web::make_web_atomic_model<InputReader_Int, TIME, const char* >("input_reader_1", "input_reader",  move(i_input));

    /****** Sender atomic model instantiation *******************/
    shared_ptr<dynamic::modeling::model> sender1 = web::make_web_atomic_model<Sender, TIME>("sender1", "sender");

    /****** Receiver atomic model instantiation *******************/
    shared_ptr<dynamic::modeling::model> receiver1 = web::make_web_atomic_model<Receiver, TIME>("receiver1", "receiver");

    /****** Subnet atomic models instantiation *******************/
    shared_ptr<dynamic::modeling::model> subnet1 = web::make_web_atomic_model<Subnet, TIME>("subnet1", "subnet");
    shared_ptr<dynamic::modeling::model> subnet2 = web::make_web_atomic_model<Subnet, TIME>("subnet2", "subnet");

    /*******NETWORKS COUPLED MODEL********/
    dynamic::modeling::Ports iports_Network = {typeid(inp_1),typeid(inp_2)};
    dynamic::modeling::Ports oports_Network = {typeid(outp_1),typeid(outp_2)};
    dynamic::modeling::Models submodels_Network = {subnet1, subnet2};
    dynamic::modeling::EICs eics_Network = {
        dynamic::translate::make_EIC<inp_1, Subnet_defs::in>("subnet1"),
         dynamic::translate::make_EIC<inp_2, Subnet_defs::in>("subnet2")
    };
    dynamic::modeling::EOCs eocs_Network = {
        dynamic::translate::make_EOC<Subnet_defs::out,outp_1>("subnet1"),
        dynamic::translate::make_EOC<Subnet_defs::out,outp_2>("subnet2")
    };
    dynamic::modeling::ICs ics_Network = {};

    shared_ptr<web::coupled_web<TIME>> NETWORK;
    NETWORK = make_shared<web::coupled_web<TIME>>(
        "Network1", "Network", submodels_Network, iports_Network, oports_Network, eics_Network, eocs_Network, ics_Network
    );

    /*******ABP SIMULATOR COUPLED MODEL********/
    dynamic::modeling::Ports iports_ABP = {typeid(inp_control)};
    dynamic::modeling::Ports oports_ABP = {typeid(outp_ack),typeid(outp_pack)};
    dynamic::modeling::Models submodels_ABP = {sender1, receiver1, NETWORK};
    dynamic::modeling::EICs eics_ABP = {
        cadmium::dynamic::translate::make_EIC<inp_control, Sender_defs::controlIn>("sender1")
    };
    dynamic::modeling::EOCs eocs_ABP = {
        dynamic::translate::make_EOC<Sender_defs::packetSentOut,outp_pack>("sender1"),
        dynamic::translate::make_EOC<Sender_defs::ackReceivedOut,outp_ack>("sender1")
    };
    dynamic::modeling::ICs ics_ABP = {
        dynamic::translate::make_IC<Sender_defs::dataOut, inp_1>("sender1","Network1"),
        dynamic::translate::make_IC<outp_2, Sender_defs::ackIn>("Network1","sender1"),
        dynamic::translate::make_IC<Receiver_defs::out, inp_2>("receiver1","Network1"),
        dynamic::translate::make_IC<outp_1, Receiver_defs::in>("Network1","receiver1")
    };
    shared_ptr<web::coupled_web<TIME>> ABP;
    ABP = make_shared<web::coupled_web<TIME>>(
        "ABP", "ABP", submodels_ABP, iports_ABP, oports_ABP, eics_ABP, eocs_ABP, ics_ABP
    );


    /*******TOP COUPLED MODEL********/
    dynamic::modeling::Ports iports_TOP = {};
    dynamic::modeling::Ports oports_TOP = {typeid(outp_pack),typeid(outp_ack)};
    dynamic::modeling::Models submodels_TOP = {input_reader, ABP};
    dynamic::modeling::EICs eics_TOP = {};
    dynamic::modeling::EOCs eocs_TOP = {
        dynamic::translate::make_EOC<outp_pack,outp_pack>("ABP"),
        dynamic::translate::make_EOC<outp_ack,outp_ack>("ABP")
    };
    dynamic::modeling::ICs ics_TOP = {
        dynamic::translate::make_IC<web::web_iestream_input_defs<int>::out, inp_control>("input_reader_1","ABP")
    };
    shared_ptr<web::coupled_web<TIME>> TOP;
    TOP = web::make_web_top_model<TIME>(
        "TOP", "top", submodels_TOP, iports_TOP, oports_TOP, eics_TOP, eocs_TOP, ics_TOP
    );

    /*************** Loggers *******************/
    std::string s_out_messages = "../simulation_results/ABP_output_messages.txt";
    static ofstream out_messages(s_out_messages);
    struct oss_sink_messages{
        static ostream& sink(){
            return out_messages;
        }
    };

    std::string s_out_state = "../simulation_results/ABP_output_state.txt";
    static ofstream out_state(s_out_state);
    struct oss_sink_state{
        static ostream& sink(){
            return out_state;
        }
    };

    using state=web::logger<logger::logger_state, web::formatter<TIME>, oss_sink_state>;
    using log_messages=web::logger<logger::logger_messages, web::formatter<TIME>, oss_sink_messages>;
    using global_time_mes=web::logger<logger::logger_global_time, web::formatter<TIME>, oss_sink_messages>;
    using global_time_sta=web::logger<logger::logger_global_time, web::formatter<TIME>, oss_sink_state>;

    using logger_top=web::multilogger<state, log_messages, global_time_mes, global_time_sta>;

    /************** Runner call ************************/ 
    dynamic::engine::runner<NDTime, logger_top> r(TOP, {0});
    r.run_until_passivate();

    // web::output_results(TOP, s_out_state, s_out_messages, "../simulation_results/");

    return 0;
}
