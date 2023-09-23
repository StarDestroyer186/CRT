<?php
header('Access-Control-Allow-Origin:*');
session_start();
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="Expires" content="30" />
<title>Credence Tracker</title>
<link rel="Bookmark" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-fav-icon']; ?>" />
<link rel="Shortcut Icon" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-fav-icon'];?>" />
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon.png">
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery.cookie.js"></script>
<script type='text/javascript'>

function login_fail(ids){
  $("#idlogin").removeClass("disable").text("<?php echo $TEXT['login-login'] ?>")
  .addClass("enable").bind("click", call_login);
  if(ids==0){$("#iduser").focus();}
  else if(ids==1){$("#idpass").focus();}
}
function gotoUrl(url){
  location.href=url;
}
function call_login(){
  $("#idlogin").unbind("click").removeClass("enable").text("<?php echo $TEXT['login-loging'] ?>").addClass("disable");
  $("#error").css("display", "none");
  $("#validatecode").css("display", "none");
  
  try{
    var iduser = $("#iduser").val();
    if(iduser.length == 0){
      $("#error").css("display", "block");
      $("#error p").text("<?php echo $TEXT['login-nologinname'] ?>");
      login_fail(0);
      return;
    }
    var idpass = $("#idpass").val();
    if(idpass.length == 0){
      $("#error").css("display", "block");
      $("#error p").text("<?php echo $TEXT['login-nopassword'] ?>");
      login_fail(1);
      return;
    }
    var idmap = "GMap3";
    var timezoneOffset = new Date().getTimezoneOffset() / 60 * -1;
	var authcode = $("#idvalidate").val();
    $.post("login.ajax.php?t=" + new Date().getTime(), {"iduser": iduser, "idpass": idpass, "idmap": idmap, "timezone": timezoneOffset, "authcode": authcode}, function(data){            
      if(data.indexOf('ok')>=0){
        //save cookie
		if ($("#remember-me").prop("checked")) {
　　　　   $.cookie("anbtek_username", iduser, { expires: 7 });
　　　　   $.cookie("anbtek_password", idpass, { expires: 7 });
	　　} else {
	　　　$.cookie("anbtek_username", "", { expires: -1 });
	　　　$.cookie("anbtek_password", "", { expires: -1 });
	　　}
		
		gotoUrl("index.php");
      }else if(data.indexOf('stopped')>=0){
        $("#error").css("display", "block");
        $("#error p").text("<?php echo $TEXT['login-stopped'] ?>");
        login_fail(1);
      }else if(data.indexOf('invalid')>=0){
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
	  }*/else{
        $("#error").css("display", "block");
        $("#error p").text("<?php echo $TEXT['login-error'] ?>");
        login_fail(1);
      }
    });
  }catch(e){
    $("#error").css("display", "block");
    $("#error p").text("<?php echo $TEXT['login-invalid'] ?>");
    login_fail(0);
  }
}

function redirect2Mobile(){
	var mobileAgent = new Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate",
　　　　　　 "bada", "nokia", "lg", "ucweb", "skyfire");
	var browser = navigator.userAgent.toLowerCase(); 
	var isMobile = false; 
	for (var i=0; i< mobileAgent.length; i++) {
		if (browser.indexOf(mobileAgent[i])!=-1) { 
			isMobile = true; 
			location.href = 'mobile/mindex.php';
			break; 
		} 
	} 
}

function passview(){
	var password = $("#idpass").attr("type");
	if(password == "password"){
		$("#idpass").attr("type","text");
		$("#passeye").attr("src", "img/eye_open.svg");
	}else{
		$("#idpass").attr("type","password");
		$("#passeye").attr("src", "img/eye_close.svg");
	}
}

