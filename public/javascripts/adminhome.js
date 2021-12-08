var meteotoday;
var meteotomorrow;
var meteoaftertomorrow;
var indexlow = L.layerGroup();
var indexmedium = L.layerGroup();
var indexhigh = L.layerGroup();
var harborslayer = L.layerGroup();
var curlat;
var curlng;
var seasonId;

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

        document.getElementById("temporada").innerHTML = "Temporada "+season.temporada_numero;
        seasonId = season.temporada_id;
        document.getElementById("nome").innerHTML = "Olá "+user.util_nome;

        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            curlat = latitude;
            curlng = longitude;

        let buoys = await $.ajax({
            url: `/api/buoys`,
            method: "get",
            dataType: "json"
        });

        let harbors = await $.ajax({
            url: `/api/harbors`,
            method: "get",
            dataType: "json"
        });

        let buoyselect="";
        for (let buoy of buoys) {
            buoyselect+= "<option value="+buoy.boia_id+">"+buoy.boia_nome+
                "</option>";
        }
        document.getElementById("boia").innerHTML = buoyselect;

        let harborselect="";
        for (let harbor of harbors) {
            harborselect+= "<option value="+harbor.porto_id+">"+harbor.porto_nome+
                "</option>";
        }
        document.getElementById("porto").innerHTML = harborselect;

        document.getElementById('date').valueAsDate = new Date();

        loadMeteo(buoys);

        document.getElementById("date").onchange = function () {
            let buoyId = document.getElementById("boia").value;
            showMeteo(buoyId);
        };
        
        //MAPA WINDY
        const options = {
            // Required: API key
            key: 'NOyxopf2sYZF2n4AIB2sjPmVJUqQxzAK', // REPLACE WITH YOUR KEY !!!
            // Put additional console output
            verbose: false,
            // Optional: Initial state of the map
            lat: 38.430328551849975,
            lon: -9.141483306884766,
            zoom: 11, //11 é o máx
            };
            // Initialize Windy API
            windyInit(options, windyAPI => {
                // windyAPI is ready, and contain 'map', 'store',
                // 'picker' and other usefull stuff
            const { map } = windyAPI;
                // .map is instance of Leaflet map 

            document.getElementById("dez").onchange = function () {
                    mapFilters(buoys,harbors,10);
            };
            document.getElementById("vinteecinco").onchange = function () {
                    mapFilters(buoys,harbors,25);
            };
            document.getElementById("cinquenta").onchange = function () {
                    mapFilters(buoys,harbors,50);
            };
            document.getElementById("portos").onchange = function () {
                if(portos.checked) {
                    harborslayer.addTo(map);
                } else {
                    map.removeLayer(harborslayer);
                } 
            };
            document.getElementById("baixo").onchange = function () {
                if(baixo.checked) {
                    indexlow.addTo(map);
                } else {
                    map.removeLayer(indexlow);
                } 
            };
            document.getElementById("medio").onchange = function () {
                if(medio.checked) {
                    indexmedium.addTo(map);
                } else {
                    map.removeLayer(indexmedium);
                } 
            };
            document.getElementById("alto").onchange = function () {
                if(alto.checked) {
                    indexhigh.addTo(map);
                } else {
                    map.removeLayer(indexhigh);
                } 
            };
            document.getElementById("boia").onchange = async function () {
                let buoyId = document.getElementById("boia").value;
                showMeteo(buoyId);
                let buoy = await $.ajax({
                    url: `/api/buoys/${buoyId}`,
                    method: "get",
                    dataType: "json"
                });
                map.flyTo([buoy.boia_long, buoy.boia_lat], 11);
            };
            document.getElementById("porto").onchange = async function () {
                let harborId = document.getElementById("porto").value;
                let harbor = await $.ajax({
                    url: `/api/harbors/${harborId}`,
                    method: "get",
                    dataType: "json"
                });
                map.flyTo([harbor.porto_long, harbor.porto_lat], 11);
            };

            /*DEFAULT MAP LAYERS*/
            document.getElementById("baixo").checked = true;
            document.getElementById("medio").checked = true; 
            document.getElementById("portos").checked = true; 
            document.getElementById("cinquenta").checked = true; 
            mapFilters(buoys,harbors,50);
            indexmedium.addTo(map);
            indexlow.addTo(map);
            harborslayer.addTo(map);

/*Fim do windy*/});
    
/*Fim do geolocation*/});
  
    } catch (err) {
    console.log(err);
    }
}

