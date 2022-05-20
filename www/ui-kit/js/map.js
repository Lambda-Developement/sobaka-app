const HEIGHT = window.innerHeight + 'px';
var pos = [57.621166, 39.888228];
var prev = [57.621136, 39.888221];
var heading = 'not moving';
var scale = 15;
const minDistance = 50; // metres

var cur_route_id = -1;
var cur_route_place = -1;

// var permissions;
var index;
var map;
var routing_control;
var pos_marker;
var markers;
var geolocation_started = false;


var onSuccess = function (position) {
    pos = [position.coords.latitude, position.coords.longitude];
    if(map.distance(L.latLng(pos[0],pos[1]),L.latLng(prev[0],prev[1])) > 20){
        let dx = pos[0] - prev[0];
        let dy = pos[1] - prev[1];
        console.log(prev,pos,dx,dy);
        heading = parseInt(Math.atan2(-dx,dy)*180/Math.PI)-45;
        prev = pos;
    }
    else if(map.distance(L.latLng(pos[0],pos[1]),L.latLng(prev[0],prev[1])) < 3){
        heading = "not moving";
    }
    update_markers();
    console.log('Latitude: ' + position.coords.latitude + '\n' +
        'Longitude: ' + position.coords.longitude + '\n' +
        'Altitude: ' + position.coords.altitude + '\n' +
        'Accuracy: ' + position.coords.accuracy + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
        'Heading: ' + position.coords.heading + '\n' +
        'Speed: ' + position.coords.speed + '\n' +
        'Timestamp: ' + position.timestamp + '\n');
};
function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

setInterval(()=>{
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
},5000);
// Получить текущее местоположение
function get_location() {
    if(!geolocation_started){
        geolocation_started = true;
    }
    map.flyTo(pos, 18);
}

// Построить маршрут между двумя точками
function make_route(start, end) {
    map.removeControl(routing_control);
    routing_control = L.Routing.control({
        waypoints: [
            start,
            end
        ],
        createMarker: function () { return null; },
        show: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: {
            addWaypoints: false,
            draggableWaypoints: false,
        },
        router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
    });
    routing_control.addTo(map);
}
function make_route_pts(pts){
    map.removeControl(routing_control);
    routing_control = L.Routing.control({
        waypoints: pts,
        createMarker: function () { return null; },
        show: false,
        showAlternatives: false,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: {
            addWaypoints: false,
            draggableWaypoints: false,
            styles: [{color: '#FC913B', dashArray: '4 8'}]
        },
        router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
    });
    routing_control.addTo(map);
}

