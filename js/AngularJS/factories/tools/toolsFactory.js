angular.module('toolsFactory', [])

.factory('tools', function($q,$timeout, $http, $localStorage , $location, configuracionServidor ){

	return {

		objetualizer: function(data){

			var object = {};

			for(key in data){
				object[data[key]]= true;
			}

			return object;

		},

		idFiker : function(data) {

			for(key in data){
				var tmp = data[key];
				tmp.index = key;
				data[key]= tmp;
			}

			return data;
		},

		randomizer: function  (sourceArray) {

			for (var i = 0; i < sourceArray.length - 1; i++) {
				var j = i + Math.floor(Math.random() * (sourceArray.length - i));

				var temp = sourceArray[j];
				sourceArray[j] = sourceArray[i];
				sourceArray[i] = temp;  
			}
			return sourceArray;
		},

		starsMaker: function(rank) {

			var arrayRank = [];

			var t1 = Math.ceil(rank)*10;
			var t2 = rank*10;

			var tr = t1-t2;							

			for(i=0; i<5; i++){

				if( i < Math.floor(rank)){
					arrayRank.push(1);
				}
				else if( (i) == Math.floor(rank) ){
					if(t1==t2){
						arrayRank.push(-1);
					}
					else{
						if(tr <= 3){
							arrayRank.push(1);
						}
						else if(tr > 3 && tr <=7 ){
							arrayRank.push(0);
						}
						else if(tr==10){
							arrayRank.push(-1);
						}
						else{
							arrayRank.push(-1);
						}
					}
					
				}
				else{
					arrayRank.push(-1);
				}
			}	

			return arrayRank;
		}




	}

});