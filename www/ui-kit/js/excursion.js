var subtitles = [
    'В целом, конечно, убеждённость некоторых оппонентов',
    'способствует подготовке и реализации экспериментов, поражающих',
    'по своей масштабности и грандиозности. Противоположная точка',
    'зрения подразумевает, что реплицированные с зарубежных источников,',
    'современные исследования преданы социально-демократической анафеме.',
]
var idx = 0;
setTimeout(()=>{
    next_text();
    TTS["stop"] = function(){
        TTS.speak({text: ''})
    };
},2000);

function next_text(){
    if(idx < subtitles.length){
        s = subtitles[idx];
        document.getElementById('subtitle').innerHTML = s;
        TTS.speak({
            text: s,
            locale: 'ru-RU',
            rate: 1
        }, function () {
            idx++;
            next_text();
        }, function (reason) {
            console.log(reason);
        });
    }else{
        console.log('Text succesfully spoken');
        document.getElementById('subtitles').style.display = 'none';
    }
}