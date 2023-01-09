const webWorker = new Worker('demo.js');
const results = [];

/*
* this function will be used to put the results into an array
* the array will be displayed when a new time frame is reached
* new array will be used for the new time frame results
*/
const onresult = (e) =>
{
    console.log('Message received from main script');
    const workerResults = 'Results: ${e.data[0] * e.data[1]}';
    console.log('Posting message back to main script');

    document.getElementById("demo").innerHTML = results;
    postMessage(workerResults);
}

webWorker.onresult = (e) =>
{
    result.textContent = e.data;
    console.log('Message received from worker');
}

function stopWorker()
{
    webWorker.terminate();
    webWorker = undefined;
}