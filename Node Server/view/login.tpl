<!DOCTYPE html>
<html>
	<head>
		<title>Login</title>
		<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0" />

        <link rel="shortcut icon" href="/icon/dev-icon.png">

        <link rel="stylesheet" type="text/css" href="/css/prism.css" />
        <link rel="stylesheet" type="text/css" href="/css/ghpages-materialize.css" />
        <link rel="stylesheet" type="text/css" href="/css/common.css" />
        <link rel="stylesheet" type="text/css" href="/css/login.css" />
        <link rel="stylesheet" type="text/css" href="/css/div.css" />

        <script src="/js/lib/jquery-3.2.1.min.js" ></script>
        <script src="/js/lib/sha256.min.js" ></script>
        <script src="/js/lib/sha1.min.js" ></script>
        <script src="/js/lib/materialize.js" ></script>

        <script src="/js/core/Login.js" ></script>
		
		<script>
			var login = new Login();
			$('body').ready(function(){
				login.initEvent();
			});
		</script>
        
	</head>
	<body>
        <div id="body" class="login">
            <nav><div class="nav-wrapper">ZecretZoft</div></nav>
            <div class="card loginCard">
                <div class="headerBar">
                    <div>เข้าสู่ระบบ</div>
                </div>
                <div class="cardContainer">
                    <div class="input-field col s6">
                        <input id="loginName" type="text" class="validate">
                        <label for="loginName">ชื่อล็อกอิน หรืออีเมล</label>
                    </div>
                    <div class="input-field col s12">
                        <input id="password" type="password" class="validate">
                        <label for="password" data-error="รหัสผ่านผิด">รหัสผ่าน</label>
                    </div>
                </div>
                <div>
                    <div class="waves-effect waves-light btn btnContainer" onclick="login.login()">Login</div>
                </div>
            </div>
            <div class="footer-copyright">
                <div class="container">© 2017 Copyright Text <a class="grey-text text-lighten-4 right" href="#!">More Links</a> </div>
            </div>
        </div>
	</body>
</html>