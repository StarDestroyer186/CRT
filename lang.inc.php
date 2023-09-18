<?php
include_once('default.inc.php');
require_once('config.inc.php');
$lang = isset($_GET['lang']) ? $_GET['lang'] : (isset($_SESSION['lang']) ? $_SESSION['lang'] : 'en');

if (!array_key_exists($lang, $support_lang)) {
    $lang = 'en';
}
$_SESSION['lang'] = $lang;

include_once("lang/$lang.php");
?>