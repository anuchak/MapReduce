var mapreduce = require('mapred')();
var fs = require('fs');
var es = require('event-stream');
var arr = [];
var lineNr = 0;
var dataFileName = process.argv[2];
var s = fs.createReadStream("blocks/" + dataFileName)
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s.pause();
        lineNr += 1; // current line no.
        if (lineNr > 1) {
            var lineArr = line.split('\t');
            var temp = [lineArr[1], lineArr[9]];
            arr.push(temp);
        }

        s.resume();
    })
        .on('error', function (err) {
            console.log('Error while reading the main file.', err);
        })
        .on('end', function () {
            callMapreduceFunction(arr);
        })
    );
var map = function (key, value) {
    //console.log("====IN MAP START====");
    //console.log(key);
    //console.log(value);
    var list = [];
    list.push([key, value]);
    // console.log("====IN MAP END====");
    return list;
};
var reduce = function (key, values) {
    //console.log("====IN Reduce START====");
    //console.log(key);
    //console.log(values);
    var sum = 0;
    for (var temp in values) {
        if (values[temp].includes("COVID-19")) {
            //console.log(temp);
            sum++;
        }
        //console.log(sum);
    }

    return (sum);
};
function callMapreduceFunction(arr) {
    mapreduce(arr, map, reduce, function (result) {
        //console.log("sss");
        console.log(result);
    });
}
