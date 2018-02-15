angular.module('accessFactory', [])

.factory('access', function($q,$timeout, $http, $localStorage , $location, objetualizer, configuracionServidor ){

	return {

		token: function(){

			var defered=$q.defer();
			var promise=defered.promise;
			var s = (window.location.host).split('.')[0];

			var respuesta = $http({
				method: 'GET',
				url: configuracionServidor.protocolo+configuracionServidor.servidor+configuracionServidor.puertoEmpresa+"/"+configuracionServidor.nombreApi+"/"+configuracionServidor.version+"/"+"configuration/login/"+s,
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function(respuesta){

				if ($localStorage.currentUser) {

					//a la fecha almacenada en la variable global le sumo 12 en milisegundos (43200000) y si es menor a cero, quiere decir que ha expirado
					if( (  ($localStorage.currentUser.date + 43200000) ) - new Date().getTime() >= 0 ){
						window.location.replace("inicio");   
						$http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;
						console.log("sesion activa");
					}
					else{

						console.log("sesion vencida");
						delete $localStorage.currentUser;
						$http.defaults.headers.common.Authorization = '';   
						window.location.replace("login"); 
					}

				}
				else{
					defered.resolve();
				} 

				defered.resolve();
				return respuesta;

			}, function(respuesta){

				window.location.replace("blank"); 
				return promise;

			});



			return respuesta;
		},

		//Se crea para seccioines de la app que no hagan parte de un modulo

		uso: function(){

			var defered=$q.defer();
			var promise=defered.promise;

			if ($localStorage.currentUser) {

				//a la fecha almacenada en la variable global le sumo 12 en milisegundos (43200000) y si es menor a cero, quiere decir que ha expirado
				if( (  ($localStorage.currentUser.date + 43200000) ) - new Date().getTime() >= 0 ){             	   	
					console.log("sesion activa");
					defered.resolve();
				}
				else{
					console.log("sesion vencida");
					delete $localStorage.currentUser;
					$http.defaults.headers.common.Authorization = '';   
					window.location.replace("login"); 
				}

			}

			else{	
				delete $localStorage.currentUser;
				$http.defaults.headers.common.Authorization = '';   
				window.location.replace("login"); 
			} 
			return promise;
		},

		//Se crea para secciones de la app que no hagan parte de un modulo, pero tengan una restriccion asociada a la variable de sesion existente en el sistema
		configModule: function(){

			var defered=$q.defer();
			var promise=defered.promise;

			if ($localStorage.currentUser) {

				//a la fecha almacenada en la variable global le sumo 12 en milisegundos (43200000) y si es menor a cero, quiere decir que ha expirado

				if( (  ($localStorage.currentUser.date + 43200000) ) - new Date().getTime() >= 0 ){             	   	
					console.log("sesion activa");

					if($localStorage.currentUser.data.profileId==4){
						defered.resolve();
					}else{
						console.log("sesion vencida");
						delete $localStorage.currentUser;
						$http.defaults.headers.common.Authorization = '';   
						$timeout(function () {
							window.location.replace("login"); 
						}, 300);

					}
				}
				else{
					console.log("sesion vencida");
					delete $localStorage.currentUser;
					$http.defaults.headers.common.Authorization = '';   
					window.location.replace("login"); 
				}

			}else{
				delete $localStorage.currentUser;
				$http.defaults.headers.common.Authorization = '';   
				window.location.replace("login"); 
			} 

			return promise;
		},

		acceso: function(){

			var defered=$q.defer();
			var promise=defered.promise;

			var localizacion = $location.$$path;
			localizacion = localizacion.replace( "/" ,'');    
			localizacion = localizacion.split("/");


			console.log($localStorage.currentUser);

			if($localStorage.currentUser){

				$http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;

				//se revisa si el array del path tiene tamaño mayor a uno, lo que indica que el valor de dicho array en la posicion cero (array[0]) PUEDE ENTRAR a ese modulo si tiene longitud 

				if(localizacion[0] in $localStorage.currentUser.data.modules){

					console.log(localizacion[0]+" si esta modules");

					//ahora se revisa si en la localizacion hay mas de un espacio, lo que indica que todos los demas son accesos

					if(localizacion.length > 1){

						//copia para evaluar los permisos

						var copia = angular.copy(localizacion);

						copia.shift();

						var testLocalizacion = copia;

						$http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.currentUser.token;


						for(acceso in testLocalizacion){

							if($localStorage.currentUser.data.modules[ localizacion[0] ].permission.includes( testLocalizacion[acceso]) ){
								console.log("si tiene el permiso de "+testLocalizacion[acceso]);
							}
							else{
								console.log("no tiene el permiso de "+testLocalizacion[acceso]);

								delete $localStorage.currentUser;
								$http.defaults.headers.common.Authorization = '';   
								window.location.replace("login"); 
							}

						}

						const permisos =$localStorage.currentUser.data.modules[ localizacion[0] ].permission;
						console.log(permisos);
						defered.resolve(objetualizer.default( permisos ));

					}
					else{

						const permisos =$localStorage.currentUser.data.modules[ localizacion[0] ].permission;
						console.log(objetualizer.default( permisos ));
						defered.resolve(objetualizer.default( permisos ));

					}

				}else{
					delete $localStorage.currentUser;
					$http.defaults.headers.common.Authorization = '';   
					window.location.replace("login"); 
				}

			}else{
				delete $localStorage.currentUser;
				$http.defaults.headers.common.Authorization = '';   
				window.location.replace("login"); 
			}

			return promise;
		}

	}

});