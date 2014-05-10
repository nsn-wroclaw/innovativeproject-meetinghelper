/**
 * Default callback.
 */
 var callback = function(message) {
	//alert(message);
	console.log(message);
 };

/**
 * Default server url.
 */
var common = {
	defaultUrl: 'http://192.168.0.198:1337/api/'
};

/**
 * Webserver get and post links.
 */
 var connectionLinks = {
 	get: {
		ping: 'ping',
		photos: 'getPhotos',
		material: 'materials/file/',
		user: 'user/',
		rooms: {
			all: 'meetings/list',
			data: 'meetings/data'
		}
	},

	post: {
		mac: 'sendMac',
		login: 'login',
		register: 'register',
		rooms: {
			create: 'meetings/create/',
			join: 'meetings/join/'
		},
		file: 'materials/sendFile',
		note: 'materials/sendNote',
		comment: 'materials/sendComment'
	}
};

/**
 * Webserver get and post constant answers.
 */
var connectionAnswers = {
	ping: 'PONG'
};

/**
 * Webserver broadcast messages received by client.
 */
var webSocketBroadcast = {
	pong: 'pong',
	enterRoom: 'joined',
	usersOnline: 'usersOnline',
	allMatetials: 'allMatetials',
	allComments: 'allComments',
	newUser: 'newUser',
	removeUser: 'removeUser',
	newMaterial: 'newMaterial',
	newComment: 'newComment'
};

/**
 * Webclient send events.
 */
var webSocketSend = {
	ping: 'ping',
	connectedUsers: 'users/online',
	enterMeeting: 'meetings/enterMeeting'
};