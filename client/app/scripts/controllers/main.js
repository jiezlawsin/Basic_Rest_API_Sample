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
	    	alert("Successfully deleted the person");
		}, function errorCallback(response) {
			console.log(response);
			alert("Server Error");
		});
	};
  })
  .controller('CreateCtrl', function (URL, $http, $scope, $location) {
  	console.log(URL.API);
  	$scope.newPerson = {
  		first_name : '',
  		last_name : '',
  		contact_number : ''
  	};
  	$scope.createPerson = function() {
	    $http({
	      method: 'POST',
	      url: URL.API + 'person',
	      data: $scope.newPerson
	    }).then(function successCallback(response) {
	    	console.log(response);
	    	alert("Successfully created a person");
	    	$location.path( '/' );
		}, function errorCallback(response) {
			console.log(response);
			alert("Server Error");
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
		alert("Server Error");
		$location.path( '/' );
	});

	$scope.editPerson = function() {
		var data = {
			first_name : $scope.currentPerson.first_name,
			last_name : $scope.currentPerson.last_name,
			contact_number : $scope.currentPerson.contact_number,
		};
		console.log(data);
		$http({
	      method: 'post',
	      url: URL.API + 'person/' + $scope.id,
	      data: data
	    }).then(function successCallback(response) {
	    	console.log(response);
	    	alert("Successfully udpated the person");
	    	$location.path( '/' );
		}, function errorCallback(response) {
			console.log(response);
			alert("Server Error");
		});
	};
  	
  });
  ;
