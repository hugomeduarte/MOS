var map;
var indexlow = L.layerGroup();
var indexmedium = L.layerGroup();
var indexhigh = L.layerGroup();
var harborslayer = L.layerGroup();
var routeboolean = false;
var route;
var searchcontrol;
var myControl;
var curlat;
var curlng;
var userId;

var harboricon = L.icon({
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
        let points = await $.ajax({
            url: `/api/users/${userId}/points/season/${season.temporada_id}`,
            method: "get",
            dataType: "json"
        });

        sessionStorage.setItem("seasonId",season.temporada_id);

        document.getElementById("temporada").innerHTML = "Temporada "+season.temporada_numero;
        document.getElementById("nome").innerHTML = "Olá "+user.util_nome+",";
        document.getElementById("pontos").innerHTML = "você tem "+points.sum+""; 

        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            curlat = latitude;
            curlng = longitude;

    // MAPA USER
    map = L.map('map').setView([38.430328551849975, -9.141483306884766], 12);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWJ1Z2FsaG8iLCJhIjoiY2phOWdhbWR5MGprdDJ5cDgzenR5MXMxMCJ9.n38CZPOHiDjdbKXw2YuEmA'
    }).addTo(map);

    searchcontrol = L.Control.geocoder({
        createMarker: function() { return null; }
    });
    searchcontrol.addTo(map);

    L.control.locate({
        position: 'topleft',
        flyTo: true,
        returnToPrevBounds: true,
    }).addTo(map);

    let harbors = await $.ajax({
        url: `/api/harbors`,
        method: "get",
        dataType: "json"
    });

    let events = await $.ajax({
        url: `/api/events/available`,
        method: "get",
        dataType: "json"
    });

    document.getElementById("dez").onchange = function () {
            mapFilters(events,harbors,10,user);
    };
    document.getElementById("vinteecinco").onchange = function () {
            mapFilters(events,harbors,25,user);
    };
    document.getElementById("cinquenta").onchange = function () {
            mapFilters(events,harbors,50,user);
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

    /*CUSTOM CONTROL */
    L.Control.MyControl = L.Control.extend({
        onAdd: function(map) {
          var el = L.DomUtil.create('div', 'leaflet-bar my-control');
      
          el.innerHTML = 'Delete';
            el.onclick = function () {
                removeRoute();
            };
          return el;
        },
      
        onRemove: function(map) {
          // Nothing to do here
        }
      });
      
      L.control.myControl = function(opts) {
        return new L.Control.MyControl(opts);
      }

      let usericon = L.icon({
        iconUrl: 'images/person.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize:     [36, 38], // size of the icon
        iconAnchor:   [18, 38], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -34], // point from which the popup should open relative to the iconAnchor
        shadowSize: [41, 41]
    });

    L.marker([curlat,curlng],{icon: usericon}).addTo(map).bindPopup("Você");
      

    //DEFAULT MAP LAYERS
    document.getElementById("baixo").checked = true;
    document.getElementById("medio").checked = true; 
    document.getElementById("portos").checked = true; 
    document.getElementById("cinquenta").checked = true; 
    mapFilters(events,harbors,50,user);
    indexmedium.addTo(map);
    indexlow.addTo(map);
    harborslayer.addTo(map);

    });

    } catch (err) {
    console.log(err);
    }
}

function createRoute(lat,lng) {
    if(routeboolean) {
        removeRoute();
    }

    map.removeControl(searchcontrol);
    myControl = L.control.myControl({
        position: 'topright'
      }).addTo(map);
      
    map.closePopup();
    routeboolean = true;

        route = L.Routing.control({
            router: L.Routing.mapbox('pk.eyJ1IjoiaHVnb21lZHVhcnRlIiwiYSI6ImNrdzhoYmQ0djBlajkycXAydDFtamZuMTEifQ.EhYQFjgOQnlUehg8l5AIQQ'),
            /*language: 'pt',*/
            collapsible: true,
            waypoints: [
                L.latLng(curlat, curlng),
                L.latLng(lng, lat)
            ],
            routeWhileDragging: true,
            fitSelectedRoutes: true,
            reverseWaypoints: true,
            createMarker: function() { return null; },
            geocoder: L.Control.Geocoder.nominatim(),
            /*lineOptions: {
                styles: [{className: 'animate'}] // Adding animate class
            }*/
        }).addTo(map);
}

function removeRoute() {
    map.removeControl(route);
    searchcontrol.addTo(map);
    map.removeControl(myControl);
}