async function loadMeteo(buoys) {
    
    let meteo0 = await $.ajax({
        url:"https://api.ipma.pt/open-data/forecast/oceanography/daily/hp-daily-sea-forecast-day0.json",
        type: 'GET',
        dataType: 'json'
    });
    meteotoday = meteo0;

    let meteo1= await $.ajax({
        url:"https://api.ipma.pt/open-data/forecast/oceanography/daily/hp-daily-sea-forecast-day1.json",
        type: 'GET',
        dataType: 'json'
    });
    meteotomorrow = meteo1;

    let meteo2= await $.ajax({
        url:"https://api.ipma.pt/open-data/forecast/oceanography/daily/hp-daily-sea-forecast-day2.json",
        type: 'GET',
        dataType: 'json'
    });
    meteoaftertomorrow = meteo2;

    showMeteo(buoys[0].boia_id);
}

async function showMeteo(buoyId) {
    let buoy = await $.ajax({
        url: `/api/buoys/${buoyId}`,
        method: "get",
        dataType: "json"
    });

    document.getElementById("meteoinfop").innerHTML = "Sem informação para a data escolhida";

    if(document.getElementById('date').value == meteotoday.forecastDate) {
        for(let i=0;i<meteotoday.data.length;i++) {
            if(buoy.regiao_globalid == meteotoday.data[i].globalIdLocal) {
                document.getElementById("meteoinfop").innerHTML =
                "predWaveDir: "+meteotoday.data[i].predWaveDir+"<br>"+
                "sstMax: "+meteotoday.data[i].sstMax+"ºC<br>"+
                "sstMin: "+meteotoday.data[i].sstMin+"ºC<br>"+
                "totalSeaMax: "+meteotoday.data[i].totalSeaMax+"m<br>"+
                "totalSeaMin: "+meteotoday.data[i].totalSeaMin+"m<br>"+
                "waveHighMax: "+meteotoday.data[i].waveHighMax+"m<br>"+
                "waveHighMin: "+meteotoday.data[i].waveHighMin+"m<br>"+
                "wavePeriodMax: "+meteotoday.data[i].wavePeriodMax+"s<br>"+
                "wavePeriodMin: "+meteotoday.data[i].wavePeriodMin+"s";
            }
        }
    }
    if(document.getElementById('date').value == meteotomorrow.forecastDate) {
        for(let i=0;i<meteotomorrow.data.length;i++) {
            if(buoy.regiao_globalid == meteotomorrow.data[i].globalIdLocal) {
                document.getElementById("meteoinfop").innerHTML =
                "predWaveDir: "+meteotomorrow.data[i].predWaveDir+"<br>"+
                "sstMax: "+meteotomorrow.data[i].sstMax+"ºC<br>"+
                "sstMin: "+meteotomorrow.data[i].sstMin+"ºC<br>"+
                "totalSeaMax: "+meteotomorrow.data[i].totalSeaMax+"m<br>"+
                "totalSeaMin: "+meteotomorrow.data[i].totalSeaMin+"m<br>"+
                "waveHighMax: "+meteotomorrow.data[i].waveHighMax+"m<br>"+
                "waveHighMin: "+meteotomorrow.data[i].waveHighMin+"m<br>"+
                "wavePeriodMax: "+meteotomorrow.data[i].wavePeriodMax+"s<br>"+
                "wavePeriodMin: "+meteotomorrow.data[i].wavePeriodMin+"s";
            }
        }
    }
    if(document.getElementById('date').value == meteoaftertomorrow.forecastDate) {
        for(let i=0;i<meteoaftertomorrow.data.length;i++) {
            if(buoy.regiao_globalid == meteoaftertomorrow.data[i].globalIdLocal) {
                document.getElementById("meteoinfop").innerHTML =
                "predWaveDir: "+meteoaftertomorrow.data[i].predWaveDir+"<br>"+
                "sstMax: "+meteoaftertomorrow.data[i].sstMax+"ºC<br>"+
                "sstMin: "+meteoaftertomorrow.data[i].sstMin+"ºC<br>"+
                "totalSeaMax: "+meteoaftertomorrow.data[i].totalSeaMax+"m<br>"+
                "totalSeaMin: "+meteoaftertomorrow.data[i].totalSeaMin+"m<br>"+
                "waveHighMax: "+meteoaftertomorrow.data[i].waveHighMax+"m<br>"+
                "waveHighMin: "+meteoaftertomorrow.data[i].waveHighMin+"m<br>"+
                "wavePeriodMax: "+meteoaftertomorrow.data[i].wavePeriodMax+"s<br>"+
                "wavePeriodMin: "+meteoaftertomorrow.data[i].wavePeriodMin+"s";
            }
        }
    }
    showEventExists(buoyId);

}

