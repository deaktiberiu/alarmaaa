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

function loadList() {
    fetch(API.READ.URL)
        .then(res => res.json())
        .then(data => {
            allPersons = data;
        });
}

function getCurrentId () {
    const urlString = window.location.search;
    currentId = urlString.substr(4);
}

function writePersonStatus()  {
    const numeHolder = document.getElementById("");
}

function changePrezenta() {
    console.log()
    let modPersoana = allPersons.find(persoana => {
        return currentId == persoana.id;
    });

    console.log(allPersons)

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

function initPage () {
    loadList();
    addListeners();
    getCurrentId ();
    writePersonStatus();
}

initPage ()