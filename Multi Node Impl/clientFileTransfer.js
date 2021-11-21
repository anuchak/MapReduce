const app = express()
app.use(fileUpload());
app.post('/upload', function (req, res) {
    console.log("Start UPLOAD");
    var startTime = getCurrentTime('start');
    var file_name = req.files.file_name;

    console.log(req.body);

    console.log(file_name.name + " :: " + startTime[0]);
    file_name.mv('blocks/' + file_name.name, function (err) {
        if (err) {
            console.log("error in file uploading");
            return res.status(500).send(err);
        }
        var content = [file_name.name];
        content = JSON.stringify(content);
        fs.appendFile("client_meta/" + req.body.client_meta, content, function (
            err) {
        });
        var endTime = getCurrentTime('end');

        var execTime = (endTime[1] - startTime[1]) / 1000;
        console.log(file_name.name + " ::" + endTime[0]);
        console.log("Time taken: " + execTime);
        console.log("====================================");
        return res.status(200).send('File uploaded!');
    });
});
app.post('/rfupload', function (req, res) {
    console.log("Start RF UPLOAD");
    var startTime = getCurrentTime('start');
    var file_name = req.files.file_name;

    console.log(req.body);

    console.log(file_name.name + " :: " + startTime[0]);
    file_name.mv('blocks/' + file_name.name, function (err) {
        if (err) {
            console.log("error in file uploading");
            return res.status(500).send(err);
        }
        var content = [file_name.name];
        content = JSON.stringify(content);
        fs.appendFile("client_meta/" + req.body.client_meta, content, function (
            err) {
        });
        var endTime = getCurrentTime('end');

        var execTime = (endTime[1] - startTime[1]) / 1000;
        console.log(file_name.name + " ::" + endTime[0]);
        console.log("Time taken: " + execTime);
        console.log("====================================");
        return res.status(200).send('File uploaded!');
    });
});
app.listen(3002, () => console.log('Example app listening on port 3002!'))
function getCurrentTime(type) {
    var currentdate = new Date();
    var datetime = type + " : " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    var inMiliSec = currentdate.getTime();
    return [datetime, inMiliSec];
}