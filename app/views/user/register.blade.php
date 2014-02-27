@extends('layouts.master')

@section('content')
	<div id="register-div" class="large-4 large-offset-4 columns well">
		{{ Form::open(array('url' => 'user/register', 'method' => 'POST')) }}
			<fieldset>
				<legend>Register</legend>
				
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
				
				<?=Form::label('password_confirmation', 'Confirm Password')?>
				<?=Form::password('password_confirmation')?>
				
				<br />
				<?=Form::submit('Register', array('class' => 'btn btn-primary'))?>
			</fieldset>
		{{ Form::close() }}
	</div>
@stop