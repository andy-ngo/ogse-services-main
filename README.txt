To setup this project, you need:

- Java JDK (tested on 8 or 11).
- MySQL 5.7
- Maven (tested on 3.8.1)

To build the project run: 
mvn clean install

To run the project after building it: 
mvn spring-boot:run

or you can run it from an IDE as well (IntelIJ preferred). If you see any syntax issues, it is recommended to reimport the project (right click on project folder -> maven -> reload project).
If you are using Eclipse, this link is strongly recommended if you see issues with integrating with Lombok: https://projectlombok.org/setup/eclipse.

If for whatever reason you still can't run the project from your IDE, you can press the "Ctrl" key twice on intelIJ and run the maven commands above to build/run. (this way it will be ran from maven directly).

Hello this is Bruno