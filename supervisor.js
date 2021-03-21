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
    counterCont.innerHTML = document.getElementsByClassName("counter").length /* -document.getElementsByClassName("display-none").length */;
}       

function showPersonHtml(person) {
    let safeClass;
    let displayThis = "";
    let safeStatus = person.isSafe == 0 ? "Nu e safe" : "E safe";
    
    if (person.isSafe == 1) {
       safeClass = "is-safe";
    } else {
       
        safeClass = "is-not-safe";
    }
    
    return `<tr id=${person.id}  class="${safeClass} ${displayThis} counter">
                <td>${person.functie} </td>
                <td>${person.lastName}  ${person.firstName}</td>
                <td>${person.telefon}</td>  
                <td> <button class="isSafeBtn" type="button" data-id="${person.id}">${safeStatus}</button> </td>
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

            allPersons = data.filter(obj => obj.prezent == 1);
            
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


/*fire alarm test */

function handlePopUp (){
    const popupContainer =document.getElementById("popupContainer").classList;
    if (popupContainer.contains("hidden")) {
        popupContainer.remove("hidden");
    }else {
        popupContainer.add("hidden");
        location.reload();
    }

}

function  countdownFinished() {
    const verificare = allPersons.find(el => el.isSafe == 0)
    const results = document.getElementById ("results");
    handlePopUp ();
    if(verificare) {
        results.innerHTML =" TEST FAILED ";
    } else {
        results.innerHTML =" CONGRADULATIONS! THE TEST WAS SUSCCESFUL ";
    }
}

function countdownBeat (timer) {
    const countdownContainer =  document.querySelector("#countdownContainer");
    const bodyElement = document.getElementsByTagName("BODY")[0]; 

    let min =  ~~(timer/60);
    let sec = timer%60; 

    let zero = sec<10 ? 0 : "";
    bodyElement.style.boxShadow =" rgba(255, 99, 71, 0.4) 0px 0px 1000px inset";
    setTimeout(function (){bodyElement.style.boxShadow ="rgba(255, 99, 71, 0.3) 0px 0px 0px inset"},200);
    countdownContainer.innerHTML = `${min}:${zero}${sec}`;
}

function countdown (timer) {
    setTimeout(function(){
            timer--;
            countdownBeat(timer);           
            if (timer ==0 ) {
                countdownFinished();
            } 
                else 
                {
                    return countdown(timer);
                }
    },1000);
} 

function manageUi(){
    const countdownContainer =  document.querySelector("#countdownContainer");
    const fireAlarmTestBtn = document.getElementById("fireAlarmTestBtn");
    fireAlarmTestBtn.style.display="none";
    countdownContainer.style.display="block"
}

function startCountdown (){
    manageUi();
    countdown (3);
}
/*fire alarm test */

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

    const fireAlarmTestBtn = document.getElementById("fireAlarmTestBtn");
    fireAlarmTestBtn.addEventListener("click", e=>startCountdown());

    const popup = document.querySelectorAll  (".popupHandler");
    popup.forEach(el => {
        el.addEventListener("click", (e)=> handlePopUp())
    }); 

}


addListeners();
loadList();