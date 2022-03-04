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
    let info2_appear = false;
    document.getElementById('icons-here').innerHTML = "" +
        "<div style=\"top: "+pos_y+"px;left: "+pos_x+"px\" class=\"my-position d-flex justify-content-center align-items-center\">\n" +
        "            <div class=\"orange-circle\"></div>\n" +
        "        </div>";
    locs.forEach((a)=>{
        let x = map.latLngToContainerPoint(L.latLng(a[0],a[1])).x;
        let y = map.latLngToContainerPoint(L.latLng(a[0],a[1])).y;
        glow = map.distance(L.latLng(pos),L.latLng(a))  <= minDistance ? "glow" : "";
        if(0 <= x && x <= window.innerWidth && 0 <= y && y <= window.innerHeight){
            document.getElementById('icons-here').innerHTML+="" +
                "<div style=\"top:"+y+"px;left:"+x+"px;\" class=\"position-fixed\">\n" +
                "            <a href=\"#\" onclick=\"collapse_toggle()\">\n" +
                "                <div class=\"geopoint d-flex justify-content-center align-items-center "+glow+" pb-2 \">\n" +
                "                    <div class=\"dog-img\"></div>\n" +
                "                </div>\n" +
                "            </a>\n" +
                "        </div>"
        }
        if(glow){
            info2_appear = true;
        }
    })
    if(info2_appear){
        document.getElementById("info2").style.display = "block";
    }else{
        document.getElementById("info2").style.display = "none";
    }
}

let searchInArray=(searchQuery, array)=>{

    return array.filter((d)=>{
        let data = d[2] //Incase If It's Array Of Objects.
        let dataWords= typeof data=="string" && data?.split(" ")?.map(b=>b&&b.toLowerCase().trim()).filter(b=>b)
        let searchWords = typeof searchQuery=="string"&&searchQuery?.split(" ").map(b=>b&&b.toLowerCase().trim()).filter(b=>b)
        let matchingWords = searchWords.filter(word=>dataWords.includes(word))
        return matchingWords.length
    })
}
function search(input_str){
    results = searchInArray(input_str,locs);
    document.getElementById("search-results1").innerHTML = "";
    results.forEach((el)=>{
        document.getElementById('search-results1').innerHTML += "" +
            "<div><a onclick='search_clicked(this)'>\n" +
            "                    <div class=\"bg-white w-100 d-inline-flex p-2\">\n" +
            "                        <div class=\"time-icon me-3\"></div>\n" +
            "                        <div><h3 class=\"text-common\">"+el[2]+"</h3></div>\n" +
            "                    </div>\n" +
            "                </a></div>";
    });
}
function search_clicked(el){
    console.log(el.children[0].children[1].children[0].innerHTML);
    let s = el.children[0].children[1].children[0].innerHTML;
    locs.forEach(d=>{
        if(d[2] == s){
            map.flyTo([d[0],d[1]],16);
            console.log('asdasd')
            return;
        }
    })
}
setInterval(()=>{
    search(document.getElementById('line-edit').value);
},1000);