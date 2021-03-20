const API = {
    CREATE: {
        URL: "http://localhost:3000/teams/create",
        METHOD: "POST"
    },
    READ: {
        URL: "http://localhost:3000/teams",
        METHOD: "GET"
    },
    UPDATE: {
        URL: "http://localhost:3000/teams/update",
        METHOD: "PUT"
    },
    DELETE: {
        URL: "http://localhost:3000/teams/delete",
        METHOD: "DELETE"
    }
};

let editId;

function getPersonsHtml(persons) {
    const tbody = document.querySelector('#statusList tbody');
    const counterCont = document.querySelector("#numberOfPersons span");
    tbody.innerHTML =  orederList(persons).map(showPersonHtml).join("");
    counterCont.innerHTML = document.getElementsByClassName("counter").length;
}       

function showPersonHtml(person) {
    let safeClass;

    if (person.isSafe == 1 || person.prezent == 0) {
       safeClass = "is-safe";
    } else {
       
        safeClass = "is-not-safe";
    }
    
    return `<tr id=${person.id}  class="${safeClass} counter">
                <td>${person.functie}</td>
                <td>${person.firstName} ${person.lastName}</td>
                <td>${person.telefon}</td>
                <td> <button class="prezentBtn" type="button" data-id="${person.id}">Prezent</button> ${person.prezent}</td>
                <td> <button class="isSafeBtn" type="button" data-id="${person.id}">Safe</button> ${person.isSafe}</td>
                <td>
                    <a href="#" class="edit-row popupHandler fa fa-edit" data-id="${person.id}"></a>
                    <a href="#" class="delete-row fa fa-trash" data-id="${person.id}"></a>     
                    <a href="userpage.html?id=${person.id}" class="fa fa-link" ></a>     
                    
                </td>
            </tr>`
}

function orederList (persons) {
    let isSafeList = [];
    let isNotSafeList = [];

    persons.forEach((el => el.isSafe == 0 ? isNotSafeList.push(el) : isSafeList.push(el) ));
    
    let isSafeListOrdered = orderThisList(isSafeList);
    let isNotSafeListOrdered = orderThisList(isNotSafeList);
    return isNotSafeListOrdered.concat(isSafeListOrdered);
}

function orderThisList(persons) { 
    
    const orderedArray= persons.sort((a,b)=>{
        const a1 = a.lastName.toLowerCase();
        const b1 = b.lastName.toLowerCase();

        if (a1 < b1) {
            return -1;
        }else if (a1>b1){
            return 1
        }else {
            return 0;
        }
    });
    return orderedArray;
}

let allPersons = [];

function loadList() {
    fetch(API.READ.URL)
        .then(res => res.json())
        .then(data => {
            allPersons = data;
            getPersonsHtml(allPersons); 
        });
}

function searchPersons(text) {
    text = text.toLowerCase().trim();

    return allPersons.filter(person => {
        return person.functie.toLowerCase().indexOf(text) > -1 || person.firstName.toLowerCase().indexOf(text) > -1 || person.lastName.toLowerCase().indexOf(text) > -1 || person.telefon.toLowerCase().indexOf(text) > -1;
    });
}

function formValidation() {
    const firstName = document.querySelector("input[name=firstName]").value;
    const lastName = document.querySelector("input[name=lastName]").value;
    const telefon = document.querySelector("input[name=telefon]").value;
    console.log ({firstName})
    if (firstName !="" && lastName !=""  && telefon  !="" ) {
        document.querySelector("#saveBtn").removeAttribute("disabled");
    }else {
        console.info("mai incearca");
    }
 }



function writeNewPerson() {
    const functie = document.querySelector("select").value;
    const firstName = document.querySelector("input[name=firstName]").value;
    const lastName = document.querySelector("input[name=lastName]").value;
    const telefon = document.querySelector("input[name=telefon]").value;
    const prezent = 0;
    const isSafe = 0;

    if (!functie || !firstName || !lastName || !telefon ) {
        document.getElementsByName("functie, firstName, lastName, telefon ").css("border", "2px solid red");
       return false; 
    }
    
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
            if (r.success) {
                loadList();
            }
        });
}


