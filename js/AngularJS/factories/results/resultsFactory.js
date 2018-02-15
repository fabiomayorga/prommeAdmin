angular.module('resultsFactory', [])

.factory('results', function($q,$timeout, $http, $localStorage , $location, configuracionServidor ){

	return {

		generalResults: function(data){

			var response =  $http({
				method: 'GET',
				url: "https://www.mocky.io/v2/5a6fde0b3300005800ff599c",
				headers: {
					'Content-Type': 'application/json'
				}
				
			}).then(function success(response){

				console.log(response);
				var imgMuestra = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0FH4mBdJiImmFgBhQ_BeNPolxIiMlrtmegN868zBiBeBZ1zGZNw";
				var searchResults = [
				{id:1, sellerName: "seller 1", productName: "producto de prueba" ,  img: imgMuestra, sellerCoordinates: {lat: 3.445869, lng: -76.531418}, sellerValoration: 5, productValoration: 4, price: 25000, negociable: true, ce: false },
				{id:2, sellerName: "seller 2", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445879, lng: -76.531458}, sellerValoration: 3, productValoration: 1, price: 55000, negociable: true, ce: false },
				{id:3, sellerName: "seller 3", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445860, lng: -76.531428}, sellerValoration: 4, productValoration: 5, price: 5000, negociable: false, ce: true },
				{id:4, sellerName: "seller 4", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445862, lng: -76.531428}, sellerValoration: 4, productValoration: 5, price: 15000, negociable: false, ce: true },
				{id:5, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 50000, negociable: false, ce: false },
				{id:6, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 150001, negociable: false, ce: false },
				{id:7, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 157000, negociable: false, ce: false },
				{id:8, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 257000, negociable: false, ce: false },
				{id:9, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 357000, negociable: false, ce: false },
				{id:10, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 257000, negociable: false, ce: false },
				{id:11, sellerName: "seller 5", productName: "producto de prueba" , img: imgMuestra, sellerCoordinates: {lat: 3.445870, lng: -76.531458}, sellerValoration: 3, productValoration: 5, price: 57000, negociable: false, ce: false }
				];

				return response;

			}, function error(response){

				return response;
			});
			return response;
		}

	}

});

