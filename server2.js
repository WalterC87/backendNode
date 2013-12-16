var express = require('express');
var server = express();

var messages = [];
var responses = [];

server.get('/', function ( req, res){
	//res.send('hello world');
	/*setTimeout(function(){
		res.send('hello world');
	},2000);*/
	debugger;
	res.send('hello world');
})

server.get('/supervisor', function (req,res){
	res.send('Corriendo con supervisor');
})

server.get('/messages', function (req,res) {
	responses.push(res);
	//res.send(messages + '<script>setTimeout(function(){window.location.reload()},1000)</script>');
})

server.get('/messages/:message', function (req,res){
	messages.push(req.params.message);
	
	responses.forEach(function(res){
		res.send(messages + '<script> window.location.reload(); </script>');	
	});

	res.send('tu mensaje es ' + req.params.message);
})

server.listen(3000);
