var express = require('express.io'),
	swig = require('swig'),
	_ = require('underscore');

var RedisStore = require('connect-redis')(express);

var server = express();
server.http().io(); //corre express y socket.io al mismo tiempo

var users = [];

//definir el sistema de vistas en este caso swig
//se define que compile a html lo que viene de swig
server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views','./app/views');

//cargar archivos estáticos

server.use(express.static('./public'))

// Add POST, Cookies y Sessions

server.configure(function(){
	server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.bodyParser());

	server.use(express.session({
		secret : "locales",
		store  : new RedisStore({})
	}));
});

var isntLoggedIn = function (req,res,next){
	//debugger;
	if(!req.session.user){
		res.redirect('/');
		return;
	}

	next();
};

var isLoggedInd = function (req,res,next){
	if(req.session.user){
		res.redirect('/app');
		return
	}

	next();
};

server.get('/', isLoggedInd, function (req,res){
	res.render('home');
})

//redirect van por default de tipo get

server.get('/app', isntLoggedIn, function (req,res){
	//debugger;
	res.render('app', {
		user : req.session.user,
		users : users
	});

});

server.post('/log-in', function (req,res){
	//res.render('Quien eres');
	users.push(req.body.username);
	server.io.broadcast('log-in', {username : req.session.user});
	req.session.user = req.body.username
	res.redirect('/app');
});

server.get('/log-out', function (req,res){
	//res.render('Quien eres');
	users = _.without(users, req.session.user);
	server.io.broadcast('log-out', {username : req.session.user});
	req.session.destroy();
	res.redirect('/');
});

server.io.route('hello?', function(req){
	req.io.emit('saludo',{
		message: 'serverReady'
	})
})

server.listen(3000);