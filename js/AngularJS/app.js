(function() {
	var app = angular.module('promeeApp', 
		[  

		'mapControllers',
		'searchNavControllers',

		'toolsFactory',
		'resultsFactory',
		
		'ngRoute',
		'ngStorage',
		'ngMessages',
		'ngSanitize'
		]);



	app.config(['$routeProvider', '$locationProvider', '$qProvider' , function($routeProvider, $locationProvider, $qProvider) {


		$routeProvider

		.when('/map', {
			templateUrl: "views/map/map.html",
			controller: 'mapMainController',
			// resolve: {
			// 	variables : function(validarAcceso){
			// 		return validarAcceso.acceso();
			// 	}
			// }
		})
		
		.otherwise({
			redirectTo: '/map'
		});


		$locationProvider.html5Mode(true);

	}])

	.constant('configuracionServidor', {
		version : "v1",
		protocolo : "http://",
		nombreApi : "promee-api",
		servidor : "",
		puerto : ':NUMERO',
		app: (window.location.host).split('.')[0] 
	})

	.config(function($mdThemingProvider) {

  		// Extend the red theme with a different color and make the contrast color black instead of white.
  		// For example: raised button text will be black instead of white.
  		var neonRedMap = $mdThemingProvider.extendPalette('red', {
  			'500': 'rgb(245, 0, 0)',
  			'contrastDefaultColor': 'light'
  		});

  		// Register the new color palette map with the name <code>neonRed</code>
  		$mdThemingProvider.definePalette('neonRed', neonRedMap);

  		// Use that theme for the primary intentions
  		$mdThemingProvider.theme('default')
  		.primaryPalette('neonRed');

  	})



	app.controller('mainController', function($scope, $rootScope, $window, $route, $mdToast , $mdDialog, $mdMedia, $timeout, $location, $http , $localStorage ,$mdSidenav, $timeout, tools) {	

		$scope.messages = {};
		$scope.messages.parentProperty = function(mensaje, textoBoton, duracion, target){

			if(!textoBoton){
				var textoBoton = "";
			}

			if(!duracion){
				var duracion = 2000;
			}

			if(!target){
				var target = '#toast-container';
			}

			var pinTo = $scope.getToastPosition();
			var toast = $mdToast.simple().textContent(mensaje)
			.action(textoBoton).highlightAction(true)
			.hideDelay(duracion).position(pinTo)
			.parent(document.querySelectorAll(target));

			$mdToast.show(toast).then(function(response) {
				if (response == 'Aceptar') {
				}
			});

		}


	})


})();