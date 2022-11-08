This folder contains the ALTERNATE BIT PROTOCOL DEVS model implemented in Cadmium

/**************************/
/****FILES ORGANIZATION****/
/**************************/

README.txt	
alternatebitprotocol.doc
makefile

atomics [This folder contains atomic models implemented in Cadmium]
	receiver.hpp
	sender.hpp
	subnet.hpp
bin [This folder will be created automatically the first time you compile the poject.
     It will contain all the executables]
build [This folder will be created automatically the first time you compile the poject.
       It will contain all the build files (.o) generated during compilation]
data_structures [This folder contains message data structure used in the model]
	message.hpp
	message.cpp
input_data [This folder contains all the input data to run the model and the tests]
	input_abp_0.txt
	input_abp_1.txt
	receiver_input_test.txt
	sender_input_test_ack_In.txt
	sender_input_test_control_In.txt
	subnet_input_test.txt
simulation_results [This folder will be created automatically the first time you compile the poject.
                    It will store the outputs from your simulations and tests]
test [This folder the unit test of the atomic models]
	main_receiver_test.cpp
	main_sender_test.cpp
	main_subnet_test.cpp
top_model [This folder contains the Alternate Bit Protocol top model]	
	main.cpp
	
/*************/
/****STEPS****/
/*************/

0 - alternatebitprotocol.doc contains the explanation of this model

1 - Update include path in the makefile in this folder and subfolders. You need to update the following lines:
	INCLUDECADMIUM=-I ../../cadmium/include
	INCLUDEDESTIMES=-I ../../DESTimes/include
    Update the relative path to cadmium/include from the folder where the makefile is. You need to take into account where you copied the folder during the installation process
	Example: INCLUDECADMIUM=-I ../../cadmium/include
	Do the same for the DESTimes library
    NOTE: if you follow the step by step installation guide you will not need to update these paths.
2 - Compile the project and the tests
	1 - Open the terminal (Ubuntu terminal for Linux and Cygwin for Windows) in the ABP folder
	3 - To compile the project and the tests, type in the terminal:
			make clean; make all
3 - Run subnet test
	1 - Open the terminal in the bin folder. 
	2 - To run the test, type in the terminal "./NAME_OF_THE_COMPILED_FILE" (For windows, "./NAME_OF_THE_COMPILED_FILE.exe"). 
	For this specific test you need to type:
			./SUBNET_TEST (or ./SUBNET_TEST.exe for Windows)
	3 - To check the output of the test, go to the folder simulation_results and open  "subnet_test_output_messages.txt" and "subnet_test_output_state.txt"
4 - To run receiver and sender tests you just need to select the proper executable name in step 3.2
			
5 - Run the top model
	1 - Open the terminal (Ubuntu terminal for Linux and Cygwin for Windows) in the bin folder.
	3 - To run the model, type in the terminal "./NAME_OF_THE_COMPILED_FILE NAME_OF_THE_INPUT_FILE". For this test you need to type:
		./ABP ../input_data/input_abp_1.txt (for Windows: ./ABP.exe ../input_data/input_abp_1.txt)
	4 - To check the output of the model, go to the folder simulation_results and open "abp_output_messasges.txt" and "abp_output_state.txt"
	5 - To run the model with different inputs
		5.1. Create new .txt files with the same structure as input_abp_0.txt or input_abp_1.txt in the folder input_data
		5.2. Run the model using the instructions in step 3
		5.3. If you want to keep the output, rename a"abp_output_messasges.txt" and "abp_output_state.txt". Otherwise it will be overwritten when you run the next simulation.

