var HEIGHT = window.innerHeight+'px';
var pos = [57.621166, 39.888228];
var scale = 15;
var locs = [
    [57.621166,39.888549,"Ярославский музей-заповедник"],
   [57.633281,39.892843,"Волжская набережная"],
   [57.619512222320715,39.90440348706052,"],Парк Стрелка"],
   [57.626019,39.889295,"Улица Кирова (Ярославский Арбат)"],
   [57.621196,39.889381,"Спасо-Преображенский собор"],
   [57.626706,39.893939,"Храм Ильи Проока"],
   [57.610874,39.856875,"Церковь Иоанна Предтечи"],
   [57.622405,39.902159,"Большой Успенский Собор"],
   [57.621258,39.869909,"Планетарий им. Терешковой"],
   [57.700785,39.827149,"Толгский монастырь"],
   [57.628284,39.887292,"Казанский женский монастырь"],
   [57.61143423326224,39.905934679926794,"Храмовый Ансамбль в Коровниках"],
   [57.62252718100328, 39.898004964328734,"Церковь Николы Рубленого"],
   [57.6226662070831, 39.89554865454208,"Церковь Спаса-на-Городу"],
   [57.6216840088054, 39.88631012570596,"Церковь Богоявления"],
   [57.626237457771296, 39.86840435639479,"Бывшие Вознесенские казармы"],
   [57.62528460201987, 39.88489386392699,"Знаменская Церковь"],
   [57.62330200055836, 39.90213527173909,"Митрополичьи Палаты"],
   [57.63157279920508, 39.88571462755887,"Пожарная каланча"],
   [57.62498351193726, 39.90178972755868,"Волжская Башня"],
   [57.62827749235443, 39.897302658247455,"Ярославский художественный музей"],
   [57.62792708676228, 39.896111757442725,"Губернаторский сад"],
   [57.50912239683766, 39.75687149871926,"Музей-заповедник Н.А. Некрасова \"Карабиха\""],
   [57.62702493722861, 39.89873106009985,"Музей истолрии города Ярославля"],
   [57.63009489292983, 39.895129914067006,"Музей \"Музыка и время\""],
   [57.626756923501354, 39.884696627558654,"Драматический театр им. Ф.Г. Волкова"],
   [57.62244932856903, 39.88699142755854,"Памятник Ярославу Мудрому"],
   [57.62206225446864, 39.9028476698865,"Скульптурная композиция \"Троица\""],
   [57.617629504957115, 39.90481052755841,"Памятник 1000-летию Ярославля"],
   [57.59918048960674, 39.845160556393985,"Петропавловский Парк"],
   [57.61477721643426, 39.86686034290263,"Колесо обозрения \"Золотое кольцо\""],
   [57.58916057592463, 39.84809362755754,"УКРК \"Арена 2000\""]
];

var permissions;

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
    permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, (status)=>{
        if(!status.hasPermission){
            permissions.requestPermission(permissions.ACCESS_FINE_LOCATION,success,error);
            function error() {
                console.warn('Geolocation permission is not turned on');
                document.location.href = "../../screens/loginka/loginka.html"; // Должно редиректить на страницу где мы прссим пользователя передумать
            }

            function success( status ) {
                if( !status.hasPermission ) error();
            }
        }
    }, null);
},2000);

function get_location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    update_markers();
    map.flyTo(pos,18);
}

var minDistance = 200; // metres

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
    // iconCreateFunction: function(cluster) {
    //     return L.divIcon({ html: '<b>' + cluster.getChildCount() + '</b>' });
    // }
});
update_markers();

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
make_route(
    L.latLng(57.59918048960674, 39.845160556393985),
    L.latLng(57.626237457771296, 39.86840435639479));
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
    info2_appear = false;
    locs.forEach((el)=>{
        var title = el[2];
        //glow = map.distance(L.latLng(pos),L.latLng(el[0],el[1]))  <= minDistance ? "glow" : "";
        glow = "";
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: "<div>\n" +
                "            <a href=\"#\" onclick=\"collapse_toggle()\">\n" +
                "                <div class=\"geopoint d-flex justify-content-center align-items-center "+glow+" pb-2 \">\n" +
                "                    <div class=\"dog-img\"></div>\n" +
                "                </div>\n" +
                "            </a>\n" +
                "        </div>",
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        var marker = L.marker(new L.LatLng(el[0], el[1]), { title: title ,icon: icon});
        // marker.bindPopup(title);
        markers.addLayer(marker);
    });
    if(glow){
        info2_appear = true;
    }
    if(info2_appear){
        document.getElementById("info2").style.display = "block";
    }else{
        document.getElementById("info2").style.display = "none";
    }
    map.addLayer(markers)
}
function zoomin(){
    map.zoomIn(1);
}
function zoomout(){
    map.zoomOut(1);
}
function redraw(){
    let pos_x = map.latLngToContainerPoint(L.latLng(pos[0],pos[1])).x;
    let pos_y = map.latLngToContainerPoint(L.latLng(pos[0],pos[1])).y;
    document.getElementById('icons-here').innerHTML = "" +
        "<div style=\"top: "+pos_y+"px;left: "+pos_x+"px\" class=\"my-position d-flex justify-content-center align-items-center\">\n" +
        "            <div class=\"orange-circle\"></div>\n" +
        "        </div>";
}

var index = elasticlunr(function () {
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
    search(document.getElementById('line-edit').value);
},1000);