// Обновление маркеров
function update_markers() {
    map.removeLayer(markers);
    markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 80
    });
    info2_appear = false;
    let idx = 0;
    let favs = localStorage.getItem('passed');
    if (favs == null || favs == 'undefined'){
        favs = []
    }else{
        favs = JSON.parse(favs);
    }
    locs.forEach((el,t) => {
        if(cur_route_id == -1 || (cur_route_id != -1 && routes[cur_route_id].includes(t))){
            var title = el[2];
            glow = map.distance(L.latLng(pos), L.latLng(el[0], el[1])) <= minDistance ? "glow" : "";
            glow2 = (favs.includes(`${t+1}`)?'glow':'');
            let route_near = false;
            if (cur_route_id != -1) {
                route_near = map.distance(L.latLng(pos), L.latLng(locs[routes[cur_route_id][cur_route_place]][0], locs[routes[cur_route_id][cur_route_place]][1])) <= minDistance ? true : false;
            }
            icon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div>\n" +
                    "            <a href=\"#\" onclick=\"collapse_toggle(" + idx + ")\">\n" +
                    "                <div class=\"geopoint d-flex justify-content-center align-items-center " + glow2 + " pb-2 \">\n" +
                    "                    <div class=\"dog-img\"></div>\n" +
                    "                </div>\n" +
                    "            </a>\n" +
                    "        </div>",
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });
            if (glow) {
                info2_appear = true;
                if(localStorage.getItem('notifications') != null){
                    cordova.plugins.notification.local.schedule({
                        title: 'Вы рядом с точкой',
                        text: 'Зайдите в приложение, чтобы узнать подробнее...',
                        foreground: true
                    });
                }
            }
            if (route_near) {
                cur_route_place += 1;
                if (cur_route_place >= routes[cur_route_id].length) {
                    cur_route_id = -1;
                    cur_route_place = -1;
                    if (localStorage != undefined) {
                        localStorage.removeItem('route_place');
                        localStorage.removeItem('route_id');
                        localStorage.removeItem('route_start');
                    }
                } else {
                    if (localStorage != undefined) {
                        localStorage.setItem('route_place', cur_route_place);
                    }
                }
            }
            var marker = L.marker(new L.LatLng(el[0], el[1]), { title: title, icon: icon });
            markers.addLayer(marker);
        }
        idx++;
    });
    update_progress();
    if(cur_route_id == -1){
        document.getElementById('make-route-btn').style.display = 'block';
        document.getElementById('excursion-btn2').style.display = 'none';
    }else{
        document.getElementById('make-route-btn').style.display = 'none';
        document.getElementById('excursion-btn2').style.display = 'block';
    }
    if (cur_route_id != -1) {
        pts = [];
        for(let k = 0;k < routes[cur_route_id].length;k++){
            pts.push(L.latLng(locs[routes[cur_route_id][k]][0], locs[routes[cur_route_id][k]][1]));
        }
        make_route_pts(pts);
        // make_route(L.latLng(pos), L.latLng(locs[routes[cur_route_id][cur_route_place]][0], locs[routes[cur_route_id][cur_route_place]][1]));
    } else if (localStorage != undefined && localStorage.getItem('make_route') != null) {
        g_id = localStorage.getItem('make_route');
        make_route(L.latLng(pos), L.latLng(locs[g_id][0], locs[g_id][1]));
        localStorage.removeItem('make_route');
    }
    else {
        make_route(null, null);
    }
    if (info2_appear) {
        document.getElementById("info2").style.display = "block";
    } else {
        document.getElementById("info2").style.display = "none";
    }
    icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style='transform: rotate(${parseInt(heading == "not moving"? 0 : heading)}deg);' class=\"${heading != "not moving" ? "my-position-heading" : "my-position"} d-flex justify-content-center align-items-center\">\n` +
            "            <div class=\"orange-circle\"></div>\n" +
            "        </div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });

    if (map.hasLayer(pos_marker)) {
        map.removeLayer(pos_marker);
    }
    pos_marker = L.marker(new L.LatLng(pos[0], pos[1]), { icon: icon });
    map.addLayer(markers);
    map.addLayer(pos_marker);
}

// Приближение карты
function zoomin() {
    map.zoomIn(1);
}

// Отдаление карты
function zoomout() {
    map.zoomOut(1);
}

// Поиск геоточек
function search(input_str) {
    results = index.search(input_str);
    document.getElementById("search-results1").innerHTML = "";
    if (results.length == 0){
        let hs = localStorage.getItem('history');
        if (hs != null && hs != 'undefined'){
            try {
                hs = JSON.parse(hs);
                hs = hs.reverse();
                if(hs.le)
                hs.forEach( idx => {
                    document.getElementById('search-results1').innerHTML += "" +
                        "<div><a onclick='search_clicked([" + locs[idx][0] + "," + locs[idx][1] + "]," + idx +")'>\n" +
                        "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
                        "                        <div class=\"time-icon me-3\"></div>\n" +
                        "                        <div><h3 class=\"text-common\">" + locs[idx][3] + "</h3></div>\n" +
                        "                    </div>\n" +
                        "                </a></div>";
                })
            }catch (e){
                console.log(e);
            }
        }
    }
    results.forEach((el) => {
        document.getElementById('search-results1').innerHTML += "" +
            "<div><a onclick='search_clicked([" + el.doc.latitude + "," + el.doc.longitude + "])'>\n" +
            "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
            "                        <div class=\"time-icon-empty me-3\"></div>\n" +
            "                        <div><h3 class=\"text-common\">" + el.doc.body + "</h3></div>\n" +
            "                    </div>\n" +
            "                </a></div>";
    });
}

// Обработчик клика в поиске
function search_clicked(coords,id) {
    map.flyTo(coords, 16);
    let hs = localStorage.getItem('history');
    if (hs != null && hs != 'undefined'){
        try {
            hs = JSON.parse(hs);
            hs.push(id);
            hs = JSON.stringify(hs);
            localStorage.setItem('history',hs);
        }catch(e){
            console.log(e);
        }
    }
    if(hs == null){
        localStorage.setItem('history',`[${id}]`);
    }
    search_history_close();
}

