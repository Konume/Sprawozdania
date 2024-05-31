# Sprawozdania
Sprawozdania
Aby uruchomić server do strony należy w konsoli cmd przejść do katalogu projektu i wpisać komende node server.js. W przeglądarce należy przejść na http://localhost:80881/
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Nazwa pełna: Strona do odczytania i analizy Sprawozdań Finansowych w Javie
Nazwa skrócona: Sprawozdania
Opis projektu i cele tworzonego oprogramowania
Celem mojego projektu jest stworzenie strony webowej umożliwiającej użytkownikom analizę sprawozdań finansowych przedsiębiorstw. Strona będzie umożliwiała wczytywanie danych finansowych z plików XML, analizę tych danych za pomocą różnych wskaźników finansowych oraz wizualizację wyników w formie interaktywnych wykresów i raportów. Projekt ma na celu ulepszyć otwartość i przejrzystość danych finansowych na rynku Polskim
Data początku projektu: 9 marca 2024
Data końca projektu: Przybliżony 9 marca 2026
Odpowiedzialność za oprogramowanie:
Budżet i harmonogram prac: 0,00 zł, harmonogram prac w pliku dokumentacja.ods
Technologie
    • Java: Główny język programowania.
    • XSL
Prawa autorskie
    • Autor: Zuzanna Szymańska
    • Warunki licencyjne do oprogramowania: MIT license  
Funkcjonalności
    1. Wczytywanie danych: Możliwość wczytywania sprawozdań finansowych z plików XML, które pobrałeś z eKRS
    2. Dostęp do sprawozdań załadowanych na serwerze. Możliwość umieszczenia tam sprawozdań z rejonu. Wybierając z listy pobieranej przez json’a umieszczonego na serwerze. 
    3. Wizualizacje wyników interaktywnie oraz wizualizacja sprawozdań:
       Obrazowe przedstawienie sprawozdania finansowego poprzez stronę html,
       Obrazowe przestawienie wyników finansowych, jak bilans, rachunek zysków i strat.
    4. Analiza danych finansowych.
       Analizowanie danych wyczytanych w standardowych raportach finansowych, przez wyliczanie wskaźników. ---- w trakcie 
    5. Przedstawienie wskaźników finansowych
       Przedstawienie wyliczonych wskaźników poprzez analizę w przejrzysty sposób.  --- w trakcie
Struktura projektu na dzień 31.05.2024 
/Sprawozdania
├── node_modules/
├── public/                 # Przykładowe pliki XML i widok XML   
│   ├── xml/
|   ├── xsd/
|   ├── xsl/
│   ├── index.html
│   ├── scripts.js
│   ├── sf.js
│   ├── style.css
│   ├── sf.css
│   ├── sprawozdanie.png
├── package.json                    
├── package-lock.json 
└── server.js                  
Implementacja
    1. Wczytywanie danych: Wczytywanie danych z plików XML 
    2. Analiza finansowa: Obliczanie wskaźników finansowych na podstawie wczytanych danych. --- w trakcie
    3. Wizualizacje: Tworzenie wykresów za pomocą biblioteki JFreeChart. ---- w trakcie
    4. Interfejs użytkownika: Tworzenie interfejsu użytkownika za pomocą JavaFX. ---- w trakcie

    
Przykładowy kod: Wczytywanie danych z plików XML 
const xsltProcessor = new XSLTProcessor();

const kopiaElementow = (xsl, zmienna, xml, tag, elementy) => {
    let varNode;
    for (let el of xsl.getElementsByTagName("xsl:variable")) {
        if (el.getAttribute('name') == zmienna){
            varNode = el;
        break;
    }
}

if (!varNode) {
    console.error(`Nie znaleziono zmiennej XSL: ${zmienna}`);
    return;
}

    let elements = xml.children[0].children;
    for (let el of elements) {
        if (!elementy || elementy.includes(el.getAttribute('name'))) {
            const rootNode = xsl.importNode(el, true);
            varNode.appendChild(rootNode);
        }
    }
};

function saveXml(xml) {
    var formData = new FormData();
    formData.append('file2', new Blob([xml], { type: 'text/xml' }));
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/xml', true);
    xhr.onload = () => {
        console.log(xhr.statusText, xhr.responseXML);
    };
    xhr.onerror = () => {
        console.error(xhr.statusText);
    };
    xhr.send(formData);
}

const loadXML = async (url) => {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.responseXML);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

(async () => {
    const xsl = await loadXML("public/xsl/JednostkaInna.xsl");

    const nazwy = await loadXML('public/xsd/JednostkaInnaStrukturyDanychSprFin_v1-0.xsd');
    kopiaElementow(xsl, "nazwy", nazwy, "xsd:complexType", ['BilansJednostkaInna', 'RZiSJednostkaInna', 'ZestZmianWKapitaleJednostkaInna', 'RachPrzeplywowJednostkaInna']);

    const podatek = await loadXML('public/xsd/StrukturyDanychSprFin_v1-1.xsd');
    kopiaElementow(xsl, "podatek", podatek, "xsd:complexType", ['TInformacjaDodatkowaDotyczacaPodatkuDochodowego']);

    const pkd = await loadXML('public/xsd/KodyPKD_v2-0E.xsd');
    kopiaElementow(xsl, "pkd", pkd, "xs:simpleType", null);

    xsltProcessor.importStylesheet(xsl);
    xsltProcessor.setParameter('', 'procesor', 'klient');
    xsltProcessor.setParameter('', 'root', '');
})();

const handleFileSelect3 = (evt) => {
    var reader = new FileReader(),
        parser = new DOMParser(),
        file1 = evt.target.files;

    reader.onload = (e) => {
        let xml = e.target.result;
        saveXml(xml);

        let m = new RegExp('<(\\w+:)?JednostkaInna.*</(\\1)?JednostkaInna[^>]*>', 'sm').exec(xml);
        if (m)
            xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + m[0];

        xml = parser.parseFromString(xml, "text/xml");
        resultDocument = xsltProcessor.transformToFragment(xml, document);

        document.getElementById("loader").style.display = "none";
        document.body.appendChild(resultDocument);
    };

    reader.readAsText(file1[0]);
}


const handleFileSelect1= (evt) => {
    document.getElementById("form").submit();
}

const handleFileSelect2= (evt) => {
    document.getElementById("form").submit();
}

Podsumowanie
Projekt aplikacji do analizy sprawozdań finansowych w Javie jest w trakcie implementacji. Ostateczna wersja aplikacji umożliwi użytkownikom skuteczną analizę kondycji finansowej różnych firm. Dzięki funkcjom wczytywania danych, obliczania wskaźników finansowych i generowania wizualizacji, użytkownicy będą mogli szybko i łatwo zrozumieć sytuację finansową analizowanych przedsiębiorstw. 
