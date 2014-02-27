<!DOCTYPE html>
<html xml:lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="description" content="" />
		<meta name="keywords" content="" />
		<meta name="author" content="Ian Lamb, ianlamb32@gmail.com" />
		<meta name="viewport" content="width=device-width" />
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<link rel="icon" href="/img/favicon.ico" type="image/ico" />
		<title>Tempus Notes</title>

		{{ HTML::style('css/foundation.min.css') }}
		{{ HTML::style('css/style.css') }}

		{{ HTML::script('js/jquery.min.js') }}
		{{ HTML::script('js/jquery.hotkeys.js') }}
		{{ HTML::script('js/foundation.min.js') }}
		{{ HTML::script('js/app.js') }}

		<script type="text/javascript">
			$(function() {
			    $.ajaxSetup({
			        headers: {
			            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
			        }
			    });
			});
		</script>

		@yield('scripts')
	</head>
	<body>
		<!-- BEGIN TOP BAR -->
		<nav class="top-bar hide-for-small" data-topbar="">
			<ul class="title-area">
				<li class="name">
					<h1><a href="index.html">Tempus Notes</a></h1>
				</li>
			</ul>

			<section class="top-bar-section">
				<ul class="right">
					<li>{{ HTML::link('#', $user->email) }}</li>
					<li class="divider"></li>
					<li>{{ HTML::link('user/logout', 'Logout') }}</li>
				</ul>
			</section>
		</nav>
		<!-- END TOP BAR -->

		<!-- BEGIN CONTENT -->
		<div class="row">
			<div class="large-12 columns">
				<div id="content">
					@yield('content')
				</div>
			</div>
		</div>
		<!-- END CONTENT -->
		<footer class="container">
		
		</footer>
	</body>
</html>