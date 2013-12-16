$(document).ready(function(){
	window.io = io.connect();

	io.on('connect', function(socket){
		console.log('Hello');
		io.emit('hello?'); //enviar msjs al server
	});

	io.on('saludo', function(data){
		console.log(data);
	});

	io.on('log-in', function(data){
		debugger;

		$('#users').append('<li>'+data.username+'</li>');
	})	

	io.on('log-out', function(data){
		debugger;
		$('#users li').each(function (i,item){
			if(item.innerText === data.username){
				$(item).remove();
			}
		})

	})
});