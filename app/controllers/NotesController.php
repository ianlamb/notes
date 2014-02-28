<?php

class NotesController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/
	
	public function __construct()
	{
		$this->beforeFilter('auth');
	}

	public function getDiary()
	{
		return View::make('diary')->with('user', Auth::user());
	}

	public function getAll()
	{
		$notes = Auth::user()->notes()->orderBy('timestamp', 'DESC')->get();

		return Response::json($notes);
	}

	public function postCreate()
	{
		$note = new Note;

		$note->user_id = Auth::user()->id;
		$note->body = Input::get('body');
		$note->timestamp = new DateTime(Input::get('timestamp'));

		$note->save();

		return Response::json(array('id' => $note->id));
	}

	public function postUpdate()
	{
		$note = Note::find(Input::get('id'));

		if(Input::old('active'))
			$note->active = Input::get('active');
		if(Input::old('important'))
			$note->important = Input::get('important');

		$note->save();

		return Response::json(array('id' => $note->id));
	}

	public function postDelete()
	{
		Note::destroy(Input::get('id'));

		return Response::json(array('status' => 'success'));
	}
}