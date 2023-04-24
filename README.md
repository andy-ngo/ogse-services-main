# ogse-services

SETUP:

Use Windows IIS Manager to host [4thYrProjectWebsite folder](/src/main/resources/4thYrProjectWebsite) as a website.

Change line 41 of [JavaWebSocketServer.java](/src/main/java/JavaWebSocketServer.java) such that the folder path is correct with your system. 

Run JavaWebSocketServer.java to act as the backend server that communicates the data through a websocket connection.

Open browser and enter following URL to see final product. 

[http://localhost:81/app-tyler-andy/index.html?viz=./sample/gis%20with%20files/visualization.json](http://localhost:82/app-tyler-andy/index.html?viz=./sample/gis%20with%20files/visualization.json)
