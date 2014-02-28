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
		{{ HTML::style('css/font-awesome.min.css') }}
		{{ HTML::style('css/style.css') }}

		{{ HTML::script('js/jquery.min.js') }}
		{{ HTML::script('js/jquery.hotkeys.js') }}
		{{ HTML::script('js/foundation.min.js') }}

		@yield('scripts')

		<script type="text/javascript">
			$(function() {
			    $.ajaxSetup({
			        headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
			    });
			});
		</script>
	</head>
	<body>
		<!-- BEGIN TOP BAR -->
		<nav class="top-bar" data-topbar="">
			<ul class="title-area">
				<li class="name">
					<h1><a href="/">Tempus Notes</a></h1>
				</li>
			</ul>

			<section class="top-bar-section">
				<ul class="right">
					@if(isset($user))
					<li class="divider"></li>
					<li class="has-dropdown not-click">
						{{ HTML::link('#', $user->email) }}
						<ul class="dropdown">
							<li>{{ HTML::link('home/about', 'About') }}</li>
							<li>{{ HTML::link('user/settings', 'Settings') }}</li>
							<li>{{ HTML::link('user/logout', 'Logout') }}</li>
						</ul>
					</li>
					@endif
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

		<script>
			(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			ga('create', 'UA-36320356-3', 'ianlamb.com');
			ga('send', 'pageview');
		</script>
	</body>
</html>