function oninit() {
    //redirect2Mobile();
	<?php if(!isset($_GET['lang'])){?>
	  var lang = navigator.userLanguage;
	  if(typeof lang == "undefined"){
		  lang=navigator.language;
	  }
	  if(typeof lang != "undefined"){
		if(lang.length > 2){
			lang = lang.substr(0,2)+'_'+lang.substr(3, 2).toUpperCase();
		}
		if(lang!="<?php echo $_SESSION['lang'] ?>" && $("#idlang [lang='"+lang+"']").length > 0){
			gotoUrl("login.php?lang="+lang);
			return;
		}
	  }
	<?php }?>
    $("input").keyup(function(event) {
      if (event.keyCode == '13') {
        call_login();
        event.preventDefault();
      }
    });
    $("#idlogin").bind("click", call_login);
    $("#iduser").focus();	
	
	$("#recpass").bind("click",function(){
		gotoUrl("recover.password.php?lang=<?php echo $_SESSION['lang'] ?>");
	});
	
	var useCookie = true;
	var url = location.search; 
    var theRequest = new Object()
    if (url.indexOf('?') != -1 && url.indexOf('lang=') == -1) {
        var str = window.decodeURIComponent(window.atob(url.substr(1))); 
		
		if(str.indexOf('iduser') != -1 && str.indexOf('idpass') != -1){
			var strs = str.split('&')
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];					 
			}
			
			if(theRequest.iduser != null && theRequest.idpass != null){
				$("#iduser").val(theRequest.iduser);
				$("#idpass").val(theRequest.idpass);
				useCookie = false;
				call_login();
			}
		}      		
    }
	
	if(useCookie){
		//get cookie
	　  var username = $.cookie('anbtek_username');
	　  var password = $.cookie('anbtek_password');
	　  $('#iduser').val(username);
	　  $('#idpass').val(password);
	　  if(username != null && username != '' && password != null && password != ''){
	　　　$("#remember-me").prop('checked',true);
		} 
	}		
}
</script>
<script src="https://cdn.tailwindcss.com"></script>

</head>
<body onload="oninit();">
<!-- <div class="vacenter">
<div class="header">
  <div class="logo"><img width="133px" height="50px" src="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-logo-main'];?>" /></div>
  <select id="idlang" onChange="gotoUrl(this.value);">
    <?php
    foreach ($support_lang as $key => $value) {
      if ($key == $_SESSION['lang']) {
        echo "<option value='login.php?lang=$key' lang='$key' selected='selected'>$value</option>\n";
      } else {
        echo "<option value='login.php?lang=$key' lang='$key'>$value</option>\n";
      }
    }?>
  </select>
</div>
<div class="cover">
</div>

<div class="content">
    <table border="0">
        <tr>
            <td width="50%" align="right">
                <p>
                    <div class="loginbg">
                    <a id="idlogin" class="button enable"><?php echo $TEXT['login-login'] ?></a>
                    </div>
                </p>
            </td>
            <td><div class="line"></div></td>
            <td width="50%" align="left">
                <div class="login">
                    <p><?php echo $TEXT['login-account'] ?><span class="gray"><?php echo $TEXT['login-input'] ?></span></p>
                    <p><input id="iduser" class="itext" type="text" size="20" value="" /></p>
                    <p><?php echo $TEXT['login-password'] ?></p>
                    <p><div class="passbox"><input id="idpass" class="itext" type="password" size="20" value="" maxlength="25" /><img src="img/eye_close.svg" id="passeye" onclick="passview()" title="<?php echo $TEXT['login-show-pass'] ?>"></img></div></p>
					<div id="validatecode" style="display: none;">
					<p><?php echo $TEXT['login-verification'] ?></p>
                    <p><input id="idvalidate" autocomplete="off" class="itext" type="text" size="20" value="" /></p>
					<p><img id="captcha_img" border='1' onclick='this.src="captcha.php?r=+Math.random()>"' style="width:100px; height:30px; cursor:pointer" /></p>
					</div>
					<p> 
						<input type="checkbox" name="remember-me" id="remember-me" value="remember-me"/> 
						<label class="bold-font" for="remember-me"><?php echo $TEXT['login-remember'] ?></label>
						<a id="recpass" style="cursor:pointer;" target="_blank"><?php echo $TEXT['recpass-subject'] ?></a>
					</p>
                    <div id="error" class="tips_wrap" style="display: none">
                      <p class="tips"></p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
	</br>
	<table border="0" cellspacing="0" class="download">
        <tr>
			<td width="9%" align="right">
                <p>                    
                    <img src='img/Mobile.svg' alt='null' height='80' width='80'>
                </p>
            </td>
            <td width="16%" align="left">
				<p><?php echo $TEXT['navi-mobile']; ?></span></p>
				<p><?php echo $TEXT['js-version']; ?><?php echo $last_ver['mobile.js']?></p>
				<p><a href="mobile/mindex.php" target="_blank"><?php echo $TEXT['js-enter']; ?></a></p>
            </td>
        </tr>
    </table>
</div>

<div class="footer">
  <p class="copyright"><?php echo $TEXT['global-copyright'] ?></p>
  <p class="copyright"><?php echo $TEXT['global-support'] ?></p>
</div>
</div> -->