// Строит маршурт до текущей геоточки
function make_route_to_cur() {
    if (localStorage != undefined) {
        if (localStorage.getItem('prev_place') != null) {
            idx = localStorage.getItem('prev_place');
            make_route(L.latLng(pos), [locs[idx][0], locs[idx][1]]);
            localStorage.removeItem('prev_place');
        }
    }
}

// Подсчитывает дистанцию между текущим положением и геоточкой в км
function calc_distance_to_geopoint(g_id){
    let meters = map.distance(L.latLng(pos[0],pos[1]),L.latLng(locs[g_id][0],locs[g_id][1]));
    return parseFloat(meters/1000.0).toFixed(1);
}

// Получение данных с сервера
document.addEventListener('deviceready', () => {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    if(cordova.plugins.backgroundMode != undefined) cordova.plugins.backgroundMode.enable();
    console.log(`[INFO] :  Attempt to run cordova permissions...`);
    // permissions = cordova.plugins.permissions;
    // var list = [
    //     permissions.ACCESS_FINE_LOCATION
    // ];

    // permissions.checkPermission(list, success, null);

    // function error() {
    //     console.warn('Camera or Accounts permission is not turned on');
    //     document.location.href = "../../screens/AccessError/accessError.html";
    // }

    // function success(status) {
    //     if (!status.hasPermission) {

    //         permissions.requestPermissions(
    //             list,
    //             function (status) {
    //                 if (!status.hasPermission) error();
    //             },
    //             error);
    //     }
    // }
    if (localStorage != undefined) {
        if (localStorage.getItem('auth_key') == null) {
            document.location.href = '/screens/Login/login.html'
        }
        auth_key = localStorage.getItem('auth_key');
    }
    api_data(auth_key).then((res) => {
        try {
            locs = res;
            index = elasticlunr(function () {
                this.use(elasticlunr.ru);
                this.addField('latitude');
                this.addField('longitude');
                this.addField('body');
                this.setRef('id');
            });
            locs.forEach((el, t) => {
                index.addDoc({
                    'body': el[2],
                    'latitude': el[0],
                    'longitude': el[1],
                    'id': t
                })
            })

            api_groutes(auth_key).then((res) => {
                try {
                    groutes = res;
                    routes = [];
                    groutes.forEach(el => {
                        routes.push(el[3].split(',').map(x => {
                            return parseInt(x)-1;
                        }));
                    });
                    setTimeout(()=>{
                        update_markers()
                    },100);
                } catch (e) {
                    console.error(e);
                }
            },
                () => console.log('error')
            );

            // TODO: проверить что ничего не сломалось в этом куске
            if (localStorage != undefined) {
                if (localStorage.getItem('prev_place') != null && localStorage.getItem('prev_place') !='undefined') {
                    idx = localStorage.getItem('prev_place');
                    map.flyTo([locs[idx][0], locs[idx][1]], 18);
                    collapse_toggle(parseInt(idx));
                }
                if (localStorage.getItem('route_id') != null && localStorage.getItem('route_start') != null) {
                    localStorage.setItem('route_id', localStorage.getItem('route_start'));
                    cur_route_id = parseInt(localStorage.getItem('route_id'));
                } else {
                    cur_route_id = -1;
                }
                if (localStorage.getItem('route_place') != null && localStorage.getItem('route_start') != null) {
                    cur_route_place = parseInt(localStorage.getItem('route_place'));
                } else {
                    cur_route_place = -1;
                }
            }

        } catch (e) {
            console.error(e);
        }
    }, () => console.log('error'));
});
setInterval(() => {
    if (locs.length > 0) search(document.getElementById('line-edit').value, {});
}, 1000);

// Подготовка карты
document.getElementById("map").style.height = HEIGHT;
map = L.map('map', {
    center: pos,
    zoom: scale,
    zoomControl: false,
})
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ'
}).addTo(map);
markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 80
});
pos_marker = L.marker(new L.LatLng(pos[0], pos[1]),);
routing_control = L.Routing.control({
    waypoints: [
        null
    ],
    createMarker: function () { return null; },
    show: false,
    showAlternatives: false,
    addWaypoints: false,
    draggableWaypoints: false,
    lineOptions: {
        addWaypoints: false,
        draggableWaypoints: false,
    },
    router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
});
routing_control.addTo(map);
