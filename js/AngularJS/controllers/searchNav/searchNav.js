(function() {

	var app = angular.module('searchNavControllers', ['angular.morris', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngRoute' ,'promeeApp', 'rzModule'])

	.filter('resultFilter', function() {
		return function (products,applyingFilter, prankStarValue, srankStarValue, sliderPriceMin, sliderPriceMax, sliderRankValue, negociable, ce) {
			
			var filteredItems = [];

			if(applyingFilter==true){

				//se aplican los filtros existentes

				angular.forEach(products , function (product) {
					if (product.price >= sliderPriceMin &&  product.price <= sliderPriceMax) {
						filteredItems.push(product);
					}
				});
			}
			else{
				filteredItems = products;
			}
			
			return filteredItems;
		};
	})
	
	.controller('childSearchNavController', function($scope, $rootScope, $window, $route, $mdToast , $mdDialog, $mdMedia, $timeout, $mdBottomSheet , $location, $http , $localStorage ,$mdSidenav, $timeout, tools, results) {

		$scope.filterStatus = "Filtrar";
		$scope.applyingFilter = false;
		$scope.srankStarValue = null;		
		$scope.prankStarValue = null;
		$scope.filter = {};
		$scope.filter.ce = false;
		$scope.filter.negociable = false;
		$scope.sliderPriceMin = 5000;
		$scope.sliderPriceMax = 20000;
		$scope.sliderRankValue = 3;
		$scope.searchResults = [];
		$scope.productsResults = [];
		$scope.categoriesResults = [];
		$scope.sellersResults = [];

		//cuando esta iniciado childChat, le reporto al padre que puede definir el broadcast (emisor)
		$scope.$emit('childSearchNavControllerPrepared', 'childSearchNavController preparado');

		//receptores
		$scope.$on('mainToSearchNavController', function (event, data) {
			$scope.chatInput = "wort";
		});

		var imgMuestra = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0FH4mBdJiImmFgBhQ_BeNPolxIiMlrtmegN868zBiBeBZ1zGZNw";

		$scope.searchData = function(){

			$scope.productsResults = [];
			$scope.categoriesResults = [];
			$scope.sellersResults = [];

			results.generalResults().then(function(respuesta){

				console.log(respuesta);

				if(200 == 200){
					$scope.productsResults = respuesta.data.products;

					//ajuste para estrellas de ranking
					for(item in $scope.productsResults){

						$scope.productsResults[item].productStars = tools.starsMaker( $scope.productsResults[item].productValoration );
						$scope.productsResults[item].sellerStars  = tools.starsMaker( $scope.productsResults[item].sellerValoration );
						
					}

					console.log($scope.productsResults);
					
				}
				else{
					$scope.messages.parentProperty("Error al consultar los datos.", "Aceptar", 3000);
				}
			});

		}

		$scope.$on('createRankCircle', function (event, data) {

			$scope.rankCircle.setMap(null);
			
			if($scope.selectedIndexFilter==2){
				$scope.rankCircle = new google.maps.Circle({
					strokeColor: '#FF0000',
					strokeOpacity: 0.5,
					strokeWeight: 1.5,
					fillColor: '#FF0000',
					fillOpacity: 0.025,
					map: map,
					center: $scope.userPosition,
					radius: data.radius
				});
			}

			console.log($scope.filterOpen);

			if(2==1){
				document.getElementById("filterButton").classList.add("filterOpen");
			}
		});

		$scope.$on('removeRankCircle', function (event, data) {
			$scope.rankCircle.setMap(null);	
		});
		//fin receptores

		$scope.sliderPriceMin = 5000;
		$scope.sliderPriceMax = 25000;
		$scope.sliderRankValue = 3;

		$scope.filter = {};

		$scope.$watch('selectedIndexFilter', function(current, old){

			console.log($scope.selectedIndexFilter);
			
			if(current==0){
					//eliminado de circulo del mapa
					if($scope.rankCircle!==null){
						$scope.rankCircle.setMap(null);
					}
				}
				else if(current==1){

					if($scope.rankCircle!==null){
						$scope.rankCircle.setMap(null);
					}

					$scope.sliderPrice = {
						min:$scope.sliderPriceMin,
						max:$scope.sliderPriceMax,
						options: {
							floor: 5000,
							ceil: 500000,
							showTicks: true,
							step: 20000,
							translate: function(value) {
								return '$' + value;
							},
							onChange: function(){
								$scope.sliderPriceMax = $scope.sliderPrice.max;
								$scope.sliderPriceMin = $scope.sliderPrice.min;
							},

						},
					}
				}
				else{

					if($scope.rankCircle!==null){
						$scope.rankCircle.setMap(null);
					}

					$scope.rankCircle = new google.maps.Circle({
						strokeColor: '#FF0000',
						strokeOpacity: 0.5,
						strokeWeight: 1.5,
						fillColor: '#FF0000',
						fillOpacity: 0.09,
						map: map,
						center: $scope.userPosition,
						radius: $scope.sliderRank.value * 1000	
					});

					//envio al maincontroller el cambio en el rango de mapa (definido como null al inicio del app)
					$scope.$emit('changeRankCircleMain', $scope.rankCircle);

					$scope.sliderRank = {
						value: $scope.sliderRankValue,
						options: {
							floor: 1,
							ceil: 10,
							showSelectionBar: true,
							showTicks: true,
							translate: function(value) {
								return value+"Km";
							},

							onStart: function(){
								console.log("inicio slider");
								if($scope.rankCircle!==null){
									$scope.rankCircle.setMap(null);
								}
							},

							onChange: function(){
								$scope.sliderRankValue = $scope.sliderRank.value;
								if($scope.rankCircle!==null){
									$scope.rankCircle.setMap(null);
								}
							},
							onEnd  : function(){

								console.log("fin slider");
								console.log($scope.rankCircle);

								if($scope.rankCircle!==null){
									$scope.rankCircle.setMap(null);
									$scope.rankCircle = new google.maps.Circle({
										strokeColor: '#FF0000',
										strokeOpacity: 0.5,
										strokeWeight: 1.5,
										fillColor: '#FF0000',
										fillOpacity: 0.025,
										map: map,
										center: $scope.userPosition,
										radius: $scope.sliderRank.value * 1000	
									});
								}else{
								}
								
								//envio al maincontroller el cambio en el rango de mapa (definido como null al inicio del app)
								$scope.$emit('changeRankCircleMain', $scope.rankCircle);

								console.log($scope.rankCircle.getRadius() );
							}
						}
					};
				}
			});

		$scope.sliderPrice = {
			min: 5000,
			max: 20000,
			options: {
				floor: 5000,
				ceil: 1000000,
				showTicks: true,
				step: 50000,
				translate: function(value) {
					return '$' + value;
				}
			},
		}		

		$scope.srankStar = function(starId){

			for(i=1; i<6; i++){
				document.getElementById("srankStar"+i).classList.remove("rankStarMarked");
			}

			for(i=1; i<starId+1; i++){			
				document.getElementById("srankStar"+i).classList.add("rankStarMarked");
			}	

			$scope.srankStarValue = starId;		

		}

		$scope.prankStar = function(starId){

			for(i=1; i<6; i++){
				document.getElementById("prankStar"+i).classList.remove("rankStarMarked");
			}

			for(i=1; i<starId+1; i++){			
				document.getElementById("prankStar"+i).classList.add("rankStarMarked");
			}	

			$scope.prankStarValue = starId;				

		}

		$scope.filterOpen = 0;

		$scope.filters = function(){
			
			if($scope.filterOpen==0){
				document.getElementById("filter").classList.remove("noVisible");
				document.getElementById("filter").classList.add("visible");

				document.getElementById("filterButton").classList.add("filterOpen");

				$scope.filterOpen = 1;
			}
			else{
				document.getElementById("filter").classList.remove("visible");
				document.getElementById("filter").classList.add("noVisible");

				document.getElementById("filterButton").classList.remove("filterOpen");

				$scope.filterOpen = 0;
			}
		}

		$scope.applyFilter = function(){
			document.getElementById("filter").classList.remove("visible");
			document.getElementById("filter").classList.add("noVisible");
			document.getElementById("filterButton").classList.remove("filterOpen");
			document.getElementById("filterButton").classList.add("filterApplied");
			$scope.filterStatus = "Filtro aplicado";
			$scope.filterOpen = 0;
			$scope.applyingFilter = true;

			if($scope.rankCircle!==null){
				$scope.rankCircle.setMap(null);
				$scope.rankCircle = new google.maps.Circle({
					strokeColor: '#FF0000',
					strokeOpacity: 0.5,
					strokeWeight: 1.5,
					fillColor: '#FF0000',
					fillOpacity: 0.025,
					map: map,
					center: $scope.userPosition,
					radius: $scope.sliderRank.value * 1000	
				});
			}
		}

		$scope.deleteFilter = function(){
			document.getElementById("filter").classList.remove("visible");
			document.getElementById("filter").classList.add("noVisible");
			document.getElementById("filterButton").classList.remove("filterOpen");
			document.getElementById("filterButton").classList.remove("filterApplied");
			$scope.filterStatus = "Filtrar";
			$scope.filterOpen = 0;
			$scope.applyingFilter = false;

			if($scope.rankCircle!==null){
				$scope.rankCircle.setMap(null);
			}
		}
	})
})();