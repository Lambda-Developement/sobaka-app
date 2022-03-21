

var subtitles = [
    ['Ярославский музей-заповедник',3 ],
    ['Главный туристический объект Ярославля, государственный музей-заповедник,',6],
    ['это историческое сердце города. Архитектурный музей-заповедник', 10],
    ['расположен на территории бывшего Спасо-Преображенского мужского монастыря.',14],
    ['Монастырь ныне не действующий, его нередко называют «Ярославский кремль»',19],
    ['Он примечателен не только хорошо сохранившейся архитектурой,',23],
    ['но и тем, что монастырь посещал Иван Грозный, а Михаил Романов',28],
    ['даже жил на его территории. Сейчас здесь расположены самые важные',32],
    ['достопримечательности города и ценные коллекции артефактов. Главным',36],
    ['самое старинное строение Ярославля (XVI век). Также в музей-заповедник',43],
    ['входят еще 6 церквей XVII–XVIII веков постройки: церковь Ильи Пророка',49],
    ['с двумя шатровыми колокольнями; церковь Николы Надеина с порталом,',52],
    ['украшенным перламутровыми изразцами; церковь Благовещения из красного',57],
    ['кирпича; церковь Богоявления с ценной фресковой росписью; церковь',63],
    ['Иоанна Предтечи с 15 главами (единственная в России); церковь Рождества',68],
    ['Христова также с древними фресками внутри. Начать маршрут можно с',72],
    ['Богоявленской площади и одноименной церкви; далее осмотреть территорию',75],
    ['монастыря с собором и следующими церквями: Воскресенской и Введенской.',80]

];
var idx = 0;
var media;
var timer_start;
setTimeout(()=>{
    document.getElementById('museum').play();
    timer_start = new Date().getTime();
    s = subtitles[idx][0];
    document.getElementById('subtitle').innerHTML = s;
    // next_text();
},2000);

setInterval(()=>{
    while(new Date().getTime() - timer_start >= subtitles[idx][1]*1000){
        idx++;
        if(idx >= subtitles.length){
            idx = subtitles.length;
            document.getElementById('subtitles').style.display = 'none';
        }
        s = subtitles[idx][0];
        document.getElementById('subtitle').innerHTML = s;
    }
},200);
