var HEIGHT = window.innerHeight+'px';
const pos = [57.621398, 39.880228];
var scale = 15;
var locs = [[57.620188, 39.898177],
            [57.619867, 39.879848]];

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
            document.getElementById('icons-here').innerHTML+="" +
                "<div style=\"top:"+y+"px;left:"+x+"px;\" class=\"position-fixed\">\n" +
                "            <a href=\"#\" onclick=\"collapse_toggle()\">\n" +
                "                <div class=\"geopoint d-flex justify-content-center align-items-center pb-2 \">\n" +
                "                    <div class=\"dog-img\"></div>\n" +
                "                </div>\n" +
                "            </a>\n" +
                "        </div>"
        }
    })
}