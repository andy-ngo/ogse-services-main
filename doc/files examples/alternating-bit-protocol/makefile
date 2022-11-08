CC=g++
CFLAGS=-std=c++17

INCLUDECADMIUM=-I C:/Cadmium-Simulation-Environment/cadmium/include
INCLUDEDESTIMES=-I C:/Cadmium-Simulation-Environment/DESTimes/include
INCLUDEWEBEXTENSION=-I D:/Development/cadmium-web-extension/include

#CREATE BIN AND BUILD FOLDERS TO SAVE THE COMPILED FILES DURING RUNTIME
bin_folder := $(shell mkdir -p bin)
build_folder := $(shell mkdir -p build)
results_folder := $(shell mkdir -p simulation_results)

#TARGET TO COMPILE ALL THE TESTS TOGETHER (NOT SIMULATOR)
message.o: data_structures/message.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEWEBEXTENSION) data_structures/message.cpp -o build/message.o

main_top.o: top_model/main.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEWEBEXTENSION) top_model/main.cpp -o build/main_top.o
	
main_subnet_test.o: test/main_subnet_test.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEWEBEXTENSION) test/main_subnet_test.cpp -o build/main_subnet_test.o

main_sender_test.o: test/main_sender_test.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEWEBEXTENSION) test/main_sender_test.cpp -o build/main_sender_test.o

main_receiver_test.o: test/main_receiver_test.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEWEBEXTENSION) test/main_receiver_test.cpp -o build/main_receiver_test.o

tests: main_subnet_test.o main_sender_test.o main_receiver_test.o message.o
		$(CC) -g -o bin/SUBNET_TEST build/main_subnet_test.o build/message.o
		$(CC) -g -o bin/SENDER_TEST build/main_sender_test.o build/message.o 
		$(CC) -g -o bin/RECEIVER_TEST build/main_receiver_test.o build/message.o  

#TARGET TO COMPILE ONLY ABP SIMULATOR
simulator: main_top.o message.o 
	$(CC) -g -o bin/ABP build/main_top.o build/message.o 
	
#TARGET TO COMPILE EVERYTHING (ABP SIMULATOR + TESTS TOGETHER)
all: simulator

#CLEAN COMMANDS
clean: 
	rm -f bin/* build/*