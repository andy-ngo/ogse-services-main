CC=g++
CFLAGS=-std=c++17

INCLUDECADMIUM=-I C:/Cadmium-Simulation-Environment/cadmium/include
INCLUDEDESTIMES=-I C:/Cadmium-Simulation-Environment/DESTimes/include
INCLUDEJSON=-I C:/Cadmium-Simulation-Environment/cadmium/json/include

#CREATE BIN AND BUILD FOLDERS TO SAVE THE COMPILED FILES DURING RUNTIME
bin_folder := $(shell mkdir -p bin)
build_folder := $(shell mkdir -p build)
results_folder := $(shell mkdir -p simulation_results)

#TARGET TO COMPILE ALL THE TESTS TOGETHER 
EmergencyArea_Test.o: test/EmergencyArea_Test.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEJSON) test/EmergencyArea_Test.cpp -o build/EmergencyArea_Test.o

Hospital_Test.o: test/Hospital_Test.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEJSON) test/Hospital_Test.cpp -o build/Hospital_Test.o

Main.o: top_model/main.cpp
	$(CC) -g -c $(CFLAGS) $(INCLUDECADMIUM) $(INCLUDEDESTIMES) $(INCLUDEJSON) top_model/main.cpp -o build/main.o

Hospital_Test: Hospital_Test.o
	$(CC) -g -o bin/Hospital_Test build/Hospital_Test.o

EmergencyArea_Test: EmergencyArea_Test.o
	$(CC) -g -o bin/EmergencyArea_Test build/EmergencyArea_Test.o
	
Main: Main.o
	$(CC) -g -o bin/Main build/Main.o
	
tests: EmergencyArea_Test Hospital_Test

main: Main

#TARGET TO COMPILE EVERYTHING
all: main

#CLEAN COMMANDS
clean:
	rm -f bin/* build/*

