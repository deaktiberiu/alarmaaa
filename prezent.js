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
let modPers = [];

function findPerson () {
    modPers =  allPersons.find(persoana => {
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
    const currPrezenta = document.querySelector("#currPrezenta span");
    const prezentSpBtn = document.querySelector("#prezentBtn span");
    const prezentBtn = document.querySelector("#prezentBtn");
    

    const fullName = modPers.firstName + " " + modPers.lastName;
    const functie = modPers.functie;

    if( modPers.prezent == 1 ) {
        prezentSpBtn.innerHTML="Absent";
        currPrezenta.innerHTML="Prezent";
        prezentBtn.style.backgroundColor = "#D90404";
        prezentBtn.style.boxShadow = " 0px 10px 20px rgba(217, 4, 4, 0.8)";
    }else {
        prezentSpBtn.innerHTML="Prezent";
        currPrezenta.innerHTML="Absent";
        prezentBtn.style.backgroundColor = "rgba(106, 215, 48, 1)"
        prezentBtn.style.boxShadow = " 0px 10px 20px rgba(119,255,46, 0.8)";
    }
    
    numeContainer.innerHTML = fullName;
    functieContainer.innerHTML = functie;
    document.title =`Prezent : ${fullName} ` ;
}

function changePrezenta() {
    if(modPers.prezent == 0 ) { 
            modPers.prezent = 1;
            modPers.isSafe = 0;
        }else {
                modPers.prezent = 0;
                modPers.isSafe = 1;
            }
    
    fetch(API.UPDATE.URL, {
        method: API.UPDATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.UPDATE.METHOD === "GET" ? null : JSON.stringify(modPers)
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

