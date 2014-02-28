<?php

class UserController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| The User Controller
	|--------------------------------------------------------------------------
	|
	| This controller processes all authentication and registration requests before a user enters their session.
	|
	*/

    protected $layout = 'layouts.master';

	public function getLogin()
	{
		return View::make('user.login');
	}

	public function postLogin()
	{
		// validation
		$rules = array(
			'email' => 'required|email',
			'password' => 'required|between:4,16'
		);
		
		$messages = array(
			'same'    => 'The :attribute and :other must match.',
			'size'    => 'The :attribute must be exactly :size.',
			'between' => 'The :attribute must be between :min - :max.',
			'in'      => 'The :attribute must be one of the following types: :values',
			'exists'  => 'The :attribute does not exist in our records.'
		);

		$validation = Validator::make(Input::all(), $rules, $messages);

		if ($validation->fails())
		{
			return Redirect::to('user/login')->with('errors', $validation->messages());
		}

		$email = Input::get('email');
		$password = Input::get('password');

		if(Input::get('register') == 1) {
			// register
			try {
				$user = new User();
				$user->email = $email;
				$user->password = Hash::make($password);
				$user->save();
				Auth::login($user);
			
				return Redirect::to('/');
			} catch( Exception $e ) {
				Session::flash('status_error', 'An error occurred while creating a new user - please try again.');
				return Redirect::to('/user/login');
			}
		} else {
			// login
			$credentials  = array(
				'email' => $email,
				'password' => $password
			);
			
			if ( Auth::attempt($credentials) )
			{
				return Redirect::to('/');
			}
			else
			{
				return Redirect::to('user/login')->with('login_errors', true);
			}
		}
	}

	public function getLogout()
	{
		Auth::logout();
        return Redirect::to('user/login');
	}

	public function postCheck()
	{
		$result = User::where('email', Input::get('email'))->first();
		
		if(!Input::old('email') && !empty($result) )
			return Response::json(array('status' => 'exists'));
		
		return Response::json(array('status' => 'notfound'));
	}

}
