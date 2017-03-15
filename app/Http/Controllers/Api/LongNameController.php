<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\LongName;

class LongNameController extends Controller
{
    public function find(Request $request)
    {
        $response = [];
        $input = $request->all();
        $data = LongName::find($input['id']);

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

        $data = new LongName;
        if (isset($input['skip']) && isset($input['take'])) {
            $data = $data->skip(0)->take(25);
        }
        // FILTER DATA
        // $data->whereParam1('value1');
        // $data->whereParam2('value2');
        $data = $data->get();

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
        $data = LongName::create($input);

        if ($data) {
            $response = [];
            $response['message'] = 'Successfully created data.';
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
        $data = LongName::find($input['id']);
        $data->update($input);

        if (! is_null($data)) {
            $response = [];
            $response['message'] = 'Successfully updated data.';
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
        LongName::destroy($input['id']);

        $response = [];
        $response['message'] = 'Successfully deleted data.';
        $status = 200;

        return response($response, $status);
    }

/** Copy/paste these lines to app\Http\routes.php 
Route::get('api/long_names/find', array('as'=>'apiLongNamesFind','uses'=>'Api\LongNameController@find'));
Route::get('api/long_names/get', array('as'=>'apiLongNamesGet','uses'=>'Api\LongNameController@get'));
Route::post('api/long_names/store', array('as'=>'apiLongNamesStore','uses'=>'Api\LongNameController@store'));
Route::post('api/long_names/update', array('as'=>'apiLongNamesUpdate','uses'=>'Api\LongNameController@update'));
Route::post('api/long_names/destroy', array('as'=>'apiLongNamesDestroy','uses'=>'Api\LongNameController@destroy'));
*/
}
