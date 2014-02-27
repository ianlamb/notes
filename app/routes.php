<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::filter('auth', function()
{
	if (Auth::guest()) return Redirect::to('user/login');
});

Route::get('/', 'NotesController@getDiary');
//Route::get('/', array('before' => 'auth'));

Route::post('note', array('before' => 'csrf', function() {
	$token = Request::ajax() ? Request::header('X-CSRF-Token') : Input::get('_token');
	if (Session::token() != $token) {
		throw new Illuminate\Session\TokenMismatchException;
	}
}));

Route::controller('home','HomeController');
Route::controller('user','UserController');
Route::controller('notes','NotesController');