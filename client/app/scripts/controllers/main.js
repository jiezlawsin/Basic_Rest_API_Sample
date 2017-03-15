'use strict';

/**
 * @ngdoc function
 * @name personsApiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the personsApiApp
 */
angular.module('personsApiApp')
  .controller('MainCtrl', function (URL, $http, $scope, $location) {
  	console.log(URL.API);
  	$scope.persons = [];
    $http({
      method: 'GET',
      url: URL.API + 'person'
    }).then(function successCallback(response) {
    	console.log(response);
    	if (response.data) {
	    	$scope.persons = response.data.data;
    	};
    	console.log($scope.persons);
	}, function errorCallback(response) {
		console.log(response);
	});

	$scope.go = function ( path ) {
	  $location.path( path );
	};

	$scope.delete = function($id) {
		console.log($id);
	    $http({
	      method: 'delete',
	      url: URL.API + 'person/' + $id
	    }).then(function successCallback(response) {
	    	console.log(response);
	    	var person = _.where($scope.persons, {id: $id});
	    	$scope.persons = _.without($scope.persons, person[0]); 
		}, function errorCallback(response) {
			console.log(response);
		});
	};
  })
  .controller('CreateCtrl', function (URL, $http, $scope, $location) {
  	console.log(URL.API);
  	$scope.newPerson = {
  		name : ''
  	};
  	$scope.createPerson = function() {
  		console.log($scope.newPerson.name);
	    $http({
	      method: 'POST',
	      url: URL.API + 'person',
	      data: $scope.newPerson
	    }).then(function successCallback(response) {
	    	console.log(response);
	    	$location.path( '/' );
		}, function errorCallback(response) {
			console.log(response);
		});
  	};
  })
  .controller('EditCtrl', function (URL, $http, $scope, $location, $route) {
  	console.log($route.current.params.id);
  	$scope.id = $route.current.params.id;
  	$scope.currentPerson = {};
    $http({
      method: 'get',
      url: URL.API + 'person/' + $scope.id,
    }).then(function successCallback(response) {
    	console.log(response);
    	if (response.data) {
    		$scope.currentPerson = response.data.data;
    	};
    	console.log($scope.currentPerson);
	}, function errorCallback(response) {
		console.log(response);
	});

	$scope.editPerson = function() {
		var data = {
			name : $scope.currentPerson.name
		};
		console.log(data);
		$http({
	      method: 'put',
	      url: URL.API + 'person/' + $scope.id,
	      data: data
	    }).then(function successCallback(response) {
	    	console.log(response);
	    	// $location.path( '/' );
		}, function errorCallback(response) {
			console.log(response);
		});
	};
  	
  });
  ;
