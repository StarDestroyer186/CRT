<?php

/*export by dompdf*/
session_start();
require_once 'dompdf/autoload.inc.php';
use Dompdf\Dompdf;

if(isset($_POST['file_name'])){
    if (isset($_SESSION['logined']) and $_SESSION['logined']) {
        if(isset($_POST['file_data'])){
			
			$lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'en';
			
			if($lang == "zh_CN" or $lang == "zh_TW"){
				$font = "simsun";
			}else if($lang == "th"){
				$font = "thsarabunnew";
			}else if($lang == "ar"){
				$font = "simpo";
			}else{
				$font = "times-roman";
			}
			
			// reference the Dompdf namespace			
			$file_name = $_POST['file_name'];
			$html = "<html><head><style type='text/css'>body{font-family:".$font."; }</style></head><body>".$_POST['file_data']."</body></html>";
			
			// instantiate and use the dompdf class
			$dompdf = new Dompdf();
			$dompdf->getOptions()->setIsFontSubsettingEnabled(true);
			$dompdf->loadHtml($html);

			// (Optional) Setup the paper size and orientation
			$dompdf->setPaper('A1', 'landscape');

			// Render the HTML as PDF
			$dompdf->render();
			$dompdf->stream($file_name.'.pdf');
		}
		
	}else{
        echo 'no login';
    }
}	

?>
