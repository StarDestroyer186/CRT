<?php
$body = file_get_contents('php://input');
$json = json_decode($body );
$ok=" ";
if(isset($json->{'action'})){
 	$getAction=$json->{'action'};
 	if($getAction == "new_ticket"){
		$ok="{\"Status\":\"1\",\"Description\":\"OK\"}";
	}
	else if($getAction == "check_ticket"){
		if($json->{'customer'} == "abcd"){
			$ok="{\"Status\":\"0\",\"Description\":\"Name Error!\"}";
		}
		else{
			$ok="{\"Status\":\"1\",\"Description\":\"OK\"}";
		}
	}
	else if($getAction == "query_seat"){
		$ok="{\"Status\":\"1\",\"enable\": [\"10010\", \"00110\", \"001\", \"11111\", \"11010\"]}";
	}
	else if($getAction == "query_time"){
		$ok="{\"Status\":\"1\",\"travel_time\":[{\"date\":\"2020-10-1\",\"time\":[\"6:00\",\"8:00\",\"10:00\",\"12:00\",\"14:00\",\"16:00\",\"18:00\"]},{\"date\":\"2020-10-2\",\"time\":[\"6:30\",\"8:30\",\"10:30\",\"12:30\",\"14:30\",\"16:30\",\"18:30\"]},{\"date\":\"2020-10-5\",\"time\":[\"7:00\",\"9:00\",\"11:00\",\"13:00\",\"15:00\",\"17:00\",\"19:00\"]}]}";
	}
	else{
		$ok="error";
	}
}
else
{
	$ok="JSON Err";
}
echo $ok;

?>
