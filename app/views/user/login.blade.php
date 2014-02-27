@extends('layouts.master')

@section('content')
	<div id="login-div" class="large-4 large-offset-4 columns">
		{{ Form::open(array('url' => 'user/login', 'method' => 'POST')) }}
			<fieldset>
				<legend>Login</legend>
				
				<?=Form::label('email', 'Email')?>
				<?=Form::text('email')?>
				@if ($errors->has('email'))
					@foreach ($errors->get('email', '<p class="alert alert-error">:message</p>') as $email_error)
						{{ $email_error }}
					@endforeach
				@endif
				
				<?=Form::label('password', 'Password')?>
				<?=Form::password('password')?>
				@if ($errors->has('password'))
					@foreach ($errors->get('password', '<p class="alert alert-error">:message</p>') as $password_error)
						{{ $password_error }}
					@endforeach
				@endif
				
				<br />
				<?=Form::submit('Authenticate', array('class' => 'small button'))?>
			</fieldset>
		{{ Form::close() }}
	</div>
@stop