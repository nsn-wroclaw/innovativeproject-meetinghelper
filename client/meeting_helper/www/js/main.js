var t_serverData = {
	totalRecords: 0,
	data: []
};

var t_myData = {
        data: []
};

var t_onlineUser = {
	numberOfOnlineUsers: 0,
        user: []
	/*id: [],
	name: [],
	surname: [],
	login: []*/
};

var me = {
	id: undefined,
	chosedRoomToEnter: undefined,
	enteredRoom: undefined
};

/**
 * Funkcje, od których oczekujemy odpowiedzi, wywołujemy,
 * podając w nich jako argument funkcję, która ma zostać wywołana
 * po otrzymaniu oczekiwanych danych.
 */
var main = {
	/**
	 * Robi zdjęcie, wysyła na serwer i wyświetla na wallu.
	 * @param {Number} quality
	 * Jakość wykonywanego zdjęcia z zakresu [1, 100].
	 */
	takePicture: function(quality) {
		devices.camera.takePicture(quality, function(imageSrc) {
			connection.file.upload.photo(imageSrc);

                        main.addNewMyData('image', imageSrc);
			//var image = document.getElementById('myImageCamera');
			//image.style.display = 'block';

			//image.src = imageSrc/*"data:image/jpeg;base64," + */;
		});
	},

	/**
	 * Pobiera zdjęcie, wysyła na serwer i wyświetla na wallu.
	 * @param {Number} quality
	 * Jakość wykonywanego zdjęcia z zakresu [1, 100].
	 */
	loadPicture: function() {
		devices.photoLibrary.take(function(imageSrc) {
			connection.file.upload.photo(imageSrc);

			var image = document.getElementById('myImageCamera');
			image.style.display = 'block';

			image.src = imageSrc/*"data:image/jpeg;base64," + */;
		});
	},

	/**
	 * Skanuje kod webserwera, nawiązuje połączenie websocketa i zapisuje zeskanowane dane do inputa.
	 */
	initialQrCode: function() {
		devices.qrCode.scan(function(result) {

			main.setUrl(result);

		}, true);
	},

	/**
	 * Skanuje kod i uruchamia jedynie alerta.
	 */
	scanAnyQrCode: function() {
		devices.qrCode.scan(function(result) {
			alert(result);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	getMac: function() {
		devices.mac.get(function(result) {
			alert(result);
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	getRooms: function() {
		connection.action.getRooms(function(received) {
			// received zawiera listę elementów, np. {id: 0, name: 'room', folderName: 'room'}
			// instersuje nas id po którym dołączamy i name które wyświetlamy
			alert(received);
		});
	},

	setUrl: function(link) {
		var url = document.getElementById('url');
		url.value = 'Connecting: ' + link;
		connection.setUrl(link, function() {
			url.value = link;

			//TUTAJ AKCJE PO POPRAWNYM POŁĄCZENIU Z SERWEREM - NP PRZEJŚCIE DO LOGOWANIA
			load('login');
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	login: function(login, password) {
		connection.action.login(login, password, function(received) {
			//akcja wykonywana po odpowiedzi serwera
			received = JSON.parse(received);
			if (received.result === 0) {//gdy jest ok
				//received.message zawiera wiadomość
				me.id = received.data.id;
				
				//TUTAJ AKCJE PO POPRAWNYM ZALOGOWANIU - NP PRZEJŚCIE DO ROOMÓW
				load('rooms');
				
			} else if (received.result === 1) {//błąd
				//received.message zawiera wiadomość dlaczego nie
			}
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	register: function(login, password, password2) {
		connection.action.register(login, password, password2, function(received) {
			//akcja wykonywana po odpowiedzi serwera
			if (received.result === 0) {//gdy jest ok
				//received.message zawiera wiadomość
				
				//TUTAJ AKCJE PO POPRAWNYM ZAREJESTROWANIU - NP PRZEJŚCIE DO STRONY LOGOWANIA
				load('login');
				
			} else if (received.result === 1) {//błąd
				//received.message zawiera wiadomość dlaczego nie
			}
		});
	},

	/**
	 * Pobiera dane mac urządzenia i wywołuje z nimi alerta.
	 */
	createRoom: function(roomName) {
		main.choseRoomToEnter();
		connection.action.createRoom(roomName, function(received) {
			var roomId = JSON.parse(received).data.id;
			//var input = document.getElementById('roomId');
			//input.value = roomId;

			main.joinRoom(roomId, function() {
				alert('Room created');
			});
		});
	},

	/**
	 * Dołącza i wchodzi do wybranego pokoju.
	 */
	joinRoom: function(roomId, callb) {
		if (roomId) {
			connection.action.joinRoom(roomId, function(received) {
				main.choseRoomToEnter(roomId);
				callb();
			});
		}
	},

	/**
	 * Ustawia pokój, do którego wejść.
	 */
	choseRoomToEnter: function(chosedRoomToEnter) {
		me.chosedRoomToEnter = chosedRoomToEnter;
	},

	/**
	 * Informuje serwer, że `wchodzi` do pokoju (do którego już wcześniej dołączył).
	 */
	enterRoom: function() {
		var userId = me.id,
			roomId = me.chosedRoomToEnter;
		if (userId && roomId) {
			connection.socket.enterRoom(userId, roomId);
			me.enteredRoom = roomId;
		} else {
			alert('No room is chosen');
		}
	},

	/**
	 * Skanuje kod, dołącza do pokoju i wchodzi do niego.
	 */
	scanRoomQrCode: function() {
		// skanowanie
		devices.qrCode.scan(function(roomId) {
			// dołączenie do pokoju
			main.joinRoom(roomId, function() {
				main.enterRoom();
			});
		});
	},
        
        /**
	 * Dodawanie elementu do struktury JSON
	 * @param {String} type
         * @param {String} data
         * @param {String} author
	 */
	addNewServerData: function(type, data, author) {
		t_serverData.totalRecords += 1;
		t_serverData.data[t_serverData.totalRecords-1] = [type, data.data, author];
                main.updateServerData(type, data.data, author);
	},
        
        /**
         * 
         * @param {String} type
         * @param {String} data
         */
        addNewMyData: function(type, data) {
                t_myData.data[t_myData.data.length] = [type, data];
                main.updateMyData(type, data);
        },
        
        /**
         * 
         * @returns {undefined}
         */
        showServerData: function() {
                for (var data in dataTable) {
                    ;
                }
        },
        
        /**
         * 
         * @param {String} type
         * @param {String} data
         * @param {String} author
         */
        updateServerData: function(type, data, author) {
                var image = document.createElement("img");
                var node = document.createAttribute("alt");
                node.value="photo";
                image.setAttributeNode(node);
                node = document.createAttribute("style");
                node.value="display:none;width:90%;margin-left:5%;";
                image.setAttributeNode(node);
                var element = document.getElementById('received');
                element.appendChild(image);
                var tmp = element.getElementsByTagName("img")[t_serverData.totalRecords-1];
                tmp.style.display='block';
                tmp.src=data;
        },

        /**
         * 
         * @param {String} type
         * @param {String} data
         */
        updateMyData: function(type, data) {
                var image = document.createElement("img");
                var node = document.createAttribute("alt");
                node.value="photo";
                image.setAttributeNode(node);
                node = document.createAttribute("style");
                node.value="display:none;width:60px;height:60px;";
                image.setAttributeNode(node);
                var element = document.getElementById('myImageCamera');
                element.appendChild(image);
                var tmp = element.getElementsByTagName("img")[t_myData.data.length-1];
                tmp.style.display='block';
                tmp.src=data;
        },
        
	/**
	 * Dodawanie nowego użytkownika do spotkania
         * @param {Number} id_
	 * @param {String} name_
         * @param {String} surname_
         * @param {String} login_
	 */
	userEntered: function(id_, name_, surname_, login_/*meaby few more params*/) {
		t_onlineUser.numberOfOnlineUsers += 1;
                t_onlineUser.user[t_onlineUser.numberOfOnlineUsers-1] = [id_, name_, surname_, login_];
                //onlineUserTable.id = id_;
		//onlineUserTable.id = onlineUserTable.id[numberOfOnlineUsers-1];
		//onlineUserTable.name = name_;
		//onlineUserTable.surname = surname_;
		//onlineUserTable.login = login_;
	},
        
        /**
         * 
         * @param {Number} id_
         */
        userLeft: function(id_) {
                ;
        }
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewPhoto = function(data) {
        main.addNewServerData('image', data, 'sbd');
	/*var image = document.getElementById('received');

	image.style.display = 'block';
	image.src = data.data;*/
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewUser = function(data) {
	if (data.userId === me.id) {
		load('wall');
	}
};

/**
 * Elementy otrzymane od websocketa obecnie obsługuje się u nas w ten sposób:
 */
connection.socket.receive.onNewMessage = function(data) {
	callback(data);
};

/**
 * Pobranie początkowego adresu MAC.
 */
if (init.ready) {
	devices.mac.get(function(result) {alert(result);}, true);
}
