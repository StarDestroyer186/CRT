<?php
    session_start();

    // DO NOT just copy from _POST to _SESSION,
    // as it could allow a malicious user to override security.
    // Use a disposable variable key, such as "data" here.
    if (array_key_exists('print', $_POST)) {
        $_SESSION['print'] = $_POST['print'];
        // Timestamp sent by AJAX
        if (array_key_exists('title', $_POST)) {
            // TODO: verify ts, but beware of time zones!
            $_SESSION['title'] = $_POST['title'];
        }
        Header("Content-Type: application/json;charset=UTF-8");
            die(json_encode(array('status' => 'OK')));
        die("Error");
    }
    // This is safe (we move unsecurity-ward):
    $_POST['print']= $_SESSION['print'];
    $_POST['title']=$_SESSION['title'];
    unset($_SESSION['print']); // keep things clean.
    unset($_SESSION['title']); // keep things clean.
?>
<html>
<head>
<title><?php echo ( isset( $_POST['title'] ) && $_POST['title'] != '') ? $_POST['title'] : '';?></title>
<link type="text/css" rel="stylesheet" href="https://printjs-4de6.kxcdn.com/print.min.css"/>
<script type="text/javascript" src="js/jquery.min.js?v=<?php echo $last_ver['jquery.min.js']?>"></script>
<script type='text/javascript' src="js/print.min.js"></script>
<script>
$(document).ready(function()  {
    
    function printPDF() {
        // console.log( $('head title').html());
        // $('head title').html("MyPDF generator");
        // console.log( $('head title').html());
        var style='.tab_report { width:100%; border-collapse: collapse; overflow: hidden; }';
        style+='.tab_report th { border: 1px solid #ccc; background-color:#D5D5D5; font-size:12px; line-height:120%; font-weight:bold; padding:5px; text-align:left; }';
        style+='.tab_report td { border:1px solid #D5D5D5; font-size:12px; padding:5px; }';
        style+=    '.tab_report td.fixed { color: #ccc; background: url(img/ajax-loader.gif) no-repeat 4px center; margin-left: 20px;}';
        style+=    '.tab_report td.success {color: #0b0;}';
        style+=    '.tab_report td.fail {color: #000;}';

        printJS({
            printable: "app",
            type: "html",
            style:style,
            documentTitle:'LAOAPPS'
        });
    }
    printPDF();// print immediately  
});
</script>
</head>
<body>
    <div id="app">
    <?php echo ( isset( $_POST['print'] ) && $_POST['print'] != '') ?( $_POST['print']) : '';?>
    </div>
</body>
</html>