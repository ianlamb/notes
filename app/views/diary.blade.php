@extends('layouts.master')

@section('scripts')
	{{ HTML::script('js/app.js') }}
@endsection

@section('content')
	<input type="text" name="newnote" id="newNote" placeholder="Start typing..." maxlength="255" />

	<ul id="filters"></ul>

	<div id="loading">loading...</div>
	<div id="diary"></div>
@stop