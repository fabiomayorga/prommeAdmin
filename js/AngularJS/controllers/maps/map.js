(function() {
	var app = angular.module('mapControllers', ['angular.morris', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngRoute' ,'promeeApp', 'rzModule'])

	.controller('mapMainController', function($scope, $rootScope, $window, $route, $mdToast , $mdDialog, $mdMedia, $timeout, $mdBottomSheet , $location, $http , $localStorage ,$mdSidenav, $timeout, tools) {

		$scope.defaultZoom = 14;
		$scope.search="";
		$scope.openSearchNav = !$mdSidenav('left').isOpen();		
		$scope.selectedIndexFilter=0;
		var imgMuestra = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0FH4mBdJiImmFgBhQ_BeNPolxIiMlrtmegN868zBiBeBZ1zGZNw";
		$scope.rankCircle = null;

		$scope.urlBase = location.protocol+"//"+location.hostname;

		console.log($scope.urlBase);

		$scope.$on('$viewContentLoaded', function() {	

			var mapStyle= [
			{
				"featureType": "landscape",
				"elementType": "geometry.fill",
				"stylers": [
				{
					"saturation": -100
				},
				{
					"lightness": 60
				}
				]
			},
			{
				"featureType": "landscape.natural.terrain",
				"elementType": "geometry.fill",
				"stylers": [
				{
					"color": "#ffeb3b"
				},
				{
					"saturation": 100
				},
				{
					"lightness": 100
				},
				{
					"visibility": "off"
				},
				{
					"weight": 3
				}
				]
			}
			];

			if (navigator.geolocation){
				navigator.geolocation.getCurrentPosition(showmap);

				function showmap(position){

					$scope.userPosition = {lat: position.coords.latitude, lng: position.coords.longitude}

					map = new google.maps.Map(document.getElementById('map'), {
						center: {lat: position.coords.latitude , lng: position.coords.longitude},
						zoom: $scope.defaultZoom ,
						fullscreenControl: false,
						mapTypeControl: false,
						styles: mapStyle
					});

					var marker = new google.maps.Marker({
						position: $scope.userPosition,
						icon: $scope.urlBase+"/img/brandMarker.png",
						map: map
					});

				}
				
			} 
			else{ 
				console.log("Geolocation is not supported by this browser.");

				map = new google.maps.Map(document.getElementById('map'), {
					center: {lat: 3.445869, lng: -76.531418},
					zoom: $scope.defaultZoom ,
					fullscreenControl: false,
					mapTypeControl: false,
					styles: mapStyle
				});
			}

			console.log("se creo el mapa");
		});


		//una vez esta cargado el sidenav, se asigna la escucha al evento close, para reiniciar los resultados y mostrar la barra de busqueda principal
		$mdSidenav('left', true).then(function(instance) {

			$mdSidenav('left').onClose(function () {

				document.getElementById("searchbox").classList.remove("noVisible");
				document.getElementById("searchbox").classList.add("visible");

				$scope.resultSuggestions = [];	

				console.log($scope.rankCircle);

				if($scope.rankCircle!==null)	{
					$scope.rankCircle.setMap(null);
					$scope.$broadcast('removeRankCircle', 1);

					//el onend event del slider tiene un pequeño problema de retraso, que lo ejecuta incluso un momento despues de realmente terminarse
					$timeout(function () {
						$scope.$broadcast('removeRankCircle', 1);
					}, 200);
				}
				else{
					$scope.$broadcast('removeRankCircle', 1);
				}

				console.log("cerrado esc");
			});

		});

		$scope.categories = ["ropa", "herramientras","juguetes"];
		$scope.categorias= (tools.randomizer($scope.categories));

		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');


		function buildToggler(componentId) {
			return function() {

				if(componentId == 'left'){
					
					$scope.openSearchNav = $mdSidenav('left').isOpen();

					if($scope.openSearchNav==true){
						document.getElementById("searchbox").classList.remove("noVisible");
						document.getElementById("searchbox").classList.add("visible");
						$scope.resultSuggestions = [];					
					}
					else{
						document.getElementById("searchbox").classList.remove("visible");
						document.getElementById("searchbox").classList.add("noVisible");

						console.log("abriendo mapa");

						if($scope.rankCircle!==null){
							$scope.$broadcast('createRankCircle', $scope.rankCircle);
						}
						
					}

				}
				$mdSidenav(componentId).toggle();
			};
		}

		$scope.searchSuggestions = function(){

			$scope.over = 1;
			
			if($scope.search!==""){
				$scope.resultSuggestions = [{id:1, name: "articulo 1", img: imgMuestra },{id:2, name: "articulo 2", img: imgMuestra },{id:3, name: "articulo 2", img: imgMuestra }];
				document.getElementById("searchSuggestions").classList.remove("noVisible");
				document.getElementById("searchSuggestions").classList.add("visible");
				console.log($scope.resultSuggestions);
			}
			else{
				$scope.resultSuggestions = [];	
				document.getElementById("searchSuggestions").classList.remove("visible");
				document.getElementById("searchSuggestions").classList.add("noVisible");
				console.log($scope.resultSuggestions);
			}	
		}

		$scope.close = function () {

			$mdSidenav('right').close()
			.then(function () {

			});
		};

		document.onkeypress = function(evt) {
			evt = evt || window.event;
			var charCode = evt.keyCode || evt.which;
			var charStr = String.fromCharCode(charCode);
			if (evt.keyCode == 13) {

				if($scope.focus==true){
					$scope.searchSuggestions();
				}

			}
		}; 

		$scope.searchProduct = function(s,n){
			$scope.toggleLeft();
			$scope.searching = s;
			$scope.hideSearch();
			document.getElementById("searchSuggestions").classList.remove("visible");
			document.getElementById("searchSuggestions").classList.add("noVisible");
			document.getElementById("searchbox").classList.remove("visible");
			document.getElementById("searchbox").classList.add("noVisible");
		};

		$scope.hideSearch = function(){

			if($scope.over!==1){
				$scope.resultSuggestions=[];
			}
		}

		$scope.lostFocusSearch = function(){
			if($scope.over==0){
				$scope.resultSuggestions = [];	
				document.getElementById("searchSuggestions").classList.remove("visible");
				document.getElementById("searchSuggestions").classList.add("noVisible");
				$scope.hideSearch();
			}
		}

		$scope.overSuggestion = function(){
			$scope.over = 1;
			console.log("o");
		}

		$scope.leaveSuggestion = function(){
			$scope.over = 0;
			console.log("l");
		}

		//receptores
		$scope.$on('chatToMainController', function(event, data) {
			console.log(data);
		});

		$scope.$on('changeRankCircleMain', function(event, data) {
			$scope.rankCircle = data
		});
		//fin receptores

		//emisores

		$timeout(function () {
			$scope.$broadcast('mainToChatController', 'creado jejejejeje');
		}, 5000);

		//fin emisores

		//creacion de broadcast despues de inicializado el controlador hijo
		$scope.$on('childChatControllerPrepared', function(event, data) {
			$scope.$broadcast('mainToChatController', 'creado');
		});

		$scope.$on('childSearchNavControllerPrepared', function(event, data) {
			$scope.$broadcast('mainToSearchNavController', 'creado');
			$scope.$broadcast('createRankCircle', "creada");
		});
		//funciones receptoras

		$scope.passRankCircleMain = function(data){
			$scope.rankCircle = data;
		} 

	})


.controller('childChatController', function($scope, $rootScope, $window, $route, $mdToast , $mdDialog, $mdMedia, $timeout, $mdBottomSheet , $location, $http , $localStorage ,$mdSidenav, $timeout, tools) {

	//cuando esta iniciado childChat, le reporto al padre que puede definir el broadcast (emisor)
	$scope.$emit('childChatControllerPrepared', 'childChatController preparado');

	//receptor
	$scope.$on('mainToChatController', function (event, data) {
		$scope.chatInput = data;
	});

})


})();