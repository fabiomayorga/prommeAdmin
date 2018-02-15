angular.module('terminosFactory', [])

.factory('terminos', function($http,$q, $httpParamSerializerJQLike, configuracionServidor){

	return{
		
		consultar: function() {

			var respuesta =  $http({
				method: 'GET',
				url: configuracionServidor.protocolo+configuracionServidor.servidor+"/"+configuracionServidor.nombreApi+"/"+configuracionServidor.version+"/terms",
				headers: {
					'Content-Type': 'application/json'
				},
				
			}).then(function success(respuesta){

				return respuesta;

			}, function error(respuesta){

				return respuesta;
			});


			return respuesta;

		},
		editar: function(data, id) {

			var respuesta =  $http({
				method: 'PUT',
				url: configuracionServidor.protocolo+configuracionServidor.servidor+"/"+configuracionServidor.nombreApi+"/"+configuracionServidor.version+"/terms/"+id,
				headers: {
					'Content-Type': 'application/json'
				},
				data : data
				
			}).then(function success(respuesta){

				return respuesta;

			}, function error(respuesta){

				return respuesta;
			});


			return respuesta;

		}

	}

	
});