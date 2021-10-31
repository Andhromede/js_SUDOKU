/**************************************** SELECTEURS **********************************************/
// BTN NOUVELLE GRILLE 
    document.querySelector('.init').onclick = function(){ 
        initGrille(true,true); 
    };

// BTN RECOMMENCER
    document.querySelector('.restart').onclick = function(){ 
        initGrille(false,true); 
    };

// BTN SELECTION DU LVL
    document.querySelector('#level').onchange = function(){ 
        initGrille(true,true);
    };


/********************************************* VARIABLES ***************************************************/
// COMBINAISONS DE GRILLES POSSIBLE
    let combinaisons = new Array(
        // Ex: "123745698 459681732 678392145 269584371 513267948 784913526 937412856 826375194 451869237",
        "123745698459681732678392145269584371513267948784913526937412856826375194451869237",
        "126895374437621985958473126457983612193246578862517394269548731314769852785231649",
        "142685973936217458857394612329451867174862593568973241298534716745621389136789425",
        "158469372362587914794312658637215984259648173841973526726841593435796821189235467",
        "269548731314769852785231649126895374437621985958473126457983612193246578862517394",
        "362175948845963217179248635713296854458731629962584713439527681576184392821396457",
        "386751942574928361291364875614837529793245186528619743478293165659817432132456987",
        "418957632297643581563812794286571394354928716179436285723845169865139472941627358",
        "452371986618429573379865241734629815162845397598713624293148567754236981186957432",
        "531428679628579143749163825986217345214835967537496281792854163381796452654312978",
        "753896412196274538482153679385624971421759683967318245248567139365912847791834526",
        "872351946139264758654987321269587134843612975175439268418725693526391487793846512",
        "921437568583629174674158392283746195765912438419835267674319852251847396983526741",
        "954126783836759124172834956295431678371568492648297315849567312215983647763421589"
    );

// NBR DE CHIFFRES AFFICHES SELON LVL (affichage symétrique, donc faire *2)
    let lvl = {
        0: 41,  /*affiche tout*/
        1: 17,  /*easy*/
        2: 15,  /*medium*/
        3: 13,  /*hardcore*/
        4: 11,  /*hell*/
        5: 9    /* wtf???*/
    };

// INITIALISATION DES VARIABLES
    let grille, masque, chiffres, choixCase = null; 
    let grilleUser = new Array(81);


/********************************************* FONCTIONNALITES ***************************************************/

// RETOURNE UN CHIFFRE EN MIN & MAX
    function aleatoire(min, max) { return (parseInt(Math.random() * 1000) % (max - min + 1) + min); }


// VERIFIE SI C UN CHIFFRE 
    function isChiffre(nbre) { return (nbre != null && nbre > 0 && nbre <= 9); }


// CREER UN TABLEAU DE 3x3 
/*  chiffres = chiffre de 1 à 9 ds le désordre,
    grille   = liste des chiffres, 
    masque   = code binaire des emplacement des chiffres, 
    id       = index du tableau, 
    tab      = tableau principale / sous tableau
*/

    function creerGrille3x3(grille, chiffres, masque, id, tab) {
        let table = "<table cellspacing=0 >";
        let x, y;

        for (y = 0; y < 3; y++) {
            table += "<tr>";

            for (x = 0; x < 3; x++) {
                index = y * 3 + x;

                if (tab) {
                    table += "<td class='tabloExterieur' >";
                    table += creerGrille3x3(grille, chiffres, masque, index, false); /*recursif pour afficher les sous tableaux*/
                    table += "</td>";
                }else {

                    if (masque[id * 9 + index] == true) /*test binaire sur le masque*/ {
                        table += "<td class='tabloInterieur'><b>" + chiffres[parseInt(grille.charAt(id * 9 + index))] + "</b></td>";
                        grilleUser[id * 9 + index] = chiffres[parseInt(grille.charAt(id * 9 + index))];
                    }else {
                        table += "<td class=\"tabloInterieur\" id='c_" + (id * 9 + index) + "' onmouseover=\"choix(this,0);\" onmouseout=\"choix(this,1);\" onclick=\"choix(this,2);\">";
                        table += isChiffre(grilleUser[id * 9 + index]) ? grilleUser[id * 9 + index] : "&nbsp;";
                        table += "</td>";
                    }
                }
            }
            table += "</tr>\n";
        }
        table += "</table>";
        return table;
    }


// CHANGEMENT DE STYLE AU HOVER + SELECTION DE LA CASE SELECTIONNE
    function choix(source, code) {

        if (code == 0) {                    // si la case est survolé alors fond gris si elle est selectionné alors font vert
            source.style.background = (source == choixCase) ? '#c0ffc0' : 'rgb(131, 131, 131)';
        } 
        else if (code == 1) {               // si la case est selectionné alors fond vert sinon pas de fond
            source.style.background = (source == choixCase) ? '#c0ffc0' : '';
        } 
        else {
            if (choixCase != null) {        // si la case est remplie alors pas de fond
                choixCase.style.background = ''; 
            }
            choixCase = source;
            choix(source, 0);
        }
    }


