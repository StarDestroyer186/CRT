<?php
$lang = $_SESSION['lang'];
$maptype = $_SESSION['maptype'];
$output = "";
if($maptype == 'GMap2'){
	$output .= "<script type=\"text/javascript\" src=\"http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;hl=$lang&amp;key=ABQIAAAAjU0EJWnWPMv7oQ-jjS7dYxSPW5CJgpdgO_s4yyMovOaVh_KvvhSfpvagV18eOyDWu7VytS6Bi1CWxw\"></script>\n";
	//$output .= "<script type=\"text/javascript\" src=\"map/labeledmarker.js\"></script>\n";
	$output .= "<script type=\"text/javascript\" src=\"map/map.google.v2.js\"></script>\n";
}else if($maptype == 'GMap3'){
	$output .= "<script type=\"text/javascript\" src=\"http://maps.google.com/maps/api/js?sensor=false&language=$lang\"></script>\n";
	$output .= "<script type=\"text/javascript\" src=\"map/map.google.v3.js\"></script>\n";
}
$output .= "<script type=\"text/javascript\" src=\"map/map.operat.js\"></script>\n";
echo $output; 
?>