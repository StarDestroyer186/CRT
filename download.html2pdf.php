<?php

/*export by html2pdf*/
session_start();
require __DIR__.'/vendor/autoload.php';
use Spipu\Html2Pdf\Html2Pdf;

if(isset($_POST['file_name'])){
    if (isset($_SESSION['logined']) and $_SESSION['logined']) {
        if(isset($_POST['file_data'])){
			
			$file_name = $_POST['file_name'];
			$html = "<html><head></head><body>".$_POST['file_data']."</body></html>";
			
			$html2pdf = new Html2Pdf('P', 'A0', 'en', true, 'UTF-8');
			$html2pdf->setDefaultFont('javiergb');
			$html2pdf->pdf->SetDisplayMode('fullpage');
			$html2pdf->writeHTML($html);
			$html2pdf->output($file_name . '.pdf');
		}
	}else{
        echo 'no login';
    }
}

?>
