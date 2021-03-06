var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(response, request) {
	console.log("Request handler 'start' was called. ");

	var body = '<html>'+
	    '<head>'+
	    '<meta http-equiv="Content-Type" '+
	    'content="text/html; charset=UTF-8" />'+
	    '</head>'+
	    '<body>'+
	    '<form action="/upload" enctype="multipart/form-data" '+
	    'method="post">'+
	    '<input type="file" name="upload">'+
	    '<input type="submit" value="Upload file" />'+
	    '</form>'+
	    '</body>'+
	    '</html>';

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();

	// function sleep(milliSeconds) {
	// 	var startTime = new Date().getTime();
	// 	while (new Date().getTime() < startTime + milliSeconds);
	// }

	// sleep(10000);

}

function upload(response, request) {
	console.log("Request handler 'upload' was called. ");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	form.parse(request, function(error, fields, files) {
		console.log("parsing done");
		response.writeHead(200, {"Content-Type": "text/html"});

		if (files.upload == undefined) { // user does not upload a file
			response.write("did not upload a file");
		} 
		else {
			fs.renameSync(files.upload.path, "./test.png");
			response.write("received image:<br/>");
			response.write("<img src='/show' />");
		}
		response.end();
	});
}

function show(response, request) {
	console.log("Request handler 'show' was called");
	fs.readFile("./test.png", "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} 
		else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

exports.start = start;
exports.upload = upload;
exports.show = show;