app.use('/public', express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function (req, res) {
    var ipAddr = ip.address()
    res.render(__dirname + "/public/" + "index.html", { ip: ipAddr });
    console.log("opening index file at: " + ipAddr);
})
app.get('/get_response_from_client', function (req, res) {
    //console.log("call for client response");
    //console.log(req.query);
    var temp = req.query;
    var host = temp.host;
    var ip = temp.ip;
    const url = "http://" + ip + ":3001/node_response_status";
    request.get(url, (error, response, body) => {
        if (!error) {
            let json = JSON.parse(body);
            json.ipAddr = ip;
            json.host = host;
            //console.log(json);
            res.send(json);
        }
        else {
            error.status = 0;
            error.ipAddr = ip;
            error.host = host;
            //console.log(error);
            res.send(error);
        }
    });
})
var server = app.listen(3001, function () {
    var host = server.address()
    var port = server.address().port
    console.log(ip.address());
    console.log("Master starts on port no 3001");
})
