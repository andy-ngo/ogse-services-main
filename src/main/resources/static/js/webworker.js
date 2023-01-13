const webWorker = new Worker('demo.js');
const resultData = [];
const resultArr = [];

import{
    onMessageReceived
} from "./demo.js"

/*
* this function will be used to put the results into an array
* the array will be displayed when a new time frame is reached
* new array will be used for the new time frame results
*/
function resultRunner()
{
    const results = onMessageReceived;
    const parsedResults = JSON.parse(results);

    if (results.includes(";"))
    {
        resultArr.push(parsedResults);
    }
    else
    {
        resultData.concat(resultArr);
        postMessage(resultArr);
    }
    /*
    console.log('Message received from main script');
    const workerResults = 'Results: ${e.data[0] * e.data[1]}';
    console.log('Posting message back to main script');

    document.getElementById("demo").innerHTML = results;
    postMessage(workerResults);
    */
}

resultRunner();

/*
webWorker.onresult = (e) =>
{
    result.textContent = e.data;
    console.log('Message received from worker');
}
*/

/*
* this function will be used to stop the webworker
*/
function stopWorker()
{
    webWorker.terminate();
    webWorker = undefined;
}