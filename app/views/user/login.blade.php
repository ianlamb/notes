@extends('layouts.master')

@section('content')
	<div id="loginDiv" class="large-4 large-offset-4 columns panel">
		{{ Form::open(array('url' => 'user/login', 'method' => 'POST', 'id' => 'loginForm')) }}
				<h4>Login / Auto-Register</h4>
				
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
				
				<input type="hidden" name="register" id="register" value="0" />
				<?=Form::button('Authenticate', array('id' => 'authBtn', 'class' => 'small button'))?>
		{{ Form::close() }}

		@if(Session::get('status_error') != null)
		<p style="font-size:10px; color:orangered;">{{ Session::get('status_error') }}</p>
		@endif
	</div>

	<script type="text/javascript">
		$(function() {
			$('#password').on('keypress', null, 'return', function() {
				$('#authBtn').trigger('click');
			});
			$('#email').on('keypress', null, 'return', function() {
				$('#authBtn').trigger('click');
			});

			$('#authBtn').on('click', '', function(){
				$.ajax({
					url: '/user/check',
					data: 'email=' + $('#email').val(),
					type: 'POST',
					success: function(result) {
						if(result.status == "exists") {
							$('#loginForm').submit();
						} else if(result.status == "notfound") {
							if(confirm('This account does not exist. Click "OK" to register and continue with login.')) {
								$('#register').val(1);
								$('#loginForm').submit();
							}
						}
					},
					error: function() {

					}
				});
			});
		});
	</script>
@stop