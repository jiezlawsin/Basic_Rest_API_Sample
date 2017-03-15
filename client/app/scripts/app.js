'use strict';

/**
 * @ngdoc overview
 * @name personsApiApp
 * @description
 * # personsApiApp
 *
 * Main module of the application.
 */
angular
  .module('personsApiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ],
  function ($httpProvider) {
      'use strict';
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      var param = function (obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
     }
     return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
      return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CreateCtrl',
        controllerAs: 'create'
      })
      .when('/edit/:id', {
        templateUrl: 'views/edit.html',
        controller: 'EditCtrl',
        controllerAs: 'edit'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .constant('URL', {
    API: 'http://localhost:8000/api/',
  });
