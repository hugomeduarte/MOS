window.onload = async function() {
    try {
        let userId = sessionStorage.getItem("userId");
        let user = await $.ajax({
            url: `/api/users/${userId}`,
            method: "get",
            dataType: "json"
        });
        let season = await $.ajax({
            url: `/api/seasons/curdate`,
            method: "get",
            dataType: "json"
        });

        document.getElementById("temporada").innerHTML = "Temporada "+season.temporada_numero;

        if(user.util_admin) {
            var create_event = document.getElementById('create_event');
            create_event.style.visibility = 'visible';
        } 
        let locations = await $.ajax({
            url: `/api/locations`,
            method: "get",
            dataType: "json"
        });
        let html="";
        for (let location of locations) {
            html+= "<option value="+location.localizacao_id+">"+location.localizacao_nome+
                "</option>";
        }
        document.getElementById("locations").innerHTML = html;

    } catch (err) {
    console.log(err);
    }
}

async function createEventt() {
    try {
        let locationId = document.getElementById("locations").value;
        let seasonId = sessionStorage.getItem("seasonId");
        let addEvent = {
            locationId: locationId,
            date: document.getElementById("date").value,
            vacancies: document.getElementById("vacancies").value,
            seasonId: seasonId
        }
        document.getElementById("mensagem").innerHTML = "Evento criado com sucesso!";
        let result = await $.ajax({
            url: `/api/events`,
            method: 'post',
            dataType: 'json',
            data: JSON.stringify(addEvent),
            contentType: 'application/json'
        });
        console.log(JSON.stringify(result));

    } catch (err) {
        console.log(err);
    }    
}