#include <iostream>
#include <string>
#include <vector>
#include <NDTime.hpp>
#include <nlohmann/json.hpp>

#include "../web-extension/json.hpp"
#include "../web-extension/web_logger.hpp"
#include "../web-extension/web_ports.hpp"
#include "../web-extension/web_model.hpp"
#include "../web-extension/web_results.hpp"
#include "../web-extension/web_tools.hpp"

#include "../atomics/emergency_area.hpp"
#include "../atomics/hospital.hpp"
#include "../data_structures/emergency.hpp"

// NOTE: THIS IS FOR MY SPECIFIC MODEL, NOT NEEDED FOR STUDENTS
using json = nlohmann::json;

int main(){
	try {
	    web::Ports iports_TOP = {};
	    web::Ports oports_TOP = {};
	    web::EICs eics_TOP = {};
	    web::EOCs eocs_TOP = {};
	    web::ICs ics_TOP = {};
	    web::Models submodels_TOP = {};

	    // NOTE: THIS IS FOR MY SPECIFIC MODEL, NOT NEEDED FOR STUDENTS
		json hospitals = web::tools::read_geojson("D:/Data/Geo Hospital 2/output/Gatineau/hospitals.geojson");
		json areas = web::tools::read_geojson("D:/Data/Geo Hospital 2/output/Gatineau/emergency_areas.geojson");

		map<string, EmergencyArea_params> m_areas;
		map<string, Hospital_params> m_hospitals;

		// NOTE: I BUILD MODELS BASED ON THE GEOJSON FILES ABOVE, STUDENTS WOULD BUILD MODELS THE NORMAL WAY
		for (auto& f : areas.at("features")) {
			struct EmergencyArea_params p = EmergencyArea<NDTime>::params_from_feature(f);
			string id = p.id;
			m_areas[id] = p;

			// NOTE: SLIGHT DIFFERENCE HERE, THERE'S A SECOND PARAMETER TO THE CALL TO MAKE AN ATOMIC MODEL. THAT PARAMETER IS A STRING IDENTIFYING THE MODEL TYPE.
			submodels_TOP.push_back(web::make_web_atomic_model<EmergencyArea, NDTime, EmergencyArea_params>(id, "area", move(p)));
		}

		for (auto& f : hospitals.at("features")) {
			struct Hospital_params p = Hospital<NDTime>::params_from_feature(f);
			string id = p.id;
			m_hospitals[id] = p;

			// NOTE: SLIGHT DIFFERENCE HERE, THERE'S A SECOND PARAMETER TO THE CALL TO MAKE AN ATOMIC MODEL. THAT PARAMETER IS A STRING IDENTIFYING THE MODEL TYPE.
			submodels_TOP.push_back(web::make_web_atomic_model<Hospital, NDTime, Hospital_params>(id, "hospital", move(p)));
		}

		// NOTE: I BUILD COUPLINGS BASED ON THE GEOJSON FILES ABOVE, STUDENTS WOULD LINK MODELS THE NORMAL WAY
		for (auto& f : areas.at("features")) {
			string area_id = f.at("properties").at("dauid").get<string>();
			string hospitals = f.at("properties").at("hospitals").get<string>();
			vector<string> split = web::tools::split(web::tools::trim(hospitals), ',');

			EmergencyArea_params area = m_areas[area_id];

			Hospital_params h1 = m_hospitals[split[0]];
			Hospital_params h2 = m_hospitals[split[1]];
			Hospital_params h3 = m_hospitals[split[2]];

			ics_TOP.push_back(web::make_IC<EmergencyArea_defs::out_1, Hospital_defs::processor_in>(area.id, h1.id));
			ics_TOP.push_back(web::make_IC<EmergencyArea_defs::out_2, Hospital_defs::processor_in>(area.id, h2.id));
			ics_TOP.push_back(web::make_IC<EmergencyArea_defs::out_3, Hospital_defs::processor_in>(area.id, h3.id));

			ics_TOP.push_back(web::make_IC<Hospital_defs::processor_out, EmergencyArea_defs::rejected_1>(h1.id, area.id));
			ics_TOP.push_back(web::make_IC<Hospital_defs::processor_out, EmergencyArea_defs::rejected_1>(h2.id, area.id));
			ics_TOP.push_back(web::make_IC<Hospital_defs::processor_out, EmergencyArea_defs::rejected_1>(h3.id, area.id));
		}

		// NOTE: SLIGHT DIFFERENCE HERE, THERE'S A SECOND PARAMETER TO THE CALL TO MAKE AN COUPLED/TOP MODEL. THAT PARAMETER IS A STRING IDENTIFYING THE MODEL TYPE.
	    std::shared_ptr<web::coupled_web<NDTime>> TOP;
		TOP	= web::make_web_top_model<NDTime>("gis_emergencies_1", "gis_emergencies", submodels_TOP, iports_TOP, oports_TOP, eics_TOP, eocs_TOP, ics_TOP);

		// NOTE: THERE'S A DEFAULT PATH, THIS IS ONLY TO WRITE TO ANOTHER PATH
	    web::out_messages = std::ofstream("../simulation_results/output_messages_2.txt");
	    web::out_state = std::ofstream("../simulation_results/state_messages_2.txt");

		// NOTE: CALLING THE RUNNER SAME AS USUAL, DIFFERENT NAMESPACE
	    web::runner<NDTime, web::logger_top> r(TOP, {0});

	    r.run_until(NDTime("2400:00:00:000"));

		// NOTE: CALL TO GENERATE THE OUTPUT FILES IN THE VIEWER FORMAT
	    web::output_results(TOP, "../simulation_results/");
	}
	catch (const exception& e) {
		cerr << e.what();
	}

    return 0;
}
