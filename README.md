# ogse-services

SETUP:

Use Windows IIS Manager to host [4thYrProjectWebsite folder](/src/main/resources/4thYrProjectWebsite) as a website and [one time setup] initialize a .json MIME type, /application/json.

Change line 41 of [JavaWebSocketServer.java](/src/main/java/JavaWebSocketServer.java) such that the folder path is correct with your system. 

Add [libraries](/src/main/java/lib) necessary to run file into project structure. File->Project Structure->Modules->Dependencies->Add the 2 jar files.

Run JavaWebSocketServer.java to act as the backend server that communicates the data through a websocket connection.

Open browser and enter following URL to see final product. 

[http://localhost:81/app-tyler-andy/index.html?viz=./sample/gis%20with%20files/visualization.json](http://localhost:82/app-tyler-andy/index.html?viz=./sample/gis%20with%20files/visualization.json)
