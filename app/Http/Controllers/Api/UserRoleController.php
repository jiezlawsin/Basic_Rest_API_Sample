<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\UserRole;

class UserRoleController extends Controller
{
    public function find(Request $request)
    {
        $response = [];
        $input = $request->all();
        $data = UserRole::find($input['id']);

        if (! is_null($data)) {
            $response['data'] = $data;
            $response['message'] = 'Successfully retrieved data.';
            $status = 200;
        } else {
            $response['message'] = 'Failed to retrieve data.';
            $status = 500;
        }

        return response($response, $status);
    }

    public function get(Request $request)
    {
        $response = [];
        $input = $request->all();

        $data = new UserRole;
        if (isset($input['skip']) && isset($input['take'])) {
            $data = $data->skip($input['skip'])->take($input['take']);
        }
        // FILTER DATA
        // $data->whereParam1('value1');
        // $data->whereParam2('value2');
        $data = $data->_paginate($data, $request, $input);

        if (! is_null($data)) {
            $response['data'] = $data;
            $response['message'] = 'Successfully retrieved data.';
            $status = 200;
        } else {
            $response['message'] = 'Failed to retrieve data.';
            $status = 500;
        }


        return response($response, $status);
    }

    public function store(Request $request)
    {
        $input = $request->all();
        $data = UserRole::create($input);

        if ($data) {
            $response = [];
            $response['message'] = 'Successfully created data.';
            $response['data'] = $data;
            $status = 200;
        } else {
            $response = [];
            $response['message'] = 'Failed to create data.';
            $status = 500;
        }

        return response($response, $status);
    }

    public function update(Request $request)
    {
        $input = $request->all();
        $data = UserRole::find($input['id']);
        $data->update($input);

        if (! is_null($data)) {
            $response = [];
            $response['message'] = 'Successfully updated data.';
            $response['data'] = $data;
            $status = 200;
        } else {
            $response = [];
            $response['message'] = 'Failed to update data.';
            $status = 500;
        }

        return response($response, $status);
    }

    public function destroy(Request $request)
    {
        $input = $request->all();
        UserRole::destroy($input['id']);

        $response = [];
        $response['message'] = 'Successfully deleted data.';
        $status = 200;

        return response($response, $status);
    }

/** Copy/paste these lines to app\Http\routes.api.php 
Route::get('api/user_roles/find', array('as'=>'apiUserRolesFind','uses'=>'UserRoleController@find', 'middleware'=>'cors'));
Route::get('api/user_roles/get', array('as'=>'apiUserRolesGet','uses'=>'UserRoleController@get', 'middleware'=>'cors'));
Route::post('api/user_roles/store', array('as'=>'apiUserRolesStore','uses'=>'UserRoleController@store', 'middleware'=>'cors'));
Route::post('api/user_roles/update', array('as'=>'apiUserRolesUpdate','uses'=>'UserRoleController@update', 'middleware'=>'cors'));
Route::post('api/user_roles/destroy', array('as'=>'apiUserRolesDestroy','uses'=>'UserRoleController@destroy', 'middleware'=>'cors'));
*/
}
