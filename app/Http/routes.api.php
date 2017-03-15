<?php

/*
|--------------------------------------------------------------------------
| WEB API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('api/person/', array('as'=>'apiSample','uses'=>'SampleController@all'));
Route::get('api/person/{id}', array('as'=>'apiSample','uses'=>'SampleController@find'));
Route::post('api/person/{id}', array('as'=>'apiSample','uses'=>'SampleController@store'));
Route::put('api/person/{id}', array('as'=>'apiSample','uses'=>'SampleController@update'));
Route::delete('api/person/{id}', array('as'=>'apiSample','uses'=>'SampleController@destroy'));