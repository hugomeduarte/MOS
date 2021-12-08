var today = new Date();  

window.onload = async function() {
    try {
        userId = sessionStorage.getItem("userId");
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

        userId = sessionStorage.setItem("seasonId",season.temporada_id);

        document.getElementById("temporada").innerHTML = "Temporada "+season.temporada_numero;
        document.getElementById("nome").innerHTML = "Histórico de "+user.util_nome;

        let seasons = await $.ajax({
            url: `/api/seasons`,
            method: "get",
            dataType: "json"
        });

        let seasonselect="";
        for (let season of seasons) {
            seasonselect+= "<option value="+season.temporada_id+">"+"Temporada "+season.temporada_numero+
                "</option>";
        }
        document.getElementById("season").innerHTML = seasonselect;
        document.getElementById("season").selectedIndex = season.temporada_id-1;

        filter(user);

        document.getElementById("season").onchange = function () {
            filter(user);
        };
        document.getElementById("history").onchange = function () {
            filter(user);
        };

        document.getElementById("homebutton").onclick = function () {
            if(user.util_admin) {
                window.location.href='adminhome.html';
            } else {
                window.location.href='home.html';
            }
        };

    } catch (err) {
    console.log(err);
    }
}

function participationsHTML(participations,user) {
    let html = "";
    for (let participation of participations) {
        if(new Date(participation.evento_data).getTime() < today.getTime()) {
        html += "<section id='participationsHTMLpast'>"+
            "<img src='images/done.png'>"+
            "<p id='datap'>"+participation.evento_data.slice(0,10)+"</p>"+
            "<p>"+participation.boia_nome+"</p>"+
            "<p>"+participation.boia_profundidade+" metros </p>"+
            "<p>Índice "+participation.boia_poluicao+"</p>"+
            "</section>";
        }
        if(new Date(participation.evento_data).getTime() > today.getTime()) {
            html += "<section id='participationsHTMLfuture'>"+
            "<img src='images/eventsicon.png'>"+
            "<p id='datap'>"+participation.evento_data.slice(0,10)+"</p>"+
            "<p>"+participation.boia_nome+"</p>"+
            "<p>"+participation.boia_profundidade+" metros </p>"+
            "<p>Índice "+participation.boia_poluicao+"</p>";

            if(user.util_admin) {
            html +="<button onclick='removeEvent("+participation.evento_id+")'><img src='images/cancelicon.png' id='cancelicon'></button>"+
            "</section>";
            } else {
            html +="<button onclick='removeParticipation("+participation.participacao_id+")'><img src='images/cancelicon.png' id='cancelicon'></button>"+
            "</section>";    
            }

            }
    }
    document.getElementById("historyfilter").innerHTML = html;
}

async function filter(user) {
    try {
        let seasonId = document.getElementById("season").value;
        userId = sessionStorage.getItem("userId");
        option = document.getElementById("history").value;
        let participations = await $.ajax({
            url: `/api/users/${userId}/participations/${option}/season/${seasonId}`,
            method: 'get',
            dataType: 'json'
        });
        participationsHTML(participations,user);

    } catch (err) {
        console.log(err);
    }  
}

function removeParticipation(participacaoId) {

    let result = $.ajax({
        url: `/api/participations/${participacaoId}`,
        method: 'DELETE',
        success: function(){  
            alert("Participação removida com sucesso!");
        },
        error: function() {
            alert(arguments[0].responseJSON.err); 
        }
    });
    console.log(JSON.stringify(result));

}

async function removeEvent(eventId) {
    let participants = await $.ajax({
        url: `/api/events/${eventId}/participants`,
        method: "get",
        dataType: "json"
    });

    for (let participant of participants) {
        removeParticipation(participant.participacao_id);
    }

    let result = $.ajax({
        url: `/api/events/${eventId}`,
        method: 'DELETE',
        success: function(){  
            alert("Evento removido com sucesso!");
        }
    });
    console.log(JSON.stringify(result));

}
