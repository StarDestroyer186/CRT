<?php
include_once('lang.inc.php');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache" />
<meta http-equiv="Expires" content="30" />
<title><?php echo $TEXT['global-title']?></title>
<link rel="Bookmark" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-fav-icon']; ?>" />
<link rel="Shortcut Icon" href="<?php echo $TEXT['link-partner-site']; ?><?php echo $TEXT['link-fav-icon'];?>" />
<script type="text/javascript" src="js/jquery.min.js"></script>
<style type="text/css">
body{ margin: 0 auto; }
#header{ background-image: linear-gradient(to bottom,white,lightgray); height: 63px; border-bottom: 1px rgb(165,165,165) solid; }
#sec{ padding-left: 10px; width: 950px; margin: 0 auto;	display: flex; justify-content: space-between; align-items: center; }
#sec1{ width: 940px; margin: 0 auto; display: flex; justify-content: space-between; align-items: flex-end; }
#f1{ border: 1px #D3D3D3 solid; width: 940px; margin: 0 auto; border-radius: 5px; height: 250px; }
#f2{ padding-top: 10px; padding-right: 500px; text-align: right; }
#f3{ padding: 30px 550px 40px 140px; float: left; justify-content: space-around; }
#f4{ float: left; }
#uname{ width: 200px; margin-left: 20px; height: 30px; }
#email{ width: 200px; margin-left: 20px; margin-top: 10px; height: 30px; }
button{ margin-left: 93px; width: 100px; height: 30px; cursor: pointer; }
span{ margin: 10px; color: red; }
#chkmsg{ margin-left: 80px; color: red; }
</style>
<script type='text/javascript'>

function recover(){
	$("#chkmsg").html("");
	var uname = $("#uname").val(); 
	var email = $("#email").val(); 
	var preg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/; //匹配Email 
	
	if(uname==''){
		$("#chkmsg").html("<?php echo $TEXT['recpass-nousername'] ?>");
		return;
	}
	
	if(email==''){
		$("#chkmsg").html("<?php echo $TEXT['recpass-noemail'] ?>");
		return;
	}
	
	if(!preg.test(email)){ 
		$("#chkmsg").html("<?php echo $TEXT['recpass-emailformat'] ?>"); 
	}else{ 
		$("#sub_btn").attr("disabled","disabled").text("<?php echo $TEXT['recpass-submitting'] ?>").css("cursor","default"); 
		
		$.get("recover.mail.php",{"uname": uname, "mail": email, "lang": "<?php echo $_SESSION['lang'] ?>"},function(msg){ 
			if(msg=="noreg"){ 
				$("#chkmsg").html("<?php echo $TEXT['recpass-infoerror'] ?>"); 
				$("#sub_btn").removeAttr("disabled").text("<?php echo $TEXT['recpass-submit'] ?>").css("cursor","pointer"); 
				
			}else if(msg=="ok"){ 
				$("#chkmsg").html("<?php echo $TEXT['recpass-sendemail-successful'] ?>");	
				
			}else{
				$("#chkmsg").html(msg);
			}				
		}); 
	} 
}


</script>
</head>
<body>
	<div id="header"></div>
		<div id="sec">
			<div id="sec1">
				<h2><?php echo $TEXT['recpass-info'] ?></h2>														
			</div>
		</div>
		
		<div id="f1">				
			<div id="f2">
				<label for="uname"><?php echo $TEXT['info-username'] ?><span>*</span></label>
				<input id="uname" type="text" name="uname" autocomplete="off"></input>
				<br>
				<label for="email"><?php echo $TEXT['info-email'] ?><span>*</span></label>
				<input id="email" type="text" name="email" autocomplete="off"></input>				
				<br>
			</div>

			<div id="f3">
				<button type="submit" id="sub_btn" onclick="recover()"><?php echo $TEXT['recpass-submit'] ?></button>
			</div>
			<div id="f4">
				<label id="chkmsg"></label>
			</div>
		</div>
</body>
</html>