function movetoHarbor(porto_long,porto_lat) {
    map.flyTo([porto_lat, porto_long], 13);
}

async function mapFilters(events,harbors,distancefilter,user) {
    harborslayer.clearLayers();
    indexlow.clearLayers();
    indexmedium.clearLayers();
    indexhigh.clearLayers();

    for (let harbor of harbors) {
        let harbormarker = L.marker([harbor.porto_long,harbor.porto_lat],{icon: harboricon});

        let harborhtml = "<h3>"+harbor.porto_nome+"<button class='movetoharbor' onclick='createRoute("+harbor.porto_lat+","+harbor.porto_long+")' value='Ver rota'><img id='caricon' src='/images/caricon.png'></button></h3>"+
        "Região: "+harbor.regiao_nome;
        harbormarker.bindPopup(harborhtml);

        let distance = turf.distance([curlat, curlng], [harbor.porto_long, harbor.porto_lat], {units: 'kilometers'});
        
        if(distance<distancefilter) {
            harborslayer.addLayer(harbormarker);
        }
    }

    for (let event of events) {
        let i = 0;
        let htmlrequisitos;
        let htmlparticipantes = [];
        let lotacao = [];
        let marker;

        let participants = await $.ajax({
            url: `/api/events/${event.evento_id}/participants`,
            method: "get",
            dataType: "json"
        });

        htmlparticipantes[event.evento_id]=""; //Para não começar a undefined

        for (let participant of participants) {
            if(participant.util_admin) {
                htmlparticipantes[event.evento_id]="<img src='images/admin.png' width='18px' height='18px' title='"+participant.util_nome+"(admin)'/>";
            }   
            else if(participant.util_id==userId) {
                htmlparticipantes[event.evento_id]+="<img src='images/user.png' width='18px' height='18px' title='"+participant.util_nome+"(você)'/>";
            }   else {
                    htmlparticipantes[event.evento_id]+="<img src='images/user.png' width='18px' height='18px' title='"+participant.util_nome+"'/>";
                }
            i++;
            lotacao[event.evento_id]=i;
        }

        if(user.licenca_profundidade<event.boia_profundidade) {
            htmlrequisitos="<br><img src='images/xicon.png' width='16px' height='16px'/><p id ='xiconp'>Não tem os requisitos de certificação</p>";
        } else {
            htmlrequisitos="<br><input type='button' onclick='sign("+event.evento_id+")' class='sign' value='Inscrever'></input>";
        }

        let eventhtml =
        "<h3>"+event.boia_nome+"<button class='movetoharbor' onclick='movetoHarbor("+event.porto_lat+","+event.porto_long+")'><img id='boaticon' src='/images/movetoharbor.png'></button></h3>"+
        "<h4>"+(event.evento_data.slice(0,10))+"</h4>"+
        "Profundidade: "+event.boia_profundidade+"m<br>"+
        "Lotação: "+lotacao[event.evento_id]+"/"+event.evento_vagas+"<br>"+
        htmlparticipantes[event.evento_id]+"<br>"+
        htmlrequisitos;

        let distance = turf.distance([curlat, curlng], [event.boia_long, event.boia_lat], {units: 'kilometers'});

            if (distance<distancefilter && event.boia_poluicao == "Bom") {
                marker = L.marker([event.boia_long,event.boia_lat],{icon: greenIcon});
                marker.bindPopup(eventhtml);
                indexlow.addLayer(marker);
            }

            if (distance<distancefilter && event.boia_poluicao == "Medio") {
                marker = L.marker([event.boia_long,event.boia_lat],{icon: goldIcon});
                marker.bindPopup(eventhtml);
                indexmedium.addLayer(marker);
            }

            if (distance<distancefilter && event.boia_poluicao == "Mau") {
                marker = L.marker([event.boia_long,event.boia_lat],{icon: redIcon});
                marker.bindPopup(eventhtml);
                indexhigh.addLayer(marker);
            }
    }

}

function sign(event_id) {
    try {
            let addParticipation = {
            userId: userId,
            eventId: event_id
            }
            let result = $.ajax({
                url: `/api/participations`,
                method: 'post',
                data: JSON.stringify(addParticipation),
                contentType: 'application/json',
                error: function() {
                    alert(arguments[0].responseJSON.err); 
                },
                success: function(){  
                    alert("Ingressou no evento com sucesso!");
                }
            });
            console.log(JSON.stringify(result));
        
    } catch (err) {
        console.log(err);
    }
}