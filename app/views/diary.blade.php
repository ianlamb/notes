@extends('layouts.master')

@section('scripts')
@endsection

@section('content')
	<input type="text" name="newnote" id="newNote" placeholder="Start typing..." maxlength="255" />

	<div id="loading">loading...</div>
	<div id="diary"></div>
@stop