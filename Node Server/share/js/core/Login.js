var Login = function() {

    var object = this;

    this.initEvent = function() {
        console.log('OK!!!!!');
    }

    this.login = function() {
        var loginName = $('#loginName').val();
        var password = $('#password').val();
        var shaPassword = sha256(password);
        var salt = this.getSalt(20);
        var encryptedPassword = sha256(shaPassword + salt);
        var dict = {
            'loginName': loginName,
            'password': encryptedPassword,
            'salt': salt,
        }
        var dump = JSON.stringify(dict);
        $.post('https://www.zecretzoft.tk/login', {'data': dump}, function(res) {
            var response = JSON.parse(res);
            console.log(response);
            if (response.isSuccess) {
                $('#password').removeClass('invalid');
                $('#loginName').removeClass('invalid');
                window.location = response.url;
                // $('#loginFailText').hide();
            } else if (response.username == false) {
                $('#loginName').addClass('invalid');
                // $('#loginFailText').show();
            } else if (response.password == false) {
                $('#password').addClass('invalid');
            }
        });
    }

    this.getSalt = function(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


}