function editPerson() {
    const functie = document.querySelector("select").value;
    const firstName = document.querySelector("input[name=firstName]").value;
    const lastName = document.querySelector("input[name=lastName]").value;
    const telefon = document.querySelector("input[name=telefon]").value;
    const prezent = 0;
    const isSafe = 0;

    const person = {
        id:editId,
        functie,
        firstName,
        lastName,
        telefon,
        prezent,
        isSafe
    };

    fetch(API.UPDATE.URL, {
        method: API.UPDATE.METHOD,
        headers: {
            "Content-Type": "application/json"
        },
        body: API.UPDATE.METHOD === "GET" ? null : JSON.stringify(person)
    })
        .then(res => res.json())
        .then(r => {
            if (r.success) {
                loadList();
            }
        });

        editId = null;

}

function editCurrentPerson(id) {
    let person = allPersons.find(person => person.id == id)
    editId = id;

    const functie = document.querySelector("select");
    const firstName = document.querySelector("input[name=firstName]");
    const lastName = document.querySelector("input[name=lastName]");
    const telefon = document.querySelector("input[name=telefon]");

    functie.value = person.functie;
    firstName.value = person.firstName;
    lastName.value = person.lastName;
    telefon.value = person.telefon;    
}

function deletePerson(id) {
    fetch("http://localhost:3000/teams/delete", {
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
    let modPersoana = allPersons.find(persoana => {
        return id == persoana.id;
    });

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

function changeIsSafe (id){
    let modPersoana = allPersons.find(persoana => {
        return id == persoana.id;
    });

    modPersoana.isSafe == 0 ? modPersoana.isSafe = 1 : modPersoana.isSafe = 0;
     
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

    modPersoana = null;
}

function handlePopUp (){
    const popupContainer =document.getElementById("popupContainer").classList;
    const saveBtnHandler = document.getElementById("saveBtn");
    document.querySelector('#popUp form').reset();

    if (popupContainer.contains("hidden")) {
        popupContainer.remove("hidden");
        saveBtnHandler.setAttribute("disabled", "");
    }else {
        popupContainer.add("hidden");
    }

}

function addListeners() {

    const inputValidate = document.querySelector('#popUp form')
    inputValidate.addEventListener("input", e => {
        const text = e.target.value;
        formValidation();
    });

    const search = document.getElementById('search')
    search.addEventListener("input", e => {
        const text = e.target.value
        const filtrate = searchPersons(text)
        getPersonsHtml(filtrate)
    });

    const statusChangeBtns = document.querySelector("#statusList tbody");
    statusChangeBtns.addEventListener("click", (e) => {
        const target = e.target;

        if (target.matches(".prezentBtn")) {
            const id = target.getAttribute("data-id");
            changePrezenta(id);
        }else if (target.matches(".isSafeBtn")){
            const id = target.getAttribute("data-id");
            changeIsSafe(id);
        }
    })

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.addEventListener("click", () => {
        if (editId) {
            editPerson();
        } else {
            writeNewPerson();
        }

        handlePopUp();
    });

    const table = document.querySelector("#statusList tbody");
    table.addEventListener("click", (e) => {
        const target = e.target;
        if (target.matches("a.delete-row")) {
            const id = target.getAttribute("data-id");
            deletePerson(id);
        } else if (target.matches("a.edit-row")) {
            const id = target.getAttribute("data-id");
            editCurrentPerson(id);
            handlePopUp();
        }
    });

    const popup = document.querySelectorAll  (".popupHandler");
    popup.forEach(el => {
        el.addEventListener("click", (e)=> handlePopUp())
    }); 
}

addListeners();
loadList();
