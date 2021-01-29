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
    return `<tr id=${person.id}>
                <td>${person.functie}</td>
                <td>${person.firstName}</td>
                <td>${person.lastName}</td>
                <td>${person.telefon}</td>
                <td> <button class="prezentBtn" type="button" data-id="${person.id}">Prezent</button> ${person.prezent}</td>
                <td> <button class="" type="button" data-id="${person.id}">Safe</button> ${person.isSafe}</td>
                <td>
                    <!--a href="#" class="edit-row" data-id="${person.id}">&#9998;</a-->
                    <a href="#" class="delete-row" data-id="${person.id}">&#10006;</a>     
                </td>
            </tr>`
}

function writeNewPerson () {
    const functie = document.querySelector("input[name=functie]").value;
    const firstName = document.querySelector("input[name=firstName]").value;
    const lastName = document.querySelector("input[name=lastName]").value;
    const telefon = document.querySelector("input[name=telefon]").value;
    const prezent = false;
    const isSafe = false;
    
    const person = {
        functie,
        firstName,
        lastName,
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
                console.warn(person)
            }
        });
}

function deletePerson (id) {
        fetch("http://localhost:3000/teams-json/delete", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ id })
          }).then(res => res.json()).then(
              r => {
                loadList();
              }
          );
}

function changePrezenta(id) {
    const person = [
    ]

    
    fetch(API.UPDATE.URL, {
        method: API.UPDATE.METHOD,
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
        })
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
    const prezentBtn = document.querySelector("#statusList tbody");
    prezentBtn.addEventListener("click", (e) => {
        const target = e.target;
        
        if(target.matches(".prezentBtn")) {
            const id = target.getAttribute("data-id");
            changePrezenta(id);
        }
    })

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", () => {
        writeNewPerson ();
    });

    const table = document.querySelector("#statusList tbody");
    table.addEventListener("click", (e) => {
        const target= e.target;
        if ( target.matches("a.delete-row")) {
            const id  = target.getAttribute("data-id");
            console.log("delete row", id);
            deletePerson(id);
        }
    });
}

addListeners ();