// RETOURNE UN NBR QUI N'EST PAS DEJA DANS LA LISTE ENVOYE EN PARAMETRE
    function uniqueChiffre(list) {
        let nbr = aleatoire(1, 9);

        for (let a = 0; a < list.length; a++) {
            if (list[a] == nbr) {
                nbr = aleatoire(1, 9);
                a = 0;
            }
        }
        return nbr;
    }


// RETOURNE LES CHIFFRES (DE 1 A 9) DANS LE DESORDRE
    function chiffreDesordre() {
        liste = new Array("0");

        for (j = 0; j < 9; j++) {
            newNbr = uniqueChiffre(liste);
            liste.push(newNbr);
        }
        return liste;
    }


// retourne un masque correspondant au niveau de difficulté
    function getMasque(nbMax) {
        let list = new Array(81);

        for (i = 0; i < nbMax; i++) {
            x = aleatoire(0, 40);

            while (list[x] == true) {
                x = aleatoire(0, 40);
            }
            list[x] = true;
        }

        for (i = 0; i < 40; i++) {
            if (list[39 - i] == true) list[41 + i] = true;
        }
        return list;
    }


// GENERE LA GRILLE
    function creerGrille(niveau, nvx) {

        if (nvx) {
            grilleUser = new Array(81);
            grille = combinaisons[aleatoire(0, 13)];                            // choisi une des combinaisons dans le tablo des combinaisons
            nbChiffre = lvl[parseInt(niveau)];
            masque = getMasque(nbChiffre);                                      // definis le nb max de chiffres à afficher
            chiffres = chiffreDesordre();                                       // genère les chiffres dans le désordre
            choixCase = null;
        }
        html = creerGrille3x3(grille, chiffres, masque, 0, true);               // créer la grille avec les paramètres ci-dessus
        document.getElementById("grille").innerHTML = html;                     // affiche la grille dans le html
    }


// REINITIALISE LA GRILLE 
    function initGrille(code, msg) {
        grilleUser = new Array(81);   

        if (!msg || confirm("êtes-vous sûr de vouloir changer de grille ?")) {         
            creerGrille(document.getElementById('level').value, code);              // regénère une grille selon le niveau selectionné
        }
    }


// RECUPERE LE CODE ASCII DU CLAVIER
    // supprime le chiffre avec les touches : espace, del, 0 ou back
    function toucher(e) {
        let key = window.event ? e.keyCode : e.which;                               // si une touche est tapper, on recupère son code
        supp = (key == 32 || key == 46 || key == 96 || key == 8 || key == 48);      // on verifie si le code touche est espace, del, back ou 0
        key -= (key < 96) ? 48 : 96;                                            

        if (key >= 1 && key <= 9 || supp) {                                         
            if (choixCase == null) {                                                // si pas de case séléctionné lors de la suppression
                alert("vous devez selectionner une case pour taper un chiffre"); 
            } 
            else {
                choixCase.innerHTML = supp ? "&nbsp;" : key;                                            
                grilleUser[parseInt(choixCase.id.split("_")[1])] = supp ? "" : key; // on vide la case selon son id sinon on garde le chiffre
            }
        }
    }

/**************** VERIFIE LA GRILLE ****************/
    function verif(code) {
        for (i = 0; i < 81; i++) {
            if (isChiffre(grilleUser[i]) && masque[i] != true){                                 // verifie si c bien un chiffre ainsi que son placement                        
                
                if (code && parseInt(chiffres[parseInt(grille.charAt(i))]) != grilleUser[i]) {  //si le chiffre a l'emplacement X est différent
                    document.getElementById("c_" + i).style.color = "red";                      // si le nbr est différent à celui du tablo de combinaisons alors chiffre en rouge
                }
                else {
                    document.getElementById("c_" + i).style.color = "black";                    // si le nbr est = à celui du tablo de combinaisons alors chiffre en noir
                }
            } 
        }
    }

/**************** AFFICHAGE REPONSE GRILLE ****************/
    function reponse(code) {
        for (i = 0; i < 81; i++) {
            if (masque[i] != true)
                if (code && !isChiffre(grilleUser[i])) {
                    document.getElementById("c_" + i).innerHTML = chiffres[parseInt(grille.charAt(i))];
                } else {
                    document.getElementById("c_" + i).innerHTML = isChiffre(grilleUser[i]) ? grilleUser[i] : "&nbsp;";
                }
        }
        verif(code);
    }