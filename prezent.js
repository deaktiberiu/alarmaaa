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

let i = 0;

function changePrezenta(id) {
    
    console.log(i++);

  /*   if(modPersoana.prezent == 0 ) { 
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
        }) */
}


function addListeners() { 
    const prezentaBtn = document.getElementById("prezentBtn");

    prezentaBtn.addEventListener("click", e => changePrezenta() );
}

addListeners() ;