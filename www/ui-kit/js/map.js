var HEIGHT = window.innerHeight+'px';
var pos = [57.621166, 39.888228];
var scale = 15;
var cur_route_id = -1;
var cur_route_place = -1;

var permissions;
var index;

var onSuccess = function(position) {
    pos = [position.coords.latitude,position.coords.longitude];
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
        'Longitude: '         + position.coords.longitude         + '\n' +
        'Altitude: '          + position.coords.altitude          + '\n' +
        'Accuracy: '          + position.coords.accuracy          + '\n' +
        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        'Heading: '           + position.coords.heading           + '\n' +
        'Speed: '             + position.coords.speed             + '\n' +
        'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}

setTimeout(()=>{
    permissions = cordova.plugins.permissions;
    var list = [
        permissions.ACCESS_FINE_LOCATION
    ];

    permissions.checkPermission(list, success, null);

    function error() {
        console.warn('Camera or Accounts permission is not turned on');
        document.location.href = "../../screens/AccessError/accessError.html";
    }

    function success( status ) {
        if( !status.hasPermission ) {

            permissions.requestPermissions(
                list,
                function(status) {
                    if( !status.hasPermission ) error();
                },
                error);
        }
    }
},2000);

function get_location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    update_markers();
    map.flyTo(pos,18);
}

var minDistance = 50; // metres

document.getElementById("map").style.height = HEIGHT;

var map = L.map('map', {
    center: pos,
    zoom:scale,
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
map.on('move',redraw);
map.on('scale',redraw);
var markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 80
});
var pos_marker = L.marker(new L.LatLng(pos[0], pos[1]), );

