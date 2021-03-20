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


let editId;

function getPersonsHtml(persons) {
    const tbody = document.querySelector('#statusList tbody');
    const counterCont = document.querySelector("#numberOfPersons span");
    tbody.innerHTML =  orederList(persons).map(showPersonHtml).join("");
    counterCont.innerHTML = document.getElementsByClassName("counter").length -document.getElementsByClassName("display-none").length;
}       

function showPersonHtml(person) {
    let safeClass;
    let displayThis = "";

    if(person.prezent == 0)
        {
            displayThis = "display-none";
            console.warn("amintrat")
        }

    if (person.isSafe == 1) {
       safeClass = "is-safe";
    } else {
       
        safeClass = "is-not-safe";
    }
    
    return `<tr id=${person.id}  class="${safeClass} ${displayThis} counter">
                <td>${person.functie} </td>
                <td>${person.lastName}  ${person.firstName}</td>
                <td>${person.telefon}</td>  
                <td> <button class="isSafeBtn" type="button" data-id="${person.id}">Safe</button> ${person.isSafe}</td>
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


function searchPersons(text) {
    text = text.toLowerCase().trim();

    return allPersons.filter(person => {
        return person.functie.toLowerCase().indexOf(text) > -1 || person.firstName.toLowerCase().indexOf(text) > -1 || person.lastName.toLowerCase().indexOf(text) > -1 || person.telefon.toLowerCase().indexOf(text) > -1;
    });
}

function  addListeners ( ) {
    const statusChangeBtns = document.querySelector("#statusList tbody");
    statusChangeBtns.addEventListener("click", (e) => {
        const target = e.target;
        if (target.matches(".isSafeBtn")){
            const id = target.getAttribute("data-id");
            changeIsSafe(id);
        }
    })

    const search = document.getElementById('search')
    search.addEventListener("input", e => {
        const text = e.target.value
        const filtrate = searchPersons(text)
        getPersonsHtml(filtrate)
    });

}


addListeners();
loadList();