<!--new page layout-->
<div class="bg-white h-screen lg:py-20">
        <div class="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-0 mr-auto mb-0 ml-auto max-w-7xl
            xl:px-5 lg:flex-row">
                <div class="w-full bg-cover relative max-w-md lg:max-w-2xl lg:w-7/12">
                    <div class="flex flex-col items-center justify-center w-full h-full relative lg:pr-10">
                        <img class="object-cover" src="img/map_banner.png" class="btn-" />
                    </div>
                </div>
                <div class="w-full mt-20 mr-0 mb-0 ml-0 relative z-10 max-w-2xl lg:mt-0 lg:w-5/12">
                    <div class="flex flex-col items-start justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl
                  relative z-10">
                        <p class="w-full text-4xl font-medium text-center leading-snug font-serif">Log-in to your account</p>
                        <div class="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                            <div class="relative">
                                <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600
                        absolute">Username</p>
                                <input id="iduser" placeholder="John" type="text" class="border placeholder-gray-400 focus:outline-none
                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                        border-gray-300 rounded-md" />
                            </div>
                            <div class="relative">
                                <p class="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                    Password</p>
                                <input placeholder="Password" id="idpass" type="password"
                                    class="border placeholder-gray-400 focus:outline-none focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md" />
                            </div>

                            <div class="mt-2 flex items-center">
                                <input type="checkbox" id="remember-me" name="remember-me" class="form-checkbox h-5 w-5 text-gray-600">
                                <label for="remember-me" class="ml-2 text-gray-600">Remember Me</label>
                            </div>

                            <div class="relative">
              <a id="idlogin" class="button enable w-full inline-block pt-4 pr-5 pb-4 pl-5 text-xl font-medium text-center text-white bg-indigo-500
                  rounded-lg transition duration-200 hover:bg-indigo-600 ease">Submit</a>
            </div>

                            <div class="flex justify-between">
                                <span class="mt-2 text-left">
                                    <label for="language" class="text-gray-600">Select Language:</label>
                                    <select id="idlang" onChange="gotoUrl(this.value);" class="block border border-gray-300 rounded-md mt-1 p-2 focus:outline-none focus:border-black">
                                        <?php
                                        foreach ($support_lang as $key => $value) {
                                          if ($key == $_SESSION['lang']) {
                                            echo "<option value='login.php?lang=$key' lang='$key' selected='selected'>$value</option>\n";
                                          } else {
                                            echo "<option value='login.php?lang=$key' lang='$key'>$value</option>\n";
                                          }
                                        }?>
                                      </select>
                                </span>
                                <span class="mt-2 text-right">
                                    <a href="_blank" id="recpass" class="text-gray-600 hover:underline">Recover
                                        Password</a>
                                </span>
                            </div>
                            
                            <div class="relative">
                                <a class="w-full inline-block pt-4 pr-5 pb-4 pl-5 text-md md:text-xs  font-medium text-center text-neutral-700
                        rounded-lg transition duration-200">CredenceTracker | © 2023 Copyright</a>
                            </div>
                        </div>
                    </div>
                    <svg viewbox="0 0 91 91" class="absolute top-0 left-0 z-0 w-32 h-32 -mt-12 -ml-12 text-yellow-300
                  fill-current">
                        <g stroke="none" strokewidth="1" fillrule="evenodd">
                            <g fillrule="nonzero">
                                <g>
                                    <g>
                                        <circle cx="3.261" cy="3.445" r="2.72" />
                                        <circle cx="15.296" cy="3.445" r="2.719" />
                                        <circle cx="27.333" cy="3.445" r="2.72" />
                                        <circle cx="39.369" cy="3.445" r="2.72" />
                                        <circle cx="51.405" cy="3.445" r="2.72" />
                                        <circle cx="63.441" cy="3.445" r="2.72" />
                                        <circle cx="75.479" cy="3.445" r="2.72" />
                                        <circle cx="87.514" cy="3.445" r="2.719" />
                                    </g>
                                    <g transform="translate(0 12)">
                                        <circle cx="3.261" cy="3.525" r="2.72" />
                                        <circle cx="15.296" cy="3.525" r="2.719" />
                                        <circle cx="27.333" cy="3.525" r="2.72" />
                                        <circle cx="39.369" cy="3.525" r="2.72" />
                                        <circle cx="51.405" cy="3.525" r="2.72" />
                                        <circle cx="63.441" cy="3.525" r="2.72" />
                                        <circle cx="75.479" cy="3.525" r="2.72" />
                                        <circle cx="87.514" cy="3.525" r="2.719" />
                                    </g>
                                    <g transform="translate(0 24)">
                                        <circle cx="3.261" cy="3.605" r="2.72" />
                                        <circle cx="15.296" cy="3.605" r="2.719" />
                                        <circle cx="27.333" cy="3.605" r="2.72" />
                                        <circle cx="39.369" cy="3.605" r="2.72" />
                                        <circle cx="51.405" cy="3.605" r="2.72" />
                                        <circle cx="63.441" cy="3.605" r="2.72" />
                                        <circle cx="75.479" cy="3.605" r="2.72" />
                                        <circle cx="87.514" cy="3.605" r="2.719" />
                                    </g>
                                    <g transform="translate(0 36)">
                                        <circle cx="3.261" cy="3.686" r="2.72" />
                                        <circle cx="15.296" cy="3.686" r="2.719" />
                                        <circle cx="27.333" cy="3.686" r="2.72" />
                                        <circle cx="39.369" cy="3.686" r="2.72" />
                                        <circle cx="51.405" cy="3.686" r="2.72" />
                                        <circle cx="63.441" cy="3.686" r="2.72" />
                                        <circle cx="75.479" cy="3.686" r="2.72" />
                                        <circle cx="87.514" cy="3.686" r="2.719" />
                                    </g>
                                    <g transform="translate(0 49)">
                                        <circle cx="3.261" cy="2.767" r="2.72" />
                                        <circle cx="15.296" cy="2.767" r="2.719" />
                                        <circle cx="27.333" cy="2.767" r="2.72" />
                                        <circle cx="39.369" cy="2.767" r="2.72" />
                                        <circle cx="51.405" cy="2.767" r="2.72" />
                                        <circle cx="63.441" cy="2.767" r="2.72" />
                                        <circle cx="75.479" cy="2.767" r="2.72" />
                                        <circle cx="87.514" cy="2.767" r="2.719" />
                                    </g>
                                    <g transform="translate(0 61)">
                                        <circle cx="3.261" cy="2.846" r="2.72" />
                                        <circle cx="15.296" cy="2.846" r="2.719" />
                                        <circle cx="27.333" cy="2.846" r="2.72" />
                                        <circle cx="39.369" cy="2.846" r="2.72" />
                                        <circle cx="51.405" cy="2.846" r="2.72" />
                                        <circle cx="63.441" cy="2.846" r="2.72" />
                                        <circle cx="75.479" cy="2.846" r="2.72" />
                                        <circle cx="87.514" cy="2.846" r="2.719" />
                                    </g>
                                    <g transform="translate(0 73)">
                                        <circle cx="3.261" cy="2.926" r="2.72" />
                                        <circle cx="15.296" cy="2.926" r="2.719" />
                                        <circle cx="27.333" cy="2.926" r="2.72" />
                                        <circle cx="39.369" cy="2.926" r="2.72" />
                                        <circle cx="51.405" cy="2.926" r="2.72" />
                                        <circle cx="63.441" cy="2.926" r="2.72" />
                                        <circle cx="75.479" cy="2.926" r="2.72" />
                                        <circle cx="87.514" cy="2.926" r="2.719" />
                                    </g>
                                    <g transform="translate(0 85)">
                                        <circle cx="3.261" cy="3.006" r="2.72" />
                                        <circle cx="15.296" cy="3.006" r="2.719" />
                                        <circle cx="27.333" cy="3.006" r="2.72" />
                                        <circle cx="39.369" cy="3.006" r="2.72" />
                                        <circle cx="51.405" cy="3.006" r="2.72" />
                                        <circle cx="63.441" cy="3.006" r="2.72" />
                                        <circle cx="75.479" cy="3.006" r="2.72" />
                                        <circle cx="87.514" cy="3.006" r="2.719" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <svg viewbox="0 0 91 91" class="absolute bottom-0 right-0 z-0 w-32 h-32 -mb-12 -mr-12 text-indigo-500
                  fill-current">
                        <g stroke="none" strokewidth="1" fillrule="evenodd">
                            <g fillrule="nonzero">
                                <g>
                                    <g>
                                        <circle cx="3.261" cy="3.445" r="2.72" />
                                        <circle cx="15.296" cy="3.445" r="2.719" />
                                        <circle cx="27.333" cy="3.445" r="2.72" />
                                        <circle cx="39.369" cy="3.445" r="2.72" />
                                        <circle cx="51.405" cy="3.445" r="2.72" />
                                        <circle cx="63.441" cy="3.445" r="2.72" />
                                        <circle cx="75.479" cy="3.445" r="2.72" />
                                        <circle cx="87.514" cy="3.445" r="2.719" />
                                    </g>
                                    <g transform="translate(0 12)">
                                        <circle cx="3.261" cy="3.525" r="2.72" />
                                        <circle cx="15.296" cy="3.525" r="2.719" />
                                        <circle cx="27.333" cy="3.525" r="2.72" />
                                        <circle cx="39.369" cy="3.525" r="2.72" />
                                        <circle cx="51.405" cy="3.525" r="2.72" />
                                        <circle cx="63.441" cy="3.525" r="2.72" />
                                        <circle cx="75.479" cy="3.525" r="2.72" />
                                        <circle cx="87.514" cy="3.525" r="2.719" />
                                    </g>
                                    <g transform="translate(0 24)">
                                        <circle cx="3.261" cy="3.605" r="2.72" />
                                        <circle cx="15.296" cy="3.605" r="2.719" />
                                        <circle cx="27.333" cy="3.605" r="2.72" />
                                        <circle cx="39.369" cy="3.605" r="2.72" />
                                        <circle cx="51.405" cy="3.605" r="2.72" />
                                        <circle cx="63.441" cy="3.605" r="2.72" />
                                        <circle cx="75.479" cy="3.605" r="2.72" />
                                        <circle cx="87.514" cy="3.605" r="2.719" />
                                    </g>
                                    <g transform="translate(0 36)">
                                        <circle cx="3.261" cy="3.686" r="2.72" />
                                        <circle cx="15.296" cy="3.686" r="2.719" />
                                        <circle cx="27.333" cy="3.686" r="2.72" />
                                        <circle cx="39.369" cy="3.686" r="2.72" />
                                        <circle cx="51.405" cy="3.686" r="2.72" />
                                        <circle cx="63.441" cy="3.686" r="2.72" />
                                        <circle cx="75.479" cy="3.686" r="2.72" />
                                        <circle cx="87.514" cy="3.686" r="2.719" />
                                    </g>
                                    <g transform="translate(0 49)">
                                        <circle cx="3.261" cy="2.767" r="2.72" />
                                        <circle cx="15.296" cy="2.767" r="2.719" />
                                        <circle cx="27.333" cy="2.767" r="2.72" />
                                        <circle cx="39.369" cy="2.767" r="2.72" />
                                        <circle cx="51.405" cy="2.767" r="2.72" />
                                        <circle cx="63.441" cy="2.767" r="2.72" />
                                        <circle cx="75.479" cy="2.767" r="2.72" />
                                        <circle cx="87.514" cy="2.767" r="2.719" />
                                    </g>
                                    <g transform="translate(0 61)">
                                        <circle cx="3.261" cy="2.846" r="2.72" />
                                        <circle cx="15.296" cy="2.846" r="2.719" />
                                        <circle cx="27.333" cy="2.846" r="2.72" />
                                        <circle cx="39.369" cy="2.846" r="2.72" />
                                        <circle cx="51.405" cy="2.846" r="2.72" />
                                        <circle cx="63.441" cy="2.846" r="2.72" />
                                        <circle cx="75.479" cy="2.846" r="2.72" />
                                        <circle cx="87.514" cy="2.846" r="2.719" />
                                    </g>
                                    <g transform="translate(0 73)">
                                        <circle cx="3.261" cy="2.926" r="2.72" />
                                        <circle cx="15.296" cy="2.926" r="2.719" />
                                        <circle cx="27.333" cy="2.926" r="2.72" />
                                        <circle cx="39.369" cy="2.926" r="2.72" />
                                        <circle cx="51.405" cy="2.926" r="2.72" />
                                        <circle cx="63.441" cy="2.926" r="2.72" />
                                        <circle cx="75.479" cy="2.926" r="2.72" />
                                        <circle cx="87.514" cy="2.926" r="2.719" />
                                    </g>
                                    <g transform="translate(0 85)">
                                        <circle cx="3.261" cy="3.006" r="2.72" />
                                        <circle cx="15.296" cy="3.006" r="2.719" />
                                        <circle cx="27.333" cy="3.006" r="2.72" />
                                        <circle cx="39.369" cy="3.006" r="2.72" />
                                        <circle cx="51.405" cy="3.006" r="2.72" />
                                        <circle cx="63.441" cy="3.006" r="2.72" />
                                        <circle cx="75.479" cy="3.006" r="2.72" />
                                        <circle cx="87.514" cy="3.006" r="2.719" />
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            
        </div>
    </div>



</body>
</html>
