var HEIGHT = window.innerHeight+'px';
var pos = [57.621398, 39.880228];
var scale = 15;
var locs = [[57.620188, 39.898177],
            [57.619867, 39.879848]];

var route = [[57.620213, 39.898240],
[57.622408, 39.896553],
[57.621695, 39.891786],
[57.622732, 39.888774],
[57.622095, 39.879967],
[57.619718, 39.880038]]

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
    var list = [
        permissions.CAMERA,
        permissions.ACCESS_FINE_LOCATION
    ];

    permissions.checkPermission(list, success, null);

    function error() {
        console.warn('Camera or Accounts permission is not turned on');
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
    // setTimeout(()=>{
    //     navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // },1000);
},2000);

function get_location(){
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
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
L.polyline(route,{color:'orange',dashArray:'5,10'}).addTo(map);
map.on('move',redraw);
map.on('scale',redraw);

redraw()

function zoomin(){
    map.zoomIn(1);
}
function zoomout(){
    map.zoomOut(1);
}
function redraw(){
    // console.log(map.getCenter());
    //console.log(map.getBounds());
    let pos_x = map.latLngToContainerPoint(L.latLng(pos[0],pos[1])).x;
    let pos_y = map.latLngToContainerPoint(L.latLng(pos[0],pos[1])).y;
    document.getElementById('icons-here').innerHTML = "" +
        "<div style=\"top: "+pos_y+"px;left: "+pos_x+"px\" class=\"my-position d-flex justify-content-center align-items-center\">\n" +
        "            <div class=\"orange-circle\"></div>\n" +
        "        </div>";
    locs.forEach((a)=>{
        let x = map.latLngToContainerPoint(L.latLng(a[0],a[1])).x;
        let y = map.latLngToContainerPoint(L.latLng(a[0],a[1])).y;
        if(0 <= x && x <= window.innerWidth && 0 <= y && y <= window.innerHeight){
            glow = map.distance(L.latLng(pos),L.latLng(a))  <= minDistance ? "glow" : "";
            document.getElementById('icons-here').innerHTML+="" +
                "<div style=\"top:"+y+"px;left:"+x+"px;\" class=\"position-fixed\">\n" +
                "            <a href=\"#\" onclick=\"collapse_toggle()\">\n" +
                "                <div class=\"geopoint d-flex justify-content-center align-items-center "+glow+" pb-2 \">\n" +
                "                    <div class=\"dog-img\"></div>\n" +
                "                </div>\n" +
                "            </a>\n" +
                "        </div>"
            if(glow){
                document.getElementById("info2").style.display = "block";
            }else{
                document.getElementById("info2").style.display = "none";
            }
        }
    })
}