@extends('layouts.master')

@section('scripts')
	{{ HTML::script('js/app.js') }}
@endsection

@section('content')
	<div class="row collapse">
		<div class="large-1 small-2 columns">
			<span id="modePrefix" class="prefix">New</span>
		</div>
		<div class="large-11 small-10 columns">
			<input type="text" name="note" id="noteField" placeholder="Start typing..." maxlength="255" />
		</div>
	</div>

	<ul id="filters"></ul>

	<div id="loading">loading...</div>
	<div id="diary"></div>
@stop