var routing_control = L.Routing.control({
    waypoints: [
        null
    ],
    createMarker: function() { return null; },
    show: false,
    showAlternatives: false,
    addWaypoints:false,
    draggableWaypoints: false,
    lineOptions : {
        addWaypoints:false,
        draggableWaypoints: false,
    },
    router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
});
routing_control.addTo(map);
// make_route(
//     L.latLng(57.59918048960674, 39.845160556393985),
//     L.latLng(57.626237457771296, 39.86840435639479));
redraw();
function make_route(start, end){
    map.removeControl(routing_control);
    routing_control = L.Routing.control({
        waypoints: [
            start,
            end
        ],
        createMarker: function() { return null; },
        show: false,
        showAlternatives: false,
        addWaypoints:false,
        draggableWaypoints: false,
        lineOptions : {
            addWaypoints:false,
            draggableWaypoints: false,
        },
        router: L.Routing.mapbox('pk.eyJ1IjoiaHVzY2tlciIsImEiOiJja3pkMTZ0cmUwNGYzMm9tcW5pa200dDJkIn0.-NLqcskaelmtyL5zpaBLzQ')
    });
    routing_control.addTo(map);
}
function update_markers(){
    map.removeLayer(markers);
    markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 80
    });
    info2_appear = false;
    let idx = 0;
    locs.forEach((el)=>{
        var title = el[2];
        glow = map.distance(L.latLng(pos),L.latLng(el[0],el[1]))  <= minDistance ? "glow" : "";
        let route_near = false;
        if(cur_route_id != -1){
            route_near = map.distance(L.latLng(pos),L.latLng(locs[routes[cur_route_id][cur_route_place]][0],locs[routes[cur_route_id][cur_route_place]][1]))  <= minDistance ? true : false;
        }
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div>\n" +
                "            <a href=\"#\" onclick=\"collapse_toggle("+idx+")\">\n" +
                "                <div class=\"geopoint d-flex justify-content-center align-items-center "+glow+" pb-2 \">\n" +
                "                    <div class=\"dog-img\"></div>\n" +
                "                </div>\n" +
                "            </a>\n" +
                "        </div>",
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        if(glow){
            info2_appear = true;
        }
        if(route_near){
            cur_route_place += 1;
            if(cur_route_place >= routes[cur_route_id].length){
                cur_route_id = -1;
                cur_route_place = -1;
                if(localStorage != undefined){
                    localStorage.removeItem('route_place');
                    localStorage.removeItem('route_id');
                }
            }else{
                if(localStorage != undefined) {
                    localStorage.setItem('route_place', cur_route_place);
                }
            }
        }
        var marker = L.marker(new L.LatLng(el[0], el[1]), { title: title ,icon: icon});

        //marker.bindPopup(title);
        markers.addLayer(marker);
        idx++;
    });
    if(cur_route_id != -1){
        make_route(L.latLng(pos),L.latLng(locs[routes[cur_route_id][cur_route_place]][0],locs[routes[cur_route_id][cur_route_place]][1]));
    }else if(localStorage != undefined && localStorage.getItem('make_route') != null){
        g_id = localStorage.getItem('make_route');
        make_route(L.latLng(pos),L.latLng(locs[g_id][0],locs[g_id][1]));
        localStorage.removeItem('make_route');
    }
    else{
        make_route(null,null);
    }
    if(info2_appear){
        document.getElementById("info2").style.display = "block";
    }else{
        document.getElementById("info2").style.display = "none";
    }
    icon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div class=\"my-position d-flex justify-content-center align-items-center\">\n" +
            "            <div class=\"orange-circle\"></div>\n" +
            "        </div>",
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    });
    if (map.hasLayer(pos_marker)){
        map.removeLayer(pos_marker);
    }
    pos_marker = L.marker(new L.LatLng(pos[0], pos[1]), { icon: icon});
    map.addLayer(markers);
    map.addLayer(pos_marker);
}
function zoomin(){
    map.zoomIn(1);
}
function zoomout(){
    map.zoomOut(1);
}
function redraw(){

}
// map.on("click", function(e){
//     pos = [e.latlng.lat, e.latlng.lng];
//     update_markers();
// })
function search(input_str){
    results = index.search(input_str);
    document.getElementById("search-results1").innerHTML = "";
    results.forEach((el)=>{
        document.getElementById('search-results1').innerHTML += "" +
            "<div><a onclick='search_clicked(["+el.doc.latitude+","+el.doc.longitude+"])'>\n" +
            "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
            "                        <div class=\"time-icon me-3\"></div>\n" +
            "                        <div><h3 class=\"text-common\">"+el.doc.body+"</h3></div>\n" +
            "                    </div>\n" +
            "                </a></div>";
    });
}
function search_clicked(coords){
    map.flyTo(coords,16);
    search_history_close();
}
setInterval(()=>{
    if (locs.length > 0) search(document.getElementById('line-edit').value,{});
},1000);
setTimeout(()=>{
    if(localStorage != undefined){
        if(localStorage.getItem('auth_key') == null){
            document.location.href = '../../screens/loginka/loginka.html'
        }
        auth_key = localStorage.getItem('auth_key');
    }
    cordovaHTTP.post("https://trip.backend.xredday.ru/",
        {
            'request':
                {
                    "action": "data",
                    "user_key": auth_key,
                }
        },
        {},
        function (response) {
            console.log(response.status);
            try {
                locs = JSON.parse(response.data);
                index = elasticlunr(function () {
                    this.use(elasticlunr.ru);
                    this.addField('latitude');
                    this.addField('longitude');
                    this.addField('body');
                    this.setRef('id');
                });
                locs.forEach((el,t)=>{
                    index.addDoc({
                        'body':el[2],
                        'latitude':el[0],
                        'longitude':el[1],
                        'id':t
                    })
                })
                if(localStorage != undefined){
                    if(localStorage.getItem('prev_place') != null){
                        idx = localStorage.getItem('prev_place');
                        map.flyTo([locs[idx][0],locs[idx][1]],18);
                        collapse_toggle(parseInt(idx));

                    }
                    if(localStorage.getItem('route_id') != null){
                        cur_route_id = parseInt(localStorage.getItem('route_id'));
                        localStorage.removeItem('route_id');
                    }else{
                        cur_route_id = -1;
                    }
                    if(localStorage.getItem('route_place') != null){
                        cur_route_place = parseInt(localStorage.getItem('route_place'));
                        localStorage.removeItem('route_place')
                    }else{
                        cur_route_place = -1;
                    }
                }
                cordovaHTTP.post("https://trip.backend.xredday.ru/",
                    {
                        'request':
                            {
                                "action": "groutes",
                                "user_key": auth_key,
                            }
                    },
                    {},
                    function (response) {
                        console.log(response.status);
                        try {
                            groutes = JSON.parse(response.data);
                            routes = [];
                            groutes.forEach(el=>{
                                routes.push(el[2].split(',').map(x=>{
                                    return parseInt(x);
                                }));
                            });
                            update_markers();
                        } catch (e) {
                            console.error("JSON parsing error");
                        }
                    },
                    function (response) {
                        console.log(response.status);
                        console.log(response.data);
                    }
                );
            } catch (e) {
                console.error("JSON parsing error");
            }
        },
        function (response) {
            console.log(response.status);
            console.log(response.data);
        }
    );
},2000);
function make_route_to_cur(){
    if(localStorage != undefined) {
        if (localStorage.getItem('prev_place') != null) {
            idx = localStorage.getItem('prev_place');
            make_route(L.latLng(pos),[locs[idx][0], locs[idx][1]]);
            localStorage.removeItem('prev_place');
        }
    }
}