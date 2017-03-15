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
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
