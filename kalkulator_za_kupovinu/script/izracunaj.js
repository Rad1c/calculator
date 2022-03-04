var valutaCijena = "USD";
var valutaPostarina = "USD";
var kursCijena = "1.73";     //napraviti da se na pocetku vrijednosti ucitaju u ove promjenjive
var kursPostarina = "1.73";
var eur = 1.96;
var usd = 1.73;
var bam = 1.0;

window.onload = function () {
    getCurrency("");
}

function showHideByClassName(imeKlase, stanje) {
    let elem = document.getElementsByClassName(imeKlase);
    for (let i = 0; i < elem.length; i++) {
        elem[i].style.display = stanje;
    }
}

function showHideById(idElement, stanje) {
    let elem = document.getElementById(idElement);
    elem.style.display = stanje
}

function izracunaj() {
    let cijenaElem = document.getElementById('input-cijena');
    let cijenaPostarinaElem = document.getElementById('input-postarina');
    let cijenaSaPostarinomElem = document.getElementById('cijena-sa-postarinom');
    let desnaStranaELem = document.getElementById('desna-strana');
    let lblKonacanIznosElem = document.getElementById('konacan-iznos');
    let konCijenaElem = document.getElementById('kon-cij');

    if(isNumeric(cijenaElem.value) && (isNumeric(cijenaPostarinaElem.value) || cijenaPostarinaElem.value === "")){
        //showHideByClassName('rezultat', 'grid');
        var postarina = 0;
        if(cijenaPostarinaElem.value !== "")
            postarina = konverzijaValuta(parseFloat(cijenaPostarinaElem.value), valutaPostarina, valutaCijena);

        let cijena = parseFloat(cijenaElem.value);
        let cijenaSaPostarinom = zaokruziNaDvijeDecimale(cijena+postarina);
        let konverzija = zaokruziNaDvijeDecimale(cijenaSaPostarinom * kursCijena);
        let carina = 0;
        let pdv = 0;
        
        if(konverzija >= 300){
            carina = zaokruziNaDvijeDecimale(konverzija * 0.1);
            pdv = zaokruziNaDvijeDecimale((konverzija + carina) * 0.17);
        }

        let konacnaCijena = zaokruziNaDvijeDecimale(konverzija + carina + pdv);

        konCijenaElem.innerText = konacnaCijena;
        lblKonacanIznosElem.innerText = konacnaCijena + " BAM";
        desnaStranaELem.innerHTML = konverzija + " BAM<br>" + carina + " BAM<br>" + pdv + " BAM";
        cijenaSaPostarinomElem.innerText = cijenaSaPostarinom + " " + valutaCijena;
        ocistiPolja();
    }
    else
        alert("Unesite ispravne podatke!");
}

function isNumeric(broj) {
    return /^\d*[.,]?\d+$/.test(broj)
}

function zaokruziNaDvijeDecimale(broj){
    return Math.round(broj * 100) / 100;
}

function ocistiPolja() {
    document.getElementById('input-cijena').value = "";
    document.getElementById('input-postarina').value = "";
}

function izaberiValutu(elem) {
    if(elem.name === "valuta-cijena"){
        valutaCijena = elem.options[elem.selectedIndex].value;
        kursCijena = vratiValutu(valutaCijena);
        document.getElementById('valuta-postarina').selectedIndex = elem.selectedIndex;
    }
    else if (elem.name === "valuta-postarina"){
        valutaPostarina = elem.options[elem.selectedIndex].value;
        kursPostarina = vratiValutu(valutaPostarina);
    }
}

function vratiValutu(nazivValute) {
    if(nazivValute === "USD")
        return usd;
    else if (nazivValute === "EUR")
        return eur;
}

function getCurrency(valuta) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if ((this.readyState == 4) && (this.status == 200)) {
            let jsonData = JSON.parse(this.responseText);
            bam = parseFloat(jsonData['bam']);
            eur = parseFloat(jsonData['eur']) / bam;
            usd = parseFloat(jsonData['usd']) / bam;
        }
    };

    xhr.open("POST", "/kalkulator_za_kupovinu/ajax/valuteAPI.php", true);        //true mozemo i da ne pisemo (ne caka zahtjev da dodje sa backend-a)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("valuta="+valuta);

}

function konverzijaValuta(iznos, valuta, novaValuta) {
    if (valuta === "USD" && novaValuta === "EUR"){
        iznos = iznos * (usd/eur);
    }
    else if(valuta === "EUR" && novaValuta === "USD"){
        iznos = iznos * (eur/usd);
    }
    return parseFloat(iznos);
}