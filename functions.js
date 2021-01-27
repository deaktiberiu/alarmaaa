const API = {
    CREATE: {
        URL: "http://localhost:3000/teams-json/create",
        METHOD: "POST" // POST
    },
    READ: {
        URL: "http://localhost:3000/teams-json",
        METHOD: "GET"
    },
    UPDATE: {
        URL: "http://localhost:3000/teams-json/update",
        METHOD: "PUT"
    },
    DELETE: {
        URL: "http://localhost:3000/teams-json/delete",
        METHOD: "DELETE" // DELETE
    }
};

function getPersonsHtml (persons) {
    const tbody = document.querySelector('#statusList tbody');
    tbody.innerHTML = persons.map(getPersonhtml).join(""); 
}

function getPersonhtml (person) {
    return `<tr>
                <td>${person.functie}</td>
                <td>${person.fullName}</td>
                <td>${person.telefon}</td>
                <td> <button type="button">Prezent</button> ${person.prezent}</td>
                <td> <button type="button">Safe</button> ${person.isSafe}</td>
            </tr>`
}

function writeNewPerson () {
    const functie = document.querySelector("#statusList input[name=functie]").value;
    const fullName = document.querySelector("#statusList input[name=fullName]").value;
    const telefon = document.querySelector("#statusList input[name=telefon]").value;
    const prezent = false;
    const isSafe = false;
    
    const person = {
        functie,
        fullName,
        telefon,
        prezent,
        isSafe
    }
       
    fetch(API.CREATE.URL, {
        method: API.CREATE.METHOD,
        headers: {
            "Content-Type": "application/json"
          },
        body: API.CREATE.METHOD === "GET" ? null : JSON.stringify(person)
    })
        .then(res => res.json())
        .then(r => {
            console.warn(r);
            if (r.success) {
                console.info('refresh list');
                loadList();
            }
        });
}

let allPersons = [];

function loadList() {
    fetch(API.READ.URL)
        .then(res => res.json())
        .then(data => {
            allPersons = data;
           console.log(data)
           getPersonsHtml(allPersons);
        });
}

loadList();


function addListeners () {
    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", () => {
        writeNewPerson ();
    });
}


addListeners ();
