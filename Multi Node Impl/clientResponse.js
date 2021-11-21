app.use('/assets', express.static('assets'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get('/', function (req, res) {
    var ipAddr = ip.address()
    res.render(__dirname + "/" + "index.html", { ip: ipAddr });
    console.log("opening index file at: " + ipAddr);

})
//client machine
app.get('/node_response_status', function (req, res) {
    console.log("request received ...");
    var response = {
        ipAddr: ip.address(),
        status: 1
    }
    res.send(response);
})

//
var server = app.listen(3001, function () {
    var host = server.address()
    var port = server.address().port
    console.log(ip.address());
    console.log("Client1 starts on port no 3001");

})