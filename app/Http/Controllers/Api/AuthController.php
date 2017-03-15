<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\MessageBag;
use Illuminate\Support\Facades\DB;

use App\User;
use Hash;
use JWTAuth;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $input = $request->all();
        if (Auth::attempt(['email' => $input['email'], 'password' => $input['password'], 'status' => 'active'])) {

            DB::enableQueryLog();
            $user = User::findOrFail(Auth::user()->id);
            $user->token = JWTAuth::attempt($input);
            $user->last_login = new Carbon();
            $user->save();
            $permissions = [];
            foreach ($user->permissions as $p) {
                # code...
                $permissions[] = md5($p->slug);
            }
            unset($user->permissions);
            $user->permissions = $permissions;
            // print_r(DB::getQueryLog());die();
            // //GENERATE a TOKEN
            // if (empty($user->token)) {
            // $user->token =  md5(substr(str_shuffle(
            //     str_repeat('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 32)),0, 32)).md5($user->id);
            // }

            $response = [];
            $response['message'] = 'Authentication successful.';
            $response['data'] = $user;
            $status = 200;
        } else {
            $response = [];
            $response['message'] = 'Authentication failed.';
            $status = 500;
        }
        return response($response, $status);
    }

    public function logout()
    {
        Auth::logout();
        $response = [];
        $response['message'] = 'Logout successful.';
        return response($response, 200);
    }

    /**JWT EXAMPLES STUFF**/
    public function register(Request $request)
    {        
        $input = $request->all();
        $input['password'] = Hash::make($input['password']);
        User::create($input);
        return response()->json(['result'=>true]);
    }
    
    public function login(Request $request)
    {
        $input = $request->all();
        if (!$token = JWTAuth::attempt($input)) {
            return response()->json(['result' => 'wrong email or password.']);
        }
            return response()->json(['result' => $token]);
    }
    
    public function get_user_details(Request $request)
    {
        $input = $request->all();
        $user = JWTAuth::toUser($input['token']);
        return response()->json(['result' => $user]);
    }


}
