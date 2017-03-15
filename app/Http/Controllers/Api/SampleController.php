<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Persons;

class SampleController extends Controller
{

    public function all()
    {
        $response = [];

        $data = Persons::get();

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

    public function find($id)
    {
        $response = [];

        $data = Persons::find($id);

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
        $sample = Persons::create($input);

        if ($sample) {
            $response = [];
            $response['message'] = 'Successfully created data.';
            $response['data'] = $sample;
            $status = 200;
        } else {
            $response = [];
            $response['message'] = 'Failed to create data.';
            $status = 500;
        }

        return response($response, $status);
    }

    public function update($id, Request $request)
    {
        $input = $request->all();
        $data = Persons::find($id);
        
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

    public function destroy($id)
    {
        Persons::destroy($id);

        $response = [];
        $response['message'] = 'Successfully deleted data.';
        $status = 200;

        return response($response, $status);
    }
}