async function showEventExists(buoyId) {

    let eventexists = await $.ajax({
        url: `/api/events/available/buoy/${buoyId}`,
        method: "get",
        dataType: "json"
    });

    if (eventexists.count == 0) {
        document.getElementById("eventexists").style.display = "none";
        } else {
            document.getElementById("eventexists").innerHTML = "Não disponível"; 
            document.getElementById("eventexists").style.display = "initial";
        }

}

function create() {
    try {
        let buoyId = document.getElementById("boia").value;
        let harborId = document.getElementById("porto").value;
        let addEvent = {
            buoyId: buoyId,
            harborId: harborId,
            date: document.getElementById("date").value,
            vacancies: document.getElementById("vacancies").value,
            seasonId: seasonId
        }

        let result = $.ajax({
            url: `/api/events`,
            method: 'post',
            data: JSON.stringify(addEvent),
            contentType: 'application/json',
            error: function() {
                alert(arguments[0].responseJSON.err); 
            },
            success: function(){  
                getlasteventId();
                alert("Evento criado com sucesso!");
            }
        });
        console.log(JSON.stringify(result));

    } catch (err) {
        console.log(err);
    }    
}

async function getlasteventId() {

    let lasteventId =  await $.ajax({
        url: `/api/events/last`,
        method: "get",
        dataType: "json"
    });

    let addParticipation = {
        userId: userId,
        eventId: lasteventId.max
    }
    
    insertParticipation(addParticipation);
    
}

function insertParticipation(addParticipation) {
console.log(addParticipation);
    let result2 =  $.ajax({
        url: `/api/participations`,
        method: 'post',
        data: JSON.stringify(addParticipation),
        contentType: 'application/json',
        error: function() {
            alert(arguments[0].responseJSON.err); 
        },
        success: function(){  
            alert("Participação inserida com sucesso!");
        }
    });
    console.log(JSON.stringify(result2));

}

async function mapFilters(buoys,harbors,distancefilter) {
    harborslayer.clearLayers();
    indexlow.clearLayers();
    indexmedium.clearLayers();
    indexhigh.clearLayers();

    let harboricon = L.icon({
        iconUrl: 'images/harboricon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:     [36, 38], // size of the icon
        iconAnchor:   [18, 38], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -34], // point from which the popup should open relative to the iconAnchor
        shadowSize: [41, 41]
    });
    var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      var goldIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

    for (let harbor of harbors) {
        let harbormarker = L.marker([harbor.porto_long,harbor.porto_lat],{icon: harboricon});

        let harborhtml = "<h3>"+harbor.porto_nome+"</h3>"+
        "Região: "+harbor.regiao_nome;
        harbormarker.bindPopup(harborhtml);

        let distance = turf.distance([curlat, curlng], [harbor.porto_long, harbor.porto_lat], {units: 'kilometers'});
        
        if(distance<distancefilter) {
            harborslayer.addLayer(harbormarker);
        }
    }

    for (let buoy of buoys) {
        let marker;

        let buoyhtml =
        "<h3>"+buoy.boia_nome+"</h3>"+
        "Profundidade: "+buoy.boia_profundidade+"m<br>";

        let distance = turf.distance([curlat, curlng], [buoy.boia_long, buoy.boia_lat], {units: 'kilometers'});

            if (distance<distancefilter && buoy.boia_poluicao == "Bom") {
                marker = L.marker([buoy.boia_long,buoy.boia_lat],{icon: greenIcon});
                marker.bindPopup(buoyhtml);
                indexlow.addLayer(marker);
            }

            if (distance<distancefilter && buoy.boia_poluicao == "Medio") {
                marker = L.marker([buoy.boia_long,buoy.boia_lat],{icon: goldIcon});
                marker.bindPopup(buoyhtml);
                indexmedium.addLayer(marker);
            }

            if (distance<distancefilter && buoy.boia_poluicao == "Mau") {
                marker = L.marker([buoy.boia_long,buoy.boia_lat],{icon: redIcon});
                marker.bindPopup(buoyhtml);
                indexhigh.addLayer(marker);
            }
    }

}

