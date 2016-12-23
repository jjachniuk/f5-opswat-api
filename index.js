//this file is the node.js file that get the file from the irule and send it to the cloud of OPSWAT

var http = require('http')
var port = 8001
var Busboy = require('busboy');
var fs = require('fs');
var request = require('request');

var server = http.createServer(function(req, res) 
{
    if (req.method === 'POST') 
    {
        console.log('it is a post');
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) 
        {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
	        var options = 
	        {
                url: 'https://scan.metascan-online.com/v2/file',
                headers: 
                {
                    'apikey': 'change to your apikey'
                }
            };
            request_stream = request.post(options);
            file.pipe(request_stream);
            request_stream.on('response',function(response) 
            {
                console.log(response.statusCode) // 200
                //console.log(JSON.stringify(response));
                response.on('data', function (body) 
                {
                    console.log('BODY: ' + body);
                });
            });
            
            file.on('data', function(data) 
            {
//                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function() 
            {
                console.log('File [' + fieldname + '] Finished');
            });
        });
        busboy.on('finish', function() 
        {
            console.log('Done parsing form!');
            res.writeHead(303, { Connection: 'close', Location: '/' });
            res.end();
        });
    req.pipe(busboy);

    }
   
});


server.listen(port, function() 
{
  console.log('Listening for requests on port ' + port);
});
















