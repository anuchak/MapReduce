const app = express();
app.use('/public', express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function (req, res) {
    var executionProcessStart = getCurrentTimeWt();
    console.log("Start: " + executionProcessStart);
    //URL SHOULD BE : http://localhost:3003/?key=kolkata&file=50.txt&mapred_file=CovidCount.js
    var executionKey = req.query.key;
    var executionKeyIndex;
    var excutionNodeId;
    var nodeMetaFileName;
    var mapredFileName = req.query.mapred_file;
    var nodesDetails = [];
    var fileName = req.query.file;
    var file = fileName.split(".");
    file = file[0];
    //console.log(file);
    var masterFileName = "master_meta/master_meta_" + file + ".json";
    var rawMetaData = fs.readFileSync(masterFileName);
    var metaData = JSON.parse(rawMetaData);
    //console.log(metaData);
    for (var key in metaData['keys']) {
        if (metaData['keys'][key].toLowerCase() == executionKey) {
            executionKeyIndex = key;
        }
    }
    for (var key in metaData['distribution']) {
        if (metaData['distribution'][key]['key_id'] == executionKeyIndex) {
            excutionNodeId = metaData['distribution'][key]['node_id'];
            nodeMetaFileName = metaData['distribution'][key]['client_meta'];
        }
    }
    console.log(executionKeyIndex);
    console.log(excutionNodeId);
    console.log(nodeMetaFileName);
    // read nodes.txt file and make an array of nodes ip and host name
    var nodesDetailsTemp = fs.readFileSync('public/nodes.txt').toString().spli
    t("\n");
    for (var line in nodesDetailsTemp) {
        if (nodesDetailsTemp[line]) {
            var temp = nodesDetailsTemp[line].split(" ");
            var temp1 = {};
            temp1['ip'] = temp[0];
            temp1['host'] = temp[1];
            nodesDetails.push(temp1);
        }
    }
    //console.log(nodesDetails);
    var toSendNodeIP = nodesDetails[excutionNodeId - 1]['ip'];
    console.log(toSendNodeIP);
    //Now send request to the client node allong with the mapred file//
    var formData = {
        client_meta: nodeMetaFileName,
        key_id: executionKeyIndex,
        node_id: excutionNodeId,
        file_name: fs.createReadStream(mapredFileName)
    };
    request.post({
        url: "http://" + toSendNodeIP + ':3003/run', formData: formData
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('sending Failed:', err);
        }
        //console.log(httpResponse);
        console.log(body);
        var executionProcessEnd = getCurrentTimeWt();
        console.log("End: " + executionProcessEnd);
        var execTime = (executionProcessEnd[1] - executionProcessStart[1]) / 100
        0;
        console.log("Time Taken :" + execTime);
        res.send(body + execTime);
    });
    //res.send( executionKeyIndex);
})
app.listen(3003, function () {
    console.log("Listening on port 3003!")
});
function getCurrentTimeWt() { // with out type
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    var inMiliSec = currentdate.getTime();
    return [datetime, inMiliSec];
}