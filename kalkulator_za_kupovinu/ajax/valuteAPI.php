<?php
    if (isset($_REQUEST['valuta'])){
        $_valuta = $_REQUEST['valuta'];
        $api_id = 'a87f2100a5bb754e791e323c55a4e22a'; // Moj API id
        $url = 'https://api.kursna-lista.info/'.$api_id.'/kursna_lista/json';
        //var_dump($_REQUEST);
        try {
            $content = file_get_contents($url);
        }
        catch (Exception $e){
            //Ako nije uspio da pribavi podatke preko API-ja
            die();
        }

        if (empty($content)) {
            //die('Greška u preuzimanju podataka');
            die();
        }

        $data = json_decode($content, true);

        //print_r($data);
        //$fajl = fopen("test.txt", "w+");
        //uzimam one valute koje mi trebaju
        if ($data['status'] == 'ok') {
            $valute['bam'] = (float)$data["result"]["bam"]["sre"];
            $valute['eur'] = (float)$data["result"]["eur"]["sre"];
            $valute['usd'] = (float)$data["result"]["usd"]["sre"];
            $js_valute = json_encode($valute);
            echo $js_valute;
            //fwrite($fajl, $bam);
        }
        else {
            //Ako je dobro parsirao podatke
            die();
        }
    }
    else
        //Ako zahtjev nije ispravno poslan izlazim iz programa
        die();
?>