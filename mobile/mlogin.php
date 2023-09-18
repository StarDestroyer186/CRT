<?php
session_start();
include_once('../lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="Expires" content="30" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta content="black" name="apple-mobile-web-app-status-bar-style">     
<meta content="telephone=no" name="format-detection">
<title><?php echo $TEXT['global-title'] . ' - ' . $TEXT['login-title'] ?></title>
<link rel="Bookmark" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-mfav-icon'];?>" />
<link rel="Shortcut Icon" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-mfav-icon'];?>" />
<link rel="apple-touch-icon" href="../img/apple-touch-icon.png">
<link rel="apple-touch-icon-precomposed" href="../img/apple-touch-icon.png">
<script type="text/javascript" src="../js/jquery.min.js"></script>
<script type="text/javascript" src="../js/jquery.cookie.js"></script>
<script type='text/javascript'>
function login_fail(ids){
  $("#idlogin").bind("click", call_login);
  $("#logintxt").removeClass("disable").text("<?php echo $TEXT['login-login'] ?>").addClass("enable");
  if(ids==0){$("#iduser").focus();}
  else if(ids==1){$("#idpass").focus();}
}
function login_succeed(ids){
	$("#idlogin").bind("click", call_login);
	$("#logintxt").removeClass("disable").text("<?php echo $TEXT['login-login'] ?>").addClass("enable");
	$("#error").css("display", "none");
	$("#iduser").val("");
	$("#idpass").val("");
}
function gotoUrl(url){
  location.href=url;
}

function call_login(){
  $("#idlogin").unbind("click");
  $("#logintxt").removeClass("enable").text("<?php echo $TEXT['login-loging'] ?>").addClass("disable");
  $("#error").css("display", "none");
  
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
    $.post("../login.ajax.php?t=" + new Date().getTime(), {"iduser": iduser, "idpass": idpass, "idmap": idmap, "timezone": timezoneOffset, "authcode": authcode}, function(data){            
	  if(data.indexOf('ok')>=0){
		 //save cookie
		 if ($("#remember-me").prop("checked")) {
　　　　    $.cookie("anbtek_username", iduser, { expires: 7 });
　　　　    $.cookie("anbtek_password", idpass, { expires: 7 });
	　　 } else {
	　　　　$.cookie("anbtek_username", "", { expires: -1 });
	　　　　$.cookie("anbtek_password", "", { expires: -1 });
	　　 }
		 var result = eval('(' + data + ')');
		 $.cookie("pull_uid", result.uid, { expires: 30 });
		 $.cookie("pull_lang", "<?php echo $_SESSION['lang'] ?>", { expires: 30 });
		 $.cookie("pull_zone", timezoneOffset, { expires: 30 });
         gotoUrl("mindex.php");
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


function passview(){
	var password = $("#idpass").attr("type");
	if(password == "password"){
		$("#idpass").attr("type","text");
		$("#passeye").attr("src", "../img/eye_open.svg");
	}else{
		$("#idpass").attr("type","password");
		$("#passeye").attr("src", "../img/eye_close.svg");
	}
}
function oninit() {
<?php if(!isset($_GET['lang'])){?>
  var lang = navigator.userLanguage;
  if(typeof lang == "undefined"){
      lang=navigator.language;
  }
  if(typeof lang != "undefined"){
    if(lang.length > 2){
        lang = lang.substr(0,2)+'_'+lang.substr(3, 2).toUpperCase();
    }
    if(lang!="<?php echo $_SESSION['lang'] ?>"){
		gotoUrl("mlogin.php?lang="+lang);
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
		gotoUrl("../recover.password.php?lang=<?php echo $_SESSION['lang'] ?>");
  });
  
  $('#idserver option:first').prop('selected', 'selected');
  //get cookie 
　var username = $.cookie('anbtek_username');
　var password = $.cookie('anbtek_password');
　$('#iduser').val(username);
　$('#idpass').val(password);
　if(username != null && username != '' && password != null && password != ''){
　　　$("#remember-me").prop('checked',true);
  }
}
</script>

<style type="text/css">
<!--
* { -webkit-overflow-scrolling: touch; }
html, body { margin: 0; padding: 0; width: 100%; height: 100%; font-size: 14px; font-family: Arial, Tahoma; overflow: auto; background: #F8F8F8; }
input::-ms-reveal, input::-ms-clear { display: none; }
input::-webkit-credentials-auto-fill-button { visibility: hidden; }
.header { width: 100%; height: 50px; background: #2B82D4; display: table }
.header-text { float: left; line-height: 50px; height: 50px; padding: 0 15px; font-size: 18px; color: #ffffff; }
#wrapper { position:absolute; left: 20px; top: 60px; right: 20px; bottom: 5px; }
#idserver { border: 1px solid #E8E8E8; width: 100%; font-size: 14px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; font-size: 14px; height: 32px; background: #FFFFFF url(mimg/server.svg) no-repeat 5px center; background-size : 20px 20px; padding-left: 35px;} 
#iduser { border: 1px solid #E8E8E8; width: 100%; font-size: 14px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; font-size: 14px; height: 32px; background: #FFFFFF url(mimg/user.svg) no-repeat 5px center; background-size : 20px 20px; padding-left: 35px;} 
#idpass { border: 1px solid #E8E8E8; width: 100%; font-size: 14px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; font-size: 14px; height: 32px; background: #FFFFFF url(mimg/key.svg) no-repeat 5px center; background-size : 20px 20px; padding-left: 35px;} 
#idvalidate { border: 1px solid #E8E8E8; width: 89%; font-size: 14px; height: 32px; background: #FFFFFF url(mimg/verification.svg) no-repeat 5px center; background-size : 20px 20px; padding-left: 35px;} 
.tips { background-color: #FBECEC; border: 1px solid #E35656; color: #c00; padding: 3px 5px; }
.bold-font { font-weight: bold; color: #555555; }
.pull-right { width: 100%;  height: 35px; }
.pull-left { float: left !important; height: 30px; }
.icon-button { width: 100%; background-color: #2B82D4; border: none; color: white; padding: 1px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 14px; margin: 0px 2px;  cursor: pointer; border-radius: 4px; box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19); height: 35px; }
.icon-button-login { padding-left: 25px; background: url(mimg/login.svg) no-repeat center left; background-size : 15px 15px; }
.enable { font-weight: bold; color: #fff; background: transparent; cursor: pointer; }
.disable { font-weight: normal; color: #ccc; cursor: default; }
.recpass { position: relative; top: 15px; left: 5px; display: none; }
.itext { outline-style: none;  border: 1px solid #ccc; border-radius: 3px; }
.iselect { outline-style: none;  }
.passbox{ position: relative; }
#idpass { outline: none; }
#passeye { position: absolute; top: 6px; right: 10px; width: 20px; cursor: pointer; }
-->
</style>	
</head>

<body onload="oninit();" ontouchmove="event.preventDefault();">
	<div class="header">
		<span class="header-text"><?php echo $TEXT['connect-to'] ?></span>
	</div>
	
	<div id="wrapper">		
		<label class="bold-font"><?php echo $TEXT['login-detail'] ?></label>
		<select class="iselect" style="float: right" id="idlang" onChange="gotoUrl(this.value);">
			<?php
			foreach ($support_lang as $key => $value) {
			  if ($key == $_SESSION['lang']) {
				echo "<option value='mlogin.php?lang=$key' lang='$key' selected='selected'>$value</option>\n";
			  } else {
				echo "<option value='mlogin.php?lang=$key' lang='$key'>$value</option>\n";
			  }
			}?>
		</select>
		
		<?php if(sizeof($support_server) > 0){?>
			<br><br>
			<select id="idserver" onChange="gotoUrl(this.value);">
				<?php
				foreach ($support_server as $key => $value) {
					$server = $value . "/mobile/mindex.php";
					echo "<option key='$key' value='$server'>$value</option>\n";
				}?>
			</select>
		<?php }?>
		<p> 					
			<input id="iduser" class="itext"  name="username" type="text" placeholder="<?php echo $TEXT['login-account'] ?>"/>
		</p>	
		<p> 
			<div class="passbox">
				<input id="idpass" class="itext" name="password" type="password" placeholder="<?php echo $TEXT['login-password'] ?>"/> 
				<img src="../img/eye_close.svg" id="passeye" onclick="passview()" title="<?php echo $TEXT['login-show-pass'] ?>"></img>
			</div>
		</p>	
		<div id="validatecode" style="display: none;">
			<!--<p><?php echo $TEXT['login-verification'] ?></p>-->
			<p><input id="idvalidate" autocomplete="off" class="itext" type="text" size="20" value="" placeholder="<?php echo $TEXT['login-verification'] ?>"/></p>
			<p><img id="captcha_img" border='1' onclick='this.src="../captcha.php?r=+Math.random()>"' style="width:100px; height:30px; cursor:pointer" /></p>
		</div>

		<div id="error" class="tips_wrap" style="display: none">
		    <p class="tips"></p>
		</div>
		<div> <!--class="pull-left"-->
			<p> 
				<input type="checkbox" name="remember-me" id="remember-me" value="remember-me"/> 
				<label class="bold-font" for="remember-me"><?php echo $TEXT['login-remember'] ?></label>				
			</p>
		</div>
		<div class="pull-right" id="idlogin">
			<button  type="button" class="icon-button">
			  <span class="icon-button-login"></span><span id="logintxt"><?php echo $TEXT['login-login'] ?></span>
			</button>
		</div>
		
		<div class="recpass">
			<a id="recpass" style="cursor:pointer; white-space:nowrap;" target="_blank"><?php echo $TEXT['recpass-subject'] ?></a>
		</div>

	</div>
</body>
</html>