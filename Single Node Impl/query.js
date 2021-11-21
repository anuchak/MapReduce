if(typeof require !== 'undefined')
{
    var XLSX = require('xlsx'),
    cluster = require('cluster'),
    //cores = require('os').cpus().length;
    cores = 10;
}

var start = Date.now();

// var workbook = XLSX.readFile('weather.xlsx',{type: 'string', cellDates: true, dateNF: 'dd-mm-yyyy;@'});

// var sheet_name_list = workbook.SheetNames;

// var arr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {raw: false});

// if(cluster.isMaster){
//     console.log("\nTime spent reading files ... " + [Date.now() - now] / 1000 + "\n");
// }


function print(m,ans){
    switch(m)
  
    {
      case '1': 
              console.log('January -> ' + ans.toFixed(2));
              break;
      case '2': 
              console.log('February -> ' + ans.toFixed(2));
              break;
      case '3': 
              console.log('March -> ' + ans.toFixed(2));
              break;
      case '4': 
              console.log('April -> ' + ans.toFixed(2));
              break;
      case '5': 
              console.log('May -> ' + ans.toFixed(2));
              break;
      case '6': 
              console.log('June -> ' + ans.toFixed(2));
              break;
      case '7': 
              console.log('July -> ' + ans.toFixed(2));
              break;
      case '8': 
              console.log('August -> ' + ans.toFixed(2));
              break;
      case '9': 
              console.log('September -> ' + ans.toFixed(2));
              break;
      case '10': 
              console.log('October -> ' + ans.toFixed(2));
              break;
      case '11': 
              console.log('November -> ' + ans.toFixed(2));
              break;
      case '12': 
              console.log('December -> ' + ans.toFixed(2));
              break;
    }
  }

  
var map = function(key, value)
{
  var list = [];
  list.push([key, value]);
  return list;
};

var reduce = function(key, values)
{
  var sum = 0, count = 0;
  values.forEach(function(y) {
    sum += y;
    count++;
  });
  return (sum / count);
};

var mapreduce = function(map, reduce, callback){
    if(cluster.isMaster) {

      for(var i = 0; i < cores; i++) {
            var worker = cluster.fork(), finished = 0, full_intermediate = [];

            worker.on('message', function(msg){
                if(msg.about == 'mapfinish'){
                    full_intermediate = full_intermediate.concat(msg.intermediate);
                }
            });

            worker.on('exit', function(){              
              finished++;
                if(finished == cores){
                  var reduce_time = Date.now();
                    full_intermediate.sort();

                    groups = full_intermediate.reduce(function(res, current){
                        var group = res[current[0]] || [];
                        group.push(current[1]);
                        res[current[0]] = group;
                        return res; 
                    }, {});

                    for(var k in groups){
                        groups[k] = reduce(k, groups[k]);
                    }
                   console.log("\nTime taken by master to reduce ... " + [Date.now() - reduce_time] / 1000 + "\n"); 
                    callback(groups);
                }
            });
        }          
    } 
    else
    {  
        // Child process

      var fileNumber = cluster.worker.id, fileName = "weather_";

      fileName += fileNumber.toString(10) + ".csv";

      var now = Date.now();

      var workbook = XLSX.readFile(fileName,{type: 'string', cellDates: true, dateNF: 'dd-mm-yyyy;@'});
      
      var sheet_name_list = workbook.SheetNames;
      
      var arr = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {raw: false});
      
      console.log("\nTime spent reading files by worker " + cluster.worker.id + " ... " + [Date.now() - now] / 1000 + "\n");
      
      now = Date.now();
      var pieces_processed = 0;
      var mypiece = arr[cluster.worker.id - 1];
      var myintermediate = [];
      
      while(mypiece){
          
          // Map
          
          var key = parseInt(mypiece['Date'].substr(3,2)), value = parseInt(mypiece['MaxTemp']), groups = {};
          myintermediate = myintermediate.concat(map(key, value));            
          
          pieces_processed++;
          mypiece = arr[(cluster.worker.id - 1) + (pieces_processed) * 12];

      }
      
      process.send({
          from: cluster.worker.id, 
          about: 'mapfinish', 
          intermediate: myintermediate
      });
      
      console.log("\nTime taken by " + cluster.worker.id + " to finish map ... " + [Date.now() - now] / 1000 + "\n");
      
      cluster.worker.destroy();
  }
};


mapreduce(map, reduce, function(result){
    //console.log(result);
    var ans1 = Number.NEGATIVE_INFINITY,ans2=Number.MAX_SAFE_INTEGER, hottest_month,coldest_month,hottest_winter_month,coldest_summer_month;
    var ans3=Number.NEGATIVE_INFINITY, ans4=Number.MAX_SAFE_INTEGER;
    //hottest month & coldest month
    for(var k in result)
    {
      if(result[k] > ans1){//hottest month
        ans1 = result[k];
        hottest_month = k;
      }
      if(result[k] < ans2){//coldest month
        ans2 = result[k];
        coldest_month = k;
      }
      if(k==11 || k==12 || k==1 || k==2){//hottest month of winter
        if(result[k] > ans3){
          ans3 = result[k];
          hottest_winter_month = k;
        }
      }
      if(k>=4 && k<=7){//coldest month of summer
        if(result[k] < ans4){
          ans4 = result[k];
          coldest_summer_month = k;
        }
      }
  
    }
    
    
    console.log("Hottest Month is:");
    print(hottest_month,ans1);
    console.log("Coldest Month is:");
    print(coldest_month,ans2);
    console.log("Hottest Winter Month is:");
    print(hottest_winter_month,ans3);
    console.log("Coldest Summer Month is:");
    print(coldest_summer_month,ans4);
    
    var check = Date.now() - start;

    console.log("\nTotal time -> " + check / 1000 + '\n');

  });