function login_fail(ids) {
    $("#idlogin").removeClass("disable").text("<?php echo $TEXT['login-login'] ?>")
        .addClass("enable").bind("click", call_login);
    if (ids == 0) { $("#iduser").focus(); }
    else if (ids == 1) { $("#idpass").focus(); }
}
function gotoUrl(url) {
    location.href = url;
}
function call_login() {
    $("#idlogin").unbind("click").removeClass("enable").text("<?php echo $TEXT['login-loging'] ?>").addClass("disable");
    $("#error").css("display", "none");
    $("#validatecode").css("display", "none");

    try {
        var iduser = $("#iduser").val();
        if (iduser.length == 0) {
            $("#error").css("display", "block");
            $("#error p").text("<?php echo $TEXT['login-nologinname'] ?>");
            login_fail(0);
            return;
        }
        var idpass = $("#idpass").val();
        if (idpass.length == 0) {
            $("#error").css("display", "block");
            $("#error p").text("<?php echo $TEXT['login-nopassword'] ?>");
            login_fail(1);
            return;
        }
        var idmap = "GMap3";
        var timezoneOffset = new Date().getTimezoneOffset() / 60 * -1;
        var authcode = $("#idvalidate").val();
        $.post("login.ajax.php?t=" + new Date().getTime(), { "iduser": iduser, "idpass": idpass, "idmap": idmap, "timezone": timezoneOffset, "authcode": authcode }, function (data) {
            if (data.indexOf('ok') >= 0) {
                //save cookie
                if ($("#remember-me").prop("checked")) {
                    $.cookie("anbtek_username", iduser, { expires: 7 });
                    $.cookie("anbtek_password", idpass, { expires: 7 });
                } else {
                    $.cookie("anbtek_username", "", { expires: -1 });
                    $.cookie("anbtek_password", "", { expires: -1 });
                }

                gotoUrl("index.php");
            } else if (data.indexOf('stopped') >= 0) {
                $("#error").css("display", "block");
                $("#error p").text("<?php echo $TEXT['login-stopped'] ?>");
                login_fail(1);
            } else if (data.indexOf('invalid') >= 0) {
                //$("#validatecode").css("display", "block");
                //$("#captcha_img").trigger("click");
                $("#error").css("display", "block");
                $("#error p").text("<?php echo $TEXT['login-invalid'] ?>");
                login_fail(0);
            }/*else if(data.indexOf('noauth')>=0){
          $("#validatecode").css("display", "block");
          $("#captcha_img").trigger("click");
          $("#error").css("display", "block");
          $("#error p").text("<?php echo $TEXT['login-invalid-verification'] ?>");
          login_fail(0);
        }*/else {
                $("#error").css("display", "block");
                $("#error p").text("<?php echo $TEXT['login-error'] ?>");
                login_fail(1);
            }
        });
    } catch (e) {
        $("#error").css("display", "block");
        $("#error p").text("<?php echo $TEXT['login-invalid'] ?>");
        login_fail(0);
    }
}

function redirect2Mobile() {
    var mobileAgent = new Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate",
        "bada", "nokia", "lg", "ucweb", "skyfire");
    var browser = navigator.userAgent.toLowerCase();
    var isMobile = false;
    for (var i = 0; i < mobileAgent.length; i++) {
        if (browser.indexOf(mobileAgent[i]) != -1) {
            isMobile = true;
            location.href = 'mobile/mindex.php';
            break;
        }
    }
}

function passview() {
    var password = $("#idpass").attr("type");
    if (password == "password") {
        $("#idpass").attr("type", "text");
        $("#passeye").attr("src", "img/eye_open.svg");
    } else {
        $("#idpass").attr("type", "password");
        $("#passeye").attr("src", "img/eye_close.svg");
    }
}

function oninit() {
      //redirect2Mobile();
      <? php if (!isset($_GET['lang'])) {?>
        var lang = navigator.userLanguage;
        if (typeof lang == "undefined") {
            lang = navigator.language;
        }
        if (typeof lang != "undefined") {
            if (lang.length > 2) {
                lang = lang.substr(0, 2) + '_' + lang.substr(3, 2).toUpperCase();
            }
            if (lang != "<?php echo $_SESSION['lang'] ?>" && $("#idlang [lang='" + lang + "']").length > 0) {
                gotoUrl("login.php?lang=" + lang);
                return;
            }
        }
      <? php }?>
        $("input").keyup(function (event) {
            if (event.keyCode == '13') {
                call_login();
                event.preventDefault();
            }
        });
    $("#idlogin").bind("click", call_login);
    $("#iduser").focus();

    $("#recpass").bind("click", function () {
        gotoUrl("recover.password.php?lang=<?php echo $_SESSION['lang'] ?>");
    });

    var useCookie = true;
    var url = location.search;
    var theRequest = new Object()
    if (url.indexOf('?') != -1 && url.indexOf('lang=') == -1) {
        var str = window.decodeURIComponent(window.atob(url.substr(1)));

        if (str.indexOf('iduser') != -1 && str.indexOf('idpass') != -1) {
            var strs = str.split('&')
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
            }

            if (theRequest.iduser != null && theRequest.idpass != null) {
                $("#iduser").val(theRequest.iduser);
                $("#idpass").val(theRequest.idpass);
                useCookie = false;
                call_login();
            }
        }
    }

    if (useCookie) {
        //get cookie
        var username = $.cookie('anbtek_username');
        var password = $.cookie('anbtek_password');
        $('#iduser').val(username);
        $('#idpass').val(password);
        if (username != null && username != '' && password != null && password != '') {
            $("#remember-me").prop('checked', true);
        }
    }
}
  </script >