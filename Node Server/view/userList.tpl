<!DOCTYPE html>
<html>
	<head>
		<title>List of User</title>
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
        
	</head>
	<body>
        {{{ topBar }}}
        <div id="body" class="container bodyContainer card">
            <div>
                <table class="highlight striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Email</th>
                            <th colspan="2">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{ #userList }}
                            <tr>
                                <td>{{ name }}</td>
                                <td>{{ surname }}</td>
                                <td>{{ email }}</td>
                                <td>
                                    <div class="tableIcon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.09 20.21,11.09 20.42,11.3L21.7,12.58C21.91,12.79 21.91,13.14 21.7,13.35M12,18.94L18.06,12.88L20.11,14.93L14.06,21H12V18.94M12,14C7.58,14 4,15.79 4,18V20H10V18.11L14,14.11C13.34,14.03 12.67,14 12,14M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4Z" />
                                        </svg>
                                    </div>
                                </td>
                                <td>
                                    <div class="tableIcon">
                                        <svg viewBox="0 0 24 24">
                                            <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                                        </svg>
                                    </div>
                                </td>
                            </tr>
                        {{ /userList }}
                    </tbody>
                </table>
            </div>
        </div>
	</body>
</html>