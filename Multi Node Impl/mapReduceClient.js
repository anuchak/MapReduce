const app = express();
app.use(fileUpload());
app.use('/public', express.static('public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.post('/run', function (req, res) {

    var client_meta = req.body.client_meta;
    var key_id = req.body.key_id;
    var node_id = req.body.node_id;
    var mr_file_name = req.files.file_name;
    // res.send(client_meta);
    // store the execution file
    mr_file_name.mv(mr_file_name.name, function (err) {
        if (err) {
            console.log("error in mr file storing")
            return res.status(500).send(err);
        }
        // get the data file name form client meta file
        console.log("mr program code upload success");
        var clientMetaFileName = "client_meta/" + client_meta;
        var rawClientMetaData = fs.readFileSync(clientMetaFileName);
        var clientMetaData = JSON.parse(rawClientMetaData);
        var blockFileName = clientMetaData[0];
        // pass the data file name by argv
        // command should be :: node CovidCount.js 1.txt //

        var mr_output = exec("node " + mr_file_name.name + " " + blockFileName, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);

            return res.status(200).send(stdout);
        });
        console.log("All Complete");
        // console.log(mr_output);
        //return mr_output;
    })
    //res.send();
})
app.listen(3003, function () {
    console.log("Listening on port 3003!")
});