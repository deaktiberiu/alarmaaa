const API = {
    READ: {
        URL: "http://localhost:3000/teams",
        METHOD: "GET"
    },
    UPDATE: {
        URL: "http://localhost:3000/teams/update",
        METHOD: "PUT"
    }
};


let currentId = 0;
let allPersons = [];
let modPersoana = [];

function findPerson () {
    modPersoana =  allPersons.find(persoana => {
        return currentId == persoana.id;
    });
}

function getCurrentId () {
    const urlString = window.location.search;
    currentId = urlString.substr(4);
}

function writePersonStatus()  {
    const numeContainer = document.getElementById("Nume");
    const functieContainer = document.getElementById("resp");
    const mainContP = document.getElementById("mainContP");
    const prezentBtn = document.querySelector("#prezentBtn span");

    const fullName = modPersoana.fullName;
    const functie = modPersoana.functie;

    prezentBtn.innerHTML = modPersoana.prezent == 1 ? "Prezent" : "Absent";
    
    numeContainer.innerHTML = fullName;
    functieContainer.innerHTML = functie;
}

function changePrezenta() {
    if(modPersoana.prezent == 0 ) { 
            modPersoana.prezent = 1;
            modPersoana.isSafe = 0;
        }else {
             modPersoana.prezent = 0;
             modPersoana.isSafe = 1;
            }
    
    fetch(API.UPDATE.URL, {
        method: API.UPDATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.UPDATE.METHOD === "GET" ? null : JSON.stringify(modPersoana)
    })
        .then(res => res.json())
        .then(r => {
            if (r.success) {
                loadList();
            }
        }) 
    }


function addListeners() { 
    const prezentaBtn = document.getElementById("prezentBtn");

    prezentaBtn.addEventListener("click", e => changePrezenta() );
}

function loadList() {
    fetch(API.READ.URL)
        .then(res => res.json())
        .then(data => {
            allPersons = data;
            initPage ();
    });
}

function initPage () {
    getCurrentId ();
    findPerson ();
    writePersonStatus();
}

addListeners();
loadList();

